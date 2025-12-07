---
stage: plan
title: Implement webview component tests
tags:
  - mvp
  - testing
  - ui
  - board
created: 2025-12-07T00:00:00Z
---

# Implement Webview Component Tests

## Goal
Ensure board webview components render correctly and handle user interactions properly.

## Scope
- Create `tests/board.test.tsx` using Vitest + React Testing Library:
  - Test TaskCard component rendering
  - Test board column rendering
  - Test drag-and-drop functionality
  - Test filter application
  - Test search functionality
  - Test context menu actions
- Create `tests/sidebar.test.tsx`:
  - Test sidebar tree rendering
  - Test filter controls
  - Test task selection
- Mock VS Code APIs for testing
- Test webview message passing

## Notes
Component tests should catch UI regressions before they reach users.