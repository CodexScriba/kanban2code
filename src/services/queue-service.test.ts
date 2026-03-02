import assert from 'node:assert/strict';
import test from 'node:test';
import type { Settings } from '../types/settings';
import type { Task } from '../types/task';
import { QueueService } from './queue-service';

const createSettings = (maxParallelRuns: number): Settings =>
  ({
    providersAndModels: {
      providers: {
        codex: { enabled: true, models: ['gpt-5.3-codex'] }
      },
      profiles: {
        default: {
          provider: 'codex',
          model: 'gpt-5.3-codex',
          description: 'default'
        }
      }
    },
    queueAndExecution: {
      maxParallelRuns,
      promptMissingFields: false,
      autoResumeOnSave: true
    }
  } as unknown as Settings);

const createTask = (): Task => ({
  frontmatter: {
    title: 'Implement QueueService',
    stage: 'plan',
    role: 'planner',
    provider: 'codex',
    model: 'gpt-5.3-codex',
    profile: 'default',
    tags: [],
    contexts: [],
    skills: []
  },
  body: 'Ship it.'
});

const createQueueService = (maxParallelRuns = 1): QueueService => {
  const task = createTask();
  return new QueueService(
    '/workspace',
    {
      readTask: async () => task,
      updateTask: async () => task
    },
    {
      getSettings: async () => createSettings(maxParallelRuns),
      getEffectiveMapping: async () => ({
        role: 'planner',
        provider: 'codex',
        model: 'gpt-5.3-codex',
        profile: 'default'
      }),
      validateProviderModel: () => ({ valid: true }),
      validateProfile: () => ({ valid: true })
    },
    {
      pathExists: async () => true,
      now: (() => {
        let value = 1000;
        return () => {
          value += 1;
          return value;
        };
      })()
    }
  );
};

test('maintains FIFO order with enqueue/dequeue/peek', async () => {
  const queue = createQueueService(1);

  const first = await queue.enqueue('.kanban2code/inbox/task-a.md', 'stage');
  const second = await queue.enqueue('.kanban2code/inbox/task-b.md', 'all');

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(queue.peek()?.taskId, '.kanban2code/inbox/task-a.md');

  const dequeuedFirst = await queue.dequeue();
  const dequeuedSecond = await queue.dequeue();

  assert.equal(dequeuedFirst?.taskId, '.kanban2code/inbox/task-a.md');
  assert.equal(dequeuedSecond?.taskId, '.kanban2code/inbox/task-b.md');
  assert.equal(queue.peek(), null);
});

test('rejects duplicate enqueue for queued or running task', async () => {
  const queue = createQueueService(1);

  const initial = await queue.enqueue('.kanban2code/inbox/task-a.md', 'stage');
  const duplicateQueued = await queue.enqueue('.kanban2code/inbox/task-a.md', 'all');

  assert.equal(initial.ok, true);
  assert.deepEqual(duplicateQueued, { ok: false, reason: 'duplicate' });

  const dequeued = await queue.dequeue();
  assert.equal(dequeued?.taskId, '.kanban2code/inbox/task-a.md');
  queue.setState('.kanban2code/inbox/task-a.md', 'running');

  const duplicateRunning = await queue.enqueue('.kanban2code/inbox/task-a.md', 'stage');
  assert.deepEqual(duplicateRunning, { ok: false, reason: 'duplicate' });
});

test('cancel removes queued task and emits cancelled state', async () => {
  const queue = createQueueService(1);
  const stateEvents: Array<{ taskId: string; state: string }> = [];
  const unsubscribe = queue.onDidStateChange((taskId, state) => {
    stateEvents.push({ taskId, state });
  });

  await queue.enqueue('.kanban2code/inbox/task-a.md', 'stage');
  const cancelled = queue.cancel('.kanban2code/inbox/task-a.md');

  assert.equal(cancelled, true);
  assert.equal(queue.getSnapshot().totalQueued, 0);
  assert.equal(stateEvents[stateEvents.length - 1]?.state, 'cancelled');

  unsubscribe();
});

test('cancel on running task marks cancellation requested', async () => {
  const queue = createQueueService(1);

  await queue.enqueue('.kanban2code/inbox/task-a.md', 'stage');
  await queue.dequeue();
  queue.setState('.kanban2code/inbox/task-a.md', 'running');

  const cancelled = queue.cancel('.kanban2code/inbox/task-a.md');

  assert.equal(cancelled, true);
  assert.equal(queue.isCancellationRequested('.kanban2code/inbox/task-a.md'), true);
  assert.equal(queue.consumeCancellation('.kanban2code/inbox/task-a.md'), true);
  assert.equal(queue.consumeCancellation('.kanban2code/inbox/task-a.md'), false);
});

