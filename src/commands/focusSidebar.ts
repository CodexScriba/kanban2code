import vscode from 'vscode';
import { logError, logInfo, notifyError } from '../utils/logger';

/**
 * Focuses the Kanban2Code sidebar view and ensures the container is visible.
 */
export async function focusSidebarCommand(): Promise<void> {
  try {
    await vscode.commands.executeCommand('workbench.view.extension.kanban2code');
    await vscode.commands.executeCommand('kanban2code.sidebar.focus');
    logInfo('Focused Kanban2Code sidebar');
  } catch (error) {
    notifyError('Failed to focus Kanban2Code sidebar', error);
    logError('focusSidebarCommand failed', error);
  }
}

