import * as vscode from 'vscode';
import { TaskScanner } from '../services/task-scanner';
import {
  isWebviewToHostMessage,
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

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, taskScanner: TaskScanner) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this.taskScanner = taskScanner;

    this._disposables.push(
      this.taskScanner.onDidRefresh(() => {
        void this.postTaskSnapshot();
      })
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

  public static createOrShow(extensionUri: vscode.Uri, taskScanner: TaskScanner): void {
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

    KanbanPanel.currentPanel = new KanbanPanel(panel, extensionUri, taskScanner);
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
    if (!isWebviewToHostMessage(rawMessage) || rawMessage.type !== 'RequestTaskSnapshot') {
      return;
    }

    await this.postTaskSnapshot();
  }

  private async postTaskSnapshot(preloadedTasks?: TaskSnapshotItem[]): Promise<void> {
    const tasks = preloadedTasks ?? (await this.taskScanner.scan());
    const snapshotMessage: TaskSnapshotMessage = {
      type: 'TaskSnapshot',
      payload: { tasks }
    };
    void this._panel.webview.postMessage(snapshotMessage);
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
