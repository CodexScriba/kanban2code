---
stage: plan
title: Implement TaskCard component
tags:
  - mvp
  - ui
  - board
  - tasks
created: 2025-12-07T00:00:00Z
---

# Implement TaskCard Component

## Goal
Render individual tasks as Kanban cards with key information and actions.

## Scope
- `<TaskCard />` shows:
  - Title.
  - Project › Phase crumb (or "Inbox").
  - Tag row (1–3 tags, type-like tags visually distinct).
  - Optional stage pill.
- On hover:
  - `Copy XML`.
  - `Open` file.
  - `[…]` menu for other actions (Mark Implementation Done, Change Stage, Move, Archive, Delete).
- Keyboard shortcuts when a card is focused:
  - `C` → copy XML.
  - `Enter` → open file.
  - `1–5` → move to specific stage.

## Notes
This is the core visual unit of your board; keep it clean and readable.

## Audit Instructions
After completing this task, please update the [Phase 4 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/webview/components/TaskCard.tsx` - Task card component for board view
- **Tests Created**:
  - `tests/webview/components/TaskCard.test.tsx` - Vitest tests for task card rendering and interactions

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.