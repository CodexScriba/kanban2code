---
stage: completed
title: Implement Inbox and project tree in sidebar
tags:
  - mvp
  - ui
  - sidebar
  - tasks
created: 2025-12-07T00:00:00Z
---

# Implement Inbox and Project Tree in Sidebar

## Goal
Render a clear tree of Inbox and Projects → Phases → Tasks matching the filesystem.

## Scope
- Inbox section:
  - Show filtered tasks from `inbox/`.
  - Display title, stage pill, key tags (1–3).
- Projects section:
  - Show project nodes.
  - Under each project, show phase nodes and direct tasks.
  - Badge counts of tasks per phase/project.
- Click task row → open markdown file in editor.

## Notes
This becomes your primary navigation surface for day-to-day work.

## Audit Instructions
After completing this task, please update the [Phase 3 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/webview/components/TaskTree.tsx` - Task tree component
  - `src/webview/components/TaskItem.tsx` - Individual task item component
- **Tests Created**:
  - `tests/webview/components/TaskTree.test.tsx` - Vitest tests for task tree rendering

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.