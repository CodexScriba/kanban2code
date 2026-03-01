---
stage: completed
agent: "02-\U0001F3DB️architect"
tags: [architecture, v1-build]
contexts: []
skills:
  - skill-vscode
  - skill-typescript-config
---

# Architecture Codex

> Source of truth: `functionality.md`
> This file contains only implementation architecture, phases, and execution tasks.

## Technical Architecture

### Overview

Kanban2Code v1 is a VS Code extension with a **three-tier architecture**: Extension Host (Node.js), Webview Hosts (bridge layer), and Webview UIs (browser DOM). All persistent state lives in `.kanban2code/` as markdown files with YAML frontmatter — the filesystem is the single source of truth.

The extension surfaces three primary views:
1. **Sidebar** — chat interface, task picker, context/skill management
2. **Kanban Board** — full editor-area board with columns, cards, drag-and-drop, filters
3. **Task Editor** — three-panel editor (metadata | file editor | execution rail)
4. **Settings** — single-file settings UI (`settings-gemini.html` pattern, internal panel switching)

Execution happens through a **queue/runner engine** that spawns CLI processes in visible VS Code terminals.

### Components

- **Extension Host** (`src/extension.ts`): Thin activation, registers providers and commands
- **SidebarProvider** (`src/webview/SidebarProvider.ts`): Sidebar webview lifecycle, message bridge to host services
- **KanbanPanel** (`src/webview/KanbanPanel.ts`): Board webview panel (singleton), message bridge
- **TaskEditorPanel** (`src/webview/TaskEditorPanel.ts`): [NEW] Task editor webview panel, three-panel layout
- **SettingsPanel** (`src/webview/SettingsPanel.ts`): [NEW] Settings webview panel, single-file multi-panel
- **Messaging** (`src/webview/messaging.ts`): Typed envelope contracts for all host↔webview communication
- **TaskService** (`src/services/task-service.ts`): [NEW] CRUD for task markdown files (create, read, update, delete, move)
- **FrontmatterService** (`src/services/frontmatter-service.ts`): [NEW] Parse/serialize YAML frontmatter with `agent→role` normalization
- **TaskScanner** (`src/services/task-scanner.ts`): [NEW] Scans `.kanban2code/` for tasks, builds in-memory index, watches for changes
- **SettingsService** (`src/services/settings-service.ts`): [NEW] Read/write settings JSON, global + per-project overrides, validation
- **QueueService** (`src/services/queue-service.ts`): [NEW] FIFO queue management, state transitions, dedup
- **RunnerEngine** (`src/services/runner-engine.ts`): [NEW] Spawns CLI processes, streams to terminal, manages run lifecycle
- **TelemetryLogger** (`src/services/telemetry-logger.ts`): [NEW] Structured JSON log writer for run events
- **ConflictDetector** (`src/services/conflict-detector.ts`): [NEW] Fingerprint-based file conflict detection

### Data Flow

```
User Action (webview)
  → typed message envelope (postMessage)
  → Webview Host (SidebarProvider / KanbanPanel / TaskEditorPanel)
  → Service Layer (TaskService / QueueService / RunnerEngine / SettingsService)
  → Filesystem (.kanban2code/**/*.md, .kanban2code/settings.json)
  → Broadcast update envelope back to all active webviews
```

**Task lifecycle:**
1. User clicks `+ Capture` → webview posts `CreateTask` → TaskService writes `.md` → broadcasts `TaskSnapshot`
2. User drags card → webview posts `MoveTask` → TaskService updates frontmatter `stage` + `order` → broadcasts `TaskSnapshot`
3. User clicks `Run Stage` → webview posts `RunStage` → RunnerEngine validates → QueueService enqueues → RunnerEngine spawns terminal → streams output → updates task stage on success/failure → broadcasts state

**Settings flow:**
1. Settings loaded from `.kanban2code/settings.json` (global) + `.kanban2code/projects/<slug>/settings.json` (override)
2. Merged at read time: `project override > global default > hardcoded fallback`
3. Settings prefill all creation/run flows

### Dependencies

- **`gray-matter`** (npm): YAML frontmatter parsing — battle-tested, handles `---` delimiters correctly
- **`vscode`** (API): Terminal, FileSystem, WebviewPanel, commands, workspace
- **esbuild** (build): Already configured for dual-entry bundling
- **No framework for webviews**: Continue vanilla TypeScript DOM (consistent with existing codebase; avoids React/bundle bloat in v1)

