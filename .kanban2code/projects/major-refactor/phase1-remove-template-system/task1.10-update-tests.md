---
stage: completed
tags:
  - test
  - p2
agent: react-dev
contexts: []
---

# Update Tests

## Goal
Remove template-related tests and update existing tests to work without templates.
When you're done update stage: code to stage: audit

## Definition of Done
- [x] `template-service.test.ts` deleted
- [x] `task-editor-modal.test.tsx` - Template tests removed
- [x] `scaffolder.test.ts` - No template assertions (no changes needed)
- [x] `context-service.test.ts` - Stage template tests updated
- [x] All remaining tests pass

## Context
This task cleans up the test suite by removing tests for template functionality and updating tests that may have dependencies on the template system.

## Audit
.kanban2code/projects/major-refactor/phase1-remove-template-system/task1.10-update-tests.md
src/services/archive.ts
src/services/fs-move.ts
src/services/stage-manager.ts
