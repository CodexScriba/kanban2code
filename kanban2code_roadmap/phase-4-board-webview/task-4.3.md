---
stage: plan
title: Implement drag-and-drop stage changes
tags:
  - mvp
  - ui
  - board
  - dnd
created: 2025-12-07T00:00:00Z
---

# Implement Drag-and-Drop Stage Changes

## Goal
Allow tasks to be moved between stages via drag-and-drop on the board.

## Scope
- Enable dragging `TaskCard` between columns.
- On drop:
  - Send message to extension host to call `moveTaskToStage`.
  - Update UI state after successful write.
- Optional: support reordering within a column by updating `order:`.

## Notes
DnD should feel smooth but always respect filesystem-backed state.