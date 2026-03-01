---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode, skill-frontend-design]
---

# Wire board to TaskScanner — live card rendering

## Goal

Replace the hardcoded board cards with dynamic rendering from the TaskScanner, enabling real-time updates when task files change.

## Definition of Done

- [ ] Board requests `TaskSnapshot` on load and renders real cards from filesystem
- [ ] Cards show: title, description (truncated), priority indicator, role badge, project badge
- [ ] Column counts update dynamically
- [ ] File watcher triggers board refresh (no polling)
- [ ] Empty columns show placeholder text

## Files

- `src/webview/KanbanPanel.ts` - modify - wire TaskScanner, handle messages
- `src/webview/ui/board.tsx` - modify - replace hardcoded cards with dynamic rendering
- `src/webview/ui/board.css` - modify - priority color indicators per spec

## Tests

- [ ] Board renders cards from filesystem
- [ ] Cards appear in correct columns by stage
- [ ] Priority colors match spec (high=red, medium=amber, low=green)
- [ ] Adding a task file triggers board update

## Context

The current board.tsx has ~200 lines of hardcoded placeholder cards. This task replaces all of that with dynamic rendering based on TaskScanner data.

Card display requirements:
- Title: full task title
- Description: truncated to ~2 lines with ellipsis
- Priority indicator: colored dot/badge (high=#fb7185 red, medium=#fbbf24 amber, low=#34d399 green)
- Role badge: shows the role (planner, coder, auditor)
- Project badge: shows project name if task is in a project folder

Column counts should update dynamically as cards are added/removed/moved.

The board should subscribe to TaskScanner's file watcher events and refresh automatically when files change, eliminating the need for polling.

Empty columns should show a placeholder message like "No tasks in this stage" to guide users.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/kanbanboard-codex.html`
