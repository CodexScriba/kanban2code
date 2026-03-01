---
tags: [feature, p1]
agent: auditor
stage: completed
contexts: [skill-vscode, skill-frontend-design]
---

# Right panel — execution rail

## Goal

Implement the right panel of the task editor with task preview, pipeline steps visualization, and recent runs feed.

## Definition of Done

- [ ] Task Preview block: read-only summary of title/stage/role/provider/model
- [ ] Pipeline Steps: per-step cards with role/provider/model, status badges (ready/queued/running/accepted/failed/skipped)
- [ ] Step actions: run/retry/cancel (state-dependent visibility)
- [ ] Edit Steps gear opens inline step editor (add/remove/reorder)
- [ ] FYI helper block: collapsible simple/complex pipeline guidance
- [ ] Recent Runs feed: chronological run entries with stage/outcome/timestamp

## Files

- `src/webview/ui/taskeditor.tsx` - modify - right panel sections
- `src/webview/ui/taskeditor.css` - modify - execution rail styles

## Tests

- [ ] Task preview reflects current task metadata
- [ ] Pipeline steps show correct status badges
- [ ] Run/retry/cancel buttons appear for correct states
- [ ] Recent runs feed shows historical data

## Context

Right panel sections:

1. **Task Preview**
   - Read-only summary
   - Shows: title, stage, role, provider, model
   - Updates when metadata changes

2. **Pipeline Steps**
   - Per-step cards showing:
     - Step name
     - Role, provider, model
     - Status badge (ready/queued/running/accepted/failed/skipped)
   - Step actions (state-dependent):
     - Run: visible for ready/failed states
     - Retry: visible for failed states
     - Cancel: visible for queued/running states
   - Edit Steps gear: opens inline editor for add/remove/reorder

3. **FYI Helper Block**
   - Collapsible section
   - Simple vs complex pipeline guidance
   - Help text for understanding pipeline behavior

4. **Recent Runs Feed**
   - Chronological list of run entries
   - Each entry shows: stage, outcome, timestamp
   - Scrollable for long histories

Status badge colors:
- ready: gray
- queued: blue
- running: yellow (pulsing)
- accepted: green
- failed: red
- skipped: gray

Inline step editor:
- Add new step
- Remove existing step
- Reorder steps (drag or up/down buttons)
- Configure role/provider/model per step

The execution rail should update in real-time when runner state changes via `RunnerStateChanged` messages.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/taskeditor-codex.html`


## Refined Prompt

Objective: Implement the right panel (execution rail) of the task editor with task preview, pipeline steps visualization, step actions, and recent runs feed.

Implementation approach:
1. Create right panel DOM structure in taskeditor.tsx with four sections: Task Preview, Pipeline Steps, FYI Helper Block, and Recent Runs Feed
2. Implement Task Preview as read-only display showing task title, stage, role, provider, model from loaded task data
3. Build Pipeline Steps section with per-step cards showing step name, role/provider/model, and status badge
4. Add state-dependent action buttons (run/retry/cancel) that appear based on current step status
5. Implement Edit Steps gear button that toggles inline step editor for add/remove/reorder operations
6. Create FYI Helper Block as collapsible section with simple vs complex pipeline guidance
7. Build Recent Runs Feed showing chronological entries with stage, outcome, timestamp
8. Wire up real-time updates via RunnerStateChanged messages from the host
9. Add CSS styles following the design reference palette and component patterns

Key decisions:
- Use existing messaging protocol: RunnerStateChanged for real-time updates, RunStage/RunAllStages/CancelRun/RetryRun for actions
- Status badge colors match design reference: gray (ready/skipped), blue (queued), yellow/pulsing (running), green (accepted), red (failed)
- Inline step editor uses simple DOM manipulation for v1 (add/remove/reorder without drag library)
- Recent runs data comes from host via TaskEditorPanel message passing

Edge cases:
- Empty pipeline: show placeholder message in Pipeline Steps section
- No recent runs: show empty state message in Recent Runs feed
- Runner state changes while user viewing: smoothly update badges without jarring transitions
- Long run histories: Recent Runs feed should be scrollable with max-height

## Context

### File Tree (scoped)

```
src/
├── extension.ts                    # Extension activation, command registration
├── webview/
│   ├── SidebarProvider.ts          # Sidebar webview host
│   ├── KanbanPanel.ts              # Kanban board webview panel (singleton pattern)
│   ├── TaskEditorPanel.ts          # Task editor webview panel (to be created in task 4.1) <- read-only reference
│   ├── messaging.ts                # Message types and validation functions <- read-only reference
│   └── ui/
│       ├── index.tsx               # Sidebar UI entry point <- read-only reference
│       ├── board.tsx               # Kanban board UI <- read-only reference
│       ├── taskeditor.tsx          # Task editor UI (to be created/modified) <- modify
│       ├── taskeditor.css          # Task editor styles <- modify
│       ├── styles.css              # Sidebar styles <- read-only reference
│       └── board.css               # Board styles <- read-only reference
├── types/
│   └── task.ts                     # Task type definitions <- read-only reference
└── services/
    └── task-service.ts             # Task CRUD operations <- read-only reference
