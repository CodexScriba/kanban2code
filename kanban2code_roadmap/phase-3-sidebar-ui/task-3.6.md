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
