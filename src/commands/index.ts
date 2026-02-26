import * as path from 'path';
import * as vscode from 'vscode';
import { KANBAN_FOLDER, PROVIDERS_FOLDER } from '../core/constants';
import { loadAllTasks } from '../services/scanner';
import { scaffoldWorkspace } from '../services/scaffolder';
import { executeTaskInTerminal } from '../services/terminal-executor';
import { findKanbanRoot } from '../workspace/validation';

interface RunnableTaskQuickPickItem extends vscode.QuickPickItem {
  taskId: string;
}

export interface RegisterCommandsOptions {
  getKanbanRoot?: () => string | null;
  setKanbanRoot?: (kanbanRoot: string | null) => void;
  onWorkspaceCreated?: (kanbanRoot: string, workspaceRoot: string) => Promise<void> | void;
  focusSidebarChat?: () => Promise<void> | void;
}

function getWorkspaceRoot(): string | null {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? null;
}

async function resolveKanbanRoot(workspaceRoot: string, options?: RegisterCommandsOptions): Promise<string | null> {
  const fromState = options?.getKanbanRoot?.();
  if (fromState) {
    return fromState;
  }

  const discovered = await findKanbanRoot(workspaceRoot);
  options?.setKanbanRoot?.(discovered);
  return discovered;
}

async function showCreateWorkspacePrompt(): Promise<void> {
  const action = await vscode.window.showInformationMessage(
    'Kanban2Code workspace not found.',
    'Create Workspace',
  );

  if (action === 'Create Workspace') {
    await vscode.commands.executeCommand('kanban2code.createWorkspace');
  }
}

export function registerCommands(
  context: vscode.ExtensionContext,
  options: RegisterCommandsOptions = {},
): void {
  const createWorkspace = vscode.commands.registerCommand('kanban2code.createWorkspace', async () => {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      void vscode.window.showErrorMessage('Please open a workspace folder first');
      return;
    }

    try {
      await scaffoldWorkspace(workspaceRoot);
      const kanbanRoot = path.join(workspaceRoot, KANBAN_FOLDER);
      options.setKanbanRoot?.(kanbanRoot);
      await options.onWorkspaceCreated?.(kanbanRoot, workspaceRoot);
      void vscode.window.showInformationMessage('Kanban2Code workspace created successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('already initialized')) {
        void vscode.window.showInformationMessage(message);
        return;
      }

      void vscode.window.showErrorMessage(`Failed to create workspace: ${message}`);
    }
  });

  const runTask = vscode.commands.registerCommand('kanban2code.runTask', async () => {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      void vscode.window.showErrorMessage('Please open a workspace folder first');
      return;
    }

    const kanbanRoot = await resolveKanbanRoot(workspaceRoot, options);
    if (!kanbanRoot) {
      await showCreateWorkspacePrompt();
      return;
    }

    const tasks = await loadAllTasks(kanbanRoot);
    const runnableTasks = tasks.filter((task) => Boolean(task.provider));

    if (runnableTasks.length === 0) {
      void vscode.window.showInformationMessage('No tasks with providers configured found');
      return;
    }

    const items: RunnableTaskQuickPickItem[] = runnableTasks.map((task) => ({
      label: task.title,
      description: `${task.stage}${task.provider ? ` | ${task.provider}` : ''}`,
      detail: task.filePath,
      taskId: task.id,
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a task to run in terminal',
      matchOnDescription: true,
      matchOnDetail: true,
    });

    if (!selected) {
      return;
    }

    await executeTaskInTerminal(kanbanRoot, selected.taskId, workspaceRoot);
  });

  const newTask = vscode.commands.registerCommand('kanban2code.newTask', async () => {
    await vscode.commands.executeCommand('kanban2code.sidebar.focus');
    await options.focusSidebarChat?.();
  });

  const openSettings = vscode.commands.registerCommand('kanban2code.openSettings', async () => {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      void vscode.window.showErrorMessage('Please open a workspace folder first');
      return;
    }

    const kanbanRoot = await resolveKanbanRoot(workspaceRoot, options);
    if (!kanbanRoot) {
      await showCreateWorkspacePrompt();
      return;
    }

    const providersFolder = path.join(kanbanRoot, PROVIDERS_FOLDER);
    await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(providersFolder));
  });

  context.subscriptions.push(createWorkspace, runTask, newTask, openSettings);
}
