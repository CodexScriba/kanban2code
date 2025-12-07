---
stage: plan
title: Implement archive behavior for tasks and projects
tags:
  - mvp
  - filesystem
  - archive
created: 2025-12-07T00:00:00Z
---

# Implement Archive Behavior for Tasks and Projects

## Goal
Support explicit archive actions that move files into `_archive/` while preserving structure.

## Scope
- Implement `archiveTask(task, root)`:
  - Only allow if `stage: 'completed'`.
  - Move:
    - Inbox tasks → `_archive/inbox/{filename}`
    - Project/phase tasks → `_archive/projects/{project}/{phase?}/{filename}`
- Implement `archiveProject(root, projectName)`:
  - Move entire `projects/{project}` into `_archive/projects/{project}`.
- Add commands:
  - `Archive Task`
  - `Archive Completed in Project`
  - `Archive Project`

## Notes
Archiving is a deliberate closure ritual, not automatic cleanup.