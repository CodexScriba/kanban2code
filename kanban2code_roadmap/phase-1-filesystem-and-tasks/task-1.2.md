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

## Audit Instructions
After completing this task, please update the [Phase 1 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/services/taskService.ts` - Task loading and management service
- **Tests Created**:
  - `tests/services/taskService.test.ts` - Vitest tests for task loading functionality

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.