import * as path from 'node:path';

interface UriLike {
  fsPath: string;
}

interface TelemetryFsAdapter {
  readFile(uri: UriLike): PromiseLike<Uint8Array>;
  writeFile(uri: UriLike, content: Uint8Array): PromiseLike<void>;
  createDirectory(uri: UriLike): PromiseLike<void>;
}

interface TelemetryRuntimeDependencies {
  fs: TelemetryFsAdapter;
  toFileUri(filePath: string): UriLike;
}

export interface TelemetryEventPayload {
  taskId?: string;
  filePath?: string;
  metadata?: Record<string, unknown>;
}

export interface TelemetryEventRecord extends TelemetryEventPayload {
  timestamp: string;
  eventType: string;
}

export interface TelemetryLoggerOptions {
  fs?: TelemetryFsAdapter;
  toFileUri?: (filePath: string) => UriLike;
  now?: () => Date;
}

const LOG_DIRECTORY = path.join('.kanban2code', '_logs');
export type RunnerTelemetryOutcome = 'success' | 'failed' | 'cancelled';

export interface RunnerTelemetryEventPayload {
  taskId: string;
  stage: string;
  scope: 'stage' | 'all';
  provider?: string;
  model?: string;
  durationMs?: number;
  outcome?: RunnerTelemetryOutcome;
  error?: string;
}

export class TelemetryLogger {
  private runtimeDependencies?: TelemetryRuntimeDependencies;

  constructor(
    private readonly workspaceRoot: string,
    private readonly options: TelemetryLoggerOptions = {}
  ) {}

  async logEvent(eventType: string, payload: TelemetryEventPayload = {}): Promise<void> {
    const now = this.getNow();
    const event: TelemetryEventRecord = {
      timestamp: now.toISOString(),
      eventType,
      ...(payload.taskId ? { taskId: payload.taskId } : {}),
      ...(payload.filePath ? { filePath: payload.filePath } : {}),
      ...(payload.metadata ? { metadata: payload.metadata } : {})
    };

    await this.appendEventLine(event, now);
  }

  async logConflictEvent(
    eventType: string,
    filePath: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    await this.logEvent(eventType, {
      filePath,
      ...(details ? { metadata: details } : {})
    });
  }

  async logRunnerStarted(payload: RunnerTelemetryEventPayload): Promise<void> {
    await this.logEvent('runner_run_started', {
      taskId: payload.taskId,
      metadata: {
        stage: payload.stage,
        scope: payload.scope,
        provider: payload.provider,
        model: payload.model
      }
    });
  }

  async logRunnerCompleted(payload: RunnerTelemetryEventPayload): Promise<void> {
    await this.logEvent('runner_run_completed', {
      taskId: payload.taskId,
      metadata: {
        stage: payload.stage,
        scope: payload.scope,
        provider: payload.provider,
        model: payload.model,
        durationMs: payload.durationMs,
        outcome: payload.outcome,
        error: payload.error
      }
    });
  }

  private async appendEventLine(event: TelemetryEventRecord, now: Date): Promise<void> {
    const deps = await this.getRuntimeDependencies();
    const logFilePath = this.getDailyLogPath(now);
    const absoluteLogPath = this.toAbsolutePath(logFilePath);
    const logUri = deps.toFileUri(absoluteLogPath);

    await deps.fs.createDirectory(deps.toFileUri(this.toAbsolutePath(LOG_DIRECTORY)));

    let existing = '';
    try {
      const raw = await deps.fs.readFile(logUri);
      existing = Buffer.from(raw).toString('utf8');
    } catch {
      existing = '';
    }

    const line = `${JSON.stringify(event)}\n`;
    const nextContent = existing.length > 0 ? `${existing}${line}` : line;
    await deps.fs.writeFile(logUri, Buffer.from(nextContent, 'utf8'));
  }

  private getDailyLogPath(now: Date): string {
    const day = now.toISOString().slice(0, 10).replace(/-/g, '');
    return path.join(LOG_DIRECTORY, `telemetry-${day}.jsonl`);
  }

  private toAbsolutePath(relativePath: string): string {
    if (path.isAbsolute(relativePath)) {
      return relativePath;
    }
    return path.join(this.workspaceRoot, relativePath);
  }

  private getNow(): Date {
    return typeof this.options.now === 'function' ? this.options.now() : new Date();
  }

  private async getRuntimeDependencies(): Promise<TelemetryRuntimeDependencies> {
    if (this.runtimeDependencies) {
      return this.runtimeDependencies;
    }

    if (this.options.fs && this.options.toFileUri) {
      this.runtimeDependencies = {
        fs: this.options.fs,
        toFileUri: this.options.toFileUri
      };
      return this.runtimeDependencies;
    }

    const vscode = await import('vscode');
    this.runtimeDependencies = {
      fs: vscode.workspace.fs,
      toFileUri: vscode.Uri.file
    };
    return this.runtimeDependencies;
  }
}
