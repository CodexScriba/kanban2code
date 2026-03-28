---
stage: inbox
agent: conversational
bounces: 0
tags:
  - agent-rules
  - workflow
  - planner
  - auditor
created: 2026-03-13
updated: 2026-03-13
---

# Agent rules and pain points observed during orchestration

## Goal
Capture real workflow pain points noticed while using Kanban2Code with planners, coders, and auditors so the agent instructions and product behavior can be improved.

## Core observations
- Shorter tasks tend to execute more smoothly and get fewer auditor returns.
- Large long-running tasks are easier to manage on the board, but they drift more, fail audits more often, and are harder to diagnose when things go wrong.
- More tasks create more board movement, but make failures easier to isolate and recover from.
- With orchestrator in the loop, the pain of moving many tasks is less important than execution quality.

## Planner pain points / rules
- The planner must always update the task frontmatter when it finishes.
- This stage transition must be explicit, not implied.
- Required transition rule:
  - `plan` -> `code`
- Planner instructions should explicitly remind the agent that stage moves are mandatory system behavior, not just documentation.
- Planner should gather real repo context, not just restate the task.
- Planner should be judged on whether it produces a coder-ready brief with:
  - refined prompt
  - scoped file tree
  - code excerpts
  - dependency graph
  - scope boundaries

## Coder pain points / rules
- If a task is returned for rework, the coder must move it back from:
  - `code` -> `audit`
  when the fixes are complete.
- This should be explicit in coder guidance, not assumed.
- Long coding tasks are more likely to forget details and be returned by audit.

## Auditor pain points / rules
- Auditor must always end with an explicit stage move.
- Required transition rule:
  - `audit` -> `completed` on pass
  - `audit` -> `code` on rework
- Auditor instructions should also mention that if the task is re-coded later, it must return from:
  - `code` -> `audit`
  before the next audit.
- Auditor should not leave tasks in ambiguous audit state after review.

## Product / workflow implications
- Kanban2Code should keep task granularity moderate rather than merging too many tasks into giant mega-tasks.
- Agent instructions should emphasize state transitions as first-class workflow actions.
- Missing stage changes are one of the most damaging workflow failures because they break orchestration trust.
- Future UI/product behavior should surface stage-transition mistakes clearly.

## Candidate follow-ups
- Update coder agent text to make `code` -> `audit` mandatory and explicit.
- Add validation/guardrails so a stage cannot silently remain wrong after an agent run.
- Consider warnings when review content exists but frontmatter did not transition.
- Consider warnings when planner/coder/auditor output looks complete but the task was not moved.
