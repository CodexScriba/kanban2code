---
stage: plan
title: Implement copy modes and copy payload builder
tags:
  - mvp
  - context
  - clipboard
created: 2025-12-07T00:00:00Z
---

# Implement Copy Modes and Copy Payload Builder

## Goal
Support multiple copy modes while making "full XML context" the default.

## Scope
- Define `CopyMode` in `types/copy.ts`:
  - `'full_xml' | 'task_only' | 'context_only'`.
- Implement `copyService.buildCopyPayload(task, mode)`:
  - `full_xml` → 9-layer XML prompt.
  - `task_only` → task metadata + body.
  - `context_only` → system + context sections without task content.
- Keep API simple; UI will mainly use `full_xml`.

## Notes
Modes beyond `full_xml` are nice-to-have but valuable for future workflows.

## Audit Instructions
After completing this task, please update the [Phase 2 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/types/copy.ts` - Copy mode type definitions
  - `src/services/copyService.ts` - Copy payload builder implementation
- **Tests Created**:
  - `tests/services/copyService.test.ts` - Vitest tests for copy functionality

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.