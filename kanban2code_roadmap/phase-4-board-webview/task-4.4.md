---
stage: plan
title: Sync filters and search between sidebar and board
tags:
  - mvp
  - ui
  - filters
  - board
created: 2025-12-07T00:00:00Z
---

# Sync Filters and Search Between Sidebar and Board

## Goal
Ensure sidebar filters and board views stay in sync so the user sees a consistent subset of tasks.

## Scope
- Share filter state (project, tags, stages) between sidebar and board via the extension host.
- When a quick view is selected in the sidebar, update the board automatically.
- Board search bar:
  - Filters tasks client-side without changing global filter state.

## Notes
This avoids cognitive dissonance between what the sidebar and board show.