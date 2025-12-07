---
stage: plan
title: Implement keyboard navigation for accessibility (webview focus)
tags:
  - mvp
  - ui
  - accessibility
  - keyboard
created: 2025-12-07T00:00:00Z
---

# Implement Keyboard Navigation for Accessibility

## Goal
Enable full keyboard navigation within the webviews (sidebar + board) for power users and accessibility, while coordinating with global keybindings defined in task 5.1.

## Scope
- Define keyboard shortcuts for sidebar:
  - Navigate between sections (Inbox, Projects, Filters)
  - Focus task list with Ctrl+Shift+F
  - Create new task with Ctrl+N
- Define keyboard shortcuts for board:
  - Navigate between columns with Tab/Shift+Tab
  - Focus next/previous task with Arrow keys
  - Move focused task with Enter (edit) or Space (stage change)
  - Copy XML context with Ctrl+C
- Implement modal keyboard handling:
  - Escape to close modals
  - Enter to confirm actions
  - Arrow keys for navigation
- Add keyboard shortcut help overlay (? key)
- Ensure all keyboard actions work with screen readers

## Notes
- Limit to in-webview behavior (focus management, ARIA, modal handling). Global VS Code keybindings and command registrations live in task 5.1; keep scopes non-overlapping.
- Keyboard navigation should be consistent across all UI components and follow VS Code extension patterns.


## Audit Instructions
After completing this task, please update the [Phase 3 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/webview/hooks/useKeyboardNavigation.ts` - Keyboard navigation hooks
  - `src/webview/components/KeyboardHelp.tsx` - Keyboard shortcut help overlay
- **Tests Created**:
  - `tests/webview/hooks/useKeyboardNavigation.test.ts` - Vitest tests for keyboard navigation

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.