### Constraints

- **No React**: Current codebase uses vanilla TS DOM manipulation. Maintain this for consistency — the board, sidebar, and all new views (task editor, settings) use the same pattern.
- **Single-file settings**: All settings UI lives in one webview entry file (`settings.tsx` + `settings.css`), with internal panel switching via DOM visibility.
- **CSP compliance**: All webview scripts must use nonce-based CSP. No `eval()`, no dynamic script injection.
- **VS Code API boundary**: Webview code cannot import `vscode` module. All host interactions go through message envelopes.
- **File-based truth**: No SQLite, no IndexedDB. All state persists as `.md` files (tasks) and `.json` files (settings, telemetry).

---

## Phases

### Phase 1: Core Services & Data Layer

**User Intervention Gate:**
- [ ] Review phase scope, dependencies, and acceptance criteria before implementation starts.


Foundation services that all views depend on. Must be solid before any UI work.

#### Task 1.1: FrontmatterService — parse/serialize with normalization

**Definition of Done:**
- [x] Parses YAML frontmatter from `.md` files using `gray-matter`
- [x] Normalizes `agent` → `role` on read
- [x] Serializes back to `.md` preserving body content
- [x] Preserves list fields: `tags`, `contexts`, `skills`
- [x] Handles missing/malformed frontmatter gracefully

**Files:**
- `src/services/frontmatter-service.ts` - create - frontmatter parse/serialize/normalize
- `src/types/task.ts` - create - `Task` interface, `TaskStage` type, `Priority` type
- `package.json` - modify - add `gray-matter` dependency

**Tests:**
- [ ] Parses valid frontmatter with all fields
- [ ] Normalizes `agent: planner` → `role: planner`
- [ ] Round-trips without data loss
- [ ] Handles empty/missing frontmatter
- [ ] Preserves markdown body content unchanged

**Skills:**
- `skills/skill-vscode` - Extension architecture conventions
- `skills/skill-typescript-config` - TypeScript strictness rules

#### Task 1.2: TaskService — CRUD for task markdown files

**Definition of Done:**
- [ ] `createTask(data)` writes `.md` file with frontmatter + body to correct location
- [ ] `readTask(filePath)` returns parsed Task object
- [ ] `updateTask(filePath, changes)` updates frontmatter fields and/or body
- [ ] `deleteTask(filePath)` removes file from disk
- [ ] `moveTask(filePath, newStage)` updates `stage` in frontmatter, moves file if needed
- [ ] File naming uses timestamp-based ID: `{timestamp}-{slug}.md`

**Files:**
- `src/services/task-service.ts` - create - task CRUD operations
- `src/types/task.ts` - modify - add `TaskCreateInput`, `TaskUpdateInput` types

**Tests:**
- [ ] Creates task file at correct path with valid frontmatter
- [ ] Reads task and returns typed object
- [ ] Updates single field without clobbering others
- [ ] Deletes file from disk
- [ ] Stage change updates frontmatter

**Skills:**
- `skills/skill-vscode` - Filesystem conventions

#### Task 1.3: TaskScanner — workspace task discovery and watching

**Definition of Done:**
- [ ] Scans `inbox/**/*.md` and `projects/**/*.md` for task files
- [ ] Returns `TaskSnapshotItem[]` with full parsed metadata (title, stage, priority, role, project, tags, taskId)
- [ ] Supports filtering by stage, priority, project, search text
- [ ] Supports sorting by `createdAt` (derived from filename timestamp) with stable tiebreaker
- [ ] Sets up `FileSystemWatcher` for `.md` changes and emits refresh events
- [ ] Replaces current `getWorkspaceTasks()` in SidebarProvider (removes 4-second polling)

**Files:**
- `src/services/task-scanner.ts` - create - scan, filter, sort, watch
- `src/types/task.ts` - modify - extend `TaskSnapshotItem` with full metadata fields

**Tests:**
- [ ] Scans and returns tasks from inbox + projects
- [ ] Filters by stage, priority, project
- [ ] Search matches title, tags, taskId (case-insensitive, partial)
- [ ] Sorts newest-first with stable tiebreaker
- [ ] File watcher triggers refresh on file add/change/delete

