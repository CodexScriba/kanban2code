---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-frontend-design]
---

# Drag and drop — column reorder + cross-column move

## Goal

Implement HTML5 drag and drop for cards, allowing reordering within columns and moving cards between columns (stage changes).

## Definition of Done

- [ ] Cards draggable within column (reorder)
- [ ] Cards draggable across columns (stage change)
- [ ] No transition restrictions (free movement per spec)
- [ ] On drop: immediately persist new stage + order to filesystem
- [ ] Visual feedback during drag (ghost card, drop zone highlight)
- [ ] Deterministic ordering preserved after drop

## Files

- `src/webview/ui/board.tsx` - modify - add HTML5 drag/drop handlers
- `src/webview/ui/board.css` - modify - drag ghost + drop zone styles
- `src/webview/KanbanPanel.ts` - modify - handle `MoveTask`/`ReorderTask` messages

## Tests

- [ ] Dragging card to different column updates stage in file
- [ ] Reordering within column persists order
- [ ] Multiple rapid drags don't corrupt state

## Context

Drag and drop should use HTML5 Drag and Drop API with the following events:
- `dragstart`: set drag data, add visual feedback
- `dragover`: allow drop, show drop zone highlight
- `dragleave`: remove drop zone highlight
- `drop`: handle the drop, persist changes
- `dragend`: cleanup visual feedback

Drag data should include:
- taskId: string
- sourceStage: string
- sourceIndex: number

Drop handling:
- Cross-column drop: update task stage in frontmatter, post `MoveTask` message
- Same-column drop: update task order, post `ReorderTask` message
- Both operations should persist immediately to filesystem

Visual feedback:
- Ghost card: semi-transparent version of the card being dragged
- Drop zone highlight: highlight the column or position where card will be dropped
- Active drag state: reduce opacity of other cards to focus on drop target

No transition restrictions: users can freely move cards between any stages (inbox, plan, code, audit, completed) per the spec.

Deterministic ordering: after drop, the order should be preserved and consistent with the visual arrangement.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/kanbanboard-codex.html`
