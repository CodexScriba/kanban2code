---
stage: completed
tags:
  - refactor
  - p1
agent: coder
contexts: []
---

---
stage: audit
tags:
  - refactor
  - p1
agent: coder
contexts: []
---

# Handle Stage Templates Migration

## Goal
Decide on and implement the fate of stage templates in the new agent-driven workflow.

## Definition of Done
- [x] Decision made: embed stage context in agent instructions OR keep `_templates/stages/`
- [x] `context.ts` - `loadStageTemplate()` updated or removed
- [x] `prompt-builder.ts` - Stage template layer updated
- [x] Stage context available to agents via alternative mechanism

## Context
This task addresses a critical decision point: what to do with stage templates that are currently loaded by the prompt builder. The decision impacts how agents will receive stage-specific context in the new workflow.

## Decision
Stage templates are no longer loaded from `.kanban2code/_templates/stages/`. Stage context is provided via agent instructions and/or standard context layers. The `stage_template` prompt layer remains present but returns a minimal fallback string when no template exists.

## Validation
- `tests/scaffolder.test.ts` verifies `_templates/` is not scaffolded.
- `tests/prompt-builder.test.ts` verifies prompt assembly still works with the `stage_template` layer present.

## Audit
.kanban2code/projects/major-refactor/phase1-remove-template-system/task1.8-handle-stage-templates-migration.md
