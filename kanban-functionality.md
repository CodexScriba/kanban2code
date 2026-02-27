# Kanban Board — Functionality Reference

Everything that's interactive in `kanbanboard-codex.html`, what it does, and the intended behavior when wired up.

---

## Top Banner: OpenClaw Connect

| Element | Class / ID | Behavior |
|---|---|---|
| **Connect button** | `.openclaw-connect-btn` | Opens the OpenClaw connection flow (OAuth or API key entry) to enable shared boards, team sync, and CI hook integration. |
| **Dismiss ×** | `.openclaw-dismiss` | Hides the banner for the current session. Should persist dismissal in localStorage so it doesn't reappear until next major prompt. |

---

## Header Toolbar (sticky, 48px)

### Left: Brand + Scope

| Element | Class / ID | Behavior |
|---|---|---|
| **Kanban2Code** | `.toolbar-brand` | Static brand label. No interaction. |
| **review-system ▼** | `.bc-scope` / `#projectBtn` | Project/scope switcher dropdown. Lists available project scopes (e.g. `review-system`, `billing`, `auth`). Selecting one filters the entire board to tasks within that scope. |

### Center: Search

| Element | Class / ID | Behavior |
|---|---|---|
| **Search input** | `.search-input` / `#searchInput` | Live-filters all cards across all columns. Matches against card title, description, tags, agent name, and task ID. Columns update their count badges to show `visible/total` while a query is active. |
| **Clear ×** | `.search-clear` / `#searchClear` | Clears the search input and resets all card visibility. Only visible when the input has text. |

### Right: Controls

| Element | Class / ID | Behavior |
|---|---|---|
| **Priority filter** | `.filter-select` / `#priorityFilter` | Dropdown: `All priority`, `High`, `Medium`, `Low`. Filters cards by their priority dot color. Updates the filter summary bar. |
| **Sort by** | `.filter-select` / `#sortFilter` | Dropdown: `Newest first`, `Oldest first`. Sorts cards within each column by creation timestamp. |
| **All / Mine toggle** | `.view-toggle` buttons | Segmented control. `All` shows every task. `Mine` filters to tasks assigned to the current user's agent/identity. |
| **Model badge** | `.model-badge` | Display-only. Shows the currently active LLM model (e.g. `sonnet-4.6`). Informational, not interactive. |
| **+ Capture** | `.capture-header-btn` | Primary CTA. Opens the task capture flow — either focuses the sidebar chat composer or opens a modal to describe a new task for the orchestrator to scope. |

### Filter Summary Bar

| Element | Class / ID | Behavior |
|---|---|---|
| **Showing: ...** | `.filter-summary` / `#filterSummary` | Read-only text that reflects the current active filters. Updates dynamically when priority, sort, or view toggle changes. Format: `Showing: All priority · Newest first · All tasks`. |

---

## Column Headers

| Element | Class | Behavior |
|---|---|---|
| **Column name** | `.col-name` | Static label: `Capture`, `Plan`, `Code`, `Audit`, `Done`. Represents the pipeline stage. |
| **Count badge** | `.col-count` | Shows number of cards in the column. During search, shows `visible/total`. |
| **+ button** | `.col-plus` | Adds a new task directly into this column. Equivalent to `+ Capture` but pre-sets the target stage. |
| **Accent bar** | `.col-accent` | Colored top border per column (visual only, not interactive). |

---

## Card — Top Row (hover-revealed)

These appear on card hover only (edit + delete fade in):

| Element | Class | Behavior |
|---|---|---|
| **Edit** (pencil icon) | `.edit-btn` | Opens the task editor — an inline form or modal where the user can modify title, description, priority, agent assignment, and tags. |
| **Delete** (trash icon) | `.delete-btn` | Prompts a confirmation dialog, then removes the task from the board and deletes its backing task file. |
| **⋮ Kebab menu** | `.card-kebab` | Always visible. Opens the context menu (see below). |

---

## Card — Title Row

| Element | Class | Behavior |
|---|---|---|
| **Priority dot** | `.priority-dot` (`.high` / `.med` / `.low`) | Color-coded circle before the title. Red = high, amber = medium, gray = low. Hover shows tooltip with priority name. |
| **Title text** | `.card-title` | Clickable — opens the task's backing file (markdown/YAML task definition) in the editor. |

