import * as fs from 'fs/promises';
import * as path from 'path';
import { Task, Stage } from '../types/task';
import { parseTaskFile, stringifyTaskFile } from './frontmatter';
import { isTransitionAllowed } from '../core/rules';
import { findTaskById } from './scanner';
import { WorkspaceState } from '../workspace/state';
import { INBOX_FOLDER, PROJECTS_FOLDER } from '../core/constants';
import { movePath } from './fs-move';

export class StageUpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StageUpdateError';
  }
}

export async function updateTaskStage(task: Task, newStage: Stage): Promise<Task> {
  // 1. Read fresh content (to avoid race conditions/stale data)
  const freshTask = await parseTaskFile(task.filePath);
  
  if (freshTask.id !== task.id) {
    throw new StageUpdateError('Task ID mismatch in file. File might have been overwritten.');
  }

  // 2. Validate Transition using current on-disk stage
  if (!isTransitionAllowed(freshTask.stage, newStage)) {
    throw new StageUpdateError(`Transition from '${freshTask.stage}' to '${newStage}' is not allowed.`);
  }

  // 3. Update Stage
  freshTask.stage = newStage;

  // 4. Serialize and Write
  const originalContent = await fs.readFile(task.filePath, 'utf-8');
  const newContent = stringifyTaskFile(freshTask, originalContent);
  
  await fs.writeFile(task.filePath, newContent, 'utf-8');

  return freshTask;
}

export async function changeStageAndReload(taskId: string, newStage: Stage): Promise<Task> {
  const root = WorkspaceState.kanbanRoot;
  if (!root) {
    throw new Error('Kanban root not found in state.');
  }

  const task = await findTaskById(root, taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  return updateTaskStage(task, newStage);
}

export type TaskLocation = { type: 'inbox' } | { type: 'project'; project: string; phase?: string };

/**
 * Move a task to a new location (inbox or project/phase).
 * This physically moves the file to the new directory.
 */
export async function moveTaskToLocation(taskId: string, location: TaskLocation): Promise<string> {
  const root = WorkspaceState.kanbanRoot;
  if (!root) {
    throw new Error('Kanban root not found in state.');
  }

  const task = await findTaskById(root, taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  const fileName = path.basename(task.filePath);
  let targetDir: string;

  if (location.type === 'inbox') {
    targetDir = path.join(root, INBOX_FOLDER);
  } else {
    targetDir = path.join(root, PROJECTS_FOLDER, location.project);
    if (location.phase) {
      targetDir = path.join(targetDir, location.phase);
    }
  }

  // Ensure target directory exists
  await fs.mkdir(targetDir, { recursive: true });

  const targetPath = path.join(targetDir, fileName);

  // Don't move if already at target location
  if (task.filePath === targetPath) {
    return targetPath;
  }

  // Move the file
  await movePath(task.filePath, targetPath);

  return targetPath;
}
