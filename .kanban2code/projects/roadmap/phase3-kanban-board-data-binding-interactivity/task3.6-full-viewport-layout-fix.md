---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-frontend-design]
---

# Full-viewport layout fix

## Goal

Fix the board layout to fill the entire available viewport width and height, working correctly on large monitors with proper column flex and per-column scrolling.

## Definition of Done

- [ ] Board fills entire available viewport width and height
- [ ] Works on large monitors (>2560px wide)
- [ ] Columns flex to fill horizontal space evenly
- [ ] Vertical scrolling per-column when cards overflow

## Files

- `src/webview/ui/board.css` - modify - fix viewport layout
- `src/webview/KanbanPanel.ts` - modify - ensure no size constraints on panel

## Tests

- [ ] Visual verification at various viewport sizes
- [ ] No horizontal scrollbar on wide monitors

## Context

The board should use a full-viewport layout that:
- Fills 100% of the available width and height
- Has no horizontal scrollbar on wide monitors
- Columns flex evenly to fill horizontal space
- Each column has independent vertical scrolling when cards overflow

CSS approach:
- Container: `display: flex; flex-direction: column; height: 100vh;`
- Header: fixed height, no overflow
- Columns container: `display: flex; flex: 1; overflow: hidden;`
- Each column: `flex: 1; overflow-y: auto; min-width: 0;`

The `min-width: 0` on columns is critical to prevent flex items from overflowing their containers.

KanbanPanel should ensure no size constraints are applied to the webview panel, allowing it to fill the entire editor area.

The layout should work correctly at various viewport sizes:
- Small laptops (1366x768)
- Standard desktop (1920x1080)
- Large monitors (2560x1440 and wider)

No horizontal scrollbar should appear on wide monitors - the columns should flex to fill the available space evenly.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/kanbanboard-codex.html`