---

## Card — Chips

| Element | Class | Behavior |
|---|---|---|
| **Agent chip** | `.agent-chip` | Shows which LLM agent/role is assigned (e.g. `architect`, `sonnet`, `haiku`, `opus`). Blue-tinted. |
| **Tag chips** | `.tag-chip` | Categorical labels (e.g. `feature`, `api`, `security`, `p1`). Neutral-tinted. Clicking could filter the board by that tag (future). |

---

## Card — Status Badges (conditional)

These appear in the card-top row only when applicable:

| Element | Class | Behavior |
|---|---|---|
| **RUNNING badge** | `.running-badge` | Amber pulsing dot + "RUNNING" label. Shown on cards where an agent is actively executing. The card also gets the `.running` class with an amber border. |
| **! 1 return** | `.audit-return` | Red badge shown on audit-stage cards that have been returned by the auditor for rework. Number indicates how many times returned. |

---

## Card — Action Buttons (bottom bar)

Three icon buttons in every card's action bar:

| Icon | Class | Title | Behavior |
|---|---|---|---|
| ▶ (play triangle) | `.run-one` | "Run stage" / "Run Plan stage" | Executes the current pipeline stage for this task. Opens a terminal executor that runs the assigned agent against the task file. |
| ▶▶ (double play) | `.run-all` | "Run full pipeline" / "Run all stages" | Queues the task through all remaining pipeline stages sequentially (e.g. Capture → Plan → Code → Audit → Done). |
| ☰ (three bars) | `.run-queue` | "Add to queue" | Adds the task to the execution queue without running immediately. Tasks in the queue are processed in order when the runner picks them up. Useful for batching multiple tasks. |
| ■ (stop square) | `.run-stop` | "Stop run" | Only shown on actively running cards (replaces run-one). Stops the current agent execution and focuses the terminal output. |

---

## Context Menu (kebab / right-click)

Triggered by the `⋮` kebab button or right-clicking a card:

| Menu Item | Action Key | Behavior |
|---|---|---|
| **Open task file** | `open` | Opens the task's markdown/YAML definition file in the editor. |
| **Run current stage** | `run` | Same as the ▶ Run button — executes the current stage. |
| **Run full pipeline** | `run-all` | Same as the ▶▶ All button — queues all remaining stages. |
| **Move to stage…** | `move` | Opens a sub-menu or dialog to manually move the card to a different column (e.g. skip from Capture to Code). |
| **Edit task** | `edit` | Same as the pencil icon — opens the task editor. |
| **Copy context** | `copy` | Copies the task's full context (description, tags, agent, file references) to clipboard in a structured format. |
| **Copy XML** | `copy-xml` | Copies the task as a full context XML block — the format used to pass task context to an LLM agent, including all relevant file contents and instructions. |
| **Delete task** | `delete` | Same as the trash icon — prompts confirmation then removes the task. Styled in red as a destructive action. |

---

## Cards — Drag & Drop

| Interaction | Behavior |
|---|---|
| **Drag** | Cards show a `grab` cursor. Clicking and holding switches to `grabbing`. Cards can be dragged between columns to manually move tasks between pipeline stages. |
| **Drop** | Dropping a card into a column moves the task to that stage and updates the task file's stage field accordingly. Column counts update. |

---

## Columns (Pipeline Stages)

The board has 5 columns representing the task lifecycle:

| Column | Color | Purpose |
|---|---|---|
| **Capture** | Neutral gray | Raw task intake. Tasks described by the user or captured from chat. Not yet scoped. |
| **Plan** | Blue | Task has been scoped. Agent generates an implementation plan, file list, and approach. |
| **Code** | Amber | Agent is writing code. Task has a plan and is actively being implemented. |
| **Audit** | Rose/pink | Code is complete, under review. An auditor agent checks for correctness, security, and quality. Tasks may be returned (`.audit-return` badge). |
| **Done** | Green | Task passed audit and is complete. Cards appear dimmed with a `.done` class. |

---

## Responsive Behavior

| Breakpoint | Changes |
|---|---|
| `≤ 1360px` | Model badge hidden. Columns shrink to 300px. |
| `≤ 1140px` | Toolbar compresses (smaller gaps, narrower search). View toggle hidden. |
| `≤ 900px` | Filter summary bar hidden. |
