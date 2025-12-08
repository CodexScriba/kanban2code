import vscode from 'vscode';

/**
 * Lightweight logger that writes to a dedicated VS Code output channel.
 */
class KanbanLogger {
  private channel: vscode.OutputChannel | null = null;

  private getChannel(): vscode.OutputChannel {
    if (!this.channel) {
      this.channel = vscode.window.createOutputChannel('Kanban2Code');
    }
    return this.channel;
  }

  info(message: string) {
    this.getChannel().appendLine(`[INFO ${new Date().toISOString()}] ${message}`);
  }

  warn(message: string) {
    this.getChannel().appendLine(`[WARN ${new Date().toISOString()}] ${message}`);
  }

  error(message: string, error?: unknown) {
    const details =
      error instanceof Error
        ? `${error.message}\n${error.stack ?? ''}`
        : typeof error === 'string'
          ? error
          : JSON.stringify(error);
    this.getChannel().appendLine(`[ERROR ${new Date().toISOString()}] ${message}`);
    if (details) {
      this.getChannel().appendLine(details);
    }
  }
}

const logger = new KanbanLogger();

export function logInfo(message: string): void {
  logger.info(message);
}

export function logWarn(message: string): void {
  logger.warn(message);
}

export function logError(message: string, error?: unknown): void {
  logger.error(message, error);
}

/**
 * Convenience helper that logs and surfaces an error toast.
 */
export function notifyError(message: string, error?: unknown): void {
  logError(message, error);
  const detail = error instanceof Error ? error.message : undefined;
  vscode.window.showErrorMessage(message + (detail ? ` (${detail})` : ''));
}

