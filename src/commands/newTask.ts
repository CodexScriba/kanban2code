import fs from 'fs/promises';
import path from 'path';
import vscode from 'vscode';
import { FOLDERS } from '../core/constants';
import { scaffoldWorkspace } from '../workspace/scaffolder';
import { ensurePathInsideRoot, findKanbanRoot } from '../workspace/validation';
import { logError, logInfo, notifyError } from '../utils/logger';

export async function newTaskCommand(): Promise<void> {
  let root = await findKanbanRoot();

  if (!root) {
    const selection = await vscode.window.showInformationMessage(
      'No .kanban2code workspace found. Scaffold one?',
      'Scaffold workspace',
    );
    if (selection !== 'Scaffold workspace') {
      return;
    }
    root = await scaffoldWorkspace();
  }

  const fileName = `task-${Date.now()}.md`;
  const filePath = path.join(root, FOLDERS.inbox, fileName);

  try {
    ensurePathInsideRoot(filePath, root);

    const content = `---\nstage: inbox\ntitle: New task\ntags: []\ncreated: ${new Date().toISOString()}\n---\n\nDescribe the task here.\n`;
    await fs.writeFile(filePath, content, 'utf8');

    const document = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
    await vscode.window.showTextDocument(document);
    logInfo(`Created new task at ${filePath}`);
  } catch (error) {
    notifyError('Failed to create new task', error);
    logError('newTaskCommand failed', error);
  }
}
