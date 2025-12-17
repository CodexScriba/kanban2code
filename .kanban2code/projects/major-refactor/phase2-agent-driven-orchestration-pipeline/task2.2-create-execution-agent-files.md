---
stage: audit
tags:
  - feature
  - p1
agent: opus
contexts: []
---

# Create Execution Agent Files

## Goal
Create three execution agent files that handle the 5-stage workflow for tasks.

## Definition of Done
- [x] `.kanban2code/_agents/planner.md` created (stage: plan)
- [x] `.kanban2code/_agents/coder.md` created (stage: code)
- [x] `.kanban2code/_agents/auditor.md` created (stage: audit)
- [x] Each agent has: role, stage, quality criteria, output format

## Context
This task creates execution agents that work on tasks in specific stages:
- Planner: Refines tasks and gathers context (stage: plan)
- Coder: Implements code and features (stage: code)
- Auditor: Reviews code and assigns quality ratings (stage: audit)

## Audit

.kanban2code/_agents/planner.md
.kanban2code/_agents/coder.md
.kanban2code/_agents/auditor.md
