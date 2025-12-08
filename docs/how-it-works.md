# How Kanban2Code Works

Kanban2Code turns a `.kanban2code/` folder into a lightweight backlog that VS Code understands. Tasks are markdown files with YAML frontmatter, so you can keep everything in git and script around it.

## Inbox-First Workflow
- New work lands in `inbox/` as simple markdown files.
- Triage directly from the sidebar or board, then move tasks through the stages: `inbox → plan → code → audit → completed → (archive)`.
- Every stage has optional guidance templates in `_templates/stages/` that the UI can surface when creating tasks.

## Stage Semantics
- **inbox**: untriaged, quick capture.
- **plan**: shaping, acceptance criteria, and context gathering.
- **code**: active implementation.
- **audit**: review, testing, polish.
- **completed**: ready to archive; copy-with-context is most useful here.
- **archive**: mirror of the active tree under `_archive/`, used by archive commands.

## Tags-as-Types (Taxonomy)
Tags stay free-text, but a small taxonomy keeps filters and suggestions consistent:

- **Scope**: `mvp`, `post-v1`
- **Type**: `bug`, `feature`, `spike`, `idea`, `roadmap`
- **Domain**: `infra`, `ui`, `context`, `board`, `filesystem`
- **Priority**: `urgent` (optional)

The task modal ships with autocomplete and category pills for these tags, and the filter panel lets you filter by category (e.g., “MVP bugs in UI”). You can still add ad-hoc tags; they’ll live under “Other”.

## Context Model
- Global context files live at the workspace root: `how-it-works.md`, `architecture.md`, `project-details.md`.
- Project and phase context: `_context.md` inside each project or phase folder.
- Agents: `_agents/*.md` capture model-specific guidance.
- Custom context: `_contexts/*.md` can be referenced from task frontmatter via `contexts: [custom-id]`.
- Copy-with-context builds a layered XML payload with system directives, contexts, task body, and stage guidance.

## UI Surfaces
- **Sidebar**: tree of inbox/projects/phases, quick filters, keyboard navigation, and a full task modal.
- **Board**: draggable columns per stage, context menu actions, XML copy shortcuts, and follow-up creation.
- **Commands & Shortcuts**: command palette entries and keybindings for opening the board, focusing the sidebar, creating tasks, copying context, and marking implementation done.

## Error Handling & Logging
- All commands surface user-friendly errors when the workspace is missing or files fail to load.
- A `Kanban2Code` output channel records debug information for filesystem operations and webview actions.

## Testing Expectations
- Vitest covers services (frontmatter parsing, task moves, archive) and webview stores/components.
- Command handlers have unit tests for critical flows (e.g., mark implementation done).
- E2E scaffolding lives in `tests/e2e/` for @vscode/test-electron to exercise real workflows.

