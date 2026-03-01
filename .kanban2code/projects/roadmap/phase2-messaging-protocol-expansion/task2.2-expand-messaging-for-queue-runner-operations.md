---
stage: completed
agent: auditor
tags: [feature, p1]
contexts: [skill-vscode]
---

# Expand messaging.ts for queue/runner operations

## Goal

Add message types for queue and runner operations to support the execution engine and its state broadcasting to all active webviews.

## Definition of Done

- [x] Add message types: `RunStage`, `RunAllStages`, `QueueStage`, `QueueAllStages`
- [x] Add message types: `CancelRun`, `RetryRun`
- [x] Add message types: `RunnerStateChanged` (queued/running/success/failed/cancelled)
- [x] Add message types: `QueueSnapshot` (current queue state)

## Files

- `src/webview/messaging.ts` - modify - add runner/queue envelope types
- `src/types/runner.ts` - create - `RunState`, `QueueItem`, `RunResult` types

## Tests

- [x] Runner message types round-trip correctly
- [x] State enum covers all transitions

## Audit Result

- Rating: 8/10
- Verdict: Pass
- Notes:
  - `src/types/runner.ts` defines `RunState`, `QueueItem`, and `RunResult` with the required fields.
  - `src/webview/messaging.ts` includes `RunStage`, `RunAllStages`, `QueueStage`, `QueueAllStages`, `CancelRun`, `RetryRun`, `RunnerStateChanged`, and `QueueSnapshot` in the correct unions.
  - Validators for new webview/host message types are implemented and reject invalid `RunState`, queue scope, and malformed payloads.
  - Messaging tests pass in `src/webview/__tests__/messaging.test.ts`; current suite contains 45 assertions (not a literal 32-test count) and passes when executed via compiled `dist/webview/__tests__/messaging.test.js`.

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

## Refined Prompt

Objective: Add runner/queue message types to messaging.ts and create runner.ts types file to support task execution state broadcasting.

Implementation approach:
1. Create `src/types/runner.ts` with `RunState` enum, `QueueItem`, and `RunResult` interfaces
2. Add runner command message types (`RunStage`, `RunAllStages`, `QueueStage`, `QueueAllStages`) to `WebviewToHostMessage` union in messaging.ts
3. Add control command message types (`CancelRun`, `RetryRun`) to `WebviewToHostMessage` union
4. Add state broadcast message types (`RunnerStateChanged`, `QueueSnapshot`) to `HostToWebviewMessage` union
5. Add manual validators for all new message types in `isWebviewToHostMessage` and `isHostToWebviewMessage`
6. Export all new message interfaces from messaging.ts

Key decisions:
- `RunState` as string union type: `'queued' | 'running' | 'success' | 'failed' | 'cancelled'` (not enum) to match existing patterns in task.ts
- Runner commands (RunStage, etc.) go in `WebviewToHostMessage` (webview → extension host)
- State broadcasts (RunnerStateChanged, QueueSnapshot) go in `HostToWebviewMessage` (host → webview)
- Use same validation patterns as existing task messages (isObject checks, typeof, optional field checks)
- `scope: 'stage' | 'all'` distinguishes single-stage vs full-task execution

Edge cases:
- `QueueSnapshot` with empty items array should still validate
- `activeTaskId` in `QueueSnapshot` can be null when queue is empty
- `error` field in `RunResult` is optional (only present on failed state)
- Unknown message types must not crash validators (return false)
- Invalid `RunState` values must be rejected by validators

## Context

### File Tree (scoped)

```
src/
├── types/
│   ├── task.ts                    # ← read-only reference (patterns to follow)
│   └── runner.ts                  # ← create (RunState, QueueItem, RunResult)
└── webview/
    ├── messaging.ts               # ← modify (add runner/queue message types)
    ├── SidebarProvider.ts         # ← read-only reference (uses message types)
    ├── __tests__/
    │   └── messaging.test.ts      # ← modify (add runner message tests)
    └── ui/
        └── index.tsx              # ← read-only reference (receives messages)
```

### Architecture Excerpts

From skill-vscode.md:
- "All host/webview communication uses typed envelopes; no ad-hoc payloads"
- "Message handlers must validate envelope/type before acting"
- "`src/webview/messaging.ts` is message contract source"

From ai-guide.md:
- Messages use `{ type: string, payload: T }` structure
- Union types discriminate on `type` field

