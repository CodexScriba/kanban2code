import * as vscode from 'vscode';
import { SidebarProvider } from './webview/SidebarProvider';
import { KanbanPanel } from './webview/KanbanPanel';
import { TaskScanner, type TaskScannerRuntime } from './services/task-scanner';

export function activate(context: vscode.ExtensionContext): void {
  const scannerRuntime: TaskScannerRuntime = {
    findFiles: (globPattern) => vscode.workspace.findFiles(globPattern),
    readFile: (uri) => vscode.workspace.fs.readFile(uri as vscode.Uri),
    toRelativePath: (uri) => vscode.workspace.asRelativePath(uri as vscode.Uri, false),
    createWatcher: (globPattern) => vscode.workspace.createFileSystemWatcher(globPattern),
    createEventEmitter: <T>() => new vscode.EventEmitter<T>()
  };

  const taskScanner = new TaskScanner(scannerRuntime);
  const sidebarProvider = new SidebarProvider(context.extensionUri, taskScanner);

  context.subscriptions.push(taskScanner, sidebarProvider);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('kanban2code.openBoard', () => {
      KanbanPanel.createOrShow(context.extensionUri, taskScanner);
    })
  );
}

export function deactivate(): void {
  // No-op for scaffold.
}
