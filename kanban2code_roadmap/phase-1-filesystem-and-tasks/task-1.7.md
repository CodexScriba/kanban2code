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