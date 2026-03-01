import assert from 'node:assert/strict';
import test from 'node:test';
import { isHostToWebviewMessage, isWebviewToHostMessage } from '../messaging';

const validTaskSnapshotItem = {
  id: '.kanban2code/inbox/1772200000000-demo.md',
  taskId: '1772200000000-demo',
  title: 'Demo task',
  description: 'Demo description',
  stage: 'inbox',
  priority: 'medium',
  role: 'coder',
  project: 'roadmap',
  tags: ['feature'],
  createdAt: 1772200000000
} as const;

test('isWebviewToHostMessage accepts existing message types', () => {
  assert.equal(isWebviewToHostMessage({ type: 'RequestTaskSnapshot' }), true);
  assert.equal(isWebviewToHostMessage({ type: 'ShowKanbanBoard' }), true);
  assert.equal(
    isWebviewToHostMessage({
      type: 'SendChatMessage',
      payload: { message: 'hello', provider: 'codex', selectedTaskId: '123' }
    }),
    true
  );
});

test('isWebviewToHostMessage accepts task CRUD + board operations', () => {
  assert.equal(
    isWebviewToHostMessage({
      type: 'CreateTask',
      payload: {
        title: 'New task',
        stage: 'plan',
        priority: 'high',
        tags: ['feature'],
        projectSlug: 'roadmap'
      }
    }),
    true
  );

  assert.equal(
    isWebviewToHostMessage({
      type: 'UpdateTask',
      payload: { taskId: 'task-1', updates: { stage: 'code', role: 'coder' } }
    }),
    true
  );

  assert.equal(isWebviewToHostMessage({ type: 'DeleteTask', payload: { taskId: 'task-1' } }), true);
  assert.equal(
    isWebviewToHostMessage({
      type: 'MoveTask',
      payload: { taskId: 'task-1', targetStage: 'audit', order: 3 }
    }),
    true
  );
  assert.equal(
    isWebviewToHostMessage({ type: 'ReorderTask', payload: { taskId: 'task-1', newOrder: 7 } }),
    true
  );
});

test('isWebviewToHostMessage accepts task editor + settings operations', () => {
  assert.equal(isWebviewToHostMessage({ type: 'OpenTaskEditor' }), true);
  assert.equal(
    isWebviewToHostMessage({ type: 'OpenTaskEditor', payload: { taskId: 'task-1' } }),
    true
  );
  assert.equal(isWebviewToHostMessage({ type: 'CloseTaskEditor' }), true);
  assert.equal(
    isWebviewToHostMessage({
      type: 'SaveTask',
      payload: {
        taskId: 'task-1',
        task: { title: 'Updated title', stage: 'code', contexts: ['skill-vscode'] }
      }
    }),
    true
  );
  assert.equal(isWebviewToHostMessage({ type: 'OpenSettings' }), true);
  assert.equal(
    isWebviewToHostMessage({ type: 'OpenSettings', payload: { projectSlug: 'roadmap' } }),
    true
  );
  assert.equal(
    isWebviewToHostMessage({
      type: 'SaveSettings',
      payload: { settings: { general: { timezone: 'UTC' } }, projectSlug: 'roadmap' }
    }),
    true
  );
});

test('isWebviewToHostMessage accepts runner command operations', () => {
  assert.equal(isWebviewToHostMessage({ type: 'RunStage', payload: { taskId: 'task-1' } }), true);
  assert.equal(isWebviewToHostMessage({ type: 'RunAllStages', payload: { taskId: 'task-1' } }), true);
  assert.equal(isWebviewToHostMessage({ type: 'QueueStage', payload: { taskId: 'task-1' } }), true);
  assert.equal(
    isWebviewToHostMessage({ type: 'QueueAllStages', payload: { taskId: 'task-1' } }),
    true
  );
  assert.equal(isWebviewToHostMessage({ type: 'CancelRun', payload: { taskId: 'task-1' } }), true);
  assert.equal(isWebviewToHostMessage({ type: 'RetryRun', payload: { taskId: 'task-1' } }), true);
});

