---
stage: plan
tags: [feature, p1]
agent: planner
contexts: []
---

# Extension Entry Point + Command Registration

## Goal
extension.ts is clean, minimal, wires everything together. Commands work from the Command Palette.

## Definition of Done
- [ ] All four commands appear in Command Palette and execute without errors. Task watcher fires, workspace snapshot rebuilds, sidebar receives WorkspaceUpdated.

## Files
- `src/extension.ts` - create - rewrite
- `src/commands/index.ts` - create - registerCommands