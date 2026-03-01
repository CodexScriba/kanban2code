---
stage: completed
agent: coder
tags: [feature, p1]
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

## Refined Prompt

Objective: Implement a glassmorphic capture modal for creating new tasks from the kanban board.

Implementation approach:
1. Add modal HTML structure to board.tsx with overlay, form fields, and action buttons
2. Implement modal open/close logic with three dismissal methods (Cancel button, Escape key, overlay click)
3. Wire header `+ Capture` button and column `+` buttons to open modal with appropriate stage prefilling
4. Add form field handlers for title, description, priority, role, project, and tags
5. Implement client-side validation (title required, trim whitespace)
6. Post `CreateTask` message to host with form data on save
7. Handle `CreateTask` in KanbanPanel.ts: validate input, call TaskService.createTask(), refresh board
8. Add glassmorphic modal styles to board.css matching existing design system
9. Prefill defaults from SettingsService (priority, role from stageRuntimeMapping for the selected stage)

Key decisions:
- Single modal instance in DOM, show/hide via CSS class: minimizes DOM manipulation
- Use existing CSS custom properties (--surface, --border-md, --accent): maintains design consistency
- Post message pattern for host communication: follows existing architecture
- Settings defaults fetched at modal open time: ensures fresh defaults without page reload
- Stage prefilled from column's data-column attribute: leverages existing HTML structure

Edge cases:
- Empty title after trimming: show validation error, prevent save
- Rapid save clicks: disable save button while processing
- Settings not yet loaded: use hardcoded sensible defaults (medium priority, no role)
- Very long tag lists: implement tag input with overflow scroll
- Mobile/narrow viewport: ensure modal fits within viewport with max-width

## Context

### File Tree (scoped)

src/
├── webview/
│   ├── KanbanPanel.ts          # ← modify - handle CreateTask message
│   ├── messaging.ts            # ← read-only reference - message types
│   └── ui/
│       ├── board.tsx           # ← modify - add modal component
│       └── board.css           # ← modify - modal styles
├── services/
│   ├── task-service.ts         # ← read-only reference - createTask API
│   └── settings-service.ts     # ← read-only reference - getSettings API
└── types/
    ├── task.ts                 # ← read-only reference - TaskCreateInput type
    └── settings.ts             # ← read-only reference - Settings type

### Architecture Excerpts

From `.kanban2code/architecture.md`:
- VS Code extension with sidebar webview support
- Extension host registers WebviewViewProvider
- Webview uses CSP and theme integration

Messaging pattern from `src/webview/messaging.ts`:
- `CreateTaskMessage` type already exists with payload: `TaskCreateInput`
- `TaskSnapshotMessage` flows from host to webview for board refresh

### Skill Excerpts

No specific skill guidance needed beyond general conventions.

### Code Excerpts

**src/webview/ui/board.tsx:70** - Capture button (line 70 in template string):
```typescript
<button class="capture-header-btn" type="button">+ Capture</button>
```
Why: This button needs click handler to open modal.

**src/webview/ui/board.tsx:86-90** - Column plus buttons:
```typescript
<button class="col-plus" type="button" title="Add task">+</button>
```
Why: These buttons should open modal with stage prefilled from parent column.

**src/webview/messaging.ts:28-31** - CreateTask message type:
```typescript
export interface CreateTaskMessage {
  type: 'CreateTask';
  payload: TaskCreateInput;
}
```
Why: Message structure for posting new task to host.

**src/services/task-service.ts:69-102** - createTask method signature:
```typescript
async createTask(data: TaskCreateInput): Promise<Task>
```
Why: Host-side API for creating task files.

**src/types/task.ts:41-58** - TaskCreateInput type:
```typescript
export interface TaskCreateInput {
  title?: string;
  body?: string;
  stage?: TaskStage;
  priority?: Priority;
  tags?: string[];
  project?: string;
  role?: string;
  // ... other fields
}
```
Why: Shape of data to collect from form fields.

### Dependency Graph

Files importing from modified files:
- `src/extension.ts` imports `KanbanPanel` - uses `createOrShow()`
- `src/webview/ui/board.tsx` imports from `../messaging` - uses message types

Files modified files import from:
- `KanbanPanel.ts` imports `TaskService`, `TaskScanner`, messaging types
- `board.tsx` imports messaging types

### Patterns to Follow

1. **Event delegation**: Current board.tsx uses `app.addEventListener` with target checks for drag/drop
2. **CSS custom properties**: All colors use var(--*) references from :root palette
3. **Glassmorphic panels**: Use `background: var(--surface)`, `backdrop-filter: blur()`, `border: 1px solid var(--border-md)`
4. **Button states**: Hover transitions use `transition: background 0.14s, border-color 0.14s`
5. **Form controls**: Follow existing `.filter-select` and `.search-input` styling patterns

### Test Patterns

Tests for similar webview messaging in `src/webview/__tests__/messaging.test.ts`:
- Message validation tests using `isWebviewToHostMessage`
- Type guard tests for payload shapes

For this task, add tests in:
- `src/webview/__tests__/messaging.test.ts` - verify CreateTask message validation
- Manual testing: modal open/close, form submission, validation errors

### Gotchas

- Escape key handling: board.tsx has no existing Escape key listener, add new handler
- Form submission: preventDefault() to avoid page reload in webview
- Z-index layering: modal overlay must be above board (z-index > 20 for sticky header)
- Settings availability: SettingsService.getSettings() is async, handle loading state
- Tag input complexity: implement simple comma-separated input first, chips can be enhanced later
- Board refresh: rely on existing TaskScanner file watcher, no manual refresh needed after createTask

### Scope Boundaries

This task is part of Phase 3 (Kanban Board Data Binding & Interactivity). Related tasks:
- Task 3.5 (Card actions — edit, delete, context menu): Do NOT implement edit/delete buttons in this task
- Task 3.3 (Drag and drop): Already completed, do not modify drag/drop logic

Stay focused on task CREATION only. Do not add:
- Task editing capabilities
- Task deletion
- Card context menus
- Inline task editing

<!-- STAGE_TRANSITION: code -->

## Audit Result (2026-03-01)

Rating: **8/9** (meets completion threshold)

- [x] 1. `+ Capture` button opens modal
- [x] 2. Column `+` opens modal with prefilled stage
- [x] 3. Modal includes title, description, priority, role, project, tags
- [x] 4. Validation enforces required title
- [x] 5. `CreateTask` message posted on save
- [x] 6. `KanbanPanel` handles `CreateTask`
- [x] 7. Modal closes on Cancel, Escape, and overlay click
- [x] 8. Glassmorphic modal styling present
- [ ] 9. Tests pass with **33 tests** (current suite passes, but repository currently reports 7 test files in full run)