**Skills:**
- `skills/skill-vscode` - VS Code workspace/file APIs

#### Task 1.4: SettingsService — global + per-project settings

**Definition of Done:**
- [ ] Reads `.kanban2code/settings.json` (global defaults)
- [ ] Reads `.kanban2code/projects/<slug>/settings.json` (project overrides)
- [ ] Merges: `project override > global default > hardcoded fallback`
- [ ] Writes settings back to correct file scope
- [ ] Validates provider/model/profile combinations
- [ ] Supports `resetSection()` and `resetToDefaults()`

**Files:**
- `src/services/settings-service.ts` - create - settings read/write/merge/validate
- `src/types/settings.ts` - create - settings shape types matching spec §7

**Tests:**
- [ ] Reads global settings
- [ ] Project override wins over global
- [ ] Hardcoded fallback fills missing keys
- [ ] Rejects invalid provider/model combo
- [ ] Reset section restores defaults for one group only

**Skills:**
- `skills/skill-vscode` - Extension settings patterns
- `skills/skill-typescript-config` - Type safety

#### Task 1.5: ConflictDetector — file conflict detection

**Definition of Done:**
- [ ] `openFile(path)` stores fingerprint (hash of content + mtime)
- [ ] `checkConflict(path)` compares current disk fingerprint vs stored
- [ ] Returns `{ hasConflict, diskVersion?, localVersion? }` when conflict detected
- [ ] `createRecoverySnapshot(path)` saves `.kanban2code/.recovery/<filename>.bak`
- [ ] Emits telemetry events per spec §13.5

**Files:**
- `src/services/conflict-detector.ts` - create - fingerprint, check, recovery
- `src/services/telemetry-logger.ts` - create - structured JSON log writer (also used by runner)

**Tests:**
- [ ] No conflict when file unchanged since open
- [ ] Conflict detected when external write changes file
- [ ] Recovery snapshot created before overwrite
- [ ] Telemetry events logged correctly

**Skills:**
- `skills/skill-vscode` - FileSystem API

---

### Phase 2: Messaging Protocol Expansion

**User Intervention Gate:**
- [ ] Review phase scope, dependencies, and acceptance criteria before implementation starts.


Expand the typed message contract to support all views and operations.

#### Task 2.1: Expand messaging.ts for full task CRUD + board operations

**Definition of Done:**
- [ ] Add message types: `CreateTask`, `UpdateTask`, `DeleteTask`, `MoveTask`, `ReorderTask`
- [ ] Add message types: `OpenTaskEditor`, `CloseTaskEditor`, `SaveTask`
- [ ] Add message types: `TaskSnapshot` (expanded with full metadata), `TaskUpdated`, `TaskDeleted`
- [ ] Add message types: `OpenSettings`, `SaveSettings`, `SettingsLoaded`
- [ ] All types have Zod schemas or manual validation
- [ ] Backward compatible with existing 3 message types

**Files:**
- `src/webview/messaging.ts` - modify - add ~20 new envelope types
- `src/types/task.ts` - modify - ensure payload types align

**Tests:**
- [ ] All new message types serialize/deserialize correctly
- [ ] Existing messages still work
- [ ] Invalid payloads rejected

**Skills:**
- `skills/skill-vscode` - Message protocol conventions
- `skills/skill-typescript-config` - Type discrimination patterns

#### Task 2.2: Expand messaging.ts for queue/runner operations

**Definition of Done:**
- [ ] Add message types: `RunStage`, `RunAllStages`, `QueueStage`, `QueueAllStages`
- [ ] Add message types: `CancelRun`, `RetryRun`
- [ ] Add message types: `RunnerStateChanged` (queued/running/success/failed/cancelled)
- [ ] Add message types: `QueueSnapshot` (current queue state)

**Files:**
- `src/webview/messaging.ts` - modify - add runner/queue envelope types
- `src/types/runner.ts` - create - `RunState`, `QueueItem`, `RunResult` types

**Tests:**
- [ ] Runner message types round-trip correctly
- [ ] State enum covers all transitions

**Skills:**
- `skills/skill-vscode` - Message protocol conventions

---

### Phase 3: Kanban Board — Data Binding & Interactivity

**User Intervention Gate:**
- [ ] Review phase scope, dependencies, and acceptance criteria before implementation starts.


