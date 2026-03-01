---
stage: completed
agent: "02-🏛️architect"
tags: []
contexts: []
skills:
  - skill-vscode
---

# gemini architecture

# Kanban2Code Functionality Spec (v1)

Last updated: 2026-02-28  
Scope: Kanban shell + Task Editor + Execution Rail + Queue model (implementation guidance)  
Status: Locked for build

---

## 1) Product Intent

Kanban2Code is a filesystem-backed VS Code extension for orchestrating AI-assisted delivery with explicit stages.

Core flow:
- `capture -> plan -> code -> audit -> done`

Complex flow:
- `capture -> architecture -> split -> code -> audit`

Why complex flow exists:
- `architecture` + `split` are used to break multi-file/high-complexity work into smaller executable sections before coding.

---

## 2) Non-Negotiable Design Rules

1. **Single source of truth per concern**
   - Pipeline step definitions/mappings are editable only in right-side `Pipeline Steps`.
   - Left panel holds high-level metadata only.

2. **Execution transparency first**
   - Every run action must execute in a visible VS Code terminal.
   - No hidden/background-only primary execution path.

3. **Naming consistency**
   - `assignee` = human person/team member
   - `role` = workflow function (planner/coder/auditor/architect...)
   - `provider` = vendor (OpenAI/Anthropic...)
   - `model` = concrete model id
   - `profile` = runtime preset/config
   - Do not overload `agent` to mean role/model/provider.

4. **v1 scope discipline**
   - Provider analytics are logged (backend artifact), not surfaced as full dashboard UI in v1.

5. **Label clarity**
   - If showing execution events: `Recent Runs / Queue Feed`
   - If showing latest phase tasks: `Latest Tasks in Phase`
   - Do not mix ambiguous labels.

---

## 3) Kanban Shell Spec

### 3.1 Header / Brand Area
- Brand/title is display-only (no click/reset behavior).
- Keep `+ Capture` as global entry in header.
- `+ Capture` opens Capture modal.
- Header status line must read `Showing:` (never `Howing:`).
  - Baseline: `Showing: All priority · Newest first · All tasks`
  - Include project state when project filter exists (e.g., `All projects` or selected project).

### 3.2 Search
- Placeholder: `Search tasks, tags, ids...`
- Matches (case-insensitive, partial): `title`, `description`, `tags`, `taskId`
- Debounce: 200ms
- Enter triggers immediate search
- Clear restores current filtered/sorted view

### 3.3 Priority Filter
- Options: `All priority` (default), `Low`, `Medium`, `High`
- Single-select in v1
- AND logic with search/project filter
- Color mapping:
  - High -> red
  - Medium -> amber/yellow
  - Low -> green

### 3.4 Sort + Project Filter
- Default sort: `Newest first` (`createdAt` desc)
- Also support: `Oldest first`
- Stable tie-breaker: `taskId` or insertion order (avoid jitter)
- Sort applies after filtering/search
- Sort preference persists for board session

Project filter requirements:
- Must exist in shell UI
- Positioned next to sort control
- Options generated from project folder scaffolds
- Options: `All projects` + active project slugs/names
- Single-select in v1
- AND logic with other filters
- When `All projects`, show project badge/label on cards

### 3.5 Kanban Columns and Card Entry
- Column header contains:
  - Column name
  - Task count
  - `+` quick-add
- Column quick-add opens Capture modal with prefilled:
  - `status` from column
  - `role` from column default context (when applicable)

### 3.6 Drag & Drop
- Required for high-volume planning.
- Reorder within column + move across columns.
- v1 has **no transition restrictions** (free movement, including to/from done).
- Persist status/order immediately and deterministically.

### 3.7 Card Content / Actions
Card minimum content:
- title
- short description
- priority indicator
- assigned role

Card quick actions:
- edit (hover-visible) -> opens Task Editor
- delete

### 3.8 Known Shell Issue
- On large monitors, webview is not filling full available viewport.
- Requirement: full-viewport layout behavior (width/height occupancy).

---

## 4) Queue + Run Model

### 4.1 Queue Positioning
- Do not add a dedicated Kanban column for queue.
- Queue is execution state, surfaced via:
  - per-card run badges
  - right-side feed/panel
  - optional header queue chip `Queue: N`

