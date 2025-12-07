---
stage: plan
title: Implement drag-and-drop stage changes
tags:
  - mvp
  - ui
  - board
  - dnd
created: 2025-12-07T00:00:00Z
---

# Implement Drag-and-Drop Stage Changes

## Goal
Allow tasks to be moved between stages via drag-and-drop on the board.

## Scope
- Enable dragging `TaskCard` between columns.
- On drop:
  - Send message to extension host to call `moveTaskToStage`.
  - Update UI state after successful write.
- Optional: support reordering within a column by updating `order:`.

## Notes
DnD should feel smooth but always respect filesystem-backed state.

## Audit Instructions
After completing this task, please update the [Phase 4 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/webview/hooks/useDragAndDrop.ts` - Drag and drop functionality for board
  - `src/webview/components/DraggableTaskCard.tsx` - Enhanced task card with drag support
- **Tests Created**:
  - `tests/webview/hooks/useDragAndDrop.test.ts` - Vitest tests for drag and drop behavior

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.