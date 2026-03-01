---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode, skill-typescript-config]
---

# Expand messaging.ts for full task CRUD + board operations

## Goal

Expand the typed message contract in messaging.ts to support all task CRUD operations, board interactions, and settings operations while maintaining backward compatibility.

## Definition of Done

- [ ] Add message types: `CreateTask`, `UpdateTask`, `DeleteTask`, `MoveTask`, `ReorderTask`
- [ ] Add message types: `OpenTaskEditor`, `CloseTaskEditor`, `SaveTask`
- [ ] Add message types: `TaskSnapshot` (expanded with full metadata), `TaskUpdated`, `TaskDeleted`
- [ ] Add message types: `OpenSettings`, `SaveSettings`, `SettingsLoaded`
- [ ] All types have Zod schemas or manual validation
- [ ] Backward compatible with existing 3 message types

## Files

- `src/webview/messaging.ts` - modify - add ~20 new envelope types
- `src/types/task.ts` - modify - ensure payload types align

## Tests

- [ ] All new message types serialize/deserialize correctly
- [ ] Existing messages still work
- [ ] Invalid payloads rejected

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