Replace hardcoded board with live data. This is the primary user-facing view.

#### Task 3.1: Wire board to TaskScanner — live card rendering

**Definition of Done:**
- [ ] Board requests `TaskSnapshot` on load and renders real cards from filesystem
- [ ] Cards show: title, description (truncated), priority indicator, role badge, project badge
- [ ] Column counts update dynamically
- [ ] File watcher triggers board refresh (no polling)
- [ ] Empty columns show placeholder text

**Files:**
- `src/webview/KanbanPanel.ts` - modify - wire TaskScanner, handle messages
- `src/webview/ui/board.tsx` - modify - replace hardcoded cards with dynamic rendering
- `src/webview/ui/board.css` - modify - priority color indicators per spec

**Tests:**
- [ ] Board renders cards from filesystem
- [ ] Cards appear in correct columns by stage
- [ ] Priority colors match spec (high=red, medium=amber, low=green)
- [ ] Adding a task file triggers board update

**Skills:**
- `skills/skill-vscode` - Webview data binding patterns
- `skills/skill-frontend-design` - Card component design

#### Task 3.2: Search, filter, sort — board toolbar

**Definition of Done:**
- [ ] Search filters cards (case-insensitive partial match on title/tags/taskId) with 200ms debounce
- [ ] Priority filter: All/Low/Medium/High (single-select, AND logic)
- [ ] Sort: Newest first (default) / Oldest first, stable tiebreaker on taskId
- [ ] Project filter: All projects + discovered project slugs (single-select, AND)
- [ ] `Showing:` status line updates dynamically
- [ ] Filter state persists for board session

**Files:**
- `src/webview/ui/board.tsx` - modify - wire filter/sort/search to task data
- `src/webview/ui/board.css` - modify - active filter styling

**Tests:**
- [ ] Search matches title substring
- [ ] Priority filter shows only matching cards
- [ ] Sort reverses card order
- [ ] Project filter shows only matching project tasks
- [ ] Status line reflects current filters

**Skills:**
- `skills/skill-frontend-design` - Filter UX patterns

#### Task 3.3: Drag and drop — column reorder + cross-column move

**Definition of Done:**
- [ ] Cards draggable within column (reorder)
- [ ] Cards draggable across columns (stage change)
- [ ] No transition restrictions (free movement per spec)
- [ ] On drop: immediately persist new stage + order to filesystem
- [ ] Visual feedback during drag (ghost card, drop zone highlight)
- [ ] Deterministic ordering preserved after drop

**Files:**
- `src/webview/ui/board.tsx` - modify - add HTML5 drag/drop handlers
- `src/webview/ui/board.css` - modify - drag ghost + drop zone styles
- `src/webview/KanbanPanel.ts` - modify - handle `MoveTask`/`ReorderTask` messages

**Tests:**
- [ ] Dragging card to different column updates stage in file
- [ ] Reordering within column persists order
- [ ] Multiple rapid drags don't corrupt state

**Skills:**
- `skills/skill-frontend-design` - Drag and drop UX

#### Task 3.4: Capture modal — task creation flow

**Definition of Done:**
- [ ] `+ Capture` in header opens modal overlay
- [ ] Column `+` opens same modal with prefilled stage
- [ ] Modal fields: title, description, priority, role, project, tags
- [ ] Defaults prefilled from SettingsService
- [ ] On save: creates task file, closes modal, board refreshes
- [ ] On cancel: closes without side effects

**Files:**
- `src/webview/ui/board.tsx` - modify - capture modal component
- `src/webview/ui/board.css` - modify - modal styles (glassmorphic, per existing design)
- `src/webview/KanbanPanel.ts` - modify - handle `CreateTask` message

**Tests:**
- [ ] Modal opens/closes correctly
- [ ] Prefilled stage from column quick-add
- [ ] Task file created on save
- [ ] Validation blocks empty title

**Skills:**
- `skills/skill-frontend-design` - Modal design patterns

#### Task 3.5: Card actions — edit, delete, context menu

**Definition of Done:**
- [ ] Edit button (hover-visible) posts `OpenTaskEditor` message
- [ ] Delete button shows confirmation, then deletes task file
- [ ] Context menu matches existing spec (Open/Run/Run all/Move/Edit/Copy/Delete)
- [ ] Delete respects "confirm destructive actions" setting

