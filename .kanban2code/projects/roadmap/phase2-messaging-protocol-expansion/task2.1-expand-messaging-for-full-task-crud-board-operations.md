---
stage: completed
tags: [feature, p1]
agent: auditor
contexts: [skill-vscode, skill-typescript-config]
---

# Expand messaging.ts for full task CRUD + board operations

## Goal

Expand the typed message contract in messaging.ts to support all task CRUD operations, board interactions, and settings operations while maintaining backward compatibility.

## Definition of Done

- [x] Add message types: `CreateTask`, `UpdateTask`, `DeleteTask`, `MoveTask`, `ReorderTask`
- [x] Add message types: `OpenTaskEditor`, `CloseTaskEditor`, `SaveTask`
- [x] Add message types: `TaskSnapshot` (expanded with full metadata), `TaskUpdated`, `TaskDeleted`
- [x] Add message types: `OpenSettings`, `SaveSettings`, `SettingsLoaded`
- [x] All types have Zod schemas or manual validation
- [x] Backward compatible with existing 3 message types

## Files

- `src/webview/messaging.ts` - modify - add ~20 new envelope types
- `src/types/task.ts` - modify - ensure payload types align

## Tests

- [x] All new message types serialize/deserialize correctly
- [x] Existing messages still work
- [x] Invalid payloads rejected

## Audit Result

- Rating: 9/10
- Verdict: Pass
- Notes:
  - `src/webview/messaging.ts` contains all requested task CRUD, editor, event, and settings message types and unions.
  - Manual validators exist for all new envelope types in both `isWebviewToHostMessage` and `isHostToWebviewMessage`.
  - Backward-compatible handling for existing message types (`RequestTaskSnapshot`, `ShowKanbanBoard`, `SendChatMessage`, `TaskSnapshot`, `TaskSelectionReset`, `OrchestratorResponse`) remains in place.
  - Messaging tests pass with 32 assertions in `src/webview/__tests__/messaging.test.ts` and successful execution in `dist/webview/__tests__/messaging.test.js`.

## Context

The messaging protocol is the contract between webview UI and extension host. All communication must use typed envelopes with `{ type: string, payload: T }` structure.

Existing message types (must remain compatible):
- `InitState`
- `ShowKanbanBoard`
- `TaskSnapshot` (current version, will be expanded)

New message types to add:
- Task CRUD: `CreateTask`, `UpdateTask`, `DeleteTask`, `MoveTask`, `ReorderTask`
- Task Editor: `OpenTaskEditor`, `CloseTaskEditor`, `SaveTask`
- Task Events: `TaskUpdated`, `TaskDeleted`
- Settings: `OpenSettings`, `SaveSettings`, `SettingsLoaded`

All new types should have Zod schemas for runtime validation. The `TaskSnapshot` type should be expanded to include full metadata fields (title, stage, priority, role, project, tags, taskId) to support board rendering without additional file reads.

Payload types should align with the interfaces defined in `src/types/task.ts` to ensure type safety across the message boundary.

## Refined Prompt

Objective: Expand messaging.ts with ~20 new typed message envelopes for task CRUD, board operations, and settings while maintaining backward compatibility.

Implementation approach:
1. Add Task CRUD message types (CreateTask, UpdateTask, DeleteTask, MoveTask, ReorderTask) to WebviewToHostMessage union
2. Add Task Editor message types (OpenTaskEditor, CloseTaskEditor, SaveTask) to WebviewToHostMessage union  
3. Add Task Event message types (TaskUpdated, TaskDeleted) to HostToWebviewMessage union
4. Add Settings message types (OpenSettings, SaveSettings, SettingsLoaded) bidirectionally
5. Extend TaskSnapshot payload validation to include full metadata fields (TaskSnapshotItem already has: id, taskId, title, stage, priority, role, project, tags, createdAt)
6. Add Zod schemas or manual validation functions for all new message types
7. Update isWebviewToHostMessage and isHostToWebviewMessage validators
8. Export all new message interfaces and type guards

Key decisions:
- Keep existing 3 message types unchanged: InitState (RequestTaskSnapshot), ShowKanbanBoard, SendChatMessage, TaskSnapshot, TaskSelectionReset, OrchestratorResponse
- Use existing TaskCreateInput and TaskUpdateInput from src/types/task.ts for CreateTask and UpdateTask payloads
- MoveTask payload: { taskId: string, targetStage: TaskStage, order?: number }
- ReorderTask payload: { taskId: string, newOrder: number }
- DeleteTask payload: { taskId: string }
- TaskUpdated/TaskDeleted payloads: { taskId: string }
- Settings types use Record<string, unknown> for flexible settings storage

