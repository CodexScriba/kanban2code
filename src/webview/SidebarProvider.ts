import * as vscode from 'vscode';
import * as path from 'node:path';
import {
  isWebviewToHostMessage,
  type OrchestratorResponseMessage,
  type TaskSnapshotItem,
  type TaskSnapshotMessage,
  type TaskStage,
  type TaskSelectionResetMessage
} from './messaging';

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'kanban2code-sidebar';
  private webviewView: vscode.WebviewView | null = null;

  constructor(private readonly extensionUri: vscode.Uri) {}

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

    const allTasks = await this.getWorkspaceTasks();
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

    const tasks = preloadedTasks ?? (await this.getWorkspaceTasks());
    const snapshotMessage: TaskSnapshotMessage = {
      type: 'TaskSnapshot',
      payload: { tasks }
    };
    void this.webviewView.webview.postMessage(snapshotMessage);
  }

  private async getWorkspaceTasks(): Promise<TaskSnapshotItem[]> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return [];
    }

    const taskUris = await Promise.all([
      vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '.kanban2code/inbox/**/*.md')
      ),
      vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '.kanban2code/projects/**/*.md')
      )
    ]);

    const allUris = [...taskUris[0], ...taskUris[1]];
    const tasks = await Promise.all(allUris.map((uri) => this.readTaskSnapshotItem(uri, workspaceFolder)));

    return tasks
      .filter((task): task is TaskSnapshotItem => task !== null)
      .sort((left, right) => left.title.localeCompare(right.title));
  }

  private async readTaskSnapshotItem(
    taskUri: vscode.Uri,
    workspaceFolder: vscode.WorkspaceFolder
  ): Promise<TaskSnapshotItem | null> {
    const relativePath = path.posix.normalize(
      path.relative(workspaceFolder.uri.fsPath, taskUri.fsPath).split(path.sep).join(path.posix.sep)
    );

    const raw = await vscode.workspace.fs.readFile(taskUri);
    const content = Buffer.from(raw).toString('utf8');
    const stage = this.parseStage(content);
    const title = this.parseTitle(content, taskUri);

    return {
      id: relativePath,
      title,
      stage
    };
  }

  private parseTitle(content: string, taskUri: vscode.Uri): string {
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch && headingMatch[1].trim().length > 0) {
      return headingMatch[1].trim();
    }

    const fileName = path.basename(taskUri.fsPath, path.extname(taskUri.fsPath));
    return fileName.trim() || 'Untitled task';
  }

  private parseStage(content: string): TaskStage {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return 'unknown';
    }

    const stageLine = frontmatterMatch[1]
      .split('\n')
      .find((line) => line.trimStart().startsWith('stage:'));
    if (!stageLine) {
      return 'unknown';
    }

    const rawStage = stageLine.split(':').slice(1).join(':').trim().toLowerCase();
    if (
      rawStage === 'inbox' ||
      rawStage === 'capture' ||
      rawStage === 'plan' ||
      rawStage === 'code' ||
      rawStage === 'audit' ||
      rawStage === 'completed'
    ) {
      return rawStage;
    }

    return 'unknown';
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
