---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode]
---

# Card actions — edit, delete, context menu

## Goal

Add card-level actions for editing, deleting, and accessing a context menu with additional operations.

## Definition of Done

- [ ] Edit button (hover-visible) posts `OpenTaskEditor` message
- [ ] Delete button shows confirmation, then deletes task file
- [ ] Context menu matches existing spec (Open/Run/Run all/Move/Edit/Copy/Delete)
- [ ] Delete respects "confirm destructive actions" setting

## Files

- `src/webview/ui/board.tsx` - modify - card action handlers
- `src/webview/KanbanPanel.ts` - modify - handle `DeleteTask`, `OpenTaskEditor` messages

## Tests

- [ ] Edit opens task editor panel
- [ ] Delete removes file after confirmation
- [ ] Context menu shows correct options per card state

## Context

Card actions should be visible on hover and include:
- Edit button: opens TaskEditorPanel for the task
- Delete button: shows confirmation dialog, then deletes task file
- Context menu: right-click or three-dot menu with options

Context menu options (per spec):
- Open: opens task in TaskEditorPanel
- Run: runs current stage (if applicable)
- Run all: runs all stages (if applicable)
- Move: submenu to move to different stage
- Edit: opens task in TaskEditorPanel
- Copy: copies task to clipboard
- Delete: deletes task with confirmation

Delete confirmation:
- If "confirm destructive actions" setting is enabled: show confirmation dialog
- If disabled: delete immediately
- Confirmation dialog should show task title and ask for confirmation

Edit button should be visible on card hover and positioned in the card footer or header area.

Delete button should be visible on card hover and positioned near the edit button.

Context menu should be accessible via:
- Right-click on card
- Three-dot menu button on card hover

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/kanbanboard-codex.html`
