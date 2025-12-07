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
This keeps Kanban2Code from accidentally touching unrelated parts of the repo and provides foundation for scaffolder to check if workspace exists.