test('isWebviewToHostMessage rejects invalid payloads', () => {
  assert.equal(
    isWebviewToHostMessage({
      type: 'SendChatMessage',
      payload: { message: 'hello', provider: 'codex', selectedTaskId: 42 }
    }),
    false
  );

  assert.equal(
    isWebviewToHostMessage({
      type: 'CreateTask',
      payload: { stage: 'not-a-stage' }
    }),
    false
  );

  assert.equal(
    isWebviewToHostMessage({
      type: 'UpdateTask',
      payload: { taskId: 'task-1', updates: { projectSlug: 'roadmap' } }
    }),
    false
  );

  assert.equal(
    isWebviewToHostMessage({
      type: 'MoveTask',
      payload: { taskId: 'task-1', targetStage: 'code', order: 'first' }
    }),
    false
  );

  assert.equal(
    isWebviewToHostMessage({
      type: 'SaveTask',
      payload: { task: { priority: 'critical' } }
    }),
    false
  );

  assert.equal(
    isWebviewToHostMessage({
      type: 'SaveSettings',
      payload: { settings: 'not-an-object' }
    }),
    false
  );

  assert.equal(
    isWebviewToHostMessage({
      type: 'RunStage',
      payload: { taskId: 42 }
    }),
    false
  );

  assert.equal(
    isWebviewToHostMessage({
      type: 'CancelRun',
      payload: {}
    }),
    false
  );

  assert.equal(isWebviewToHostMessage({ type: 'UnknownType' }), false);
});

test('isHostToWebviewMessage accepts existing and new event types', () => {
  assert.equal(
    isHostToWebviewMessage({
      type: 'TaskSnapshot',
      payload: { tasks: [validTaskSnapshotItem] }
    }),
    true
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'TaskSelectionReset',
      payload: { reason: 'Task removed' }
    }),
    true
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'OrchestratorResponse',
      payload: { message: 'Ready' }
    }),
    true
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'TaskUpdated',
      payload: { taskId: 'task-1' }
    }),
    true
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'TaskDeleted',
      payload: { taskId: 'task-1' }
    }),
    true
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'SettingsLoaded',
      payload: { settings: { queueAndExecution: { defaultMode: 'stage' } }, projectSlug: 'roadmap' }
    }),
    true
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'RunnerStateChanged',
      payload: { taskId: 'task-1', state: 'running', timestamp: 1772200000001 }
    }),
    true
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'QueueSnapshot',
      payload: {
        items: [
          {
            taskId: 'task-1',
            scope: 'stage',
            state: 'queued',
            enqueuedAt: 1772200000000
          }
        ],
        activeTaskId: null,
        totalQueued: 1
      }
    }),
    true
  );
});

test('isHostToWebviewMessage rejects invalid payloads', () => {
  assert.equal(
    isHostToWebviewMessage({
      type: 'TaskSnapshot',
      payload: {
        tasks: [{ ...validTaskSnapshotItem, stage: 'invalid-stage' }]
      }
    }),
    false
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'TaskSnapshot',
      payload: {
        tasks: [{ ...validTaskSnapshotItem, description: 123 }]
      }
    }),
    false
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'TaskUpdated',
      payload: { taskId: 123 }
    }),
    false
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'SettingsLoaded',
      payload: { settings: null }
    }),
    false
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'RunnerStateChanged',
      payload: { taskId: 'task-1', state: 'done', timestamp: 1772200000001 }
    }),
    false
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'QueueSnapshot',
      payload: {
        items: [
          {
            taskId: 'task-1',
            scope: 'invalid-scope',
            state: 'queued',
            enqueuedAt: 1772200000000
          }
        ],
        activeTaskId: null,
        totalQueued: 1
      }
    }),
    false
  );

  assert.equal(
    isHostToWebviewMessage({
      type: 'QueueSnapshot',
      payload: {
        items: [],
        activeTaskId: 99,
        totalQueued: 0
      }
    }),
    false
  );

  assert.equal(isHostToWebviewMessage({ type: 'UnknownType' }), false);
});
