---
stage: audit
tags:
  - refactor
  - p1
agent: coder
contexts: []
---

# Update Scaffolder for Agent Bundling

## Goal
Update the scaffolder to bundle and copy agent files to new workspaces.

## Definition of Done
- [x] Agent markdown files embedded in extension build
- [x] `scaffolder.ts` copies bundled agents to new workspaces
- [x] Existing agents preserved if already present (no overwrite)
- [x] `tests/scaffolder.test.ts` verifies agent scaffolding

## Context
This task updates the scaffolder to create `_agents/` directories in new workspaces and populate them with the bundled agent files. This ensures all workspaces have access to the standard agent definitions.

## Audit

src/assets/seed-content.ts
src/services/scaffolder.ts
tests/scaffolder.test.ts