**Files:**
- `src/webview/ui/board.tsx` - modify - card action handlers
- `src/webview/KanbanPanel.ts` - modify - handle `DeleteTask`, `OpenTaskEditor` messages

**Tests:**
- [ ] Edit opens task editor panel
- [ ] Delete removes file after confirmation
- [ ] Context menu shows correct options per card state

**Skills:**
- `skills/skill-vscode` - Command/action patterns

#### Task 3.6: Full-viewport layout fix

**Definition of Done:**
- [ ] Board fills entire available viewport width and height
- [ ] Works on large monitors (>2560px wide)
- [ ] Columns flex to fill horizontal space evenly
- [ ] Vertical scrolling per-column when cards overflow

**Files:**
- `src/webview/ui/board.css` - modify - fix viewport layout
- `src/webview/KanbanPanel.ts` - modify - ensure no size constraints on panel

**Tests:**
- [ ] Visual verification at various viewport sizes
- [ ] No horizontal scrollbar on wide monitors

**Skills:**
- `skills/skill-frontend-design` - Responsive layout

---

### Phase 4: Task Editor

**User Intervention Gate:**
- [ ] Review phase scope, dependencies, and acceptance criteria before implementation starts.


The three-panel task editor for detailed task work.

#### Task 4.1: TaskEditorPanel — webview host + three-panel layout shell

**Definition of Done:**
- [ ] New `TaskEditorPanel` singleton webview panel
- [ ] Receives task file path via message, loads full task data
- [ ] Renders three-panel layout: left (metadata), center (editor), right (execution rail)
- [ ] Top bar with breadcrumb, live chips (stage/role/provider/dirty), action buttons
- [ ] Exit behavior: clean close or dirty-state modal (Save & Exit / Discard & Exit / Cancel)

**Files:**
- `src/webview/TaskEditorPanel.ts` - create - webview host for task editor
- `src/webview/ui/taskeditor.tsx` - create - task editor DOM
- `src/webview/ui/taskeditor.css` - create - task editor styles
- `esbuild.mjs` - modify - add `taskeditor` entry point
- `src/extension.ts` - modify - register openTaskEditor command

**Tests:**
- [ ] Panel opens with task data loaded
- [ ] Three-panel layout renders correctly
- [ ] Top bar shows correct breadcrumb and chips
- [ ] Exit with no changes closes immediately
- [ ] Exit with dirty state shows modal

**Skills:**
- `skills/skill-vscode` - WebviewPanel lifecycle
- `skills/skill-frontend-design` - Multi-panel layout

#### Task 4.2: Left panel — task metadata form

**Definition of Done:**
- [ ] Section order: Basic Info, Location, Pipeline, Assignment, Context, Skills, Tags
- [ ] Basic Info: title + smart summary inputs
- [ ] Location: type dropdown + phase dropdown + `+ New Location` action
- [ ] Pipeline: current stage (display), priority selector, policy flags
- [ ] Assignment: assignee, role, provider, model, profile fields
- [ ] Context/Skills/Tags: chip lists with add/remove
- [ ] Changes update dirty state; do not auto-save

**Files:**
- `src/webview/ui/taskeditor.tsx` - modify - left panel form rendering
- `src/webview/ui/taskeditor.css` - modify - form styles

**Tests:**
- [ ] All sections render in correct order
- [ ] Field changes mark form dirty
- [ ] Location `+ New Location` opens create dialog
- [ ] Chip add/remove works for tags/contexts/skills

**Skills:**
- `skills/skill-frontend-design` - Form design patterns

#### Task 4.3: Center panel — tabbed markdown/yaml editor

**Definition of Done:**
- [ ] Three tabs: Task Body, Frontmatter, Run Notes
- [ ] Uses `<textarea>` with monospace font for editing (Monaco deferred to post-v1 if complex)
- [ ] Tab switching preserves content
- [ ] Bottom action bar: Discard changes / Save (or Saved state)
- [ ] Save posts `SaveTask` to host, host writes file via TaskService
- [ ] Conflict detection on save via ConflictDetector

**Files:**
- `src/webview/ui/taskeditor.tsx` - modify - center panel tabs + editor
- `src/webview/ui/taskeditor.css` - modify - editor/tab styles
- `src/webview/TaskEditorPanel.ts` - modify - handle `SaveTask`, conflict detection

