---
stage: plan
title: Define webview architecture and messaging protocol
tags:
  - mvp
  - infra
  - webview
  - architecture
created: 2025-12-07T00:00:00Z
---

# Define Webview Architecture and Messaging Protocol

## Goal
Establish foundation for React webviews with proper state management and host communication.

## Scope
- Define message types for host ↔ webview communication:
  - TaskUpdated, TaskSelected, FilterChanged, etc.
  - Request types: CreateTask, MoveTask, CopyContext.
- Add a versioned envelope (e.g., `{version, type, payload}`) and runtime validation (zod/io-ts) for all messages to prevent silent schema drift.
- Set up React state management with Zustand:
  - Create stores for tasks, filters, UI state.
  - Define actions and selectors.
- Create base component library:
  - Button, Modal, Tree, Card components.
  - Use shadcn/ui for consistent styling.
- Establish CSS/styling approach:
  - Tailwind CSS for utility classes.
  - CSS-in-JS for component-specific styles.
- Define webview initialization pattern:
  - Consistent setup for sidebar and board webviews.
  - Message handling registration with validation.

## Notes
This provides the foundation that both Phase 3 (sidebar) and Phase 4 (board) will build upon.

## Audit Instructions
After completing this task, please update the [Phase 1 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/webview/messaging.ts` - Message protocol between host and webview
  - `src/webview/stores/` - Zustand stores for state management
  - `src/webview/components/` - Base component library
- **Tests Created**:
  - `tests/webview/messaging.test.ts` - Vitest tests for messaging protocol
  - `tests/webview/stores/` - Vitest tests for state management

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.
