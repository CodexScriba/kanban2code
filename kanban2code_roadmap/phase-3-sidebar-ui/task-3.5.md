---
stage: plan
title: Implement sidebar task context menus
tags:
  - mvp
  - ui
  - sidebar
  - actions
created: 2025-12-07T00:00:00Z
---

# Implement Sidebar Task Context Menus

## Goal
Enable core actions on tasks directly from the sidebar list.

## Scope
- On right-click of a task:
  - `Copy XML (Full Context)`.
  - `Change Stage ▸` (Inbox / Plan / Code / Audit / Completed).
  - `Mark Implementation Done` (only if `stage: code`).
  - `Move to Project/Phase…`.
  - `Archive` (only if `stage: completed`).
  - `Delete task` (with confirmation).
- After actions, refresh relevant parts of the UI.

## Notes
This is where your "Mark implementation done (Code → Audit only)" logic will live.