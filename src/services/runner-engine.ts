import * as path from 'node:path';
import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';
import matter from 'gray-matter';
import type { QueueItem, RunResult, RunState } from '../types/runner';
import type { Task, TaskStage } from '../types/task';
import type { SettingsService } from './settings-service';
import type { TaskService } from './task-service';
import type { TelemetryLogger } from './telemetry-logger';

interface UriLike {
  fsPath: string;
}

interface RunnerFsAdapter {
  readFile(uri: UriLike): PromiseLike<Uint8Array>;
}

interface ShellIntegrationLike {
  executeCommand(commandLine: string): void;
}

interface TerminalLike {
  show(preserveFocus?: boolean): void;
  dispose(): void;
  shellIntegration?: ShellIntegrationLike;
}

interface PtyLike {
  open(initialDimensions: { columns: number; rows: number }): void;
  close(): void;
  onDidWrite: (listener: (data: string) => unknown) => { dispose(): void };
}

interface TerminalFactoryOptions {
  name: string;
  pty: PtyLike;
}

interface TerminalCloseEvent {
  terminal: TerminalLike;
}

interface TerminalFactory {
  createTerminal(options: TerminalFactoryOptions): TerminalLike;
  onDidCloseTerminal(listener: (event: TerminalCloseEvent) => unknown): { dispose(): void };
}

interface SpawnedProcess {
  readonly stdout: NodeJS.ReadableStream;
  readonly stderr: NodeJS.ReadableStream;
  readonly stdin: NodeJS.WritableStream;
  readonly pid: number | undefined;
  kill(signal?: NodeJS.Signals | number): boolean;
  on(event: 'error', listener: (error: Error) => void): this;
  on(event: 'close', listener: (code: number | null, signal: NodeJS.Signals | null) => void): this;
}

type SpawnProcess = (
  command: string,
  args: string[],
  options: {
    cwd: string;
    env: NodeJS.ProcessEnv;
    stdio: 'pipe';
  }
) => SpawnedProcess;

interface RunnerQueueLike {
  dequeue(): Promise<QueueItem | null> | QueueItem | null;
  setState?(taskId: string, state: RunState): Promise<void> | void;
}

type RunScope = QueueItem['scope'];

type TaskServiceLike = Pick<TaskService, 'readTask' | 'updateTask'>;
type SettingsServiceLike = Pick<SettingsService, 'getSettings'>;
type TelemetryLoggerLike = Pick<TelemetryLogger, 'logEvent'>;

export interface ProviderConfig {
  cli: string;
  subcommand?: string;
  model?: string;
  model_flag?: string;
  prompt_style?: 'stdin' | 'flag' | 'positional';
  prompt_flag?: string;
  unattended_flags?: string[];
  output_flags?: string[];
  endpoint?: string;
  endpoint_flag?: string;
  api_key?: string;
  api_key_env?: string;
  provider?: string;
}

interface CommandBuildResult {
  command: string;
  args: string[];
  promptInput?: string;
}

interface ActiveRun {
  taskPath: string;
  stage: TaskStage;
  scope: RunScope;
  startedAt: number;
  terminal: TerminalLike;
}

export interface RunnerEngineOptions {
  fs?: RunnerFsAdapter;
  toFileUri?: (filePath: string) => UriLike;
  terminalFactory?: TerminalFactory;
  spawnProcess?: SpawnProcess;
  now?: () => number;
  queueService?: RunnerQueueLike;
  resolveTaskPath?: (taskId: string) => Promise<string | null>;
}

const NEXT_STAGE: Record<TaskStage, TaskStage | null> = {
  inbox: 'capture',
  capture: 'plan',
  plan: 'code',
  code: 'audit',
  audit: 'completed',
  completed: null,
  unknown: null
};

const EXECUTABLE_STAGES: TaskStage[] = ['plan', 'code', 'audit'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === 'string');
};

const asTaskStage = (value: unknown): TaskStage | null => {
  if (
    value === 'inbox' ||
    value === 'capture' ||
    value === 'plan' ||
    value === 'code' ||
    value === 'audit' ||
    value === 'completed' ||
    value === 'unknown'
  ) {
    return value;
  }
  return null;
};

