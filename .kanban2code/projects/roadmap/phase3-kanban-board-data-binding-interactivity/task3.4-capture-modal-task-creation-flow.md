---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-frontend-design]
---

# Capture modal — task creation flow

## Goal

Create a capture modal for creating new tasks, accessible from the board header and column quick-add buttons.

## Definition of Done

- [ ] `+ Capture` in header opens modal overlay
- [ ] Column `+` opens same modal with prefilled stage
- [ ] Modal fields: title, description, priority, role, project, tags
- [ ] Defaults prefilled from SettingsService
- [ ] On save: creates task file, closes modal, board refreshes
- [ ] On cancel: closes without side effects

## Files

- `src/webview/ui/board.tsx` - modify - capture modal component
- `src/webview/ui/board.css` - modify - modal styles (glassmorphic, per existing design)
- `src/webview/KanbanPanel.ts` - modify - handle `CreateTask` message

## Tests

- [ ] Modal opens/closes correctly
- [ ] Prefilled stage from column quick-add
- [ ] Task file created on save
- [ ] Validation blocks empty title

## Context

The capture modal should use the glassmorphic design pattern consistent with the existing UI (see docs/design/sidebar-codex-blue.html for reference).

Modal fields:
- Title: required text input
- Description: optional textarea
- Priority: dropdown (Low, Medium, High)
- Role: dropdown (planner, coder, auditor)
- Project: dropdown (All projects + "Inbox")
- Tags: chip input with add/remove

Defaults should be prefilled from SettingsService task defaults:
- Default priority
- Default role
- Default project (if set)

Modal triggers:
- Header `+ Capture` button: opens modal with no prefilled stage
- Column `+` button: opens modal with stage prefilled to that column

On save:
- Validate required fields (title must not be empty)
- Create task file via TaskService
- Post `CreateTask` message to host
- Close modal
- Board refreshes automatically via file watcher

On cancel:
- Close modal without any side effects
- No task file created
- No state changes

Modal should be dismissible via:
- Cancel button
- Escape key
- Click outside modal (overlay)

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/kanbanboard-codex.html`
