---
stage: audit
tags:
  - refactor
  - p1
agent: react-dev
contexts: []
---

# Remove Template Command

## Goal
Remove the template creation command from the extension.

## Definition of Done
- [x] `kanban2code.newTemplate` command removed from `commands/index.ts`
- [x] Command removed from `package.json` contributions
- [x] Keybinding removed if exists

## Context
This task removes the command that allows users to create new templates. This command is no longer needed in the agent-driven workflow.

## Audit
.kanban2code/projects/major-refactor/phase1-remove-template-system/task1.6-remove-template-command.md
src/commands/index.ts