### 4.2 Required Run/Queue Actions
Two scopes:
- Stage only
- All stages

Required semantics:
- `Run Stage`
- `Run All Stages`
- `Queue Stage`
- `Queue All Stages`

### 4.3 Pipeline Execution Behavior
- `All Stages` can run serialized: one task proceeds through audit/done before next starts.
- Queue handler responsibilities:
  - enqueue/dequeue
  - prevent duplicate concurrent runs for same task
  - ordered execution (default FIFO)
  - state transitions: queued/running/success/failed/cancelled
  - cancel/retry
  - terminal panel integration

### 4.4 Required Visibility
- Every run started from UI must stream in visible VS Code terminal output.

---

## 5) Task Editor Shell (Top -> Bottom, Left -> Right)

> Note: Task Editor HTML shell was missing initially; screenshot/mock is reference. This spec defines implementation behavior.

## 5.1 Global Top Bar (Required)

Include in Task Editor shell:
- Breadcrumb/path context:
  - `kanban2code / projects / <project> / <task-file>.md`
- Live chips:
  - stage
  - role/assignee
  - provider/model
  - dirty state (`unsaved changes`)
- Primary actions:
  - `Run Stage`
  - `Run Pipeline`
  - `Save .md`
  - `Exit` (required)

Exit behavior:
- If no unsaved changes: close editor and return to board
- If dirty: modal with
  - `Save & Exit` (primary)
  - `Discard & Exit` (danger)
  - `Cancel`

---

## 5.2 Left Panel: TASK METADATA

Header:
- `TASK METADATA`
- sub-label: `frontmatter + routing`
- informational only, no click behavior

Section order (locked):
1. `Basic Info`
2. `Location`
3. `Pipeline`
4. `Assignment`
5. `Context`
6. `Skills`
7. `Tags`

Rationale:
- Context + Skills are execution-critical, therefore above Tags.

### Basic Info
- Required in all roles:
  - `task title`
  - `smart summary`

Multi-level capture rule:
- Because capture can happen at multiple stages/roles, role prompts must tell LLMs to review/update title + smart summary if scope/clarity changes.

### Location
- Required for routing consistency.
- Fields:
  - `type` (project/domain; extensible)
  - `phase` (scaffold-sourced when type=project)
- Must include `+ New Location` action:
  - opens create dialog (type, slug, optional phase template)
  - writes scaffold folder structure
  - returns and selects new location
- Helper text explains where task files are created/read.
- Validation: cannot run with required location empty.

### Pipeline (Left)
- High-level metadata only:
  - current stage
  - priority
  - policy flags
- No per-step mapping editor here.

### Assignment (Naming Migration)
- Replace old terms with:
  - `assignee` (human)
  - `role` (workflow function)
  - `provider` (vendor)
  - `model` (concrete model)
  - `profile` (runtime preset)

### Tags
- Keep as-is (self-explanatory).

---

## 5.3 Center Panel: TASK FILE EDITOR

Tabs (locked):
- `Task Body`
- `Frontmatter`
- `Run Notes`

Editor tech:
- Monaco (or equivalent) is acceptable.
- Must support markdown/yaml editing ergonomics.

Bottom action bar (required):
- `Discard changes`
- `Save` (or `Saved` state when clean)
- visible and consistent across all tabs

### Frontmatter Rules
- Accept AI-generated YAML frontmatter.
- Normalize legacy keys on load/save:
  - `agent` -> `role`
  - `provider` kept as vendor
  - include `model`/`profile` where available
- Preserve lists:
  - `tags`
  - `contexts`
  - `skills`
- Keep location keys explicit:
  - `project`
  - `phase`

### Run Notes Rules
- Store per-task execution notes and log references.
- Allow local debug links (e.g., taskeditor preview URLs).

---

## 5.4 Right Panel: EXECUTION RAIL

Top -> bottom layout:

1) **Task Preview** (read-only summary; formerly Proposed Task)
- Purpose: sanity-check execution target before run/queue
- Shows:
  - title
  - current stage
  - assignee/role
  - provider/model/profile
  - tags/context count
- Actions:
  - `Capture Task`
  - `Edit inline`

2) **Pipeline Steps** (interactive and authoritative)
- This is the only place to edit per-step mapping.
- Per-step fields:
  - role/provider/model/profile
- Status badges:
  - ready / queued / running / accepted / failed / skipped