### Skill Excerpts

**skill-vscode.md** (relevant sections):
- Architecture Principles: Keep strict separation between Extension Host, Webview Host, and Webview UI
- Mandatory Project Structure: `src/webview/messaging.ts` is message contract source
- Anti-Patterns: Untyped/unvalidated message payloads are forbidden
- Testing Standards: Unit tests for message protocol required

No specific skill guidance needed beyond general conventions.

### Code Excerpts

**src/webview/messaging.ts:97-111** — Union type pattern to extend:
```typescript
export type WebviewToHostMessage =
  | RequestTaskSnapshotMessage
  | ShowKanbanBoardMessage
  | SendChatMessage
  | CreateTaskMessage
  // ... add runner commands here

export type HostToWebviewMessage =
  | TaskSnapshotMessage
  | TaskUpdatedMessage
  // ... add runner state broadcasts here
```

**src/webview/messaging.ts:271-396** — Validator pattern to follow:
```typescript
export const isWebviewToHostMessage = (value: unknown): value is WebviewToHostMessage => {
  if (!isObject(value) || typeof value.type !== 'string') return false;
  // Check type strings and validate payloads
  if (value.type === 'RunStage') {
    // validate payload shape
  }
  // ... more checks
  return false; // unknown type
};
```

**src/types/task.ts:1-3** — Type pattern to follow:
```typescript
export type TaskStage = 'inbox' | 'capture' | 'plan' | 'code' | 'audit' | 'completed' | 'unknown';
export type Priority = 'low' | 'medium' | 'high';
```

**src/types/settings.ts:34-36** — Notification trigger states (already include runner states):
```typescript
export type NotificationTrigger = 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
```

**src/webview/__tests__/messaging.test.ts:29-64** — Test pattern to follow:
```typescript
test('isWebviewToHostMessage accepts task CRUD + board operations', () => {
  assert.equal(isWebviewToHostMessage({ type: 'CreateTask', payload: {...} }), true);
  // Add runner message tests following same pattern
});
```

### Dependency Graph

Files importing from messaging.ts:
- `src/webview/SidebarProvider.ts` — imports message types, type guards
- `src/webview/ui/index.tsx` — imports message types, type guards
- `src/webview/__tests__/messaging.test.ts` — imports type guards for testing

New file `src/types/runner.ts` will be imported by:
- `src/webview/messaging.ts` (for type definitions)
- Future runner engine implementation (out of scope for this task)

### Patterns to Follow

- Use discriminated unions with `type` string literal (existing pattern in messaging.ts)
- Manual validation with `isObject()` helper and typeof checks
- String union types for states (like `TaskStage`, `Priority`) not TypeScript enums
- Optional fields use `in` operator check + undefined check + type check
- Keep validators pure functions, no side effects
- Export individual message interfaces and the union types
- Reject unknown message types explicitly (return false)

### Test Patterns

Tests in `src/webview/__tests__/messaging.test.ts`:
- Test each new validator with valid payloads
- Test each validator with invalid payloads (wrong types, missing fields)
- Test state enum validation (invalid RunState values rejected)
- Test union type discrimination works correctly
- Test backward compatibility: existing message types still validate

Add new test sections:
- `test('isWebviewToHostMessage accepts runner commands', ...)`
- `test('isHostToWebviewMessage accepts runner state broadcasts', ...)`
- `test('validators reject invalid runner payloads', ...)`

### Gotchas

- `RunState` must match `NotificationTrigger` in settings.ts for consistency
- `QueueSnapshot.activeTaskId` can be null — use explicit null check, not just undefined
- `RunResult.error` is optional — check with `'error' in value && value.error !== undefined`
- Don't forget to add new message types to both the interface AND the union type
- Validator functions must return false for unknown types (not throw)
- `scope: 'stage' | 'all'` — validate both literal values explicitly

### Scope Boundaries

This task (2.2) does NOT include:
- Task CRUD message types — handled in completed task 2.1
- Creating the actual runner engine implementation
- SidebarProvider message handler implementation for runner commands
- UI components for runner controls or queue visualization
- Settings for runner configuration
- Actual task execution logic

Focus only on:
1. Type definitions in `src/types/runner.ts`
2. Message envelope types in `src/webview/messaging.ts`
3. Validators for new message types
4. Tests for new message types

<!-- STAGE_TRANSITION: code -->
