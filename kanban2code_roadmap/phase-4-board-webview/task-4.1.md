---
stage: plan
title: Implement Board layout and data flow
tags:
  - mvp
  - ui
  - board
created: 2025-12-07T00:00:00Z
---

# Implement Board Layout and Data Flow

## Goal
Create the main Kanban board webview with 5 stage columns.

## Scope
- Implement `<Board />` React component:
  - Columns: Inbox, Plan, Code, Audit, Completed.
  - Each column shows tasks filtered by stage + global filters.
- Top bar:
  - Search box.
  - `[+ New Task]` (reusing task creation flow).
  - Filter controls synced with sidebar (via host messaging).
- Wire board to extension host for task data loading.

## Notes
This view powers your mixed "see everything at once" workflow.