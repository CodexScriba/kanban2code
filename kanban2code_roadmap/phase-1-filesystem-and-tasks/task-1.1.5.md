---
stage: plan
title: Implement workspace detection and validation (extends phase-0 task)
tags:
  - mvp
  - infra
  - validation
created: 2025-12-07T00:00:00Z
---

# Implement Workspace Detection and Validation (Extension)

## Goal
Reuse the phase-0 workspace detection while adding Phase 1-specific outputs (status codes and guardrails). Avoid duplicating the core implementation tracked in `phase-0-foundation/task-0.5.md`.

## Scope
- Depend on the core detection from `task-0.5`; do not fork implementation.
- Extend API to return explicit status enums (valid | missing | invalid | forbidden).
- Provide helper guards used by filesystem services to block writes outside the kanban root.
- Emit consistent error strings for UI surfaces (sidebar, board, commands) without reimplementing detection logic.

## Notes
Single-owner check: any detection fixes belong in `task-0.5`; this task only layers additional status plumbing for Phase 1 features.
