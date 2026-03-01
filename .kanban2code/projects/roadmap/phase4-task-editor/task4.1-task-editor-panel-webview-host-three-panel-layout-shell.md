---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode, skill-frontend-design]
---

# TaskEditorPanel — webview host + three-panel layout shell

## Goal

Create a new singleton webview panel for the task editor with a three-panel layout (metadata, editor, execution rail) and proper exit behavior handling.

## Definition of Done

- [ ] New `TaskEditorPanel` singleton webview panel
- [ ] Receives task file path via message, loads full task data
- [ ] Renders three-panel layout: left (metadata), center (editor), right (execution rail)
- [ ] Top bar with breadcrumb, live chips (stage/role/provider/dirty), action buttons
- [ ] Exit behavior: clean close or dirty-state modal (Save & Exit / Discard & Exit / Cancel)

## Files

- `src/webview/TaskEditorPanel.ts` - create - webview host for task editor
- `src/webview/ui/taskeditor.tsx` - create - task editor DOM
- `src/webview/ui/taskeditor.css` - create - task editor styles
- `esbuild.mjs` - modify - add `taskeditor` entry point
- `src/extension.ts` - modify - register openTaskEditor command

## Tests

- [ ] Panel opens with task data loaded
- [ ] Three-panel layout renders correctly
- [ ] Top bar shows correct breadcrumb and chips
- [ ] Exit with no changes closes immediately
- [ ] Exit with dirty state shows modal

## Context

TaskEditorPanel follows the singleton pattern used by KanbanPanel, with a static `currentPanel` property to ensure only one instance exists.

Three-panel layout:
- Left panel: task metadata form (Basic Info, Location, Pipeline, Assignment, Context, Skills, Tags)
- Center panel: tabbed editor (Task Body, Frontmatter, Run Notes)
- Right panel: execution rail (Task Preview, Pipeline Steps, Recent Runs)

Top bar components:
- Breadcrumb: project / task title
- Live chips: stage, role, provider, dirty indicator
- Action buttons: Save, Close

Exit behavior:
- Clean close: if no unsaved changes, close immediately
- Dirty state: show modal with options:
  - Save & Exit: save changes and close
  - Discard & Exit: discard changes and close
  - Cancel: keep panel open

The panel should receive the task file path via `OpenTaskEditor` message from the board or sidebar.

Layout should use flexbox to ensure panels fill the available space and scroll independently when content overflows.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/taskeditor-codex.html`
