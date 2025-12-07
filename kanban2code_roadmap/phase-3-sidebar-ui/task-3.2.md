---
stage: plan
title: Implement filters and quick views in sidebar
tags:
  - mvp
  - ui
  - filters
created: 2025-12-07T00:00:00Z
---

# Implement Filters and Quick Views in Sidebar

## Goal
Let the user constrain visible tasks by project, tags, and stage, and expose preset "quick views".

## Scope
- Filters:
  - Project dropdown: All, Inbox only, each project.
  - Tag chips: multi-select tags (e.g. `bug`, `idea`, `roadmap`).
  - Stage toggles: Inbox / Plan / Code / Audit / Completed.
- Quick Views mapped to presets, such as:
  - Today's Focus (Plan + Code + Audit).
  - All In Development (Plan + Code + Audit, all projects).
  - Bugs (tag `bug`).
  - Ideas & Roadmaps (tags `idea` or `roadmap`).
- Ensure filter state is accessible to the board view later.

## Notes
These filters drive your "show me everything, but sliced how I want" workflow.

## Audit Instructions
After completing this task, please update the [Phase 3 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/webview/components/FilterPanel.tsx` - Filter UI components
  - `src/webview/stores/filterStore.ts` - Filter state management
- **Tests Created**:
  - `tests/webview/components/FilterPanel.test.tsx` - Vitest tests for filter functionality

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.