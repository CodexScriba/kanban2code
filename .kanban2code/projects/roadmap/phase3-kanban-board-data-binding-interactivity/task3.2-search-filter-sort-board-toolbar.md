---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-frontend-design]
---

# Search, filter, sort — board toolbar

## Goal

Add a toolbar to the board with search, priority filter, sort options, and project filter to help users find and organize tasks.

## Definition of Done

- [ ] Search filters cards (case-insensitive partial match on title/tags/taskId) with 200ms debounce
- [ ] Priority filter: All/Low/Medium/High (single-select, AND logic)
- [ ] Sort: Newest first (default) / Oldest first, stable tiebreaker on taskId
- [ ] Project filter: All projects + discovered project slugs (single-select, AND)
- [ ] `Showing:` status line updates dynamically
- [ ] Filter state persists for board session

## Files

- `src/webview/ui/board.tsx` - modify - wire filter/sort/search to task data
- `src/webview/ui/board.css` - modify - active filter styling

## Tests

- [ ] Search matches title substring
- [ ] Priority filter shows only matching cards
- [ ] Sort reverses card order
- [ ] Project filter shows only matching project tasks
- [ ] Status line reflects current filters

## Context

The board toolbar should be positioned above the columns and include:
- Search input: text field with 200ms debounce
- Priority dropdown: All, Low, Medium, High
- Sort dropdown: Newest first, Oldest first
- Project dropdown: All + dynamically discovered projects
- Status line: "Showing X of Y tasks"

Filter logic:
- All filters use AND logic (task must match all active filters)
- Search matches: title (partial, case-insensitive), tags (partial, case-insensitive), taskId (partial, case-insensitive)
- Priority filter: exact match on priority field
- Project filter: exact match on project field (or no project for inbox tasks)

Sort logic:
- Newest first: descending by createdAt (derived from filename timestamp)
- Oldest first: ascending by createdAt
- Stable tiebreaker: use taskId to ensure consistent ordering when timestamps are equal

Filter state should persist for the board session (not across VS Code restarts) to maintain user's view during active work.

The status line should update dynamically to show "Showing X of Y tasks" where X is the filtered count and Y is the total count.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/kanbanboard-codex.html`
