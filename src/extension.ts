import * as vscode from 'vscode';
import { SidebarProvider } from './webview/SidebarProvider';
import { KanbanPanel } from './webview/KanbanPanel';
import { TaskEditorPanel } from './webview/TaskEditorPanel';
import { TaskScanner, type TaskScannerRuntime } from './services/task-scanner';
import { TaskService } from './services/task-service';
import { SettingsService } from './services/settings-service';

export function activate(context: vscode.ExtensionContext): void {
  const scannerRuntime: TaskScannerRuntime = {
    findFiles: (globPattern) => vscode.workspace.findFiles(globPattern),
    readFile: (uri) => vscode.workspace.fs.readFile(uri as vscode.Uri),
    toRelativePath: (uri) => vscode.workspace.asRelativePath(uri as vscode.Uri, false),
    createWatcher: (globPattern) => vscode.workspace.createFileSystemWatcher(globPattern),
    createEventEmitter: <T>() => new vscode.EventEmitter<T>()
  };

  const taskScanner = new TaskScanner(scannerRuntime);
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  const taskService = new TaskService(workspaceRoot ?? '');
  const settingsService = new SettingsService(workspaceRoot ?? '');
  const sidebarProvider = new SidebarProvider(context.extensionUri, taskScanner);

  context.subscriptions.push(taskScanner, sidebarProvider);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('kanban2code.openBoard', () => {
      if (!workspaceRoot) {
        void vscode.window.showWarningMessage(
          'Open a workspace folder to use Kanban board drag-and-drop persistence.'
        );
        return;
      }

      KanbanPanel.createOrShow(context.extensionUri, taskScanner, taskService, settingsService);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('kanban2code.openTaskEditor', (arg?: unknown) => {
      if (!workspaceRoot) {
        void vscode.window.showWarningMessage('Open a workspace folder to use the task editor.');
        return;
      }

      const taskPath =
        typeof arg === 'string'
          ? arg
          : arg &&
              typeof arg === 'object' &&
              'taskId' in arg &&
              typeof (arg as { taskId?: unknown }).taskId === 'string'
            ? (arg as { taskId: string }).taskId
            : undefined;

      TaskEditorPanel.createOrShow(context.extensionUri, taskService, taskPath);
    })
  );
}

export function deactivate(): void {
  // No-op for scaffold.
}