Edge cases:
- Invalid payloads must be rejected by validators returning false
- Unknown message types must not crash validators
- TaskSnapshot validation must handle partial metadata (optional fields)

## Context

### File Tree (scoped)

```
src/
├── types/
│   └── task.ts                    # ← read-only reference (TaskCreateInput, TaskUpdateInput)
└── webview/
    ├── messaging.ts               # ← modify (add ~20 message types + validators)
    ├── SidebarProvider.ts         # ← read-only reference (uses isWebviewToHostMessage)
    └── ui/
        └── index.tsx              # ← read-only reference (uses isHostToWebviewMessage)
```

### Architecture Excerpts

From skill-vscode.md:
- "All host/webview communication uses typed envelopes; no ad-hoc payloads"
- "Message handlers must validate envelope/type before acting"
- "Extension Host owns VS Code APIs + filesystem writes"
- "Webview UI owns rendering only"

### Skill Excerpts

**skill-vscode.md** (relevant sections):
- Architecture Principles: Keep strict separation between Extension Host, Webview Host, and Webview UI
- Mandatory Project Structure: `src/webview/messaging.ts` is message contract source
- Anti-Patterns: Untyped/unvalidated message payloads are forbidden

**skill-typescript-config.md**:
- No specific guidance needed for this messaging protocol task

### Code Excerpts

**src/webview/messaging.ts:1-28** — Current message types to preserve:
```typescript
export interface RequestTaskSnapshotMessage { type: 'RequestTaskSnapshot'; }
export interface ShowKanbanBoardMessage { type: 'ShowKanbanBoard'; }
export interface SendChatMessage {
  type: 'SendChatMessage';
  payload: { message: string; provider: string; selectedTaskId?: string; };
}
export type WebviewToHostMessage = RequestTaskSnapshotMessage | ShowKanbanBoardMessage | SendChatMessage;

export interface TaskSnapshotMessage {
  type: 'TaskSnapshot';
  payload: { tasks: TaskSnapshotItem[]; };
}
export type HostToWebviewMessage = TaskSnapshotMessage | TaskSelectionResetMessage | OrchestratorResponseMessage;
```

**src/types/task.ts:38-71** — Input types for message payloads:
```typescript
export interface TaskCreateInput {
  title?: string; body?: string; stage?: TaskStage; role?: string;
  agent?: string; provider?: string; model?: string; profile?: string;
  priority?: Priority; tags?: string[]; contexts?: string[];
  skills?: string[]; project?: string; phase?: string; projectSlug?: string;
}
export interface TaskUpdateInput {
  title?: string; body?: string; stage?: TaskStage; role?: string;
  agent?: string; provider?: string; model?: string; profile?: string;
  priority?: Priority; tags?: string[]; contexts?: string[];
  skills?: string[]; project?: string; phase?: string;
}
```

**src/webview/messaging.ts:52-78** — Current validator pattern to extend:
```typescript
export const isWebviewToHostMessage = (value: unknown): value is WebviewToHostMessage => {
  if (!isObject(value) || typeof value.type !== 'string') return false;
  // Existing type checks...
};
```

### Dependency Graph

Files importing from messaging.ts:
- `src/webview/SidebarProvider.ts` — imports isWebviewToHostMessage, message types
- `src/webview/ui/index.tsx` — imports isHostToWebviewMessage, TaskSnapshotItem

No external consumers outside webview module.

### Patterns to Follow

- Use discriminated unions with `type` string literal for message variants
- Manual validation with `isObject()` helper and typeof checks (current pattern)
- Optional fields use `in` operator check + undefined check + type check
- Keep validators pure functions, no side effects
- Export individual message interfaces and the union types

### Test Patterns

Tests should be in `src/webview/__tests__/messaging.test.ts` (create if not exists):
- Test each validator with valid payloads
- Test each validator with invalid payloads (missing fields, wrong types)
- Test union type discrimination works correctly
- Test backward compatibility: existing message types still validate

### Gotchas

- TaskSnapshot already validates all TaskSnapshotItem fields (lines 85-103) — do not break this
- SendChatMessage has optional selectedTaskId with special undefined check pattern (lines 69-76)
- SidebarProvider.ts line 65 uses isWebviewToHostMessage for filtering
- UI index.tsx line 636 uses isHostToWebviewMessage for filtering

### Scope Boundaries

This task (2.1) does NOT include:
- Runner/queue message types (RunStage, CancelRun, etc.) — handled in task 2.2
- Creating src/types/runner.ts — handled in task 2.2
- Actual implementation of task CRUD logic in SidebarProvider
- Settings UI components or storage implementation
- Board view webview implementation

Focus only on the message contract (types + validators) in messaging.ts.
