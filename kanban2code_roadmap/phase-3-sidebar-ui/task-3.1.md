---
stage: plan
title: Implement Kanban2Code sidebar shell
tags:
  - mvp
  - ui
  - sidebar
created: 2025-12-07T00:00:00Z
---

# Implement Kanban2Code Sidebar Shell

## Goal
Create the main sidebar view in VS Code that will host filters, quick views, and the task tree.

## Scope
- Register custom view `kanban2code.sidebar`.
- Render `<Sidebar />` React component with:
  - Title bar: "Kanban2Code".
  - Buttons:
    - `[Board]`
    - `[+ New Task]`
    - `⚙︎` for settings.
- Wire sidebar to task data from `taskService.loadAllTasks`.
- Support basic refresh when files change.

## Notes
No fancy filters yet; this is the structural foundation for later UI work.