**Tests:**
- [ ] Tab switching preserves content
- [ ] Save writes to disk
- [ ] Conflict detected shows modal
- [ ] Discard restores last-saved state

**Skills:**
- `skills/skill-vscode` - File save patterns

#### Task 4.4: Right panel — execution rail

**Definition of Done:**
- [ ] Task Preview block: read-only summary of title/stage/role/provider/model
- [ ] Pipeline Steps: per-step cards with role/provider/model, status badges (ready/queued/running/accepted/failed/skipped)
- [ ] Step actions: run/retry/cancel (state-dependent visibility)
- [ ] Edit Steps gear opens inline step editor (add/remove/reorder)
- [ ] FYI helper block: collapsible simple/complex pipeline guidance
- [ ] Recent Runs feed: chronological run entries with stage/outcome/timestamp

**Files:**
- `src/webview/ui/taskeditor.tsx` - modify - right panel sections
- `src/webview/ui/taskeditor.css` - modify - execution rail styles

**Tests:**
- [ ] Task preview reflects current task metadata
- [ ] Pipeline steps show correct status badges
- [ ] Run/retry/cancel buttons appear for correct states
- [ ] Recent runs feed shows historical data

**Skills:**
- `skills/skill-vscode` - Pipeline visualization
- `skills/skill-frontend-design` - Status badge design

---

### Phase 5: Queue & Execution Engine

**User Intervention Gate:**
- [ ] Review phase scope, dependencies, and acceptance criteria before implementation starts.


The runner that spawns CLI processes and manages the execution queue.

#### Task 5.1: QueueService — FIFO queue with state management

**Definition of Done:**
- [ ] `enqueue(taskId, scope)` adds to queue (scope = 'stage' | 'all')
- [ ] `dequeue()` returns next item in FIFO order
- [ ] Prevents duplicate concurrent runs for same task
- [ ] State transitions: queued → running → success/failed/cancelled
- [ ] `cancel(taskId)` removes from queue or signals running process
- [ ] `retry(taskId)` re-enqueues failed task
- [ ] Emits state change events for UI updates

**Files:**
- `src/services/queue-service.ts` - create - queue logic
- `src/types/runner.ts` - modify - queue item types

**Tests:**
- [ ] FIFO order maintained
- [ ] Duplicate enqueue rejected
- [ ] Cancel removes queued item
- [ ] Cancel signals running process
- [ ] Retry re-enqueues with correct state

**Skills:**
- `skills/skill-vscode` - Event emitter patterns

#### Task 5.2: RunnerEngine — CLI process spawning + terminal integration

**Definition of Done:**
- [ ] Reads provider config from `.kanban2code/_providers/<name>.md`
- [ ] Builds CLI command from provider config (cli, model, flags)
- [ ] Spawns process in VS Code terminal (visible to user, per spec §4.4)
- [ ] Streams output to terminal in real-time
- [ ] On completion: updates task stage, logs telemetry, dequeues next
- [ ] `Run Stage`: executes current stage only
- [ ] `Run All Stages`: serialized pipeline (one stage completes before next starts)
- [ ] Respects `max parallel runs` setting (default 1)

**Files:**
- `src/services/runner-engine.ts` - create - process spawning and lifecycle
- `src/services/telemetry-logger.ts` - modify - add run event logging

**Tests:**
- [ ] Correct CLI command built from provider config
- [ ] Terminal created and visible
- [ ] Task stage updated on success
- [ ] Failed run transitions to `failed` state
- [ ] Serialized pipeline runs stages in order

**Skills:**
- `skills/skill-vscode` - Terminal API, process management

#### Task 5.3: Run validation guardrails

**Definition of Done:**
- [ ] `Run Stage` validates: location set, current stage has valid mapping (role/provider/model)
- [ ] `Run Pipeline` validates: all enabled steps have valid mappings
- [ ] If validation fails: do not enqueue, open Task Editor focused on missing fields
- [ ] After user saves required fields: resume run flow
- [ ] Settings defaults fill empty execution fields before validation

**Files:**
- `src/services/runner-engine.ts` - modify - add validation layer
- `src/services/settings-service.ts` - modify - add `getEffectiveMapping(stage, project)` helper

