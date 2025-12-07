---
stage: plan
title: Implement workspace detection and validation
tags:
  - mvp
  - infra
  - validation
created: 2025-12-07T00:00:00Z
---

# Implement Workspace Detection and Validation

## Goal
Reliably locate `.kanban2code` and prevent unsafe file operations.

## Scope
- Implement `workspace/validation.ts`:
  - `findKanbanRoot(workspaceRoot)` to locate `.kanban2code`.
  - Guard against operations outside the kanban root.
- On missing `.kanban2code`:
  - Return null/false to indicate workspace needs scaffolding.
- Show clear error messages when the workspace is invalid.

## Notes
This is the single owner for detection logic; Phase 1 task 1.1.5 only layers status plumbing—avoid parallel implementations. Keeps Kanban2Code from accidentally touching unrelated parts of the repo and provides foundation for scaffolder to check if workspace exists.

## Audit Instructions
After completing this task, please update the [Phase 0 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task

Example format:
- **Files Created**:
  - `src/workspace/validation.ts` - Workspace detection and validation logic
