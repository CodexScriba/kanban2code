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

## Audit Instructions
After completing this task, please update the [Phase 1 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/services/archiveService.ts` - Archive functionality for tasks and projects
  - `src/commands/archiveCommands.ts` - Command handlers for archive operations
- **Tests Created**:
  - `tests/services/archiveService.test.ts` - Vitest tests for archive functionality
  - `tests/commands/archiveCommands.test.ts` - Vitest tests for archive commands

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.