**Tests:**
- [ ] Run blocked when location empty
- [ ] Run blocked when provider/model missing
- [ ] Settings defaults fill gaps correctly
- [ ] Post-save resume works

**Skills:**
- `skills/skill-vscode` - Validation flow patterns

#### Task 5.4: Wire runner to board + sidebar UI

**Definition of Done:**
- [ ] Board cards show run status badges (queued/running/success/failed)
- [ ] Queue chip in board header shows `Queue: N`
- [ ] Sidebar shows active run indicator
- [ ] Run/Queue/Cancel/Retry actions work from board context menu
- [ ] Runner state changes broadcast to all active webviews

**Files:**
- `src/webview/ui/board.tsx` - modify - run badges on cards, queue chip
- `src/webview/ui/board.css` - modify - badge styles (pulsing for running)
- `src/webview/KanbanPanel.ts` - modify - handle runner messages, broadcast state
- `src/webview/SidebarProvider.ts` - modify - handle runner messages

**Tests:**
- [ ] Card badge updates when run state changes
- [ ] Queue chip shows correct count
- [ ] Cancel from context menu stops running task

**Skills:**
- `skills/skill-vscode` - Multi-webview state sync

---

### Phase 6: Settings UI

**User Intervention Gate:**
- [ ] Review phase scope, dependencies, and acceptance criteria before implementation starts.


Single-file settings with internal panel navigation.

#### Task 6.1: SettingsPanel — webview host + panel navigation shell

**Definition of Done:**
- [ ] New `SettingsPanel` singleton webview panel
- [ ] Sidebar navigation: General, Task Defaults, Pipeline Defaults, Stage Runtime Mapping, Providers & Models, Agent Behavior, Roles, Queue & Execution, Project Overrides, Notifications, Telemetry & Logs
- [ ] Panel switching via DOM visibility (no page reload)
- [ ] Loads current settings from SettingsService on open
- [ ] Save/Reset section/Reset to defaults actions per panel

**Files:**
- `src/webview/SettingsPanel.ts` - create - settings webview host
- `src/webview/ui/settings.tsx` - create - settings DOM (all panels in one file)
- `src/webview/ui/settings.css` - create - settings styles
- `esbuild.mjs` - modify - add `settings` entry point
- `src/extension.ts` - modify - register openSettings command
- `package.json` - modify - register command

**Tests:**
- [ ] Panel opens and renders sidebar nav
- [ ] Panel switching shows correct content
- [ ] Settings data loads from service
- [ ] Save persists to disk

**Skills:**
- `skills/skill-vscode` - Settings UI patterns
- `skills/skill-frontend-design` - Multi-panel navigation

#### Task 6.2: Settings panels — all content per spec §7.6

**Definition of Done:**
- [ ] All 11 panels render correct form controls per spec
- [ ] Stage Runtime Mapping has provider→model dependency (changing provider forces model reselection)
- [ ] Providers & Models: add/edit/disable provider, add/edit/remove model, endpoint + API key
- [ ] Agent Behavior: mode CRUD, role definition, instructions
- [ ] Project Overrides: per-project override controls
- [ ] Inline validation (no silent failure)
- [ ] Uses `assignee`/`role`/`provider`/`model`/`profile` naming consistently

**Files:**
- `src/webview/ui/settings.tsx` - modify - implement all panel contents
- `src/webview/ui/settings.css` - modify - form styles
- `src/webview/SettingsPanel.ts` - modify - handle all settings messages

**Tests:**
- [ ] Each panel renders expected form fields
- [ ] Provider/model dependency validation works
- [ ] Inline validation shows errors
- [ ] Naming consistency verified (no `agent` where `role` intended)

**Skills:**
- `skills/skill-frontend-design` - Form validation patterns

---

### Phase 7: Typography & Polish

**User Intervention Gate:**
- [ ] Review phase scope, dependencies, and acceptance criteria before implementation starts.


Final visual consistency pass.

#### Task 7.1: Typography — Poppins + Noto Mono font integration

**Definition of Done:**
- [ ] Poppins loaded for all UI text (board, sidebar, task editor, settings)
- [ ] Noto Mono for code surfaces (editor, run metadata, badges)
- [ ] Font tokens defined: `--font-ui`, `--font-mono`
- [ ] CSP updated to allow font loading (Google Fonts or local bundled)
- [ ] Consistent across all three webview hosts

