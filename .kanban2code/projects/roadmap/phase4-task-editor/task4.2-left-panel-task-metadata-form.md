---
agent: auditor
stage: completed
tags: [feature, p1]
contexts: [skill-frontend-design]
---

# Left panel — task metadata form

## Goal

Implement the left panel of the task editor with all metadata sections in the correct order, including form fields, chip lists, and the location creation action.

## Definition of Done

- [x] Section order: Basic Info, Location, Pipeline, Assignment, Context, Skills, Tags
- [x] Basic Info: title + smart summary inputs
- [x] Location: type dropdown + phase dropdown + `+ New Location` action
- [x] Pipeline: current stage (display), priority selector, policy flags
- [x] Assignment: assignee, role, provider, model, profile fields
- [x] Context/Skills/Tags: chip lists with add/remove
- [x] Changes update dirty state; do not auto-save

## Files

- `src/webview/ui/taskeditor.tsx` - modify - left panel form rendering
- `src/webview/ui/taskeditor.css` - modify - form styles

## Tests

- [x] All sections render in correct order (verified via `src/webview/ui/taskeditor.tsx`)
- [x] Field changes mark form dirty (verified via `syncDirtyFromState` handlers)
- [x] Location `+ New Location` opens create dialog (verified via `newLocationBtn` click handler)
- [x] Chip add/remove works for tags/contexts/skills (verified via `bindChipInteractions`)

## Audit Outcome (2026-03-01)

- Rating: **7.5 / 10**
- Metadata form implementation matches the requested left-panel behavior and section ordering.
- Completion gate not met: task remains in `audit` because score is below 8.

### Findings

- `npm test` currently fails at TypeScript compile stage (TS6133 unused declarations in `src/webview/ui/taskeditor.tsx`), so the project test gate does not pass in current source state.
- Service tests in prebuilt `dist` do pass when run directly (`node --test dist/services/*.test.js`), but this does not replace the `npm test` gate.

## Context

Left panel sections (in order):

1. **Basic Info**
   - Title: text input
   - Smart summary: textarea (auto-generates from task content)

2. **Location**
   - Type: dropdown (Inbox, Project)
   - Phase: dropdown (discovered phases)
   - `+ New Location` action: opens dialog to create new project/phase

3. **Pipeline**
   - Current stage: display (read-only)
   - Priority: dropdown (Low, Medium, High)
   - Policy flags: checkboxes for various pipeline policies

4. **Assignment**
   - Assignee: text input
   - Role: dropdown (planner, coder, auditor)
   - Provider: dropdown (available providers)
   - Model: dropdown (models for selected provider)
   - Profile: dropdown (available profiles)

5. **Context**
   - Chip list with add/remove
   - Add button opens context picker

6. **Skills**
   - Chip list with add/remove
   - Add button opens skill picker

7. **Tags**
   - Chip list with add/remove
   - Add button opens tag input

Dirty state tracking:
- Any field change should mark the form as dirty
- Dirty indicator appears in top bar chip
- No auto-save - user must explicitly save

Chip lists should support:
- Click to remove
- Add button to open picker/input
- Visual feedback for empty state

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/taskeditor-codex.html`

## Refined Prompt

Objective: Implement the left panel metadata form for the task editor with 7 sections, dirty state tracking, and chip list interactions.

Implementation approach:
1. Create the left panel container structure in taskeditor.tsx with 7 ordered sections
2. Implement Basic Info section with title input and summary textarea
3. Implement Location section with type/phase dropdowns and New Location action
4. Implement Pipeline section with stage display, priority selector, and policy checkboxes
5. Implement Assignment section with role/provider/model/profile cascading dropdowns
6. Implement Context/Skills/Tags sections with chip list components
7. Add dirty state tracking - any field change sets isDirty flag and shows indicator
8. Add event handlers that post messages to host when values change

Key decisions:
- Use the existing pattern from board.tsx: vanilla TypeScript with DOM APIs, not React
- Chip lists use the same pattern as capture tags in board.tsx (click chip to remove)
- Form inputs use CSS classes from design reference: form-input, form-select, form-textarea
- Dirty state is local to the webview; parent (TaskEditorPanel) tracks it via messages
- Location dropdowns are populated from discovered projects/phases (passed from host)

Edge cases:
- Empty chip lists show placeholder text "No tags/contexts/skills added"
- Provider change should reset model to first available for that provider
- Phase dropdown disabled when Location Type is "Inbox"
- Form should handle initial task data load and populate all fields

## Context

### File Tree (scoped)

```
src/
├── webview/
│   ├── SidebarProvider.ts          # <- read-only reference (webview host pattern)
│   ├── KanbanPanel.ts              # <- read-only reference (singleton panel pattern)
│   ├── TaskEditorPanel.ts          # <- read-only reference (host for task editor)
│   ├── messaging.ts                # <- read-only reference (message types)
│   └── ui/
│       ├── index.tsx               # <- read-only reference
│       ├── board.tsx               # <- read-only reference (form patterns)
│       ├── board.css               # <- read-only reference (styles)
│       ├── taskeditor.tsx          # <- modify/create (main implementation)
│       └── taskeditor.css          # <- modify/create (styles)
├── services/
│   ├── task-service.ts             # <- read-only reference (Task types)
│   ├── settings-service.ts         # <- read-only reference (provider/model config)
│   └── frontmatter-service.ts      # <- read-only reference
├── types/
│   ├── task.ts                     # <- read-only reference (TaskFrontmatter types)
│   └── settings.ts                 # <- read-only reference (Settings types)
```

### Architecture Excerpts

From `.kanban2code/architecture.md`:
- VS Code extension with sidebar webview support
- WebviewViewProvider serves bundled React-ready webview (actually vanilla TS in board.tsx)
- Extension host registers provider that serves bundled webview with CSP and theme integration

From `src/types/task.ts`:
- TaskFrontmatter includes: title, stage, order, role, agent, provider, model, profile, priority, tags[], contexts[], skills[], project, phase
- TaskCreateInput/TaskUpdateInput mirror these fields as optional

### Skill Excerpts

From `.kanban2code/_context/skills/skill-frontend-design.md`:
- Override shadcn defaults aggressively - tokens, spacing, radius, components
- Use CSS custom properties for all color values
- Choreograph motion - staggered load, purposeful hover/scroll interactions
- Layout has a point of view — asymmetry, scale contrast, or intentional density

Design approach for this task:
- Follow the existing dark theme established in docs/design/taskeditor-codex.html
- Use CSS variables from the design reference (--bg, --surface, --border, --text, etc.)
- Form inputs: border-radius 6px, border var(--border-md), background rgba(255,255,255,0.03)
- Section cards: border 1px solid var(--border), border-radius 8px, background rgba(255,255,255,0.02)

### Code Excerpts

From `src/webview/messaging.ts:65-82`:
```typescript
export interface OpenTaskEditorMessage {
  type: 'OpenTaskEditor';
  payload?: {
    taskId?: string;
  };
}

