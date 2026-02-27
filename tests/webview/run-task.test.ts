import { describe, expect, test, vi } from 'vitest';
import type { Task } from '../../src/types/task';
import { executeRunTaskPayload } from '../../src/webview/run-task';

const task: Task = {
  id: 'task-1',
  filePath: '/repo/.kanban2code/inbox/task-1.md',
  title: 'Task 1',
  stage: 'code',
  provider: 'codex',
  content: '# Task 1',
};

describe('executeRunTaskPayload', () => {
  test('runs current stage in terminal when allRemaining is false', async () => {
    const executeTaskInTerminalFn = vi.fn(async () => undefined);
    const findTaskByIdFn = vi.fn(async () => task);
    const runTaskPipelineFn = vi.fn(async () => ({ status: 'completed' as const }));

    await executeRunTaskPayload(
      '/repo/.kanban2code',
      '/repo',
      { taskFilePath: task.filePath, allRemaining: false },
      { executeTaskInTerminalFn, findTaskByIdFn, runTaskPipelineFn },
    );

    expect(executeTaskInTerminalFn).toHaveBeenCalledWith('/repo/.kanban2code', 'task-1', '/repo');
    expect(runTaskPipelineFn).not.toHaveBeenCalled();
  });

  test('runs remaining pipeline when allRemaining is true', async () => {
    const executeTaskInTerminalFn = vi.fn(async () => undefined);
    const findTaskByIdFn = vi.fn(async () => task);
    const runTaskPipelineFn = vi.fn(async () => ({ status: 'completed' as const }));

    await executeRunTaskPayload(
      '/repo/.kanban2code',
      '/repo',
      { taskFilePath: task.filePath, allRemaining: true },
      { executeTaskInTerminalFn, findTaskByIdFn, runTaskPipelineFn },
    );

    expect(findTaskByIdFn).toHaveBeenCalledWith('/repo/.kanban2code', 'task-1');
    expect(runTaskPipelineFn).toHaveBeenCalledWith(task);
    expect(executeTaskInTerminalFn).not.toHaveBeenCalled();
  });

  test('throws when allRemaining task cannot be found', async () => {
    const executeTaskInTerminalFn = vi.fn(async () => undefined);
    const findTaskByIdFn = vi.fn(async () => null);
    const runTaskPipelineFn = vi.fn(async () => ({ status: 'completed' as const }));

    await expect(
      executeRunTaskPayload(
        '/repo/.kanban2code',
        '/repo',
        { taskFilePath: '/repo/.kanban2code/inbox/missing.md', allRemaining: true },
        { executeTaskInTerminalFn, findTaskByIdFn, runTaskPipelineFn },
      ),
    ).rejects.toThrow('Task not found: missing');
  });

  test('throws when allRemaining pipeline does not complete', async () => {
    const executeTaskInTerminalFn = vi.fn(async () => undefined);
    const findTaskByIdFn = vi.fn(async () => task);
    const runTaskPipelineFn = vi.fn(async () => ({ status: 'failed' as const, error: 'Audit failed' }));

    await expect(
      executeRunTaskPayload(
        '/repo/.kanban2code',
        '/repo',
        { taskFilePath: task.filePath, allRemaining: true },
        { executeTaskInTerminalFn, findTaskByIdFn, runTaskPipelineFn },
      ),
    ).rejects.toThrow('Audit failed');
  });
});
