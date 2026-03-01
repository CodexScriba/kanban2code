import assert from 'node:assert/strict';
import test from 'node:test';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import type { Settings } from '../types/settings';
import type { Task } from '../types/task';
import { RunnerEngine, type ProviderConfig } from './runner-engine';

interface UriLike {
  fsPath: string;
}

interface TerminalLike {
  show(preserveFocus?: boolean): void;
  dispose(): void;
}

class FakeProcess extends EventEmitter {
  readonly stdout = new PassThrough();
  readonly stderr = new PassThrough();
  readonly stdin = new PassThrough();
  readonly pid = 1234;
  private closed = false;

  kill(): boolean {
    if (this.closed) {
      return false;
    }
    this.closed = true;
    this.emit('close', null, 'SIGTERM');
    return true;
  }

  succeed(output = ''): void {
    if (this.closed) {
      return;
    }
    if (output.length > 0) {
      this.stdout.write(output);
    }
    this.closed = true;
    this.emit('close', 0, null);
  }

  fail(code = 1, output = ''): void {
    if (this.closed) {
      return;
    }
    if (output.length > 0) {
      this.stderr.write(output);
    }
    this.closed = true;
    this.emit('close', code, null);
  }
}

const createWorkspace = async (): Promise<string> => {
  return fs.mkdtemp(path.join(os.tmpdir(), 'kanban2code-runner-engine-'));
};

const createNodeFsAdapter = () => ({
  readFile: async (uri: UriLike): Promise<Uint8Array> => new Uint8Array(await fs.readFile(uri.fsPath))
});

const toFileUri = (filePath: string): UriLike => ({ fsPath: filePath });

const createSettings = (maxParallelRuns: number): Settings =>
  ({
    stageRuntimeMapping: {
      plan: { role: 'planner', provider: 'codex', model: 'gpt-5.3-codex', profile: 'default' },
      code: { role: 'coder', provider: 'codex', model: 'gpt-5.3-codex', profile: 'default' },
      audit: { role: 'auditor', provider: 'codex', model: 'gpt-5.3-codex', profile: 'default' }
    },
    queueAndExecution: {
      maxParallelRuns
    }
  } as unknown as Settings);

const createTask = (stage: Task['frontmatter']['stage']): Task => ({
  frontmatter: {
    stage,
    provider: 'codex',
    model: 'gpt-5.3-codex',
    tags: [],
    contexts: [],
    skills: []
  },
  body: 'Ship this feature.'
});

const providerFrontmatter = (provider: Partial<ProviderConfig> = {}): string => `---
cli: ${provider.cli ?? 'codex'}
subcommand: ${provider.subcommand ?? 'exec'}
model: ${provider.model ?? 'gpt-5.3-codex'}
unattended_flags:
  - '--yolo'
output_flags:
  - '--json'
prompt_style: ${provider.prompt_style ?? 'stdin'}
provider: openai
---
`;

test('reads provider config and builds command', async () => {
  const workspace = await createWorkspace();
  await fs.mkdir(path.join(workspace, '.kanban2code', '_providers'), { recursive: true });
  await fs.writeFile(
    path.join(workspace, '.kanban2code', '_providers', 'codex.md'),
    providerFrontmatter(),
    'utf8'
  );

  const runner = new RunnerEngine(
    workspace,
    {
      readTask: async () => createTask('plan'),
      updateTask: async () => createTask('plan')
    },
    {
      getSettings: async () => createSettings(1)
    },
    {
      logEvent: async () => undefined
    },
    {
      fs: createNodeFsAdapter(),
      toFileUri
    }
  );

  const provider = await runner.readProviderConfig('codex');
  const built = runner.buildCommand(provider, createTask('plan'), 'plan');
  assert.equal(provider.cli, 'codex');
  assert.deepEqual(built.args.slice(0, 4), ['exec', '--model', 'gpt-5.3-codex', '--yolo']);
  assert.equal(typeof built.promptInput, 'string');
});

