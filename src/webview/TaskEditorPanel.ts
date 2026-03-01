import * as vscode from 'vscode';
import { TaskService } from '../services/task-service';
import {
  isWebviewToHostMessage,
  type LoadTaskEditorMessage,
  type SaveTaskMessage
} from './messaging';

export class TaskEditorPanel {
  public static currentPanel: TaskEditorPanel | undefined;
  public static readonly viewType = 'kanban2code-task-editor';
  private static readonly saveEmitter = new vscode.EventEmitter<{ taskPath: string }>();
  public static readonly onDidSaveTask = TaskEditorPanel.saveEmitter.event;

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private readonly taskService: TaskService;
  private disposables: vscode.Disposable[] = [];
  private currentTaskPath: string | null = null;
  private isDisposed = false;

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    taskService: TaskService,
    initialTaskPath?: string
  ) {
    this.panel = panel;
    this.extensionUri = extensionUri;
    this.taskService = taskService;

    this.update();

    if (initialTaskPath) {
      void this.loadTask(initialTaskPath);
    }

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.panel.webview.onDidReceiveMessage(
      (message: unknown) => {
        void this.handleWebviewMessage(message);
      },
      null,
      this.disposables
    );
  }

  public static createOrShow(
    extensionUri: vscode.Uri,
    taskService: TaskService,
    taskPath?: string
  ): void {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (TaskEditorPanel.currentPanel) {
      TaskEditorPanel.currentPanel.panel.reveal(column);

      if (taskPath && taskPath !== TaskEditorPanel.currentPanel.currentTaskPath) {
        void TaskEditorPanel.currentPanel.loadTask(taskPath);
      }

      return;
    }

    const panel = vscode.window.createWebviewPanel(
      TaskEditorPanel.viewType,
      'Task Editor',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
        retainContextWhenHidden: true
      }
    );

    TaskEditorPanel.currentPanel = new TaskEditorPanel(panel, extensionUri, taskService, taskPath);
  }

  public dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this.isDisposed = true;
    TaskEditorPanel.currentPanel = undefined;

    this.panel.dispose();

    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private update(): void {
    const webview = this.panel.webview;
    this.panel.webview.html = this.getHtmlForWebview(webview);
  }

  private async handleWebviewMessage(rawMessage: unknown): Promise<void> {
    if (!isWebviewToHostMessage(rawMessage)) {
      return;
    }

    if (rawMessage.type === 'CloseTaskEditor') {
      this.dispose();
      return;
    }

    if (rawMessage.type !== 'SaveTask') {
      return;
    }

    await this.handleSaveTask(rawMessage);
  }

  private async handleSaveTask(message: SaveTaskMessage): Promise<void> {
    if (!this.currentTaskPath) {
      void vscode.window.showWarningMessage('No task is currently loaded.');
      return;
    }

    try {
      await this.taskService.updateTask(this.currentTaskPath, message.payload.task);
      TaskEditorPanel.saveEmitter.fire({ taskPath: this.currentTaskPath });
      await this.loadTask(this.currentTaskPath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      void vscode.window.showErrorMessage(`Failed to save task: ${errorMessage}`);
    }
  }

  private async loadTask(taskPath: string): Promise<void> {
    try {
      const task = await this.taskService.readTask(taskPath);
      this.currentTaskPath = taskPath;
      this.panel.title = task.frontmatter.title?.trim() || 'Task Editor';

      const loadMessage: LoadTaskEditorMessage = {
        type: 'LoadTaskEditor',
        payload: {
          taskPath,
          taskId: taskPath.replace(/\\/g, '/').split('/').pop()?.replace(/\.md$/i, '') ?? taskPath,
          task
        }
      };

      void this.panel.webview.postMessage(loadMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      void vscode.window.showErrorMessage(`Failed to load task editor: ${errorMessage}`);
      this.dispose();
    }
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'dist', 'taskeditor.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'dist', 'taskeditor.css')
    );
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src https://fonts.googleapis.com https://fonts.gstatic.com; style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com; script-src 'nonce-${nonce}'; img-src data: https:;" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${styleUri}" />
    <title>Kanban2Code Task Editor</title>
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
