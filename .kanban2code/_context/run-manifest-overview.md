---
name: K2C Run Manifest Overview Contract
description: Shared artifact contract for packaging each Kanban2Code run into a durable overview.
scope: global
created: 2026-06-27
---

# K2C Run Manifest / Overview Contract

Every K2C task/run should preserve a compact overview artifact as it moves through intake, planning, coding, verification, goal closure, audit, and handoff. This is not product behavior; it is the workflow package that lets Dan, Kay, Ron, and downstream agents see the same state without replaying the whole run.

## Required Fields

Use this exact field set wherever a stage creates or updates a run overview:

- Task
- Stage
- Role
- Model lane
- Worktree
- Branch
- Inputs/context bundle
- Outputs/artifacts
- Success criteria / acceptance criteria
- Gate results
- Verification commands/results
- Deferrals / next directions
- Handoff/mailbox status

## Stage Responsibilities

- Scout/intake records the task, current stage, role, source context bundle, obvious worktree or branch constraints, and any mailbox/handoff blocker.
- Planner records the mechanical plan inputs, success or acceptance criteria, model lane expectation, scope boundaries, and downstream verification commands.
- Verifier, when present, records plan gate results, findings, and whether the plan can advance.
- Coder records changed outputs/artifacts, verification commands/results, deferrals, and the next gate.
- Goalkeeper, when present, records success-criteria gate results and any next directions for code or plan rework.
- Auditor records quality gate results, rating/verdict, verification evidence, documentation status, and handoff/mailbox status.
- Orchestrator/Ron-facing summaries record the latest field values and link to task files, logs, diffs, reports, and human handoff artifacts instead of duplicating full content.

## Output Location

Prefer updating an existing `## K2C Run Manifest / Overview` section in the task file. If the task file does not have that section yet, append it near the stage's report section. Runtime summaries and human handoff files may include a shorter `## K2C Run Manifest / Overview` that links back to the task section.

Do not paste secrets into the manifest. Use paths, command names, verdicts, and short evidence summaries.
