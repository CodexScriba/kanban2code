---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode]
---

# QueueService — FIFO queue with state management

## Goal

Create a FIFO queue service that manages task execution state, prevents duplicate concurrent runs, and emits state change events for UI updates.

## Definition of Done

- [ ] `enqueue(taskId, scope)` adds to queue (scope = 'stage' | 'all')
- [ ] `dequeue()` returns next item in FIFO order
- [ ] Prevents duplicate concurrent runs for same task
- [ ] State transitions: queued → running → success/failed/cancelled
- [ ] `cancel(taskId)` removes from queue or signals running process
- [ ] `retry(taskId)` re-enqueues failed task
- [ ] Emits state change events for UI updates

## Files

- `src/services/queue-service.ts` - create - queue logic
- `src/types/runner.ts` - modify - queue item types

## Tests

- [ ] FIFO order maintained
- [ ] Duplicate enqueue rejected
- [ ] Cancel removes queued item
- [ ] Cancel signals running process
- [ ] Retry re-enqueues with correct state

## Context

QueueService manages the execution queue for tasks, ensuring FIFO ordering and preventing duplicate concurrent runs.

Queue operations:
- `enqueue(taskId, scope)`: Add task to queue with scope ('stage' or 'all')
- `dequeue()`: Get next task from queue (FIFO)
- `cancel(taskId)`: Remove from queue or signal running process to stop
- `retry(taskId)`: Re-enqueue a failed task

State transitions:
- `queued`: Task is waiting in queue
- `running`: Task is currently executing
- `success`: Task completed successfully
- `failed`: Task execution failed
- `cancelled`: Task was cancelled by user

Duplicate prevention:
- Check if task is already in queue or running
- Reject duplicate enqueue attempts
- Allow retry after failed state

Event emission:
- Emit events on state changes
- Events include: taskId, oldState, newState, timestamp
- UI subscribes to events for real-time updates

Queue item structure:
- taskId: string
- scope: 'stage' | 'all'
- state: RunState
- enqueuedAt: number
- startedAt?: number
- completedAt?: number

The queue should respect the `max parallel runs` setting from SettingsService (default 1).