- Step actions:
  - run / retry / cancel (state dependent)
- Must include an explicit `Edit Steps`/gear flow to add/remove/reorder.

3) **FYI helper block** (directly below Pipeline Steps)
- concise, collapsible guidance:
  - Simple: `capture -> plan -> code -> audit`
  - Complex: `capture -> architecture -> split -> code -> audit`

4) **Recent Runs / Queue Feed**
- execution-focused chronological feed
- each item shows stage/outcome/timestamp
- clicking item focuses corresponding terminal output
- optional toggle to phase list allowed, but then label must switch to `Latest Tasks in Phase`

### Provider Visibility in v1 UI
Always show active provider/model/profile in:
- Task Preview
- Pipeline Steps
- Recent Runs / Queue Feed items

### Provider Analytics in v1
- Keep as structured logs only (no full analytics panel in v1)
- Minimum telemetry fields:
  - timestamp, taskId, stage, role, provider, model, profile, status, duration, retries, error class/message
- Audit metrics should be interpreted mainly in `code -> audit` transitions.

---

## 6) Validation and Guardrails

### Empty-task Run Guardrail
- Tasks may start with empty execution fields.
- If user clicks Run and required fields are missing:
  - do not enqueue
  - open Task Editor focused on missing required fields
  - after save/confirm, resume run flow

### Run Guard Minimums
`Run Stage` requires:
- valid location
- valid stage mapping for current step (role/provider/model/profile as required)

`Run Pipeline` requires:
- valid mappings for all enabled steps in pipeline

---

## 7) Settings (Required)

Add a dedicated **Settings** category/screen (first-class in navigation, not hidden).

### 7.1 Settings IA (information architecture)
Use the following groups:

1. **General**
   - timezone
   - date/time display format
   - UI density (comfortable/compact)
   - confirm destructive actions (on/off)

2. **Task Defaults**
   - default task title template (optional)
   - default smart summary behavior (manual/AI-assist)
   - default priority (`low|medium|high`)
   - default tags/contexts/skills seed lists

3. **Pipeline Defaults**
   - default pipeline template:
     - simple: `capture -> plan -> code -> audit`
     - complex: `capture -> architecture -> split -> code -> audit`
   - default current stage on create (usually `capture`)
   - audit bounce cap default (initially 2)

4. **Stage Runtime Mapping**
   - per-stage defaults for `role`, `provider`, `model`, `profile`
   - example:
     - plan -> planner / anthropic / haiku / planner-fast
     - code -> coder / openai / codex / code-default
     - audit -> auditor / anthropic / opus / audit-deep
   - this is the fallback when a task has empty execution fields

5. **Queue & Execution**
   - default queue mode (`stage` or `all stages`)
   - default scheduling policy (FIFO for v1)
   - serialized pipeline mode default (on/off)
   - max parallel runs (default 1)
   - auto-open terminal on run (default on)

6. **Projects Overrides**
   - per-project override layer for all relevant defaults above
   - precedence: `project override > global default`

7. **Telemetry & Logs**
   - run logging enabled (on/off; default on)
   - redact sensitive fields in logs (on/off)
   - log retention policy

### 7.2 Required behavior
- Settings must support both:
  - **global defaults**
  - **per-project overrides**
- Defaults must prefill:
  - capture/task creation
  - run actions
  - empty-task remediation flow
- Save flow:
  - `Save settings`
  - `Reset section`
  - `Reset to defaults`
- Changes apply immediately to new actions; existing tasks are not silently rewritten.

### 7.3 Validation
- Block invalid provider/model/profile combinations.
- If provider changes and model is incompatible, force model reselection.
- Show inline validation, never silent failure.

### 7.4 Migration note
- Legacy key `agent` in settings/imported templates must be normalized to `role`.

### 7.5 Single-file settings implementation contract
- Settings UI must live in **one file**: `settings-gemini.html`.
- No separate standalone pages for providers, agent behavior, roles, or notifications.
- Sidebar navigation must switch internal panels in the same DOM/page.
- All settings work happens by updating this single file (incremental patching, not file sprawl).

### 7.6 Required panel-level content (v1)
- **General**
  - Display: timezone, date/time format
  - Behavior: compact density, confirm destructive actions
