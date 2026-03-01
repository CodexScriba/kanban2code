---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode]
---

# Wire runner to board + sidebar UI

## Goal

Connect runner state to board and sidebar UI, showing run status badges, queue counts, and enabling run actions from context menus.

## Definition of Done

- [ ] Board cards show run status badges (queued/running/success/failed)
- [ ] Queue chip in board header shows `Queue: N`
- [ ] Sidebar shows active run indicator
- [ ] Run/Queue/Cancel/Retry actions work from board context menu
- [ ] Runner state changes broadcast to all active webviews

## Files

- `src/webview/ui/board.tsx` - modify - run badges on cards, queue chip
- `src/webview/ui/board.css` - modify - badge styles (pulsing for running)
- `src/webview/KanbanPanel.ts` - modify - handle runner messages, broadcast state
- `src/webview/SidebarProvider.ts` - modify - handle runner messages

## Tests

- [ ] Card badge updates when run state changes
- [ ] Queue chip shows correct count
- [ ] Cancel from context menu stops running task

## Context

Runner state must be visible across all UI components for real-time feedback.

Board card badges:
- Show run status badge on each card
- Badge states: queued, running, success, failed
- Running badge should pulse (CSS animation)
- Badge positioned in card footer or header

Queue chip:
- Display in board header
- Format: `Queue: N` where N is number of queued tasks
- Updates dynamically as tasks are enqueued/dequeued

Sidebar indicator:
- Show active run indicator when runner is active
- Could be a status icon or text indicator
- Updates when runner state changes

Context menu actions:
- Run: enqueue task for current stage
- Run all: enqueue all stages (pipeline)
- Queue: enqueue without starting immediately
- Cancel: cancel running or queued task
- Retry: re-enqueue failed task

State broadcasting:
- RunnerEngine emits state change events
- KanbanPanel and SidebarProvider subscribe to events
- Broadcast `RunnerStateChanged` message to all webviews
- Webviews update UI based on new state

Message flow:
1. User clicks Run from context menu
2. Webview posts `RunStage` or `RunAllStages` message
3. Host validates and enqueues task via QueueService
4. RunnerEngine starts execution
5. State changes broadcast via `RunnerStateChanged`
6. All webviews update UI (badges, queue chip, indicator)

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary targets for this task: `docs/design/kanbanboard-codex.html` and `docs/design/sidebar-codex-blue.html`
