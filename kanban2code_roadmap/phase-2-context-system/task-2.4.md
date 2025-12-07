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