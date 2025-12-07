---
stage: plan
title: Integrate copy-with-context with VS Code clipboard
tags:
  - mvp
  - context
  - clipboard
created: 2025-12-07T00:00:00Z
---

# Integrate Copy-With-Context with VS Code Clipboard

## Goal
Make "Copy XML (Full Context)" a one-click action that fills the clipboard.

## Scope
- Implement `kanban2code.copyTaskContext` command:
  - Accepts task identifier + `CopyMode`.
  - Uses `copyService.buildCopyPayload`.
  - Writes result to VS Code clipboard API.
- Show a toast or VS Code notification on success:
  - "Copied full XML context for '{title}'."
- Handle errors gracefully.

## Notes
This is one of the most-used actions; it should feel instant and reliable.

## Audit Instructions
After completing this task, please update the [Phase 2 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/commands/copyTaskContext.ts` - Command handler for copy functionality
- **Tests Created**:
  - `tests/commands/copyTaskContext.test.ts` - Vitest tests for copy command

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.