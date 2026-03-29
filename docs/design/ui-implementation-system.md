# UI Implementation System

## Purpose

This folder is the durable UI-system memory for WorkforceMaster frontend planning.

It exists so future planner tasks can:

- reuse already-identified shared UI components
- avoid duplicating shell patterns under new names
- preserve `ui-shell` fidelity while still building clean production code
- know when something must stay screen-specific instead of being forced into a generic abstraction

## Source Of Truth

- Approved visual source: `ui-shell/src/components/`
- Machine-readable reuse map: `docs/design/ui-components-index.json`
- Screen-specific mapping docs in this folder

## Planner Rule

When a frontend planning task touches approved UI, read this folder before deciding component structure.

The planner must answer:

1. Does this visual pattern already exist in the mapping
2. Should the task reuse it, extend it, or create something new
3. Is the visible pattern truly shared, or only superficially similar

## Reuse Rules

### Reuse existing

Reuse an existing shared component when the approved pattern is visually identical in:

- layout
- spacing rhythm
- typography hierarchy
- shell treatment
- interaction model

### Extend existing

Extend an existing shared component only when the approved pattern stays part of the same visual system and the change does not create a second disguised component.

### Create new

Create a new component when the approved UI shows a distinct visual identity or behavior that would become awkward, conditional, or misleading if forced into an existing shared component.

### Do not generalize

If a section is unique enough that forced reuse would create fidelity drift, keep it screen-specific.

## Current Shared Seed

The first mapped shared system is the navbar from `ui-shell/src/components/CommandCenterNavbar.jsx`.

Current shared navbar components:

- `AppHeader`
- `BrandCluster`
- `WorkspaceSelector`
- `TeamsFilterPill`
- `WorkspaceTabs`
- `DateNavigator`
- `ThemeToggleButton`
- `LoginActionButton`

## Current Limits

- This system is seeded from the navbar only.
- KPI rails, context views, right rails, tables, and screen-specific cards are not mapped yet.
- Until those are mapped, planners should avoid inventing broad shared abstractions prematurely.

## Update Rule

When a planner identifies a new reusable approved UI pattern:

1. confirm it is actually shared across screens or slices
2. add it to `docs/design/ui-components-index.json`
3. document its visual contract in the relevant porting map
4. tell the coder to reuse that named component in future tasks

## Failure Modes To Avoid

- creating `AppNavbar`, `CommandNavbar`, and `ShellHeader` as three names for the same thing
- flattening unique UI into one generic card because it feels cleaner in code
- reusing a component that is only superficially similar and then drifting from `ui-shell`
- letting each task invent its own shared component list independently