export interface SaveTaskMessage {
  type: 'SaveTask';
  payload: {
    taskId?: string;
    task: TaskCreateInput;
  };
}
```
Relevant for: Form changes should eventually trigger SaveTask message (but only on explicit save).

From `src/types/task.ts:5-20`:
```typescript
export interface TaskFrontmatter {
  title?: string;
  stage: TaskStage;
  order?: number;
  role?: string;
  agent?: string;
  provider?: string;
  model?: string;
  profile?: string;
  priority?: Priority;
  tags: string[];
  contexts: string[];
  skills: string[];
  project?: string;
  phase?: string;
}
```
Relevant for: All form fields map directly to TaskFrontmatter properties.

From `src/webview/ui/board.tsx:516-534`:
```typescript
const addCaptureTag = (rawTag: string): void => {
  const tag = normalizeTag(rawTag);
  if (!tag) return;
  const normalized = tag.toLowerCase();
  if (captureTags.some((entry) => entry.toLowerCase() === normalized)) return;
  captureTags = [...captureTags, tag];
  renderCaptureTags();
};

const removeCaptureTag = (tag: string): void => {
  captureTags = captureTags.filter((entry) => entry !== tag);
  renderCaptureTags();
};
```
Relevant for: Chip add/remove pattern - same approach for tags/contexts/skills.

From `src/types/settings.ts:52-78`:
```typescript
export interface Settings {
  providersAndModels: {
    providers: Record<string, ProviderConfig>;
    profiles: Record<string, ProviderProfile>;
  };
  roles: {
    available: string[];
  };
}
```
Relevant for: Provider/model/profile dropdowns populated from settings.

### Dependency Graph

Files importing from files to modify:
- `src/webview/TaskEditorPanel.ts` - creates/hosts the taskeditor.tsx webview
- `esbuild.mjs` - bundles taskeditor.tsx entry point

Files imported by files to modify:
- `src/webview/messaging.ts` - message types for host communication
- `src/types/task.ts` - Task and TaskFrontmatter types

### Patterns to Follow

1. **Vanilla TypeScript pattern** (from board.tsx):
   - No React, use direct DOM manipulation
   - Template strings for HTML generation
   - Event listeners attached after DOM insertion

2. **Form input pattern**:
   - Use class="form-input" for text inputs
   - Use class="form-select" for dropdowns
   - Use class="form-textarea" for multi-line text
   - All have consistent focus states (border-color change)

3. **Chip list pattern** (from board.tsx capture modal):
   - Chips render as buttons with remove handler
   - Click chip to remove
   - Input + Add button for adding new items
   - Prevent duplicates (case-insensitive)

4. **Dirty state pattern**:
   - Track originalValues vs currentValues
   - Compare on each input change
   - Post message to host when dirty state changes
   - Visual indicator in header (header-badge.dirty class)

5. **Message passing**:
   - Form changes: update local state only (no auto-save)
   - Explicit Save button triggers SaveTask message
   - Host responds with TaskUpdated message

### Test Patterns

From `src/services/task-service.test.ts`:
- Uses vitest with describe/it/expect pattern
- Mocks filesystem operations
- Tests input validation and output formatting

For UI tests (if added):
- Follow pattern from `src/webview/__tests__/messaging.test.ts`
- Test message type guards and validation

### Gotchas

- Form fields must match TaskFrontmatter exactly (watch for naming: role vs agent)
- Provider/model are linked - changing provider should update available models
- Phase dropdown only relevant when Location Type is "Project"
- Tags/contexts/skills are arrays in frontmatter but chips in UI
- Dirty state must compare arrays by content, not reference
- The "stage" field in pipeline should be display-only (stage changes via workflow, not edit)

### Scope Boundaries

This task (4.2) focuses ONLY on the left panel metadata form. Do NOT implement:
- Center panel tabbed editor (Task 4.3)
- Right panel execution rail (Task 4.4)
- Top bar/breadcrumb (Task 4.1)
- Save/discard logic (Task 4.3)
- Conflict detection (Task 4.3)

Interaction with other tasks:
- Task 4.1 creates the TaskEditorPanel and three-panel layout shell - this task populates the left panel
- Task 4.3 handles the center editor and save flow - this task provides form data for saving
- Task 4.4 handles execution rail - this task provides metadata display values

The left panel should expose a function or message pattern to:
1. Receive initial task data from host
2. Notify parent when dirty state changes
3. Provide current form values when save is requested
