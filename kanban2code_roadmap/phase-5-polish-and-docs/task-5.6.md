---
stage: plan
title: Implement E2E tests for core workflows
tags:
  - mvp
  - testing
  - e2e
  - workflows
created: 2025-12-07T00:00:00Z
---

# Implement E2E Tests for Core Workflows

## Goal
Verify critical user workflows work end-to-end in real VS Code environment.

## Scope
- Create `tests/e2e/` using @vscode/test-electron:
  - Test workspace scaffolding workflow
  - Test task creation from sidebar
  - Test task creation from board
  - Test stage changes via drag-and-drop
  - Test copy XML context functionality
  - Test archive workflow
  - Test filter synchronization
- Set up test workspace fixtures
- Configure test data cleanup

## Notes
E2E tests catch integration issues that unit tests might miss, especially around VS Code APIs.