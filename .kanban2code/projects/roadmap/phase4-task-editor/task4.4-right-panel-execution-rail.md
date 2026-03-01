---
stage: plan
tags: [feature, p1]
agent: planner
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
