import * as vscode from 'vscode';
import { SidebarProvider } from './webview/SidebarProvider';

export function activate(context: vscode.ExtensionContext): void {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider)
  );
}

export function deactivate(): void {
  // No-op for scaffold.
}