test('retry re-enqueues failed task only', async () => {
  const queue = createQueueService(1);

  const invalidRetry = await queue.retry('.kanban2code/inbox/task-a.md');
  assert.deepEqual(invalidRetry, { ok: false, reason: 'invalid_state' });

  await queue.enqueue('.kanban2code/inbox/task-a.md', 'stage');
  await queue.dequeue();
  queue.setState('.kanban2code/inbox/task-a.md', 'running');
  queue.setState('.kanban2code/inbox/task-a.md', 'failed');

  const retryResult = await queue.retry('.kanban2code/inbox/task-a.md', 'all');
  assert.equal(retryResult.ok, true);
  assert.equal(queue.peek()?.scope, 'all');
});

test('dequeue respects max parallel runs setting', async () => {
  const queue = createQueueService(1);

  await queue.enqueue('.kanban2code/inbox/task-a.md', 'stage');
  await queue.enqueue('.kanban2code/inbox/task-b.md', 'stage');

  const first = await queue.dequeue();
  assert.equal(first?.taskId, '.kanban2code/inbox/task-a.md');

  queue.setState('.kanban2code/inbox/task-a.md', 'running');

  const blocked = await queue.dequeue();
  assert.equal(blocked, null);

  queue.setState('.kanban2code/inbox/task-a.md', 'success');

  const second = await queue.dequeue();
  assert.equal(second?.taskId, '.kanban2code/inbox/task-b.md');
});

test('validation failure reports missing title focus target', async () => {
  const task: Task = {
    ...createTask(),
    frontmatter: {
      ...createTask().frontmatter,
      title: ''
    }
  };

  const queue = new QueueService(
    '/workspace',
    {
      readTask: async () => task,
      updateTask: async () => task
    },
    {
      getSettings: async () => createSettings(1),
      getEffectiveMapping: async () => ({
        role: 'planner',
        provider: 'codex',
        model: 'gpt-5.3-codex',
        profile: 'default'
      }),
      validateProviderModel: () => ({ valid: true }),
      validateProfile: () => ({ valid: true })
    },
    {
      pathExists: async () => true
    }
  );

  const result = await queue.enqueue('.kanban2code/inbox/task-a.md', 'stage');
  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }
  assert.equal(result.reason, 'validation_failed');
  assert.equal(result.validation?.missingRequiredFields.includes('title'), true);
  assert.deepEqual(result.validation?.focusTargets[0], { field: 'title', stage: undefined });
});

test('run-all validates entire pipeline mappings', async () => {
  const queue = new QueueService(
    '/workspace',
    {
      readTask: async () => createTask(),
      updateTask: async () => createTask()
    },
    {
      getSettings: async () => createSettings(1),
      getEffectiveMapping: async (stage: string) => {
        if (stage === 'capture') {
          return {
            role: '',
            provider: '',
            model: '',
            profile: ''
          };
        }
        return {
          role: 'planner',
          provider: 'codex',
          model: 'gpt-5.3-codex',
          profile: 'default'
        };
      },
      validateProviderModel: () => ({ valid: true }),
      validateProfile: () => ({ valid: true })
    },
    {
      pathExists: async () => true
    }
  );

  const result = await queue.enqueue('.kanban2code/inbox/task-a.md', 'all');
  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }
  assert.equal(result.reason, 'validation_failed');
  assert.equal(result.validation?.errors.some((entry) => entry.message.includes("Pipeline step 'capture'")), true);
  assert.equal(result.validation?.focusTargets.some((entry) => entry.field === 'pipeline'), true);
});

test('project tasks require phase for run validation', async () => {
  const task: Task = {
    ...createTask(),
    frontmatter: {
      ...createTask().frontmatter,
      project: 'roadmap',
      phase: ''
    }
  };

  const queue = new QueueService(
    '/workspace',
    {
      readTask: async () => task,
      updateTask: async () => task
    },
    {
      getSettings: async () => createSettings(1),
      getEffectiveMapping: async () => ({
        role: 'planner',
        provider: 'codex',
        model: 'gpt-5.3-codex',
        profile: 'default'
      }),
      validateProviderModel: () => ({ valid: true }),
      validateProfile: () => ({ valid: true })
    },
    {
      pathExists: async () => true
    }
  );

  const result = await queue.enqueue('.kanban2code/projects/roadmap/task-a.md', 'stage');
  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }
  assert.equal(result.reason, 'validation_failed');
  assert.equal(result.validation?.errors.some((entry) => entry.field === 'location'), true);
  assert.equal(result.validation?.focusTargets.some((entry) => entry.field === 'phase'), true);
});
