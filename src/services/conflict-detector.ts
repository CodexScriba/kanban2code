import * as path from 'node:path';
import { createHash } from 'node:crypto';
import { TelemetryLogger } from './telemetry-logger';

interface UriLike {
  fsPath: string;
}

interface ConflictFsAdapter {
  readFile(uri: UriLike): PromiseLike<Uint8Array>;
  writeFile(uri: UriLike, content: Uint8Array): PromiseLike<void>;
  createDirectory(uri: UriLike): PromiseLike<void>;
  stat(uri: UriLike): PromiseLike<{ type: number; ctime: number; mtime: number; size: number }>;
}

interface ConflictRuntimeDependencies {
  fs: ConflictFsAdapter;
  toFileUri(filePath: string): UriLike;
}

interface OpenedFingerprint {
  hash: string;
  mtime: number;
  content: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  diskVersion?: string;
  localVersion?: string;
}

export interface ConflictDetectorOptions {
  fs?: ConflictFsAdapter;
  toFileUri?: (filePath: string) => UriLike;
  telemetryLogger?: TelemetryLogger;
  now?: () => number;
}

const RECOVERY_DIRECTORY = path.join('.kanban2code', '.recovery');

export class ConflictDetector {
  private runtimeDependencies?: ConflictRuntimeDependencies;
  private readonly openedFingerprints = new Map<string, OpenedFingerprint>();
  private readonly telemetryLogger: TelemetryLogger;

  constructor(
    private readonly workspaceRoot: string,
    private readonly options: ConflictDetectorOptions = {}
  ) {
    this.telemetryLogger =
      options.telemetryLogger ?? new TelemetryLogger(workspaceRoot, { fs: options.fs, toFileUri: options.toFileUri });
  }

  async openFile(filePath: string, content: string): Promise<void> {
    const absolutePath = this.toAbsolutePath(filePath);
    const deps = await this.getRuntimeDependencies();
    const mtime = await this.readMtime(absolutePath, deps);
    const hash = this.computeFingerprint(content, mtime);
    this.openedFingerprints.set(absolutePath, { hash, mtime, content });
  }

  async checkConflict(filePath: string, currentContent: string): Promise<ConflictCheckResult> {
    const absolutePath = this.toAbsolutePath(filePath);
    const opened = this.openedFingerprints.get(absolutePath);
    if (!opened) {
      return { hasConflict: false };
    }

    const deps = await this.getRuntimeDependencies();

    try {
      const [raw, stat] = await Promise.all([
        deps.fs.readFile(deps.toFileUri(absolutePath)),
        deps.fs.stat(deps.toFileUri(absolutePath))
      ]);
      const diskVersion = Buffer.from(raw).toString('utf8');
      const diskHash = this.computeFingerprint(diskVersion, stat.mtime);

      if (diskHash === opened.hash) {
        return { hasConflict: false };
      }

      await this.telemetryLogger.logConflictEvent('file_conflict_detected', filePath, {
        reason: 'fingerprint_mismatch',
        openedMtime: opened.mtime,
        diskMtime: stat.mtime
      });

      return {
        hasConflict: true,
        diskVersion,
        localVersion: currentContent
      };
    } catch {
      await this.telemetryLogger.logConflictEvent('file_conflict_detected', filePath, {
        reason: 'missing_on_disk'
      });
      return {
        hasConflict: true,
        localVersion: currentContent
      };
    }
  }

  async createRecoverySnapshot(filePath: string, content: string): Promise<string> {
    const deps = await this.getRuntimeDependencies();
    const recoveryDirPath = this.toAbsolutePath(RECOVERY_DIRECTORY);
    await deps.fs.createDirectory(deps.toFileUri(recoveryDirPath));

    const baseName = `${path.basename(filePath)}.bak`;
    let snapshotRelativePath = path.join(RECOVERY_DIRECTORY, baseName);
    let snapshotAbsolutePath = this.toAbsolutePath(snapshotRelativePath);

    if (await this.fileExists(snapshotAbsolutePath, deps)) {
      const suffix = this.getNow();
      snapshotRelativePath = path.join(RECOVERY_DIRECTORY, `${baseName}.${suffix}`);
      snapshotAbsolutePath = this.toAbsolutePath(snapshotRelativePath);
    }

    await deps.fs.writeFile(deps.toFileUri(snapshotAbsolutePath), Buffer.from(content, 'utf8'));
    return snapshotRelativePath;
  }

  clearFingerprint(filePath: string): void {
    const absolutePath = this.toAbsolutePath(filePath);
    this.openedFingerprints.delete(absolutePath);
  }

  private computeFingerprint(content: string, mtime: number): string {
    return createHash('sha256').update(`${content}:${mtime}`).digest('hex');
  }

  private async readMtime(filePath: string, deps: ConflictRuntimeDependencies): Promise<number> {
    const stat = await deps.fs.stat(deps.toFileUri(filePath));
    return stat.mtime;
  }

  private async fileExists(filePath: string, deps: ConflictRuntimeDependencies): Promise<boolean> {
    try {
      await deps.fs.stat(deps.toFileUri(filePath));
      return true;
    } catch {
      return false;
    }
  }

  private toAbsolutePath(filePath: string): string {
    if (path.isAbsolute(filePath)) {
      return filePath;
    }
    return path.join(this.workspaceRoot, filePath);
  }

  private getNow(): number {
    return typeof this.options.now === 'function' ? this.options.now() : Date.now();
  }

  private async getRuntimeDependencies(): Promise<ConflictRuntimeDependencies> {
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
