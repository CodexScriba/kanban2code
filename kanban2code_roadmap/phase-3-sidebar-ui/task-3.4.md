---
stage: plan
title: Implement New Task modal
tags:
  - mvp
  - ui
  - tasks
  - creation
created: 2025-12-07T00:00:00Z
---

# Implement New Task Modal

## Goal
Provide a rich task creation flow that defaults to Inbox-first but supports projects/phases.

## Scope
- `<TaskModal />` with fields:
  - Location: Inbox or Project.
  - If Project: project + optional phase selection.
  - Title (required).
  - Stage (default `inbox`).
  - Agent (dropdown from `_agents/`).
  - Tags (free-text with chips).
  - Template (optional, from `_templates/tasks/`).
- On submit:
  - Generate filename: `{timestamp}-{slug(title)}.md`.
  - Apply selected template to build frontmatter + body.
  - Write file into appropriate folder.
  - Reload tasks.

## Notes
This should reflect your "I don't mind filling the form if it captures my thinking" preference.