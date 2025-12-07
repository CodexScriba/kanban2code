---
stage: plan
title: Implement file watcher for task changes
tags:
  - mvp
  - filesystem
  - watcher
  - events
created: 2025-12-07T00:00:00Z
---

# Implement File Watcher for Task Changes

## Goal
Keep UI in sync with filesystem changes and enable real-time updates.

## Scope
- Implement FileSystemWatcher for `.kanban2code`:
  - Watch for file creation, modification, deletion.
  - Watch for file moves and renames.
  - Ignore non-task paths: `_templates/`, `_agents/`, `_archive/`, any `_context.md`, and non-`.md` files.
- Debounce rapid changes (300ms) to avoid excessive updates:
  - Batch multiple rapid changes into single update.
  - Reset debounce timer on each change.
- Emit events for:
  - Task created (new .md file in task locations).
  - Task updated (existing .md file modified).
  - Task deleted ( .md file removed).
  - Task moved (file renamed between folders).
- Handle external edits:
  - User edits in VS Code editor.
  - Git operations (checkout, merge, rebase).
- Integrate with task loading service to refresh data.

## Notes
File watching is critical for responsive UI; must handle edge cases like rapid saves and external tool modifications.

## Audit Instructions
After completing this task, please update the [Phase 1 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/services/fileWatcher.ts` - File system watcher implementation
- **Tests Created**:
  - `tests/services/fileWatcher.test.ts` - Vitest tests for file watching functionality

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.
