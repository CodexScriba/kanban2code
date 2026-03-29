---
skill_name: skill-ui-system-planning-mode
version: "1.0"
framework: react
last_verified: "2026-03-27"
always_attach: false
priority: 10
triggers:
  - ui-shell
  - design fidelity
  - reusable component
  - reusable ui
  - primitive extraction
  - port approved ui
  - screen parity
  - design mapping
  - navbar
  - historical
  - forecast
  - agent
---

# UI System Planning Mode

> **Target:** Frontend planning tasks that must port approved UI with strict fidelity while identifying reusable production components.

## 1. Use This Skill For

- Planning frontend tasks that reference `ui-shell/` as an approved visual source of truth
- Deciding whether a UI element should be reused, extended, or created new
- Building or maintaining a permanent design mapping in `docs/design/`
- Preventing duplicate shared components when an approved visual pattern already exists
- Splitting a page into safe implementation slices without losing reuse opportunities

## 2. What This Skill Does

This skill puts the planner into a strict `UI system planning mode`.

In this mode, the planner does more than gather coding context. It must:

1. read the approved UI references first
2. read the permanent design mapping under `docs/design/`
3. identify the visible UI elements the task touches
4. decide whether each element is:
   - `reuse existing`
   - `extend existing`
   - `create new`
   - `screen-specific, do not generalize`
5. check whether an equivalent shared component already exists in the design mapping
6. produce a strict reuse decision for the coder
7. update or reference the permanent design docs instead of letting the task invent new visual patterns in isolation

This is still planning work. It is not implementation, and it is not freeform design.

## 3. Core Principle

The planner must treat approved UI as a hard contract and treat the permanent design mapping as a reuse ledger.

The goal is:

- same approved UI
- cleaner internals
- fewer duplicate components
- explicit reuse decisions

The goal is not:

- redesigning the approved shell
- turning every similar thing into one generic card
- letting each task invent its own slightly different shared component

## 4. Required Inputs

Before planning in this mode, read these in order when they exist:

1. task file
2. `docs/design/ui-components-index.json`
3. `docs/design/ui-implementation-system.md`
4. the relevant screen porting map in `docs/design/`
5. approved `ui-shell` component files for the visual slice
6. frontend source files already listed in the task
7. backend contract files when live data or request shape matters

For WorkforceMaster frontend tasks that use backend data, also read:

- `skills/skill-workforcemaster-backend.md`
- `backend/app/contracts/*.py` relevant to the task

## 5. Hard Behavior Rules

### The planner must

- identify the visible UI units in the task
- compare them against the existing design mapping
- use mapped component names exactly when a component already exists in `docs/design/ui-components-index.json`
- reuse named shared components when the visual pattern is truly identical
- create a new component recommendation only when the approved UI proves it is distinct
- keep screen-specific components screen-specific when forced reuse would introduce drift
- name reusable components consistently and update the mapping language accordingly
- preserve visual fidelity as the higher priority than abstraction purity
- explain why a component is shared or not shared
- trace indirect consumers in shared shell files when the task affects frontend state, filters, date controls, or shell-mounted data
- verify every proposed file path against the real repo tree before writing it into the task
- distinguish between `existing file to modify`, `existing folder for a new file`, and `intentionally new path`

### The planner must not

- invent a new shared component without checking `docs/design/ui-components-index.json`
- invent a synonym for an already-mapped shared component name unless it is explicitly updating the design mapping
- force unique UI into a generic primitive just to reduce file count
- describe the task as "implement the page" when it should be described as a bounded slice
- treat `ui-shell` as inspiration
- permit duplicate component creation when an equivalent mapped component already exists
- rely on vibe-coded source structure as the production component structure
- propose test or component paths based only on generic skill conventions without confirming the actual repo layout

## 6. Reuse Decision Framework

For each visible UI element touched by the task, produce one of these decisions:

### `reuse existing`

Use this when:

- the approved visual pattern is materially identical
- the same spacing, hierarchy, shell, and interaction model are already mapped
- only the data or copy changes

Example:

- `WorkspaceTabs`
- `DateNavigator`
- `RightRailShell`

### `extend existing`

Use this when:

- the base visual pattern is shared
- a small constrained extension is needed
- the extension does not create a second visual system

Example:

- extending `MetricCard` to support one approved comparison badge style already present in another screen

### `create new`

Use this when:

- the approved UI clearly shows a distinct layout or interaction pattern
- sharing would blur fidelity or create conditional spaghetti

Example:

- `SlaHeroCard`

### `screen-specific, do not generalize`

Use this when:

- something looks similar at a glance but is not actually the same pattern
- the spacing, rhythm, emphasis, or interaction model is unique enough that sharing would be misleading

Example:

- a Historical critical-hours card that is visually specialized and should not be flattened into a generic panel

## 7. Required Planner Output Additions

When this skill is active, the planner output must include these sections in addition to its normal planning sections:

### `UI Reuse Decision`

For every major visible element in scope, list:

- element name
- decision: `reuse existing | extend existing | create new | screen-specific`
- source reference
- target production component name
- rationale

### `Design Mapping References`

List the exact files in `docs/design/` that were consulted.

### `Verified Repo Paths`

List the key file and test paths proposed by the task and state whether each one is:

- existing file to modify
- existing folder for a new file
- intentionally new path

### `Do Not Duplicate`

List any already-mapped components the coder must not recreate under a new name.

### `Visual Contract`

List the non-negotiable fidelity requirements for the slice.

## 8. Design Mapping Files

This skill uses `docs/design/` as the durable UI system memory.

The primary files are:

- `docs/design/ui-components-index.json`
- `docs/design/ui-implementation-system.md`
- screen-specific mapping files such as:
  - `docs/design/navbar-porting-map.md`
  - `docs/design/historical-porting-map.md`
  - `docs/design/forecast-porting-map.md`
  - `docs/design/agent-porting-map.md`

## 9. JSON Mapping Expectations

`docs/design/ui-components-index.json` is the machine-readable source of truth for reuse decisions.

Each component entry should state at minimum:

- `name`
- `kind`
- `status`
- `source_refs`
- `used_by`
- `target_files`
- `do_not_generalize`
- `notes_doc`

Use the JSON file to answer:

- does this visual component already exist conceptually
- should this task reuse it
- where should the production code live
- what doc explains the rule

If the JSON already contains a component entry, its `name` is canonical for planning output.
Do not replace it with a cleaner-sounding alias inside the task.

## 10. Navbar Seed Example

If a task touches the shared navbar, the planner should prefer mapped shared components such as:

- `AppHeader`
- `BrandCluster`
- `WorkspaceSelector`
- `TeamsFilterPill`
- `WorkspaceTabs`
- `DateNavigator`
- `ThemeToggleButton`
- `LoginActionButton`

The planner should not tell the coder to create a second navbar system under a different set of names unless the design mapping explicitly changes.

If the current codebase uses different implementation helper names such as `TeamsPill` or `DateControl`, the planner may mention them as current code references, but the reuse decision should still point back to the canonical mapped component names.

## 11. Relationship To Backend Contracts

This skill does not replace backend contract reading.

If the UI element displays live data, the planner must still:

- read the relevant `backend/app/contracts/*.py` file
- use `skills/skill-workforcemaster-backend.md`
- ensure the UI reuse decision does not imply invented backend logic

Visual reuse and data truth are separate responsibilities and both must be satisfied.

For frontend tasks in this repo, the planner must also inspect shared shell and route consumers when the feature data affects shell-mounted controls or filters. At minimum, check:

- `frontend/src/app/AppShell.jsx`
- `frontend/src/app/routes.jsx`
- `frontend/src/app/AppProviders.jsx`
- `frontend/src/lib/api/request-context.js`

Do not assume the feature folder contains every relevant dependency.

## 12. When To Skip This Mode

Do not use this mode when:

- the task is backend-only
- the task is bug-fix only and does not touch shared UI or fidelity decisions
- the task is purely behavioral and does not affect visible UI structure

## 13. Success Criteria

This skill is working when:

- the planner stops duplicate shared component creation early
- later tasks reuse named components intentionally
- the design mapping becomes more useful over time instead of drifting
- frontend tasks become more mechanical to implement and less interpretive
- the approved shell remains visually consistent across screens
- proposed file paths and test locations match the actual repo structure instead of generic conventions

## 14. Source Material

- `docs/design/ui-components-index.json`
- `docs/design/ui-implementation-system.md`
- `docs/design/navbar-porting-map.md`
- `ui-shell/src/components/CommandCenterNavbar.jsx`
- `skills/skill-workforcemaster-backend.md`
