import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { SidebarProvider } from './webview/SidebarProvider';
import { WorkspaceState } from './workspace/state';
import { findKanbanRoot } from './workspace/validation';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  let sidebarProvider: SidebarProvider | undefined;

  const registerSidebarProvider = (
    kanbanRoot: string,
    workspaceRoot: string,
  ) => {
    if (sidebarProvider) {
      return;
    }

    sidebarProvider = new SidebarProvider(context.extensionUri, {
      kanbanRoot,
      workspaceRoot,
    });

    const registration = vscode.window.registerWebviewViewProvider(
      SidebarProvider.viewType,
      sidebarProvider,
    );
    context.subscriptions.push(registration);
  };

  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? null;
  let kanbanRoot: string | null = null;

  if (workspaceRoot) {
    kanbanRoot = await findKanbanRoot(workspaceRoot);
    WorkspaceState.setKanbanRoot(kanbanRoot);

    if (kanbanRoot) {
      registerSidebarProvider(kanbanRoot, workspaceRoot);
    }
  }

  registerCommands(context, {
    getKanbanRoot: () => WorkspaceState.kanbanRoot,
    setKanbanRoot: (nextKanbanRoot) => WorkspaceState.setKanbanRoot(nextKanbanRoot),
    onWorkspaceCreated: (createdKanbanRoot, createdWorkspaceRoot) => {
      registerSidebarProvider(createdKanbanRoot, createdWorkspaceRoot);
    },
    focusSidebarChat: () => {
      sidebarProvider?.focusChatInput();
    },
  });

  if (workspaceRoot && !kanbanRoot) {
    const action = await vscode.window.showInformationMessage(
      'Kanban2Code workspace not found.',
      'Create Workspace',
    );

    if (action === 'Create Workspace') {
      await vscode.commands.executeCommand('kanban2code.createWorkspace');
    }
  }
}

export function deactivate(): void {
  WorkspaceState.setKanbanRoot(null);
}