const toProviderKey = (providerName: string): string => providerName.trim().replace(/\.md$/i, '');

class RunnerPty implements PtyLike {
  private readonly emitter = new EventEmitter();
  private readonly openHandler: () => void;
  private readonly closeHandler: () => void;

  constructor(openHandler: () => void, closeHandler: () => void) {
    this.openHandler = openHandler;
    this.closeHandler = closeHandler;
  }

  open(): void {
    this.openHandler();
  }

  close(): void {
    this.closeHandler();
  }

  onDidWrite(listener: (data: string) => unknown): { dispose(): void } {
    this.emitter.on('write', listener);
    return {
      dispose: () => {
        this.emitter.off('write', listener);
      }
    };
  }

  write(data: string): void {
    this.emitter.emit('write', data);
  }
}

export class RunnerEngine {
  private readonly activeRuns = new Map<string, ActiveRun>();
  private runtimeDependencies?: {
    fs: RunnerFsAdapter;
    toFileUri: (filePath: string) => UriLike;
    terminalFactory: TerminalFactory;
    spawnProcess: SpawnProcess;
  };

  constructor(
    private readonly workspaceRoot: string,
    private readonly taskService: TaskServiceLike,
    private readonly settingsService: SettingsServiceLike,
    private readonly telemetryLogger: TelemetryLoggerLike,
    private readonly options: RunnerEngineOptions = {}
  ) {}

  async runStage(taskIdOrPath: string, scope: RunScope = 'stage'): Promise<RunResult> {
    const taskPath = await this.resolveTaskPath(taskIdOrPath);
    await this.enforceParallelLimit();

    const task = await this.taskService.readTask(taskPath);
    const stage = task.frontmatter.stage;
    if (!EXECUTABLE_STAGES.includes(stage)) {
      throw new Error(`Stage '${stage}' is not executable.`);
    }

    return this.executeOneStage(taskPath, task, stage, scope);
  }

  async runAllStages(taskIdOrPath: string): Promise<RunResult[]> {
    const taskPath = await this.resolveTaskPath(taskIdOrPath);
    await this.enforceParallelLimit();

    const results: RunResult[] = [];
    let task = await this.taskService.readTask(taskPath);
    const pipelineStages = this.buildPipeline(task.frontmatter.stage);

    for (const targetStage of pipelineStages) {
      if (task.frontmatter.stage !== targetStage) {
        task = await this.taskService.updateTask(taskPath, { stage: targetStage });
      }

      const result = await this.executeOneStage(taskPath, task, targetStage, 'all');
      results.push(result);
      if (result.state !== 'success') {
        break;
      }
      task = await this.taskService.readTask(taskPath);
    }

    return results;
  }

  async dequeueAndRunNext(): Promise<void> {
    const queue = this.options.queueService;
    if (!queue) {
      return;
    }

    const maxParallelRuns = await this.getMaxParallelRuns();
    while (this.activeRuns.size < maxParallelRuns) {
      const queueItem = await queue.dequeue();
      if (!queueItem) {
        return;
      }

      if (typeof queue.setState === 'function') {
        await queue.setState(queueItem.taskId, 'running');
      }

      const taskPath = await this.resolveTaskPath(queueItem.taskId);
      const runPromise =
        queueItem.scope === 'all' ? this.runAllStages(taskPath) : this.runStage(taskPath, 'stage');

      void runPromise
        .then(async (result) => {
          if (typeof queue.setState !== 'function') {
            return;
          }

          const finalState = Array.isArray(result)
            ? (result[result.length - 1]?.state ?? 'success')
            : result.state;
          await queue.setState(queueItem.taskId, finalState);
        })
        .catch(async () => {
          if (typeof queue.setState === 'function') {
            await queue.setState(queueItem.taskId, 'failed');
          }
        })
        .finally(() => {
          void this.dequeueAndRunNext();
        });
    }
  }

  getActiveRunCount(): number {
    return this.activeRuns.size;
  }

