import vscode from 'vscode';
import { BoardPanel } from '../webview/BoardPanel';
import { scaffoldWorkspace } from '../workspace/scaffolder';
import { findKanbanRoot } from '../workspace/validation';
import { logError, logInfo, notifyError } from '../utils/logger';

export async function openBoardCommand(context: vscode.ExtensionContext): Promise<void> {
  try {
    const root = await findKanbanRoot();

    if (!root) {
      const selection = await vscode.window.showInformationMessage(
        'No .kanban2code workspace found. Scaffold one?',
        'Scaffold workspace',
      );
      if (selection === 'Scaffold workspace') {
        const newRoot = await scaffoldWorkspace();
        BoardPanel.createOrShow(context, newRoot);
        logInfo(`Scaffolded workspace and opened board at ${newRoot}`);
        return;
      }
      return;
    }

    BoardPanel.createOrShow(context, root);
    logInfo('Opened Kanban2Code board');
  } catch (error) {
    notifyError('Failed to open Kanban2Code board', error);
    logError('openBoardCommand failed', error);
  }
}
