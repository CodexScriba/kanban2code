import * as vscode from 'vscode';
import { SidebarProvider } from './webview/SidebarProvider';
import { KanbanPanel } from './webview/KanbanPanel';

export function activate(context: vscode.ExtensionContext): void {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('kanban2code.openBoard', () => {
      KanbanPanel.createOrShow(context.extensionUri);
    })
  );
}

export function deactivate(): void {
  // No-op for scaffold.
}
