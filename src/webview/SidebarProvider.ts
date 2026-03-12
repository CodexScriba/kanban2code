import * as vscode from 'vscode';
import {
  isWebviewToHostMessage,
  type OrchestratorResponseMessage,
  type QueueSnapshotMessage,
  type RunnerStateChangedMessage,
  type TaskSnapshotMessage,
  type TaskSelectionResetMessage
} from './messaging';
import { TaskScanner } from '../services/task-scanner';
import type { TaskSnapshotItem } from '../types/task';
import { QueueService } from '../services/queue-service';
import { AlibabaService } from '../services/alibaba-service';
import { resolveSidebarChatResponse } from '../services/sidebar-chat-router';

export class SidebarProvider implements vscode.WebviewViewProvider, vscode.Disposable {
  public static readonly viewType = 'kanban2code-sidebar';
  private webviewView: vscode.WebviewView | null = null;
  private readonly disposables: vscode.Disposable[] = [];

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly taskScanner: TaskScanner,
    private readonly queueService: QueueService,
    private readonly alibabaService: AlibabaService
  ) {
    this.disposables.push(
      this.taskScanner.onDidRefresh(() => {
        void this.postTaskSnapshot();
      })
    );
    this.disposables.push(
      this.queueService.onDidRunnerStateChange((event) => {
        this.postRunnerStateChanged(event.taskId, event.state, event.timestamp);
      })
    );
    this.disposables.push(
      this.queueService.onDidQueueSnapshotChange(() => {
        this.postQueueSnapshot();
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
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src https://fonts.gstatic.com; style-src ${webview.cspSource} https://fonts.googleapis.com; script-src 'nonce-${nonce}';" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Noto+Sans+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
      this.postQueueSnapshot();
      return;
    }

    if (rawMessage.type === 'ShowKanbanBoard') {
      vscode.commands.executeCommand('kanban2code.openBoard');
      return;
    }

    if (rawMessage.type === 'OpenSettings') {
      vscode.commands.executeCommand('kanban2code.openSettings', rawMessage.payload);
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

    await this.postOrchestratorResponse(rawMessage.payload.provider, rawMessage.payload.message, selectedTask);

    await this.postTaskSnapshot(allTasks);
  }

  private async postOrchestratorResponse(
    provider: string,
    message: string,
    selectedTask: TaskSnapshotItem | null
  ): Promise<void> {
    if (!this.webviewView) {
      return;
    }

    const responseText = await resolveSidebarChatResponse(
      provider,
      message,
      selectedTask,
      this.alibabaService
    );

    const responseMessage: OrchestratorResponseMessage = {
      type: 'OrchestratorResponse',
      payload: {
        message: responseText
      }
    };
    void this.webviewView.webview.postMessage(responseMessage);
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

  private postRunnerStateChanged(
    taskId: string,
    state: RunnerStateChangedMessage['payload']['state'],
    timestamp: number
  ): void {
    if (!this.webviewView) {
      return;
    }

    const message: RunnerStateChangedMessage = {
      type: 'RunnerStateChanged',
      payload: {
        taskId,
        state,
        timestamp
      }
    };
    void this.webviewView.webview.postMessage(message);
  }

  private postQueueSnapshot(): void {
    if (!this.webviewView) {
      return;
    }

    const message: QueueSnapshotMessage = {
      type: 'QueueSnapshot',
      payload: this.queueService.getSnapshot()
    };
    void this.webviewView.webview.postMessage(message);
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
