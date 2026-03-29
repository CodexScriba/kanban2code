# Navbar Porting Map

## Purpose

This document records the approved navbar structure from `ui-shell/src/components/CommandCenterNavbar.jsx` and the intended production component mapping.

The navbar is the first seeded shared UI system for WorkforceMaster.

## Source Reference

- `ui-shell/src/components/CommandCenterNavbar.jsx`

## Shared Navbar Contract

The production navbar must preserve:

- left, center, and right macro layout
- sticky header behavior
- compact shell density
- brand block plus workspace context cluster
- segmented workspace tabs
- centered date hero
- right-side utility actions and login button

This is a shared shell pattern and should not be reimplemented differently per workspace.

## Component Mapping

### AppHeader

- Role: top-level shared navbar container and layout owner
- Source: `CommandCenterNavbar`
- Production target: `frontend/src/components/shared/AppHeader.jsx`
- Notes: owns the three-zone layout and shared shell framing

### BrandCluster

- Role: logo, product wordmark, and command-center label cluster
- Source: left brand anchor and logo block
- Production target: `frontend/src/components/shared/AppHeader.jsx`
- Notes: keep visual hierarchy and density from the approved shell

### WorkspaceSelector

- Role: current workspace control shown beside the brand block
- Source: left workspace select cluster
- Production target: `frontend/src/components/shared/AppHeader.jsx`
- Notes: this is shared shell UI even if available options later differ by product state

### TeamsFilterPill

- Role: compact teams filter pill
- Source: left secondary filter pill
- Production target: `frontend/src/components/shared/AppHeader.jsx`
- Notes: currently shared structurally, but it is only rendered when the active workspace requires it

### WorkspaceTabs

- Role: segmented Historical, Forecast, and Agent switcher
- Source: mode switcher block
- Production target: `frontend/src/components/shared/AppHeader.jsx`
- Notes: keep segmented treatment and active-state styling consistent

### DateNavigator

- Role: previous button, centered date trigger, next button
- Source: centered date hero block
- Production target: `frontend/src/components/shared/AppHeader.jsx`
- Notes: this is the visual hero of the navbar and must not be reduced to a generic input

### ThemeToggleButton

- Role: theme mode icon action
- Source: right-side theme toggle button
- Production target: `frontend/src/components/shared/AppHeader.jsx`
- Notes: treat as a shared shell action

### LoginActionButton

- Role: right-side CTA button for login or agent view entry
- Source: right-side action button
- Production target: `frontend/src/components/shared/AppHeader.jsx`
- Notes: preserve shell prominence and button treatment

## Reuse Guidance

- Reuse these navbar components across Historical, Forecast, and Agent workspaces.
- Do not create alternate navbar component names for the same visual structure.
- If a workspace hides or disables one of these pieces, keep the same component and vary behavior through props or composition instead of creating a second navbar system.

## Do Not Generalize Beyond Evidence

- `GlassPill` and `NavArrow` exist in the vibe-coded source, but they are implementation helpers, not yet approved shared production primitives.
- Do not automatically promote every helper function from `ui-shell` into a named design-system primitive.
- Only map what is visually meaningful and stable across screens.
