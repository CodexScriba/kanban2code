---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode]
---

# RunnerEngine — CLI process spawning + terminal integration

## Goal

Create a runner engine that spawns CLI processes in VS Code terminals, streams output in real-time, and manages task stage updates on completion.

## Definition of Done

- [ ] Reads provider config from `.kanban2code/_providers/<name>.md`
- [ ] Builds CLI command from provider config (cli, model, flags)
- [ ] Spawns process in VS Code terminal (visible to user, per spec §4.4)
- [ ] Streams output to terminal in real-time
- [ ] On completion: updates task stage, logs telemetry, dequeues next
- [ ] `Run Stage`: executes current stage only
- [ ] `Run All Stages`: serialized pipeline (one stage completes before next starts)
- [ ] Respects `max parallel runs` setting (default 1)

## Files

- `src/services/runner-engine.ts` - create - process spawning and lifecycle
- `src/services/telemetry-logger.ts` - modify - add run event logging

## Tests

- [ ] Correct CLI command built from provider config
- [ ] Terminal created and visible
- [ ] Task stage updated on success
- [ ] Failed run transitions to `failed` state
- [ ] Serialized pipeline runs stages in order

## Context

RunnerEngine is responsible for executing tasks by spawning CLI processes in VS Code terminals.

Provider config reading:
- Read from `.kanban2code/_providers/<name>.md`
- Extract: cli, model, flags, endpoint, API key
- Use FrontmatterService for parsing

CLI command building:
- Base command from provider config
- Add model flag
- Add any additional flags
- Include task context as prompt input

Terminal integration:
- Use VS Code's `window.createTerminal()` API
- Terminal must be visible to user (per spec §4.4)
- Stream output in real-time as process runs
- Terminal name should indicate task being run

Execution modes:
- `Run Stage`: Execute only the current stage
- `Run All Stages`: Execute all stages in serialized order (one completes before next starts)

Completion handling:
- On success: update task stage to next stage, log telemetry, dequeue next task
- On failure: update task stage to `failed`, log error, stop pipeline
- On cancel: update task stage to `cancelled`, log cancellation

Parallel execution:
- Respect `max parallel runs` setting from SettingsService
- Default to 1 (sequential execution)
- QueueService manages concurrent run limits

Telemetry logging:
- Log run start, completion, failure, cancellation
- Include: taskId, stage, provider, model, duration, outcome
- Write to `.kanban2code/_logs/` via TelemetryLogger
