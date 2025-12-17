---
stage: audit
tags:
  - refactor
  - p1
agent: coder
contexts: []
---

# Create Agent Templates in assets/agents.ts

## Goal
Create constants in assets/agents.ts containing bundled agent content.

## Definition of Done
- [x] `AGENT_ROADMAPPER` constant with full agent markdown
- [x] `AGENT_ARCHITECT` constant
- [x] `AGENT_SPLITTER` constant
- [x] `AGENT_PLANNER`, `AGENT_CODER`, `AGENT_AUDITOR` constants
- [x] Scaffolder uses these constants for agent creation

## Context
This task creates string constants for all agent content that can be bundled with the extension. This follows the same pattern as the existing templates.ts file but for agent content instead.

## Audit

src/assets/agents.ts
src/assets/seed-content.ts
src/services/scaffolder.ts
tests/scaffolder.test.ts
