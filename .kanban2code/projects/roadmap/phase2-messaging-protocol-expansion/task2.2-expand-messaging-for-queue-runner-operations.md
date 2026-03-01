---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode]
---

# Expand messaging.ts for queue/runner operations

## Goal

Add message types for queue and runner operations to support the execution engine and its state broadcasting to all active webviews.

## Definition of Done

- [ ] Add message types: `RunStage`, `RunAllStages`, `QueueStage`, `QueueAllStages`
- [ ] Add message types: `CancelRun`, `RetryRun`
- [ ] Add message types: `RunnerStateChanged` (queued/running/success/failed/cancelled)
- [ ] Add message types: `QueueSnapshot` (current queue state)

## Files

- `src/webview/messaging.ts` - modify - add runner/queue envelope types
- `src/types/runner.ts` - create - `RunState`, `QueueItem`, `RunResult` types

## Tests

- [ ] Runner message types round-trip correctly
- [ ] State enum covers all transitions

## Context

The runner engine needs to communicate its state to all active webviews (sidebar, board, task editor) so UI can show real-time status updates.

New message types:
- Run commands: `RunStage`, `RunAllStages`, `QueueStage`, `QueueAllStages`
- Control commands: `CancelRun`, `RetryRun`
- State broadcasts: `RunnerStateChanged`, `QueueSnapshot`

`RunnerStateChanged` should include:
- taskId: string
- state: RunState enum (queued, running, success, failed, cancelled)
- timestamp: number

`QueueSnapshot` should include:
- items: QueueItem[]
- activeTaskId: string | null
- totalQueued: number

`RunState` enum values:
- `queued`: Task is in queue waiting to run
- `running`: Task is currently executing
- `success`: Task completed successfully
- `failed`: Task execution failed
- `cancelled`: Task was cancelled by user

`QueueItem` should include:
- taskId: string
- scope: 'stage' | 'all'
- state: RunState
- enqueuedAt: number

`RunResult` should include:
- taskId: string
- state: RunState
- output: string
- error?: string
- completedAt: number

These types will be used by both the runner engine and the webview UI to maintain consistent state representation.
