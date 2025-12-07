---
stage: plan
title: Implement sidebar task context menus
tags:
  - mvp
  - ui
  - sidebar
  - actions
created: 2025-12-07T00:00:00Z
---

# Implement Sidebar Task Context Menus

## Goal
Enable core actions on tasks directly from the sidebar list.

## Scope
- On right-click of a task:
  - `Copy XML (Full Context)`.
  - `Change Stage ▸` (Inbox / Plan / Code / Audit / Completed).
  - `Mark Implementation Done` (only if `stage: code`).
  - `Move to Project/Phase…`.
  - `Archive` (only if `stage: completed`).
  - `Delete task` (with confirmation).
- After actions, refresh relevant parts of the UI.

## Notes
This is where your "Mark implementation done (Code → Audit only)" logic will live.

## Audit Instructions
After completing this task, please update the [Phase 3 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/webview/components/ContextMenu.tsx` - Context menu component for tasks
  - `src/webview/hooks/useContextMenu.ts` - Hook for context menu functionality
- **Tests Created**:
  - `tests/webview/components/ContextMenu.test.tsx` - Vitest tests for context menu

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.