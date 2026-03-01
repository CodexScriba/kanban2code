import * as vscode from 'vscode';
import { TaskScanner } from '../services/task-scanner';
import { TaskService } from '../services/task-service';
import { SettingsService } from '../services/settings-service';
import { QueueService } from '../services/queue-service';
import {
  isWebviewToHostMessage,
  type QueueSnapshotMessage,
  type RunnerStateChangedMessage,
  type SettingsLoadedMessage,
  type TaskSnapshotMessage,
  type TaskSnapshotItem
} from './messaging';

export class KanbanPanel {
  public static currentPanel: KanbanPanel | undefined;
  public static readonly viewType = 'kanban2code-board';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private readonly taskScanner: TaskScanner;
  private readonly taskService: TaskService;
  private readonly settingsService: SettingsService;
  private readonly queueService: QueueService;

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    taskScanner: TaskScanner,
    taskService: TaskService,
    settingsService: SettingsService,
    queueService: QueueService
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this.taskScanner = taskScanner;
    this.taskService = taskService;
    this.settingsService = settingsService;
    this.queueService = queueService;

    this._disposables.push(
      this.taskScanner.onDidRefresh(() => {
        void this.postTaskSnapshot();
      })
    );
    this._disposables.push(
      new vscode.Disposable(
        this.queueService.onDidStateChange((taskId, state, timestamp) => {
          this.postRunnerStateChanged(taskId, state, timestamp);
        })
      )
    );
    this._disposables.push(
      new vscode.Disposable(
        this.queueService.onDidQueueChange(() => {
          this.postQueueSnapshot();
        })
      )
    );

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.onDidReceiveMessage(
      (message: unknown) => {
        void this.handleWebviewMessage(message);
      },
      null,
      this._disposables
    );
  }

  public static createOrShow(
    extensionUri: vscode.Uri,
    taskScanner: TaskScanner,
    taskService: TaskService,
    settingsService: SettingsService,
    queueService: QueueService
  ): void {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (KanbanPanel.currentPanel) {
      KanbanPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      KanbanPanel.viewType,
      'Kanban Board',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
        retainContextWhenHidden: true
      }
    );

    KanbanPanel.currentPanel = new KanbanPanel(
      panel,
      extensionUri,
      taskScanner,
      taskService,
      settingsService,
      queueService
    );
  }

  private _update(): void {
    const webview = this._panel.webview;
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }

  public dispose(): void {
    KanbanPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async handleWebviewMessage(rawMessage: unknown): Promise<void> {
    if (!isWebviewToHostMessage(rawMessage)) {
      return;
    }

    if (rawMessage.type === 'RequestTaskSnapshot') {
      await this.postTaskSnapshot();
      await this.postSettings();
      this.postQueueSnapshot();
      return;
    }

    if (rawMessage.type === 'RunStage') {
      await this.handleQueueIntent(rawMessage.payload.taskId, 'stage');
      return;
    }

    if (rawMessage.type === 'RunAllStages') {
      await this.handleQueueIntent(rawMessage.payload.taskId, 'all');
      return;
    }

    if (rawMessage.type === 'QueueStage') {
      await this.handleQueueIntent(rawMessage.payload.taskId, 'stage');
      return;
    }

    if (rawMessage.type === 'QueueAllStages') {
      await this.handleQueueIntent(rawMessage.payload.taskId, 'all');
      return;
    }

    if (rawMessage.type === 'CancelRun') {
      const cancelled = this.queueService.cancel(rawMessage.payload.taskId);
      if (!cancelled) {
        void vscode.window.showWarningMessage(`No queued/running task found: ${rawMessage.payload.taskId}`);
      }
      return;
    }

    if (rawMessage.type === 'RetryRun') {
      const resolvedTask = await this.resolveTask(rawMessage.payload.taskId);
      if (!resolvedTask) {
        void vscode.window.showWarningMessage(`Task not found: ${rawMessage.payload.taskId}`);
        return;
      }

      const result = await this.queueService.retry(resolvedTask.id);
      if (!result.ok) {
        void vscode.window.showWarningMessage('Retry is only available for failed runs.');
      }
      return;
    }

    if (rawMessage.type === 'MoveTask') {
      await this.taskService.updateTask(rawMessage.payload.taskId, {
        stage: rawMessage.payload.targetStage,
        order: rawMessage.payload.order
      });
      this.taskScanner.invalidateCache();
      await this.postTaskSnapshot();
      return;
    }

    if (rawMessage.type === 'CreateTask') {
      const title = rawMessage.payload.title?.trim();
      if (!title) {
        void vscode.window.showWarningMessage('Task title is required.');
        return;
      }

      await this.taskService.createTask({
        ...rawMessage.payload,
        title
      });
      this.taskScanner.invalidateCache();
      await this.postTaskSnapshot();
      return;
    }

    if (rawMessage.type === 'DeleteTask') {
      const resolvedTask = await this.resolveTask(rawMessage.payload.taskId);
      if (!resolvedTask) {
        void vscode.window.showWarningMessage(`Task not found: ${rawMessage.payload.taskId}`);
        return;
      }

      try {
        await this.taskService.deleteTask(resolvedTask.id);
        this.taskScanner.invalidateCache();
        await this.postTaskSnapshot();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        void vscode.window.showErrorMessage(`Failed to delete task: ${message}`);
      }
      return;
    }

    if (rawMessage.type === 'OpenTaskEditor') {
      const taskIdentifier = rawMessage.payload?.taskId;
      if (!taskIdentifier) {
        void vscode.window.showWarningMessage('Task identifier is required to open the task editor.');
        return;
      }

      const resolvedTask = await this.resolveTask(taskIdentifier);
      if (!resolvedTask) {
        void vscode.window.showWarningMessage(`Task not found: ${taskIdentifier}`);
        return;
      }

      try {
        await vscode.commands.executeCommand('kanban2code.openTaskEditor', resolvedTask.id);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        void vscode.window.showErrorMessage(`Failed to open task editor: ${message}`);
      }
      return;
    }

    if (rawMessage.type === 'ReorderTask') {
      await this.taskService.updateTask(rawMessage.payload.taskId, {
        order: rawMessage.payload.newOrder
      });
      this.taskScanner.invalidateCache();
      await this.postTaskSnapshot();
    }
  }

  private async postTaskSnapshot(preloadedTasks?: TaskSnapshotItem[]): Promise<void> {
    const tasks = preloadedTasks ?? (await this.taskScanner.scan());
    const snapshotMessage: TaskSnapshotMessage = {
      type: 'TaskSnapshot',
      payload: { tasks }
    };
    void this._panel.webview.postMessage(snapshotMessage);
  }

  private async postSettings(): Promise<void> {
    const settings = await this.settingsService.getSettings();
    const settingsMessage: SettingsLoadedMessage = {
      type: 'SettingsLoaded',
      payload: {
        settings: settings as unknown as Record<string, unknown>
      }
    };
    void this._panel.webview.postMessage(settingsMessage);
  }

  private postRunnerStateChanged(taskId: string, state: RunnerStateChangedMessage['payload']['state'], timestamp: number): void {
    const message: RunnerStateChangedMessage = {
      type: 'RunnerStateChanged',
      payload: {
        taskId,
        state,
        timestamp
      }
    };
    void this._panel.webview.postMessage(message);
  }

  private postQueueSnapshot(): void {
    const snapshot = this.queueService.getSnapshot();
    const message: QueueSnapshotMessage = {
      type: 'QueueSnapshot',
      payload: snapshot
    };
    void this._panel.webview.postMessage(message);
  }

  private async resolveTask(taskIdentifier: string): Promise<TaskSnapshotItem | null> {
    const tasks = await this.taskScanner.scan();
    const task = tasks.find((entry) => entry.id === taskIdentifier || entry.taskId === taskIdentifier);
    return task ?? null;
  }

  private async handleQueueIntent(taskIdentifier: string, scope: 'stage' | 'all'): Promise<void> {
    const resolvedTask = await this.resolveTask(taskIdentifier);
    if (!resolvedTask) {
      void vscode.window.showWarningMessage(`Task not found: ${taskIdentifier}`);
      return;
    }

    const result = await this.queueService.enqueue(resolvedTask.id, scope);
    if (!result.ok && result.reason === 'duplicate') {
      void vscode.window.showWarningMessage('Task is already queued or running.');
      return;
    }

    if (!result.ok && result.validation) {
      const message = result.validation.errors[0]?.message ?? 'Task validation failed before run.';
      void vscode.window.showWarningMessage(message);
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'board.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'board.css')
    );
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src https://fonts.googleapis.com https://fonts.gstatic.com; style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com; script-src 'nonce-${nonce}' 'unsafe-inline'; img-src data: https:;" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${styleUri}" />
    <title>Kanban2Code Board</title>
  </head>
  <body>
    <div id="app"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`;
  }
}

function getNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < 32; i += 1) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}
