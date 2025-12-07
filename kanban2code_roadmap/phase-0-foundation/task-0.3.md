---
stage: plan
title: Implement .kanban2code workspace scaffolder
tags:
  - mvp
  - infra
  - filesystem
  - scaffolding
created: 2025-12-07T00:00:00Z
---

# Implement `.kanban2code` Workspace Scaffolder

## Goal
Provide a one-shot command that generates the canonical `.kanban2code` folder with all required subfolders and seed files.

## Scope
- Create `.kanban2code` with:
  - `inbox/`
  - `projects/`
  - `_agents/`
  - `_templates/stages/`
  - `_templates/tasks/`
  - `_archive/`
- Create seed files:
  - `how-it-works.md`
  - `architecture.md`
  - `project-details.md`
  - `_agents/opus.md` (and optionally `sonnet.md`, `codex.md`)
  - `_templates/stages/inbox.md`, `code.md`, `plan.md`, `audit.md`, `completed.md`
  - `_templates/tasks/bug.md` (and optionally feature/spike)
  - `.gitignore` ignoring `_archive/`
  - A sample inbox task.
- Wire command `kanban2code.scaffoldWorkspace` with a friendly success/error message.
- Use workspace detection from task 0.5 to check if `.kanban2code` exists before scaffolding.

## Notes
This is the "first run" experience: should only be called when workspace detection confirms `.kanban2code` is missing.