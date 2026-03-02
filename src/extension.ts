import * as vscode from 'vscode';
import { SidebarProvider } from './webview/SidebarProvider';
import { KanbanPanel } from './webview/KanbanPanel';
import { TaskEditorPanel } from './webview/TaskEditorPanel';
import { SettingsPanel } from './webview/SettingsPanel';
import { TaskScanner, type TaskScannerRuntime } from './services/task-scanner';
import { TaskService } from './services/task-service';
import { SettingsService } from './services/settings-service';
import { QueueService } from './services/queue-service';
import type { ValidationFocusTarget } from './types/runner';

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
  const queueService = new QueueService(workspaceRoot ?? '', taskService, settingsService, {
    promptForValidation: async (taskPath, validation) => {
      const firstError = validation.errors[0];
      if (firstError) {
        void vscode.window.showWarningMessage(firstError.message);
      }
      await vscode.commands.executeCommand('kanban2code.openTaskEditor', {
        taskId: taskPath,
        focusTargets: validation.focusTargets
      });
    }
  });
  const sidebarProvider = new SidebarProvider(context.extensionUri, taskScanner, queueService);

  context.subscriptions.push(taskScanner, queueService, sidebarProvider);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider)
  );
  context.subscriptions.push(
    TaskEditorPanel.onDidSaveTask(({ taskPath }) => {
      void queueService.handleTaskSaved(taskPath);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('kanban2code.openBoard', () => {
      if (!workspaceRoot) {
        void vscode.window.showWarningMessage(
          'Open a workspace folder to use Kanban board drag-and-drop persistence.'
        );
        return;
      }

      KanbanPanel.createOrShow(
        context.extensionUri,
        taskScanner,
        taskService,
        settingsService,
        queueService
      );
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
      const focusTargets =
        arg &&
        typeof arg === 'object' &&
        'focusTargets' in arg &&
        Array.isArray((arg as { focusTargets?: unknown }).focusTargets)
          ? ((arg as { focusTargets: ValidationFocusTarget[] }).focusTargets ?? [])
          : undefined;

      TaskEditorPanel.createOrShow(context.extensionUri, taskService, taskPath, focusTargets);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('kanban2code.openSettings', (arg?: unknown) => {
      if (!workspaceRoot) {
        void vscode.window.showWarningMessage('Open a workspace folder to configure Kanban2Code settings.');
        return;
      }

      const projectSlug =
        arg &&
        typeof arg === 'object' &&
        'projectSlug' in arg &&
        typeof (arg as { projectSlug?: unknown }).projectSlug === 'string'
          ? (arg as { projectSlug: string }).projectSlug
          : undefined;

      SettingsPanel.createOrShow(context.extensionUri, settingsService, projectSlug);
    })
  );
}

export function deactivate(): void {
  // No-op for scaffold.
}