- **Task Defaults**
  - Default title template
  - Smart summary behavior
  - Default priority
  - Default tags/contexts/skills seed lists
- **Pipeline Defaults**
  - Simple template: `capture -> plan -> code -> audit`
  - Complex template: `capture -> architecture -> split -> code -> audit`
  - Default create stage
  - Audit bounce cap
- **Stage Runtime Mapping**
  - Per stage (plan, architecture, code, audit): role/provider/model/profile selectors
  - Provider->Model dependency required
  - No free-text runtime mapping
- **Providers & Models**
  - Add/edit/disable provider controls
  - Add/edit/remove model controls
  - Endpoint + API key configuration
  - Feeds runtime/task selectors
- **Agent Behavior**
  - Mode setup (select/add/edit/delete)
  - API config selector
  - Role definition
  - Short description
  - When-to-use guidance
  - Mode-specific instructions
  - Global instructions
  - Available tools block
- **Roles**
  - Add/edit/delete role
  - Role visibility toggles (assignment/pipeline availability)
- **Queue & Execution**
  - Default queue mode (`stage` / `all stages`)
  - FIFO policy + max parallel runs
  - Serialized pipeline toggle
  - Auto-open terminal on run
- **Project Overrides**
  - Per-project override controls with explicit precedence (`project > global`)
- **Notifications**
  - Master toggle
  - In-app / Telegram / sound channels
  - Status trigger selector
  - Quiet hours
  - Digest frequency
- **Telemetry & Logs**
  - Run logging toggle
  - Redaction toggle
  - Retention policy
  - Provider-run telemetry note (timestamp/taskId/stage/role/provider/model/profile/status/duration/retries/error)

### 7.7 Settings naming and copy rules
- Use `assignee`, `role`, `provider`, `model`, `profile` consistently.
- Do not use `agent` where `role` or `provider/model` is intended.
- Keep labels explicit and operational (avoid ambiguous terms).

---

## 8) Example Frontmatter (Normalized Shape)

```yaml
---
title: "Review System - Backend API"
stage: plan
role: planner
provider: anthropic
model: claude-3.5-haiku
profile: planner-fast
tags:
  - feature
  - p1
  - api
contexts:
  - force-summary
  - api-architecture.md
  - review-system-architecture.md
skills:
  - nextjs-core-skills
  - skill-drizzle-orm
project: review-system
phase: phase2-notifications
---
```

Legacy input compatibility:
- If incoming frontmatter uses `agent: planner`, normalize to `role: planner` on save.

---

## 9) UX/Behavior Acceptance Checklist (Build Gate)

### Kanban
- [ ] Header title display-only
- [ ] `+ Capture` works globally
- [ ] Column quick-add prefill works
- [ ] `Showing:` label correct and dynamic
- [ ] Search/filter/sort/project logic correct
- [ ] `Newest first` default with stable ordering
- [ ] DnD unrestricted and persisted
- [ ] Full-viewport issue fixed on large monitors

### Task Editor
- [ ] Top-right bar includes Run Stage / Run Pipeline / Save .md / Exit
- [ ] Exit dirty-state modal works
- [ ] Left section order matches spec
- [ ] Assignment uses new naming (assignee/role/provider/model/profile)
- [ ] Center tabs + save/discard behavior implemented
- [ ] Frontmatter normalization implemented
- [ ] Right panel order and naming implemented
- [ ] Pipeline step editing only on right side

### Execution
- [ ] Run always visible in VS Code terminal
- [ ] Queue states mirrored in badges + feed
- [ ] Queue handler supports FIFO + cancel/retry + dedupe
- [ ] Stage and All-Stages controls available for Run and Queue

### Logging
- [ ] Provider telemetry logged with required fields
- [ ] Audit metrics tracked primarily on code->audit transitions

---

## 10) Implementation Notes for Agents

When implementing with AI agents:
- Prioritize control-surface clarity over feature volume.
- Never duplicate mutable controls across panels.
- Keep labels explicit and user-language-first.
- Prefer deterministic state transitions over hidden automation.
- Preserve filesystem truth (`.md` + frontmatter) as canonical record.


## 11) Typography Spec (UI Font Direction)

Font direction for app UI should prioritize modern, rounded readability (round "a" feel) while staying developer-friendly.

