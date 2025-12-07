---
stage: plan
title: Implement TaskCard component
tags:
  - mvp
  - ui
  - board
  - tasks
created: 2025-12-07T00:00:00Z
---

# Implement TaskCard Component

## Goal
Render individual tasks as Kanban cards with key information and actions.

## Scope
- `<TaskCard />` shows:
  - Title.
  - Project › Phase crumb (or "Inbox").
  - Tag row (1–3 tags, type-like tags visually distinct).
  - Optional stage pill.
- On hover:
  - `Copy XML`.
  - `Open` file.
  - `[…]` menu for other actions (Mark Implementation Done, Change Stage, Move, Archive, Delete).
- Keyboard shortcuts when a card is focused:
  - `C` → copy XML.
  - `Enter` → open file.
  - `1–5` → move to specific stage.

## Notes
This is the core visual unit of your board; keep it clean and readable.