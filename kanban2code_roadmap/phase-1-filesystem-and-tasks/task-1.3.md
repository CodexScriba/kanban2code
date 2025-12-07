---
stage: plan
title: Implement stage update service
tags:
  - mvp
  - filesystem
  - stages
created: 2025-12-07T00:00:00Z
---

# Implement Stage Update Service

## Goal
Allow stages to change by updating frontmatter only, without moving files.

## Scope
- Implement `taskMoveService.moveTaskToStage(task, newStage)` with transition guards:
  - Read file, update `stage` in frontmatter, write back.
  - Enforce allowed transitions (e.g., Code → Audit via "Mark Implementation Done"; Completed only to Archive; disallow regressions unless explicitly allowed).
- Provide a higher-level helper for the UI:
  - `changeStageAndReload(taskId, newStage)` to refresh board/sidebar state.
- Ensure invalid stage values are avoided (only use known `Stage` values) and return explicit errors for disallowed transitions.

## Notes
This is the core of Kanban behavior; keep it simple and reliable.

## Audit Instructions
After completing this task, please update the [Phase 1 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/services/taskMoveService.ts` - Stage transition and task movement service
- **Tests Created**:
  - `tests/services/taskMoveService.test.ts` - Vitest tests for stage transitions

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.