  async readProviderConfig(providerName: string): Promise<ProviderConfig> {
    const deps = await this.getRuntimeDependencies();
    const providerKey = toProviderKey(providerName);
    const providerPath = path.join(
      this.workspaceRoot,
      '.kanban2code',
      '_providers',
      `${providerKey}.md`
    );

    let raw: Uint8Array;
    try {
      raw = await deps.fs.readFile(deps.toFileUri(providerPath));
    } catch {
      throw new Error(`Provider config not found: ${providerKey}`);
    }

    const parsed = matter(Buffer.from(raw).toString('utf8'));
    if (!isRecord(parsed.data) || typeof parsed.data.cli !== 'string') {
      throw new Error(`Provider config is missing required 'cli' field: ${providerKey}`);
    }

    return {
      cli: parsed.data.cli,
      subcommand: typeof parsed.data.subcommand === 'string' ? parsed.data.subcommand : undefined,
      model: typeof parsed.data.model === 'string' ? parsed.data.model : undefined,
      model_flag: typeof parsed.data.model_flag === 'string' ? parsed.data.model_flag : undefined,
      prompt_style:
        parsed.data.prompt_style === 'stdin' ||
        parsed.data.prompt_style === 'flag' ||
        parsed.data.prompt_style === 'positional'
          ? parsed.data.prompt_style
          : undefined,
      prompt_flag: typeof parsed.data.prompt_flag === 'string' ? parsed.data.prompt_flag : undefined,
      unattended_flags: normalizeStringArray(parsed.data.unattended_flags),
      output_flags: normalizeStringArray(parsed.data.output_flags),
      endpoint: typeof parsed.data.endpoint === 'string' ? parsed.data.endpoint : undefined,
      endpoint_flag:
        typeof parsed.data.endpoint_flag === 'string' ? parsed.data.endpoint_flag : undefined,
      api_key: typeof parsed.data.api_key === 'string' ? parsed.data.api_key : undefined,
      api_key_env: typeof parsed.data.api_key_env === 'string' ? parsed.data.api_key_env : undefined,
      provider: typeof parsed.data.provider === 'string' ? parsed.data.provider : undefined
    };
  }

  buildCommand(providerConfig: ProviderConfig, task: Task, stage: TaskStage): CommandBuildResult {
    const args: string[] = [];
    const modelFlag = providerConfig.model_flag ?? '--model';
    const promptStyle = providerConfig.prompt_style ?? 'stdin';
    const promptFlag = providerConfig.prompt_flag ?? '--prompt';
    const prompt = this.buildPrompt(task, stage);

    if (providerConfig.subcommand) {
      args.push(providerConfig.subcommand);
    }
    if (providerConfig.model) {
      args.push(modelFlag, providerConfig.model);
    }
    if (providerConfig.endpoint) {
      args.push(providerConfig.endpoint_flag ?? '--endpoint', providerConfig.endpoint);
    }
    if (providerConfig.unattended_flags) {
      args.push(...providerConfig.unattended_flags);
    }
    if (providerConfig.output_flags) {
      args.push(...providerConfig.output_flags);
    }

    if (promptStyle === 'flag') {
      args.push(promptFlag, prompt);
      return { command: providerConfig.cli, args };
    }
    if (promptStyle === 'positional') {
      args.push(prompt);
      return { command: providerConfig.cli, args };
    }
    return { command: providerConfig.cli, args, promptInput: prompt };
  }

  private async executeOneStage(
    taskPath: string,
    task: Task,
    stage: TaskStage,
    scope: RunScope
  ): Promise<RunResult> {
    const providerName = task.frontmatter.provider ?? (await this.getProviderForStage(stage));
    const providerConfig = await this.readProviderConfig(providerName);
    const command = this.buildCommand(providerConfig, task, stage);
    const startedAt = this.getNow();

    await this.telemetryLogger.logEvent('runner_run_started', {
      taskId: taskPath,
      metadata: {
        stage,
        provider: providerName,
        model: providerConfig.model,
        scope
      }
    });

    const runResult = await this.spawnInTerminal(taskPath, stage, command, providerConfig);
    const durationMs = this.getNow() - startedAt;

    if (runResult.state === 'success') {
      const nextStage = NEXT_STAGE[stage];
      if (nextStage) {
        await this.taskService.updateTask(taskPath, { stage: nextStage });
      }
    }

    await this.telemetryLogger.logEvent('runner_run_completed', {
      taskId: taskPath,
      metadata: {
        stage,
        provider: providerName,
        model: providerConfig.model,
        scope,
        durationMs,
        outcome: runResult.state,
        error: runResult.error
      }
    });

    await this.dequeueAndRunNext();
    return runResult;
  }

