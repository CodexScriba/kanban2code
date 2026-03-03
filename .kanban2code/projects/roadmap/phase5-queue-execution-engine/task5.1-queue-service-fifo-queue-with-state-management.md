---
tags: [feature, p1]
stage: completed
agent: coder
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

## Refined Prompt

Objective: Create a FIFO QueueService with state management and event emission for task execution orchestration.

Implementation approach:
1. Create `src/types/runner.ts` with RunState type and QueueItem interface
2. Create `src/services/queue-service.ts` with QueueService class
3. Implement FIFO queue operations (enqueue, dequeue, peek)
4. Add state management (queued → running → success/failed/cancelled)
5. Implement duplicate detection (reject if task already queued or running)
6. Add cancel functionality (remove from queue or signal running task)
7. Add retry functionality (re-enqueue failed tasks)
8. Implement EventEmitter pattern for state change events
9. Integrate with SettingsService for maxParallelRuns configuration
10. Write comprehensive unit tests

Key decisions:
- Use EventEmitter pattern: Follows Node.js conventions and enables decoupled UI updates
- In-memory queue storage: Phase 5 tasks don't require persistence; state is transient
- Duplicate prevention by taskId: Prevents same task running concurrently, allows different scopes
- Max parallel runs from SettingsService: Keeps configuration centralized

Edge cases:
- Enqueue while already running: Should reject with clear error
- Cancel already completed task: Should return false/no-op
- Retry non-failed task: Should reject (only failed tasks can retry)
- Dequeue empty queue: Should return null/undefined
- State transition from terminal states: Should not allow transitions from success/failed/cancelled

## Context

### File Tree (scoped)

```
src/
├── types/
│   ├── settings.ts         # <- read-only reference (maxParallelRuns)
│   ├── task.ts             # <- read-only reference
│   └── runner.ts           # <- create (RunState, QueueItem, QueueStateEvent)
├── services/
│   ├── settings-service.ts # <- read-only reference (get maxParallelRuns)
│   └── queue-service.ts    # <- create (QueueService class)
└── webview/
    └── messaging.ts        # <- read-only reference (message patterns)
```

### Architecture Excerpts

From `skill-vscode.md`:
- "Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes"
- "All host/webview communication uses typed envelopes; no ad-hoc payloads"
- "On state changes, broadcast refresh/update events to UI"

From `ai-guide.md`:
- Services follow class-based pattern with dependency injection
- Types are defined in `src/types/*.ts` and imported by services
- Unit tests use `*.test.ts` pattern alongside source files

### Skill Excerpts

From `skill-vscode.md`:
- Extension Host owns business logic, Webview UI owns rendering only
- Message handlers must validate envelope/type before acting
- On state changes, broadcast to all active webviews

From `skill-vitest-playwright-testing.md`:
- Unit tests use `*.test.ts` pattern
- Vitest excludes `tests/**`, uses `vitest.setup.ts` for matchers
- Mock external dependencies, test service logic in isolation

### Code Excerpts

`src/types/settings.ts:83-89` - maxParallelRuns setting:
```typescript
export interface Settings {
  // ...
  queueAndExecution: {
    defaultMode: 'stage' | 'all stages';
    schedulingPolicy: 'FIFO';
    serializedPipeline: boolean;
    maxParallelRuns: number;  // <- QueueService uses this
    autoOpenTerminal: boolean;
  };
}
```

`src/services/settings-service.ts:94-99` - default settings:
```typescript
queueAndExecution: {
  defaultMode: 'stage',
  schedulingPolicy: 'FIFO',
  serializedPipeline: true,
  maxParallelRuns: 1,  // <- Default is 1 (sequential)
  autoOpenTerminal: true
}
```

`src/services/task-service.ts:61-67` - service pattern to follow:
```typescript
export class TaskService {
  private runtimeDependencies?: RuntimeDependencies;

  constructor(
    private readonly workspaceRoot: string,
    private readonly options: TaskServiceOptions = {}
  ) {}
  // ... methods
}
```

`src/types/task.ts:1` - TaskStage type for reference:
```typescript
export type TaskStage = 'inbox' | 'capture' | 'plan' | 'code' | 'audit' | 'completed' | 'unknown';
```

### Dependency Graph

Files importing from modified/created files:
- `src/services/queue-service.ts` (new) will be imported by:
  - `src/services/runner-engine.ts` (task 5.2 - not yet created)
  - `src/extension.ts` (for service orchestration)
  - Potentially command handlers for Run/Queue/Cancel actions

Files that `queue-service.ts` depends on:
- `src/types/runner.ts` (QueueItem, RunState)
- `src/types/settings.ts` (Settings type)
- `src/services/settings-service.ts` (SettingsService for maxParallelRuns)

### Patterns to Follow

1. **Service class pattern**: Constructor with workspaceRoot and optional dependencies injection (see TaskService, SettingsService)
2. **Type definitions**: Export types from `src/types/*.ts`, use explicit interfaces
3. **Event emission**: Use Node.js EventEmitter pattern for state changes
4. **Testing pattern**: Co-located `*.test.ts` files with descriptive test names
5. **Error handling**: Throw descriptive errors for invalid operations

### Test Patterns

Example from `src/services/settings-service.test.ts`:
- Use `describe` blocks for method groups
- Use `it('should...')` for individual test cases
- Mock filesystem dependencies for isolated testing
- Test error cases and edge cases explicitly

### Gotchas

- EventEmitter memory leaks: Ensure consumers unsubscribe when webviews dispose
- State transition validation: Don't allow invalid transitions (e.g., success → running)
- Max parallel runs: Check running count before starting new task, not at enqueue time
- Duplicate detection: Must check both queue AND running set
- Scope handling: Same taskId with different scopes is still a duplicate

### Scope Boundaries

This task (5.1) is the foundation for Phase 5. It should NOT:
- Spawn actual CLI processes (task 5.2 - RunnerEngine)
- Validate task configuration before run (task 5.3 - Validation)
- Update UI components directly (task 5.4 - UI wiring)
- Read provider configs or build CLI commands (task 5.2)
- Integrate with VS Code terminal API (task 5.2)

QueueService provides the queue management primitives. Other tasks will consume this service.