test('creates visible terminal and updates stage on success', async () => {
  const workspace = await createWorkspace();
  await fs.mkdir(path.join(workspace, '.kanban2code', '_providers'), { recursive: true });
  await fs.writeFile(
    path.join(workspace, '.kanban2code', '_providers', 'codex.md'),
    providerFrontmatter(),
    'utf8'
  );

  const terminalWrites: string[] = [];
  const terminals: TerminalLike[] = [];
  const createdNames: string[] = [];
  const activeProcesses: FakeProcess[] = [];
  const taskByPath = new Map<string, Task>([['.kanban2code/inbox/a.md', createTask('plan')]]);

  const runner = new RunnerEngine(
    workspace,
    {
      readTask: async (filePath: string) => {
        const task = taskByPath.get(filePath);
        if (!task) {
          throw new Error('missing task');
        }
        return task;
      },
      updateTask: async (filePath: string, updates) => {
        const current = taskByPath.get(filePath) ?? createTask('plan');
        const next: Task = {
          ...current,
          frontmatter: {
            ...current.frontmatter,
            ...(updates.stage ? { stage: updates.stage } : {})
          }
        };
        taskByPath.set(filePath, next);
        return next;
      }
    },
    {
      getSettings: async () => createSettings(1)
    },
    {
      logEvent: async () => undefined
    },
    {
      fs: createNodeFsAdapter(),
      toFileUri,
      terminalFactory: {
        createTerminal: (options) => {
          createdNames.push(options.name);
          options.pty.onDidWrite((text) => {
            terminalWrites.push(text);
          });
          const terminal: TerminalLike = {
            show: () => {
              options.pty.open({ columns: 120, rows: 30 });
            },
            dispose: () => undefined
          };
          terminals.push(terminal);
          return terminal;
        },
        onDidCloseTerminal: () => ({ dispose: () => undefined })
      },
      spawnProcess: () => {
        const proc = new FakeProcess();
        activeProcesses.push(proc);
        setImmediate(() => proc.succeed('ok\n'));
        return proc;
      }
    }
  );

  const result = await runner.runStage('.kanban2code/inbox/a.md');
  assert.equal(terminals.length, 1);
  assert.equal(createdNames[0].includes('K2C:'), true);
  assert.equal(result.state, 'success');
  assert.equal(taskByPath.get('.kanban2code/inbox/a.md')?.frontmatter.stage, 'code');
  assert.equal(terminalWrites.join('').includes('ok'), true);
  assert.equal(activeProcesses.length, 1);
});

test('failed process returns failed state and does not advance stage', async () => {
  const workspace = await createWorkspace();
  await fs.mkdir(path.join(workspace, '.kanban2code', '_providers'), { recursive: true });
  await fs.writeFile(
    path.join(workspace, '.kanban2code', '_providers', 'codex.md'),
    providerFrontmatter(),
    'utf8'
  );

  const taskByPath = new Map<string, Task>([['.kanban2code/inbox/b.md', createTask('plan')]]);
  const runner = new RunnerEngine(
    workspace,
    {
      readTask: async (filePath: string) => taskByPath.get(filePath) ?? createTask('plan'),
      updateTask: async (filePath: string, updates) => {
        const current = taskByPath.get(filePath) ?? createTask('plan');
        const next: Task = {
          ...current,
          frontmatter: {
            ...current.frontmatter,
            ...(updates.stage ? { stage: updates.stage } : {})
          }
        };
        taskByPath.set(filePath, next);
        return next;
      }
    },
    {
      getSettings: async () => createSettings(1)
    },
    {
      logEvent: async () => undefined
    },
    {
      fs: createNodeFsAdapter(),
      toFileUri,
      terminalFactory: {
        createTerminal: (options) => ({
          show: () => options.pty.open({ columns: 120, rows: 30 }),
          dispose: () => undefined
        }),
        onDidCloseTerminal: () => ({ dispose: () => undefined })
      },
      spawnProcess: () => {
        const proc = new FakeProcess();
        setImmediate(() => proc.fail(2, 'boom\n'));
        return proc;
      }
    }
  );

  const result = await runner.runStage('.kanban2code/inbox/b.md');
  assert.equal(result.state, 'failed');
  assert.equal(taskByPath.get('.kanban2code/inbox/b.md')?.frontmatter.stage, 'plan');
});

