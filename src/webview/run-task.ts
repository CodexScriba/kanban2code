import * as path from 'path';
import type { RunnerRunResult } from '../runner/runner-engine';
import { RunnerEngine } from '../runner/runner-engine';
import { findTaskById } from '../services/scanner';
import { executeTaskInTerminal } from '../services/terminal-executor';
import type { Task } from '../types/task';
import type { RunTaskPayload } from './messaging';

export interface RunTaskExecutionDeps {
  executeTaskInTerminalFn: typeof executeTaskInTerminal;
  findTaskByIdFn: typeof findTaskById;
  runTaskPipelineFn: (task: Task) => Promise<RunnerRunResult>;
}

function createDefaultDeps(kanbanRoot: string): RunTaskExecutionDeps {
  return {
    executeTaskInTerminalFn: executeTaskInTerminal,
    findTaskByIdFn: findTaskById,
    runTaskPipelineFn: async (task: Task) => new RunnerEngine(kanbanRoot).runTask(task),
  };
}

export async function executeRunTaskPayload(
  kanbanRoot: string,
  workspaceRoot: string,
  payload: RunTaskPayload,
  depsOverride: Partial<RunTaskExecutionDeps> = {},
): Promise<void> {
  const deps = { ...createDefaultDeps(kanbanRoot), ...depsOverride };
  const taskId = path.basename(payload.taskFilePath, '.md');

  if (payload.allRemaining) {
    const task = await deps.findTaskByIdFn(kanbanRoot, taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const result = await deps.runTaskPipelineFn(task);
    if (result.status !== 'completed') {
      throw new Error(result.error ?? `Task pipeline ended with status: ${result.status}`);
    }

    return;
  }

  await deps.executeTaskInTerminalFn(kanbanRoot, taskId, workspaceRoot);
}
