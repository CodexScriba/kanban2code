---
stage: plan
title: Implement recursive task loading
tags:
  - mvp
  - filesystem
  - tasks
  - loader
created: 2025-12-07T00:00:00Z
---

# Implement Recursive Task Loading

## Goal
Load all tasks from `.kanban2code` into memory with the correct `project` and `phase` inferred.

## Scope
- Implement `taskService.loadAllTasks(root): Promise<Task[]>`:
  - Load `inbox/*.md`.
  - For each project in `projects/`:
    - Load direct tasks under `projects/{project}/*.md` (excluding `_context.md`).
    - Load phase tasks under `projects/{project}/{phase}/*.md` (excluding `_context.md`).
- Note: Consider renaming `_context.md` to `_project.md` to avoid confusion with potential tasks named "context".
- Set:
  - `task.project` based on project folder.
  - `task.phase` based on phase folder (or `null`).
- Ensure function is resilient to missing folders and empty states.

## Notes
This will drive both sidebar and board views, so correctness is crucial.