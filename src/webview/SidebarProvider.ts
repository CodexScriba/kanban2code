import * as vscode from 'vscode';
import { WorkspaceState } from '../workspace/state';
import { findKanbanRoot } from '../workspace/validation';
import { loadAllTasks, findTaskById } from '../services/scanner';
import { createEnvelope, validateEnvelope, type MessageEnvelope } from './messaging';
import type { Task } from '../types/task';
import type { Stage } from '../types/task';
import { changeStageAndReload } from '../services/stage-manager';
import { archiveTask } from '../services/archive';

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'kanban2code.sidebar';
  private _view?: vscode.WebviewView;
  private _tasks: Task[] = [];

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    void _context;
    void _token;
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, 'dist'),
        vscode.Uri.joinPath(this._extensionUri, 'docs', 'design', 'styles'),
      ],
    };

    webviewView.webview.html = this._getWebviewContent(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(async (data) => {
      await this._handleWebviewMessage(data);
    });

    // Send initial state when view becomes visible
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this._sendInitialState();
      }
    });

    // Send initial state
    this._sendInitialState();
  }

  private async _handleWebviewMessage(data: unknown) {
    try {
      const envelope = validateEnvelope(data);
      const { type, payload } = envelope;

      switch (type) {
        case 'CreateKanban':
          await vscode.commands.executeCommand('kanban2code.scaffoldWorkspace');
          await this._refreshStateAndView();
          break;

        case 'OpenBoard':
          await vscode.commands.executeCommand('kanban2code.openBoard');
          break;

        case 'OpenSettings':
          await vscode.commands.executeCommand('kanban2code.openSettings');
          break;

        case 'CreateTask': {
          await vscode.commands.executeCommand('kanban2code.newTask', payload);
          break;
        }

        case 'OpenTask': {
          const { filePath } = payload as { filePath: string };
          if (filePath) {
            const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
            await vscode.window.showTextDocument(doc);
          }
          break;
        }

        case 'CopyContext': {
          const { taskId, mode } = payload as { taskId: string; mode: string };
          await vscode.commands.executeCommand('kanban2code.copyTaskContext', taskId, mode);
          break;
        }

        case 'CreateProject':
          await vscode.commands.executeCommand('kanban2code.newProject');
          break;

        case 'CreateContext':
          await vscode.commands.executeCommand('kanban2code.newContext');
          break;

        case 'CreateAgent':
          await vscode.commands.executeCommand('kanban2code.newAgent');
          break;

        case 'CreateTemplate':
          await vscode.commands.executeCommand('kanban2code.newTemplate');
          break;

        case 'MoveTask': {
          const { taskId, toStage } = payload as { taskId: string; toStage: Stage };
          await changeStageAndReload(taskId, toStage);
          await this._sendInitialState();
          break;
        }

        case 'ArchiveTask': {
          const { taskId } = payload as { taskId: string };
          const root = WorkspaceState.kanbanRoot;
          if (root && taskId) {
            const task = await findTaskById(root, taskId);
            if (task) {
              await archiveTask(task, root);
              await this._sendInitialState();
            }
          }
          break;
        }

        case 'DeleteTask': {
          const { taskId } = payload as { taskId: string };
          const root = WorkspaceState.kanbanRoot;
          if (root && taskId) {
            const task = await findTaskById(root, taskId);
            if (task) {
              await vscode.workspace.fs.delete(vscode.Uri.file(task.filePath));
              await this._sendInitialState();
            }
          }
          break;
        }

        case 'OpenMoveModal': {
          vscode.window.showInformationMessage('Move modal not implemented yet.');
          break;
        }

        case 'TaskContextMenu': {
          // Context menu will be handled in Task 3.5
          const { taskId } = payload as { taskId: string };
          vscode.window.showInformationMessage(`Context menu for task: ${taskId}`);
          break;
        }

        case 'ALERT': {
          const text = (payload as { text?: string })?.text ?? 'Alert from Kanban2Code';
          vscode.window.showInformationMessage(text);
          break;
        }
      }
    } catch (error) {
      console.error('Error handling webview message:', error);
    }
  }

  private async _sendInitialState() {
    const kanbanRoot = WorkspaceState.kanbanRoot;
    const hasKanban = !!kanbanRoot;

    if (hasKanban && kanbanRoot) {
      try {
        this._tasks = await loadAllTasks(kanbanRoot);
      } catch (error) {
        console.error('Error loading tasks:', error);
        this._tasks = [];
      }
    } else {
      this._tasks = [];
    }

    this._postMessage(createEnvelope('InitState', {
      hasKanban,
      tasks: this._tasks,
      workspaceRoot: kanbanRoot,
    }));
  }

  public async refresh() {
    await this._sendInitialState();
  }

  public updateTasks(tasks: Task[]) {
    this._tasks = tasks;
    this._postMessage(createEnvelope('TaskUpdated', { tasks }));
  }

  private _getWebviewContent(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js'),
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kanban2Code</title>
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  private _postMessage(message: MessageEnvelope) {
    this._view?.webview.postMessage(message);
  }

  private async _refreshStateAndView() {
    const kanbanRoot = await this._detectKanbanRoot();
    WorkspaceState.setKanbanRoot(kanbanRoot);
    await vscode.commands.executeCommand('setContext', 'kanban2code:isActive', !!kanbanRoot);
    await this._sendInitialState();
  }

  private async _detectKanbanRoot(): Promise<string | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders || [];
    for (const folder of workspaceFolders) {
      const root = await findKanbanRoot(folder.uri.fsPath);
      if (root) return root;
    }
    return null;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