test('runAllStages executes serialized plan -> code -> audit pipeline', async () => {
  const workspace = await createWorkspace();
  await fs.mkdir(path.join(workspace, '.kanban2code', '_providers'), { recursive: true });
  await fs.writeFile(
    path.join(workspace, '.kanban2code', '_providers', 'codex.md'),
    providerFrontmatter(),
    'utf8'
  );

  const taskByPath = new Map<string, Task>([['.kanban2code/inbox/c.md', createTask('plan')]]);
  const createdNames: string[] = [];

  const runner = new RunnerEngine(
    workspace,
    {
      readTask: async (filePath: string) => taskByPath.get(filePath) ?? createTask('plan'),
      updateTask: async (filePath: string, updates) => {
        const current = taskByPath.get(filePath) ?? createTask('plan');
        const next: Task = {
          ...current,
          frontmatter: {
            ...current.frontmatter,
            ...(updates.stage ? { stage: updates.stage } : {})
          }
        };
        taskByPath.set(filePath, next);
        return next;
      }
    },
    {
      getSettings: async () => createSettings(1)
    },
    {
      logEvent: async () => undefined
    },
    {
      fs: createNodeFsAdapter(),
      toFileUri,
      terminalFactory: {
        createTerminal: (options) => {
          createdNames.push(options.name);
          return {
            show: () => options.pty.open({ columns: 120, rows: 30 }),
            dispose: () => undefined
          };
        },
        onDidCloseTerminal: () => ({ dispose: () => undefined })
      },
      spawnProcess: () => {
        const proc = new FakeProcess();
        setImmediate(() => proc.succeed('ok\n'));
        return proc;
      }
    }
  );

  const results = await runner.runAllStages('.kanban2code/inbox/c.md');
  assert.deepEqual(
    createdNames.map((name) => name.match(/\[(.+)\]/)?.[1] ?? ''),
    ['plan', 'code', 'audit']
  );
  assert.equal(results.length, 3);
  assert.equal(results.every((entry) => entry.state === 'success'), true);
  assert.equal(taskByPath.get('.kanban2code/inbox/c.md')?.frontmatter.stage, 'completed');
});

test('respects max parallel runs', async () => {
  const workspace = await createWorkspace();
  await fs.mkdir(path.join(workspace, '.kanban2code', '_providers'), { recursive: true });
  await fs.writeFile(
    path.join(workspace, '.kanban2code', '_providers', 'codex.md'),
    providerFrontmatter(),
    'utf8'
  );

  const taskByPath = new Map<string, Task>([
    ['.kanban2code/inbox/d1.md', createTask('plan')],
    ['.kanban2code/inbox/d2.md', createTask('plan')]
  ]);
  const active: FakeProcess[] = [];

  const runner = new RunnerEngine(
    workspace,
    {
      readTask: async (filePath: string) => taskByPath.get(filePath) ?? createTask('plan'),
      updateTask: async (filePath: string, updates) => {
        const current = taskByPath.get(filePath) ?? createTask('plan');
        const next: Task = {
          ...current,
          frontmatter: {
            ...current.frontmatter,
            ...(updates.stage ? { stage: updates.stage } : {})
          }
        };
        taskByPath.set(filePath, next);
        return next;
      }
    },
    {
      getSettings: async () => createSettings(1)
    },
    {
      logEvent: async () => undefined
    },
    {
      fs: createNodeFsAdapter(),
      toFileUri,
      terminalFactory: {
        createTerminal: (options) => ({
          show: () => options.pty.open({ columns: 120, rows: 30 }),
          dispose: () => undefined
        }),
        onDidCloseTerminal: () => ({ dispose: () => undefined })
      },
      spawnProcess: () => {
        const proc = new FakeProcess();
        active.push(proc);
        return proc;
      }
    }
  );

  const running = runner.runStage('.kanban2code/inbox/d1.md');
  await assert.rejects(
    () => runner.runStage('.kanban2code/inbox/d2.md'),
    /Max parallel runs reached/
  );

  active[0].succeed('done\n');
  await running;
});
