import vscode from 'vscode';
import fs from 'fs/promises';
import type { Stage } from '../types/task';
import { findKanbanRoot, ensurePathInsideRoot } from '../workspace/validation';
import { loadTask } from '../services/taskService';
import { getNextStage, moveTaskToStage, InvalidTransitionError } from '../services/taskMoveService';
import { logError, logInfo, notifyError } from '../utils/logger';
import { parseTaskFile, stringifyTask } from '../services/frontmatter';

export interface MarkImplementationDoneArgs {
  taskFilePath?: string;
  targetStage?: Stage;
  rootOverride?: string;
}

/**
 * Advances the current task to the next logical stage (defaults to Audit/Completed).
 */
export async function markImplementationDoneCommand(args?: MarkImplementationDoneArgs): Promise<void> {
  const root = args?.rootOverride ?? (await findKanbanRoot());

  if (!root) {
    notifyError('No .kanban2code workspace found.');
    return;
  }

  const activeEditor = vscode.window.activeTextEditor;
  const filePath = args?.taskFilePath ?? activeEditor?.document.uri.fsPath;

  if (!filePath) {
    notifyError('Open a task file to mark it done.');
    return;
  }

  if (!filePath.endsWith('.md')) {
    notifyError('Active file is not a Kanban2Code task.');
    return;
  }

  try {
    ensurePathInsideRoot(filePath, root);
  } catch (error) {
    notifyError('Task is outside the Kanban2Code workspace.', error);
    return;
  }

  try {
    const task = await loadTask(filePath, root);
    const targetStage: Stage =
      args?.targetStage ?? getNextStage(task.stage) ?? 'completed';

    if (task.stage === targetStage) {
      vscode.window.showInformationMessage(`"${task.title}" is already at ${targetStage}.`);
      return;
    }

    try {
      await moveTaskToStage(task, targetStage, { allowRegressions: true });
    } catch (error) {
      if (error instanceof InvalidTransitionError) {
        // Allow explicit overrides (e.g., jumping straight to completed)
        const originalContent = await fs.readFile(filePath, 'utf8');
        const { rawFrontmatter } = parseTaskFile(originalContent, filePath);
        task.stage = targetStage;
        const updated = stringifyTask(task, rawFrontmatter);
        await fs.writeFile(filePath, updated, 'utf8');
      } else {
        throw error;
      }
    }
    logInfo(`Moved ${task.title} to ${targetStage}`);
    vscode.window.showInformationMessage(`Marked "${task.title}" as ${targetStage}.`);
  } catch (error) {
    notifyError('Failed to mark implementation done', error);
    logError('markImplementationDoneCommand failed', error);
  }
}
