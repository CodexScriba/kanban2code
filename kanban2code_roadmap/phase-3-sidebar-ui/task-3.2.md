---
stage: plan
title: Implement filters and quick views in sidebar
tags:
  - mvp
  - ui
  - filters
created: 2025-12-07T00:00:00Z
---

# Implement Filters and Quick Views in Sidebar

## Goal
Let the user constrain visible tasks by project, tags, and stage, and expose preset "quick views".

## Scope
- Filters:
  - Project dropdown: All, Inbox only, each project.
  - Tag chips: multi-select tags (e.g. `bug`, `idea`, `roadmap`).
  - Stage toggles: Inbox / Plan / Code / Audit / Completed.
- Quick Views mapped to presets, such as:
  - Today's Focus (Plan + Code + Audit).
  - All In Development (Plan + Code + Audit, all projects).
  - Bugs (tag `bug`).
  - Ideas & Roadmaps (tags `idea` or `roadmap`).
- Ensure filter state is accessible to the board view later.

## Notes
These filters drive your "show me everything, but sliced how I want" workflow.