Primary recommendation order:
1. **Poppins** (preferred for UI/body)
2. **URW Gothic** (acceptable alternative)
3. **Noto Sans** (fallback for broad compatibility)

Monospace/code surfaces:
- **Noto Mono** for editor-adjacent technical text, run metadata, and code-like badges where monospaced readability helps.

Implementation notes:
- Keep one primary UI font family across shell/editor/settings for visual consistency.
- Use mono selectively (not for all body text).
- Define font tokens in theme variables (e.g., `--font-ui`, `--font-mono`) so swaps are centralized.
- Do not mix multiple decorative UI fonts in v1.

## 12) Deferred vs Locked Decisions (Post-Spec)

### Deferred (explicitly not v1)
- Team auth/online identity is deferred.
- Onboarding wizard is deferred.

### v1 identity assumption
- Local-first usage, single active operator by default.
- `assignee` can still be set in metadata, but permission enforcement is minimal in v1.

---

## 13) Conflict Handling Policy (Implemented Decision)

Conflict handling is **required in v1** to prevent silent overwrite.

### 13.1 Conflict detection model
When opening a task file, store:
- `openedFingerprint` (hash or mtime+size)
- `openedAt`

Before every save, recalculate current disk fingerprint.

Conflict condition:
- disk fingerprint != openedFingerprint

### 13.2 Save behavior
If no conflict:
- save normally
- update `openedFingerprint`

If conflict detected:
- block direct save
- show conflict modal with 3 explicit actions:
  1. `Reload from Disk` (discard local unsaved)
  2. `Compare Changes` (show side-by-side diff)
  3. `Overwrite with Mine` (danger; requires confirmation)

Default highlighted action:
- `Compare Changes`

### 13.3 Compare UX requirements
- Left: disk version
- Right: local editor version
- Allow selective copy from either side (chunk-level if available)
- Final action buttons:
  - `Use Merged + Save`
  - `Cancel`

### 13.4 Autosave interaction
- Autosave must not bypass conflict checks.
- If autosave hits conflict, pause autosave and show a non-blocking warning banner:
  - `External file change detected. Resolve conflict to continue saving.`

### 13.5 Telemetry events (required)
Log these events:
- `file_conflict_detected`
- `file_conflict_reload_disk`
- `file_conflict_compare_opened`
- `file_conflict_overwrite_confirmed`
- `file_conflict_merged_saved`

### 13.6 Safety defaults
- Never silently overwrite disk changes.
- `Overwrite with Mine` requires second confirmation.
- Keep one local recovery snapshot before overwrite.

---

## Technical Architecture

### Overview
Kanban2Code is a lightweight VS Code extension containing a host environment (Extension Host) and a Webview-based UI (React). The Extension Host handles file system operations (managing `.md` task files inside `.kanban2code/`), VS Code API interactions, and spawns terminal commands. The Webview handles the Kanban UI, Task Editor, Settings, and orchestrates user workflows. The communication between them is established via strictly typed message passing.

### Components
- **Extension Host (`src/extension.ts`, `src/webview/SidebarProvider.ts`)**: Orchestrates extension activation, registers the Webview Panel/Sidebar, manages workspace file I/O operations, handles queue execution logic, and executes terminal commands.
- **Webview Bridge (`src/webview/messaging.ts`)**: Defines typed message contracts for cross-environment data transmission (e.g., loading tasks, saving task files, executing runs).
- **Webview UI (`src/webview/ui/*`)**: React application responsible for presentation. Contains the Kanban Shell (columns, cards, drag-and-drop), Task Editor (metadata, frontmatter, markdown content editing, run notes), Execution Rail (pipeline steps, run controls, recent runs), and Settings.
- **Queue Handler**: Resides in the Extension Host to manage concurrent execution restrictions, ordered runs (FIFO), and stage-transition execution, directly interacting with visible VS Code terminals.

### Data Flow
1. **Load**: Extension Host scans `.kanban2code/projects` for task `.md` files, parses frontmatter and markdown body, and broadcasts task list to Webview UI.
2. **Edit/Save**: User modifications in the Task Editor dispatch an envelope to Extension Host, which validates and writes changes back to disk (handling file conflicts via fingerprinting).
3. **Execute**: User initiates a run (Stage or Pipeline). Webview dispatches run intent. Extension Host enqueues the task, spawns a visible terminal session, streams output/status back to Webview, and updates task metadata upon completion.
4. **State Sync**: Webview responds exclusively to state-change messages broadcasted by Extension Host.

