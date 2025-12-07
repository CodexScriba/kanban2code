---
stage: plan
title: Implement Inbox and project tree in sidebar
tags:
  - mvp
  - ui
  - sidebar
  - tasks
created: 2025-12-07T00:00:00Z
---

# Implement Inbox and Project Tree in Sidebar

## Goal
Render a clear tree of Inbox and Projects → Phases → Tasks matching the filesystem.

## Scope
- Inbox section:
  - Show filtered tasks from `inbox/`.
  - Display title, stage pill, key tags (1–3).
- Projects section:
  - Show project nodes.
  - Under each project, show phase nodes and direct tasks.
  - Badge counts of tasks per phase/project.
- Click task row → open markdown file in editor.

## Notes
This becomes your primary navigation surface for day-to-day work.