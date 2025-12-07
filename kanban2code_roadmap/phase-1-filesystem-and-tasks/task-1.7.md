---
stage: plan
title: Implement integration tests for task loading
tags:
  - mvp
  - testing
  - filesystem
created: 2025-12-07T00:00:00Z
---

# Implement Integration Tests for Task Loading

## Goal
Ensure task loading works correctly across all folder structures and edge cases.

## Scope
- Create `tests/task-loading.test.ts` using Vitest:
  - Test loading from empty workspace
  - Test loading from inbox only
  - Test loading from projects with phases
  - Test loading from projects without phases
  - Test handling of _context.md exclusion
  - Test project/phase inference from paths
  - Test error handling for missing folders
  - Test with malformed task files

## Notes
Integration tests should use temporary test directories to avoid affecting real workspace.

## Audit Instructions
After completing this task, please update the [Phase 1 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `tests/task-loading.test.ts` - Vitest integration tests for task loading

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.