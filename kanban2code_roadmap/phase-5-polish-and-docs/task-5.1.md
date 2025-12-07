---
stage: plan
title: Implement keyboard shortcuts and command palette entries (global bindings)
tags:
  - mvp
  - polish
  - shortcuts
created: 2025-12-07T00:00:00Z
---

# Implement Keyboard Shortcuts and Command Palette Entries

## Goal
Make common actions fast via keyboard and easily discoverable at the VS Code level, building on in-webview navigation from task 3.6.

## Scope
- Define VS Code-level keybindings, for example:
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
- Keep in-webview focus rules and ARIA behavior in task 3.6; avoid duplicating that work here.

## Notes
This supports your desire to "execute without touching the UI" once tasks are queued. Coordinate with task 3.6 so global shortcuts cooperate with in-webview navigation.