**Files:**
- `src/webview/ui/board.css` - modify - apply font tokens
- `src/webview/ui/styles.css` - modify - apply font tokens
- `src/webview/ui/taskeditor.css` - modify - apply font tokens
- `src/webview/ui/settings.css` - modify - apply font tokens
- `src/webview/KanbanPanel.ts` - modify - update CSP for fonts
- `src/webview/SidebarProvider.ts` - modify - update CSP for fonts
- `src/webview/TaskEditorPanel.ts` - modify - update CSP for fonts

**Tests:**
- [ ] Fonts load without CSP errors
- [ ] UI text renders in Poppins
- [ ] Code surfaces render in Noto Mono

**Skills:**
- `skills/skill-frontend-design` - Typography implementation

#### Task 7.2: Color palette unification + priority indicators

**Definition of Done:**
- [ ] CSS custom properties for all colors centralized in shared variables
- [ ] Priority colors: high=#fb7185 (red), medium=#fbbf24 (amber), low=#34d399 (green)
- [ ] Stage colors consistent across board/sidebar/editor
- [ ] Dark theme variables use consistent naming

**Files:**
- `src/webview/ui/board.css` - modify - centralize variables
- `src/webview/ui/styles.css` - modify - centralize variables
- `src/webview/ui/taskeditor.css` - modify - use shared variables
- `src/webview/ui/settings.css` - modify - use shared variables

**Tests:**
- [ ] Priority colors match spec
- [ ] No hardcoded color values outside variable definitions

**Skills:**
- `skills/skill-frontend-design` - Design system tokens

---

## Context

### Relevant Patterns

- **Vanilla TS DOM**: All existing webview code uses `document.createElement` + manual event wiring. No React. Continue this pattern.
- **Singleton panels**: `KanbanPanel` uses static `currentPanel` pattern. Reuse for `TaskEditorPanel` and `SettingsPanel`.
- **Message envelopes**: All host↔webview communication uses `{ type: string, payload: T }` typed envelopes via `postMessage`. Keep this contract.
- **File-based state**: Tasks are `.md` files with YAML frontmatter. Settings will be `.json` files. No database.
- **CSP with nonce**: All webview HTML uses random nonce for script-src. Maintain this security model.

### Related Files

- `src/webview/messaging.ts` - message contract source of truth, must be expanded
- `src/webview/KanbanPanel.ts` - reference implementation for new webview panels
- `src/webview/SidebarProvider.ts` - reference for service wiring and message handling
- `src/webview/ui/board.tsx` - reference for vanilla TS DOM rendering
- `docs/design/taskeditor-codex.html` - visual reference for Task Editor implementation
- `docs/design/settings-gemini.html` - visual reference for Settings implementation
- `functionality.md` - locked spec, authoritative for all behavior decisions

### Gotchas

- **No React installed**: `tsconfig.json` has `jsx: react-jsx` but React is not in dependencies. The `.tsx` files use no JSX — they're vanilla TS with `.tsx` extension. Don't introduce React.
- **Polling in SidebarProvider**: Current `getWorkspaceTasks()` polls every 4 seconds. Phase 1 TaskScanner replaces this with `FileSystemWatcher` events — must remove the `setInterval`.
- **Hardcoded cards in board**: `board.tsx` has ~200 lines of hardcoded placeholder cards. Phase 3.1 replaces all of this with dynamic rendering.
- **Unicode in frontmatter**: Some task files have literal `\U0001F3DB` unicode escapes in `agent` field values. FrontmatterService must handle this gracefully.
- **CSP font loading**: SidebarProvider has strict CSP with no `font-src`. Must be loosened when adding Poppins. Board already allows Google Fonts.
- **`agent` → `role` migration**: Existing task files and provider configs use `agent` field. FrontmatterService must normalize to `role` on read but preserve backward compat for reading.
- **Architecture.md references stale code**: The `.kanban2code/_context/architecture.md` references files (`src/types/task.ts`, `src/runner/runner-engine.ts`, etc.) from a previous codebase that don't exist in this repo. This is a clean rebuild.

## Handoff Notes
- Do not duplicate full spec text from `functionality.md` inside task files.
- Keep this document focused on architecture, phased plan, and executable tasks.
- Splitter should generate task files from the `## Phases` section only.