### Dependencies
- **VS Code Extension API**: For workspace filesystem access, webview rendering, and terminal creation.
- **React**: For rendering Webview UI components.
- **esbuild**: For dual-entry bundling of extension and webview.
- **Monaco Editor** (or similar): For embedding markdown/YAML editing capabilities inside the Task Editor.

### Constraints
- **Single Source of Truth**: `.kanban2code` `.md` files act as the canonical source. All updates must be written to disk.
- **Execution Transparency**: Execution strictly happens in a visible VS Code terminal; hidden background execution is forbidden.
- **Strict Separation**: Webview must not possess VS Code API logic; Extension Host handles all business logic.
- **Conflict Handling**: Before saving, fingerprint matching is strictly required to avert silent disk overwrites.

---

## Phases

### Phase 1: Core Shell & Navigation Foundation
Establish the high-level layout, Kanban shell structure, and Settings view base.

#### Task 1.1: Webview Global Layout & View Orchestration
**Definition of Done:**
- [ ] Implement full viewport layout.
- [ ] Add sidebar navigation to toggle between Kanban Board and Settings.
- [ ] Set up basic global state/context for UI views.

**Files:**
- `src/webview/ui/index.tsx` - modify - Implement routing/view switching logic.
- `src/webview/ui/styles.css` - modify - Define full-viewport and navigation CSS tokens.

**Tests:**
- [ ] View toggling renders correct active view.
- [ ] Full viewport layout resizes with panel.

**Skills:**
- `skills/skill-vscode`
- `skills/react-core-skills`

#### Task 1.2: Settings File Migration & Global State
**Definition of Done:**
- [ ] Create `settings-gemini.html` (or integrate inside `index.tsx`) following single-file structure requirement.
- [ ] Define global/project-level settings schema in Extension Host.
- [ ] Connect Settings UI form inputs to messaging bridge for saving configurations.

**Files:**
- `src/webview/ui/Settings.tsx` - create - Implementation of all settings panels per spec.
- `src/webview/messaging.ts` - modify - Add settings save/load message types.

**Tests:**
- [ ] Changing a setting triggers save message.
- [ ] Invalid model combination shows inline validation.

**Skills:**
- `skills/skill-vscode`
- `skills/react-core-skills`

---

### Phase 2: Kanban Board Features
Implement full Kanban view functionalities according to spec.

#### Task 2.1: Board Header, Filters, and Search
**Definition of Done:**
- [ ] Implement display-only header and status line ("Showing: ...").
- [ ] Add debounce-based search and clear actions.
- [ ] Implement Priority, Sort, and Project single-select filters.

**Files:**
- `src/webview/ui/board.tsx` - modify - Add header, filter state, and search logic.
- `src/webview/ui/board.css` - modify - Styling for header and filter bars.

**Tests:**
- [ ] "Showing:" label updates dynamically with filters.
- [ ] Search accurately filters tasks.

**Skills:**
- `skills/react-core-skills`

#### Task 2.2: Kanban Columns & Drag-and-Drop
**Definition of Done:**
- [ ] Render dynamic columns with task counts and quick-add prefill hooks.
- [ ] Implement free-movement drag-and-drop between columns.
- [ ] Update task status explicitly upon drop and notify Host.

**Files:**
- `src/webview/ui/board.tsx` - modify - Update DnD logic to allow unrestricted movement and persist transitions.
- `src/webview/messaging.ts` - modify - Verify task status update envelope.

**Tests:**
- [ ] Card drops to 'done' successfully update status.
- [ ] Quick-add prefills correct status.

**Skills:**
- `skills/skill-vscode`
- `skills/react-core-skills`

---

### Phase 3: Task Editor & File Conflict Policy
Implement the complex Task Editor UI and disk conflict safety rules.

#### Task 3.1: Task Editor Shell & Left Metadata Panel
**Definition of Done:**
- [ ] Implement global top bar (breadcrumbs, chips, primary actions).
- [ ] Build left panel (Basic Info, Location, Pipeline, Assignment, Context, Skills, Tags) matching exact naming.
- [ ] Wire up "Exit" modal for dirty-state ("Save & Exit", "Discard & Exit").

