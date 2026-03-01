import * as vscode from 'vscode';
import {
  isWebviewToHostMessage,
  type OrchestratorResponseMessage,
  type TaskSnapshotMessage,
  type TaskSelectionResetMessage
} from './messaging';
import { TaskScanner } from '../services/task-scanner';
import type { TaskSnapshotItem } from '../types/task';

export class SidebarProvider implements vscode.WebviewViewProvider, vscode.Disposable {
  public static readonly viewType = 'kanban2code-sidebar';
  private webviewView: vscode.WebviewView | null = null;
  private readonly disposables: vscode.Disposable[] = [];

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly taskScanner: TaskScanner
  ) {
    this.disposables.push(
      this.taskScanner.onDidRefresh(() => {
        void this.postTaskSnapshot();
      })
    );
  }

  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.webviewView = webviewView;
    const { webview } = webviewView;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview.css')
    );
    const nonce = getNonce();

    webview.html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="${styleUri}" />
    <title>Kanban2Code</title>
  </head>
  <body>
    <div id="app"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`;

    webview.onDidReceiveMessage((message: unknown) => {
      void this.handleWebviewMessage(message);
    });
  }

  private async handleWebviewMessage(rawMessage: unknown): Promise<void> {
    if (!this.webviewView || !isWebviewToHostMessage(rawMessage)) {
      return;
    }

    if (rawMessage.type === 'RequestTaskSnapshot') {
      await this.postTaskSnapshot();
      return;
    }

    if (rawMessage.type === 'ShowKanbanBoard') {
      vscode.commands.executeCommand('kanban2code.openBoard');
      return;
    }

    if (rawMessage.type !== 'SendChatMessage') {
      return;
    }

    const allTasks = await this.taskScanner.scan();
    let selectedTaskId = rawMessage.payload.selectedTaskId;
    let selectedTask = selectedTaskId
      ? allTasks.find((task) => task.id === selectedTaskId) ?? null
      : null;

    if (selectedTaskId && !selectedTask) {
      selectedTaskId = undefined;
      const resetMessage: TaskSelectionResetMessage = {
        type: 'TaskSelectionReset',
        payload: {
          reason: 'Selected task is no longer available. Scope reset to general chat.'
        }
      };
      void this.webviewView.webview.postMessage(resetMessage);
    }

    const scopeLabel = selectedTask
      ? `${selectedTask.stage} • ${selectedTask.title}`
      : 'general chat';
    const responseMessage: OrchestratorResponseMessage = {
      type: 'OrchestratorResponse',
      payload: {
        message: `Context received (${scopeLabel}) via provider ${rawMessage.payload.provider}.`
      }
    };
    void this.webviewView.webview.postMessage(responseMessage);

    await this.postTaskSnapshot(allTasks);
  }

  private async postTaskSnapshot(preloadedTasks?: TaskSnapshotItem[]): Promise<void> {
    if (!this.webviewView) {
      return;
    }

    const tasks = preloadedTasks ?? (await this.taskScanner.scan());
    const snapshotMessage: TaskSnapshotMessage = {
      type: 'TaskSnapshot',
      payload: { tasks }
    };
    void this.webviewView.webview.postMessage(snapshotMessage);
  }

  dispose(): void {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
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
