import * as vscode from 'vscode';
import { KanbanPanel } from '../webview/KanbanPanel';
import { scaffoldWorkspace } from '../services/scaffolder';
import { WorkspaceState } from '../workspace/state';
import { KANBAN_FOLDER } from '../core/constants';
import { buildCopyPayload, copyToClipboard } from '../services/copy';
import { findTaskById } from '../services/scanner';
import { CopyMode } from '../types/copy';
import { SidebarProvider } from '../webview/SidebarProvider';
import { restartFileWatcher } from '../extension';
import * as path from 'path';
import type { Stage } from '../types/task';

export function registerCommands(context: vscode.ExtensionContext, sidebarProvider: SidebarProvider) {
  context.subscriptions.push(
    // Open Board command
    vscode.commands.registerCommand('kanban2code.openBoard', () => {
      KanbanPanel.createOrShow(context.extensionUri);
    }),

    // New Task command (modal-friendly)
    vscode.commands.registerCommand('kanban2code.newTask', async (options?: {
      title?: string;
      location?: 'inbox' | { type: 'inbox' } | { type: 'project'; project: string; phase?: string };
      stage?: Stage;
      agent?: string;
      tags?: string[];
      template?: string;
      content?: string;
    }) => {
      const kanbanRoot = WorkspaceState.kanbanRoot;
      if (!kanbanRoot) {
        vscode.window.showErrorMessage('Kanban workspace not detected. Please create a Kanban board first.');
        return;
      }

      const title =
        options?.title ??
        (await vscode.window.showInputBox({
          prompt: 'Enter task title',
          placeHolder: 'New task...',
        }));

      if (!title) return;

      const location = options?.location || 'inbox';
      const timestamp = Date.now();
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const filename = `${timestamp}-${slug}.md`;

      let targetDir: string;
      if (location === 'inbox' || (typeof location === 'object' && location.type === 'inbox')) {
        targetDir = path.join(kanbanRoot, 'inbox');
      } else {
        const project = typeof location === 'string' ? location : location.project;
        const phase = typeof location === 'string' ? undefined : location.phase;
        targetDir = phase
          ? path.join(kanbanRoot, 'projects', project, phase)
          : path.join(kanbanRoot, 'projects', project);
      }

      await vscode.workspace.fs.createDirectory(vscode.Uri.file(targetDir));

      const filePath = path.join(targetDir, filename);
      const stage = options?.stage ?? 'inbox';

      const frontmatterLines = [
        `stage: ${stage}`,
        `created: ${new Date().toISOString()}`,
      ];

      if (options?.agent) {
        frontmatterLines.push(`agent: ${options.agent}`);
      }

      if (options?.tags && options.tags.length > 0) {
        frontmatterLines.push(`tags: [${options.tags.join(', ')}]`);
      }

      if (options?.template) {
        frontmatterLines.push(`template: ${options.template}`);
      }

      const content = `---
${frontmatterLines.join('\n')}
---

# ${title}

${options?.content ?? ''}
`;

      try {
        await vscode.workspace.fs.writeFile(
          vscode.Uri.file(filePath),
          Buffer.from(content, 'utf8')
        );

        await sidebarProvider.refresh();

        // Open the new task file
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
        await vscode.window.showTextDocument(doc);

        vscode.window.showInformationMessage(`Task "${title}" created.`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to create task: ${message}`);
      }
    }),

    // Scaffold Workspace command
    vscode.commands.registerCommand('kanban2code.scaffoldWorkspace', async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace open. Please open a folder first.');
        return;
      }

      const rootPath = workspaceFolders[0].uri.fsPath;
      try {
        await scaffoldWorkspace(rootPath);

        // Update State
        const newKanbanRoot = path.join(rootPath, KANBAN_FOLDER);
        WorkspaceState.setKanbanRoot(newKanbanRoot);
        await vscode.commands.executeCommand('setContext', 'kanban2code:isActive', true);

        // Start file watcher for the new kanban root
        restartFileWatcher(newKanbanRoot);

        // Refresh sidebar
        await sidebarProvider.refresh();

        vscode.window.showInformationMessage('Kanban2Code initialized successfully!');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to scaffold: ${message}`);
      }
    }),

    // Copy Task Context command
    vscode.commands.registerCommand('kanban2code.copyTaskContext', async (taskInput: string | { id: string }, mode: CopyMode = 'full_xml') => {
      const kanbanRoot = WorkspaceState.kanbanRoot;
      if (!kanbanRoot) {
        vscode.window.showErrorMessage('Kanban workspace not detected.');
        return;
      }

      try {
        const taskId = typeof taskInput === 'string' ? taskInput : taskInput?.id;
        if (!taskId) {
          vscode.window.showErrorMessage('No task specified for copy.');
          return;
        }

        const task = await findTaskById(kanbanRoot, taskId);
        if (!task) {
          vscode.window.showErrorMessage(`Task '${taskId}' not found.`);
          return;
        }

        const payload = await buildCopyPayload(task, mode, kanbanRoot);
        await copyToClipboard(payload);
        vscode.window.showInformationMessage('Task context copied to clipboard.');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to copy context: ${message}`);
      }
    }),

    // Open Settings command (placeholder)
    vscode.commands.registerCommand('kanban2code.openSettings', () => {
      vscode.commands.executeCommand('workbench.action.openSettings', '@ext:kanban2code');
    }),

    // New Project command (placeholder)
    vscode.commands.registerCommand('kanban2code.newProject', async () => {
      const kanbanRoot = WorkspaceState.kanbanRoot;
      if (!kanbanRoot) {
        vscode.window.showErrorMessage('Kanban workspace not detected.');
        return;
      }

      const name = await vscode.window.showInputBox({
        prompt: 'Enter project name',
        placeHolder: 'my-project',
        validateInput: (value) => {
          if (!value) return 'Project name is required';
          if (!/^[a-z0-9-]+$/.test(value)) return 'Use lowercase letters, numbers, and hyphens only';
          return null;
        }
      });

      if (!name) return;

      const projectDir = path.join(kanbanRoot, 'projects', name);
      try {
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(projectDir));

        // Create _context.md file
        const contextPath = path.join(projectDir, '_context.md');
        const contextContent = `# ${name}

Project context and documentation goes here.
`;
        await vscode.workspace.fs.writeFile(
          vscode.Uri.file(contextPath),
          Buffer.from(contextContent, 'utf8')
        );

        vscode.window.showInformationMessage(`Project "${name}" created.`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to create project: ${message}`);
      }
    }),

    // New Context command (placeholder)
    vscode.commands.registerCommand('kanban2code.newContext', () => {
      vscode.window.showInformationMessage('New Context command (Not implemented yet)');
    }),

    // New Agent command (placeholder)
    vscode.commands.registerCommand('kanban2code.newAgent', async () => {
      const kanbanRoot = WorkspaceState.kanbanRoot;
      if (!kanbanRoot) {
        vscode.window.showErrorMessage('Kanban workspace not detected.');
        return;
      }

      const name = await vscode.window.showInputBox({
        prompt: 'Enter agent name',
        placeHolder: 'frontend-dev',
      });

      if (!name) return;

      const agentPath = path.join(kanbanRoot, '_agents', `${name}.md`);
      const agentContent = `# ${name}

## Role
Describe the agent's role and expertise.

## Guidelines
- Guideline 1
- Guideline 2
`;
      try {
        await vscode.workspace.fs.writeFile(
          vscode.Uri.file(agentPath),
          Buffer.from(agentContent, 'utf8')
        );

        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(agentPath));
        await vscode.window.showTextDocument(doc);

        vscode.window.showInformationMessage(`Agent "${name}" created.`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to create agent: ${message}`);
      }
    }),

    // New Template command (placeholder)
    vscode.commands.registerCommand('kanban2code.newTemplate', () => {
      vscode.window.showInformationMessage('New Template command (Not implemented yet)');
    }),
  );
}
