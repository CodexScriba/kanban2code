---
stage: plan
title: Define core types and constants
tags:
  - mvp
  - infra
  - types
  - model
created: 2025-12-07T00:00:00Z
---

# Define Core Types and Constants

## Goal
Create a shared type system and constants for tasks, stages, and copy modes used across extension, services, and UI.

## Scope
- In `types/task.ts`:
  - Define `Stage = 'inbox' | 'plan' | 'code' | 'audit' | 'completed'`.
  - Define `Task` interface with:
    - `filePath`, `title`, `stage`, `project?`, `phase?`, `agent?`,
      `tags?`, `contexts?`, `order?`, `created?`, `content`.
    - `order?`: Optional floating-point for manual ordering within a stage (default: sort by created date)
- In `core/constants.ts`:
  - `STAGES` array in order.
  - Folder names for `inbox`, `projects`, `_archive`, etc.
- Ensure all services and UI components use these shared types.

## Notes
This should be the single source of truth for task-related typing in Kanban2Code.