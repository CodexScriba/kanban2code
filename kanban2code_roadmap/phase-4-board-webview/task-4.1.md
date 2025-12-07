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

## Audit Instructions
After completing this task, please update the [Phase 4 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/webview/Board.tsx` - Main board React component
  - `src/webview/components/BoardColumn.tsx` - Column component for stages
- **Tests Created**:
  - `tests/webview/Board.test.tsx` - Vitest tests for board layout
  - `tests/webview/components/BoardColumn.test.tsx` - Vitest tests for column rendering

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.