**Files:**
- `src/webview/ui/TaskEditor.tsx` - create - Main editor component containing layout and Left Panel.
- `src/webview/ui/styles.css` - modify - Grid layout styling for Editor panels.

**Tests:**
- [ ] Exit intercepts if changes are unsaved.
- [ ] Left panel input uses updated nomenclature (assignee/role/provider/model/profile).

**Skills:**
- `skills/react-core-skills`

#### Task 3.2: Editor Center Panel & Frontmatter Normalization
**Definition of Done:**
- [ ] Implement tabs: Task Body, Frontmatter, Run Notes.
- [ ] Embed markdown/YAML editing environment.
- [ ] Implement load/save serialization logic converting legacy `agent` to `role`.

**Files:**
- `src/webview/ui/TaskEditor.tsx` - modify - Add center panel tabs.
- `src/webview/ui/utils.ts` - create - Add serialization and frontmatter parsing/normalization logic.

**Tests:**
- [ ] Loading legacy file transforms 'agent' into 'role' in state.
- [ ] Switching tabs retains unsaved changes.

**Skills:**
- `skills/react-core-skills`

#### Task 3.3: Conflict Detection & Save Flow
**Definition of Done:**
- [ ] Generate fingerprint on file load in Extension Host.
- [ ] Intercept save requests on Host side; detect if disk fingerprint altered.
- [ ] Render 3-action conflict modal in UI and implement compare UX.

**Files:**
- `src/extension.ts` - modify - Add fingerprinting mechanism.
- `src/webview/messaging.ts` - modify - Add conflict detection messaging envelopes.
- `src/webview/ui/TaskEditor.tsx` - modify - Add conflict resolution modal.

**Tests:**
- [ ] Out-of-band disk modification blocks UI save.
- [ ] Merged save works correctly.

**Skills:**
- `skills/skill-vscode`

---

### Phase 4: Execution Rail & Queue Model
Implement runtime mapping, queue integration, and visible terminal execution.

#### Task 4.1: Execution Rail UI
**Definition of Done:**
- [ ] Implement Right Panel with Task Preview, Pipeline Steps, FYI Helper block, and Recent Runs feed.
- [ ] Add explicit gear flow to edit pipeline steps.

**Files:**
- `src/webview/ui/TaskEditor.tsx` - modify - Assemble Right Panel components.
- `src/webview/ui/ExecutionRail.tsx` - create - Segregate rail-specific logic.

**Tests:**
- [ ] Execution Rail displays current active step prominently.
- [ ] Click feed item dispatches event to open terminal.

**Skills:**
- `skills/react-core-skills`

#### Task 4.2: Queue Execution Engine (Host)
**Definition of Done:**
- [ ] Create Queue singleton in Host to process Run Stage / Run All Stages.
- [ ] Prevent duplicate execution.
- [ ] Spawn visible VS Code terminals to execute pipeline scripts.
- [ ] Stream real-time queued/running/success/failed statuses back to UI.

**Files:**
- `src/queue/QueueManager.ts` - create - Host queue manager implementation.
- `src/extension.ts` - modify - Register QueueManager and terminal handlers.

**Tests:**
- [ ] `Run All Stages` processes serially (FIFO).
- [ ] Terminal appears in foreground upon start.

**Skills:**
- `skills/skill-vscode`

---

## Context

### Relevant Patterns
- **React Components**: Stateful logic encapsulated at view root (e.g., `board.tsx`), propagating props to dumb UI elements.
- **Webview Messaging**: Standardized `postMessage` protocol through `src/webview/messaging.ts` to coordinate React view and Extension Host API securely.

### Related Files
- `src/webview/messaging.ts` - Critical for extending API contract for new phases.
- `.kanban2code/_context/skills/skill-vscode.md` - Primary reference for separation of concerns between Host and UI.

### Gotchas
- **State Overwrites**: File I/O must strictly respect the Fingerprinting policy. Never bypass the `openedFingerprint` check.
- **Naming Regressions**: Double-check `provider/model/role` vocabulary. Do not allow 'agent' naming to slip back into UI templates or new storage shapes.
- **Terminal Execution Scope**: Keep in mind we are relying strictly on visible VS Code terminals; avoid utilizing child process APIs that hide output from users. Ensure terminal lifecycle (reuse vs distinct panels) avoids memory/pane leaks.