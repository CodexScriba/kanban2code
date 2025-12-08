---
stage: completed
title: Implement Kanban2Code sidebar shell
tags:
  - mvp
  - ui
  - sidebar
created: 2025-12-07T00:00:00Z
---

# Implement Kanban2Code Sidebar Shell

## Goal
Create the main sidebar view in VS Code that will host filters, quick views, and the task tree.

## Scope
- Register custom view `kanban2code.sidebar`.
- Render `<Sidebar />` React component with:
  - Title bar: "Kanban2Code".
  - Buttons:
    - `[Board]`
    - `[+ New Task]`
    - `⚙︎` for settings.
- Wire sidebar to task data from `taskService.loadAllTasks`.
- Support basic refresh when files change.

## Notes
No fancy filters yet; this is the structural foundation for later UI work.

## Audit Instructions
After completing this task, please update the [Phase 3 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/webview/Sidebar.tsx` - Main sidebar React component
  - `src/webview/SidebarProvider.ts` - Sidebar view provider
- **Tests Created**:
  - `tests/webview/Sidebar.test.tsx` - Vitest tests for sidebar component

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.