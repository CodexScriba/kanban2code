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