```

### Architecture Excerpts

From `.kanban2code/_context/skill-vscode.md`:
- Extension Host owns VS Code APIs + filesystem writes
- Webview Host owns serialization/broadcast
- Webview UI owns rendering only
- All host/webview communication uses typed envelopes; no ad-hoc payloads
- Core layout must be class-based CSS (no inline layout sprawl)

From `src/webview/messaging.ts`:
- `RunnerStateChanged` message: `{ type: 'RunnerStateChanged', payload: { taskId: string, state: RunState, timestamp: number } }`
- `RunStage` message: `{ type: 'RunStage', payload: { taskId: string } }`
- `RunAllStages` message: `{ type: 'RunAllStages', payload: { taskId: string } }`
- `CancelRun` message: `{ type: 'CancelRun', payload: { taskId: string } }`
- `RetryRun` message: `{ type: 'RetryRun', payload: { taskId: string } }`

### Skill Excerpts

From `.kanban2code/_context/skills/skill-frontend-design.md`:
- Use CSS custom properties for theme values
- Choreograph motion intentionally - staggered reveals, purposeful hover states
- Override shadcn defaults with project-specific tokens
- Layout should have a point of view - asymmetric, dramatic scale contrasts

From `.kanban2code/_context/skills/skill-vscode.md`:
- Build output must include webview JS and CSS consumed by webview host
- No task is complete if style assets fail to load in Extension Host runtime
- Keep filenames/path contracts stable between build and host loader

### Code Excerpts

From `docs/design/taskeditor-codex.html:862-925` (design reference):
```html
<aside class="panel rail-panel">
  <header class="panel-head">
    <span class="panel-title">Execution Rail</span>
    <span class="panel-sub">proposal + analytics</span>
  </header>
  <div class="rail-scroll">
    <div class="proposal-card">
      <div class="section-title">Proposed Task</div>
      <h4>Review System - Backend API</h4>
      <div class="kv">
        <b>Stage</b><span>capture -> plan</span>
        <b>Agent</b><span>architect -> planner</span>
        <b>Skills</b><span>nextjs-core, drizzle-orm</span>
        <b>Tags</b><span>feature, p1, api</span>
      </div>
    </div>
    <div class="pipeline">
      <div class="section-title">Pipeline Steps</div>
      <div class="pipeline-step active">
        <div class="row-inline"><span class="dot"></span>plan | planner | haiku</div>
        <span class="status-pill warn">ready</span>
      </div>
    </div>
    <div class="terminal-list">
      <div class="terminal-item">
        <span><b>[backend api] -- plan</b><br />started 10:30</span>
        <span class="status-pill warn">running</span>
      </div>
    </div>
  </div>
</aside>
```
From `src/webview/messaging.ts:205-212` (RunnerStateChanged type):
```typescript
export interface RunnerStateChangedMessage {
  type: 'RunnerStateChanged';
  payload: {
    taskId: string;
    state: RunState;
    timestamp: number;
  };
}
```

### Dependency Graph

Files importing from modified files:
- `src/webview/TaskEditorPanel.ts` - will host the task editor webview and handle message passing

Files modified by imports:
- `src/webview/messaging.ts` - message types already defined (read-only for this task)
- `esbuild.mjs` - may need taskeditor entry point (handled in task 4.1)

### Patterns to Follow

- Use CSS custom properties from design reference for colors (e.g., `--accent`, `--green`, `--red`, `--amber`)
- Panel structure: `.panel` > `.panel-head` + `.rail-scroll` for scrollable content
- Status pills use `.status-pill` with modifier classes (`.ok`, `.warn`)
- Pipeline steps use `.pipeline-step` with `.active` modifier for current step
- Message posting via `vscode.postMessage()` pattern used in board.tsx

### Test Patterns

- UI component tests should verify rendering of different status states
- Message handling tests should verify correct message types posted on button clicks
- State update tests should verify UI updates when runner state changes

### Gotchas

- Runner state message timing: UI should handle state updates that arrive while user is interacting
- Status badge color mapping: ensure all 6 statuses have correct colors (ready/queued/running/accepted/failed/skipped)
- Step editor inline toggle: ensure gear icon toggles editor visibility without losing scroll position
- Empty states: all sections should have sensible empty state displays

### Scope Boundaries

This task focuses ONLY on the right panel (execution rail). Do NOT touch:
- Left panel metadata form (task 4.2 responsibility)
- Center panel tabbed editor (task 4.3 responsibility)
- TaskEditorPanel.ts host setup (task 4.1 responsibility)
- esbuild.mjs entry point (task 4.1 responsibility)
- extension.ts command registration (task 4.1 responsibility)

The taskeditor.tsx file may be created by task 4.1; this task adds the right panel sections to it. Coordinate with task 4.1 to ensure the three-panel layout shell exists before adding right panel content.