  private async spawnInTerminal(
    taskPath: string,
    stage: TaskStage,
    command: CommandBuildResult,
    provider: ProviderConfig
  ): Promise<RunResult> {
    const deps = await this.getRuntimeDependencies();
    const startedAt = this.getNow();

    return new Promise<RunResult>((resolve) => {
      let child: SpawnedProcess | null = null;
      let output = '';
      let resolved = false;
      const finalize = (state: RunState, error?: string): void => {
        if (resolved) {
          return;
        }
        resolved = true;
        this.activeRuns.delete(taskPath);
        terminalCloseDisposable.dispose();
        terminal.dispose();
        resolve({
          taskId: taskPath,
          state,
          output,
          ...(error ? { error } : {}),
          completedAt: this.getNow()
        });
      };

      const pty = new RunnerPty(
        () => {
          const env: NodeJS.ProcessEnv = { ...process.env };
          if (provider.api_key && provider.api_key_env) {
            env[provider.api_key_env] = provider.api_key;
          }

          try {
            child = deps.spawnProcess(command.command, command.args, {
              cwd: this.workspaceRoot,
              env,
              stdio: 'pipe'
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            pty.write(`${message}\r\n`);
            finalize('failed', message);
            return;
          }

          this.activeRuns.set(taskPath, {
            taskPath,
            stage,
            scope: 'stage',
            startedAt,
            terminal
          });

          child.stdout.on('data', (chunk: Buffer | string) => {
            const text = chunk.toString();
            output += text;
            pty.write(text.replace(/\n/g, '\r\n'));
          });

          child.stderr.on('data', (chunk: Buffer | string) => {
            const text = chunk.toString();
            output += text;
            pty.write(text.replace(/\n/g, '\r\n'));
          });

          child.on('error', (error) => {
            const message = error.message;
            output += `${message}\n`;
            pty.write(`${message}\r\n`);
            finalize('failed', message);
          });

          child.on('close', (code, signal) => {
            if (signal) {
              finalize('cancelled', `Process terminated by signal ${signal}`);
              return;
            }

            if (code === 0) {
              finalize('success');
              return;
            }

            const message = `Process exited with code ${code ?? 'unknown'}`;
            finalize('failed', message);
          });

          if (command.promptInput) {
            child.stdin.write(command.promptInput);
            child.stdin.end();
          }
        },
        () => {
          if (child && !resolved) {
            child.kill('SIGTERM');
          }
        }
      );

      const terminal = deps.terminalFactory.createTerminal({
        name: `K2C: ${path.basename(taskPath, '.md')} [${stage}]`,
        pty
      });

      const terminalCloseDisposable = deps.terminalFactory.onDidCloseTerminal((event) => {
        if (event.terminal !== terminal || resolved) {
          return;
        }
        if (child) {
          child.kill('SIGTERM');
        }
        finalize('cancelled', 'Terminal closed by user');
      });

      terminal.show(true);
    });
  }

  private buildPrompt(task: Task, stage: TaskStage): string {
    const title = task.frontmatter.title?.trim() || '(untitled)';
    const provider = task.frontmatter.provider?.trim() || '(default)';
    const model = task.frontmatter.model?.trim() || '(default)';
    return [
      `You are executing task stage: ${stage}.`,
      `Title: ${title}`,
      `Provider: ${provider}`,
      `Model: ${model}`,
      '',
      'Task body:',
      task.body
    ].join('\n');
  }

  private buildPipeline(stage: TaskStage): TaskStage[] {
    if (stage === 'completed') {
      return [];
    }
    if (stage === 'plan') {
      return ['plan', 'code', 'audit'];
    }
    if (stage === 'code') {
      return ['code', 'audit'];
    }
    if (stage === 'audit') {
      return ['audit'];
    }
    if (stage === 'capture' || stage === 'inbox') {
      return ['plan', 'code', 'audit'];
    }
    return [];
  }

  private async getProviderForStage(stage: TaskStage): Promise<string> {
    const settings = await this.settingsService.getSettings();
    const mapping = settings.stageRuntimeMapping[stage];
    if (mapping?.provider) {
      return mapping.provider;
    }
    throw new Error(`No provider configured for stage '${stage}'.`);
  }

  private async enforceParallelLimit(): Promise<void> {
    const maxParallelRuns = await this.getMaxParallelRuns();
    if (this.activeRuns.size >= maxParallelRuns) {
      throw new Error(
        `Max parallel runs reached (${maxParallelRuns}). Wait for an active run to complete.`
      );
    }
  }

  private async getMaxParallelRuns(): Promise<number> {
    const settings = await this.settingsService.getSettings();
    const configured = settings.queueAndExecution.maxParallelRuns;
    if (typeof configured !== 'number' || !Number.isFinite(configured)) {
      return 1;
    }
    return Math.max(1, Math.floor(configured));
  }

  private async resolveTaskPath(taskIdOrPath: string): Promise<string> {
    if (
      taskIdOrPath.endsWith('.md') ||
      taskIdOrPath.startsWith('.kanban2code/') ||
      taskIdOrPath.includes(path.sep)
    ) {
      return taskIdOrPath;
    }

    if (typeof this.options.resolveTaskPath === 'function') {
      const resolved = await this.options.resolveTaskPath(taskIdOrPath);
      if (resolved) {
        return resolved;
      }
    }

    throw new Error(`Unable to resolve task path for '${taskIdOrPath}'.`);
  }

  private getNow(): number {
    return typeof this.options.now === 'function' ? this.options.now() : Date.now();
  }

  private async getRuntimeDependencies(): Promise<{
    fs: RunnerFsAdapter;
    toFileUri: (filePath: string) => UriLike;
    terminalFactory: TerminalFactory;
    spawnProcess: SpawnProcess;
  }> {
    if (this.runtimeDependencies) {
      return this.runtimeDependencies;
    }

    const fs = this.options.fs;
    const toFileUri = this.options.toFileUri;
    const spawnProcess = this.options.spawnProcess || ((...args: Parameters<typeof spawn>) => spawn(...args)) as SpawnProcess;
    const terminalFactory = this.options.terminalFactory ?? (await this.createVscodeTerminalFactory());

    if (!fs || !toFileUri) {
      const vscode = await import('vscode');
      this.runtimeDependencies = {
        fs: vscode.workspace.fs,
        toFileUri: vscode.Uri.file,
        terminalFactory,
        spawnProcess
      };
      return this.runtimeDependencies;
    }

    this.runtimeDependencies = {
      fs,
      toFileUri,
      terminalFactory,
      spawnProcess
    };
    return this.runtimeDependencies;
  }

  private async createVscodeTerminalFactory(): Promise<TerminalFactory> {
    const vscode = await import('vscode');
    return {
      createTerminal: (options) =>
        vscode.window.createTerminal({
          name: options.name,
          pty: {
            onDidWrite: options.pty.onDidWrite as unknown as import('vscode').Event<string>,
            open: options.pty.open,
            close: options.pty.close
          }
        }) as unknown as TerminalLike,
      onDidCloseTerminal: (listener) =>
        vscode.window.onDidCloseTerminal((terminal) => listener({ terminal: terminal as unknown as TerminalLike }))
    };
  }
}

export const getNextTaskStage = (stage: TaskStage): TaskStage | null => {
  return NEXT_STAGE[stage] ?? null;
};

export const parseTaskStage = (value: unknown): TaskStage | null => {
  return asTaskStage(value);
};
