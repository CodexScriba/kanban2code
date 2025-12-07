---
stage: plan
title: Implement keyboard shortcuts and command palette entries
tags:
  - mvp
  - polish
  - shortcuts
created: 2025-12-07T00:00:00Z
---

# Implement Keyboard Shortcuts and Command Palette Entries

## Goal
Make common actions fast via keyboard and easily discoverable.

## Scope
- Define keybindings, for example:
  - Toggle board.
  - Focus Kanban2Code sidebar.
  - New task.
  - Copy XML for current task.
  - Mark implementation done.
- Ensure all actions are also available via the command palette:
  - `Kanban2Code: New Task`
  - `Kanban2Code: Copy XML for Current Task`
  - `Kanban2Code: Mark Implementation Done`
  - etc.

## Notes
This supports your desire to "execute without touching the UI" once tasks are queued.