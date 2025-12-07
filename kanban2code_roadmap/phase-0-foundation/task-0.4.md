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
    - `id` (stable identifier, e.g., derived from file path), `filePath`, `title`, `stage`, `project?`, `phase?`, `agent?`,
      `parent?`, `tags?`, `contexts?`, `order?`, `created?`, `content`.
    - `parent?`: Optional link to another task (used by follow-ups/dependencies).
    - `order?`: Optional floating-point for manual ordering within a stage (default: sort by created date)
- In `core/constants.ts`:
  - `STAGES` array in order.
  - Folder names for `inbox`, `projects`, `_archive`, etc.
- Ensure all services and UI components use these shared types.

## Notes
This should be the single source of truth for task-related typing in Kanban2Code.

## Audit Instructions
After completing this task, please update the [Phase 0 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task

Example format:
- **Files Created**:
  - `src/types/task.ts` - Core type definitions for tasks and stages
  - `src/core/constants.ts` - Shared constants for the application
