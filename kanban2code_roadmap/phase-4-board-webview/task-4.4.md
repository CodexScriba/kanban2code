---
stage: plan
title: Sync filters and search between sidebar and board
tags:
  - mvp
  - ui
  - filters
  - board
created: 2025-12-07T00:00:00Z
---

# Sync Filters and Search Between Sidebar and Board

## Goal
Ensure sidebar filters and board views stay in sync so the user sees a consistent subset of tasks.

## Scope
- Share filter state (project, tags, stages) between sidebar and board via the extension host.
- When a quick view is selected in the sidebar, update the board automatically.
- Board search bar:
  - Filters tasks client-side without changing global filter state.

## Notes
This avoids cognitive dissonance between what the sidebar and board show.

## Audit Instructions
After completing this task, please update the [Phase 4 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/webview/stores/boardStore.ts` - Board state management
  - `src/webview/hooks/useBoardFilters.ts` - Filter synchronization logic
- **Tests Created**:
  - `tests/webview/stores/boardStore.test.ts` - Vitest tests for board state
  - `tests/webview/hooks/useBoardFilters.test.ts` - Vitest tests for filter sync

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.