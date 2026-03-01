---
agent: auditor
stage: completed
tags: [feature, p1]
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

## Refined Prompt

Objective: Create a RunnerEngine service that spawns CLI processes in VS Code terminals, manages execution lifecycle, and handles task stage transitions.

Implementation approach:
1. Create `src/services/runner-engine.ts` with RunnerEngine class
2. Add provider config reading using FrontmatterService pattern
3. Implement CLI command builder from provider config + task metadata
4. Implement terminal spawning via VS Code `window.createTerminal()` API
5. Add process lifecycle management (start, monitor, completion)
6. Implement stage transition logic (plan→code→audit→completed)
7. Integrate with QueueService for dequeue on completion
8. Add telemetry logging for run events
9. Implement serialized pipeline execution for `Run All Stages`
10. Write comprehensive unit tests

Key decisions:
- Terminal per task: Each task gets its own named terminal for visibility
- VS Code Terminal API: Required by spec §4.4 for execution transparency
- Provider config in markdown: Reuse existing frontmatter parsing pattern
- Pipeline serialization: Wait for each stage to complete before next
- Telemetry via TelemetryLogger: Consistent with existing logging pattern

Edge cases:
- Provider config not found: Log error, mark task failed
- CLI command fails to spawn: Mark task failed, log telemetry
- Process exits with non-zero: Mark task failed, preserve output
- Terminal closed by user: Treat as cancellation, update state
- Stage transition at end: plan→code, code→audit, audit→completed
- Missing next stage mapping: Log warning, mark failed

## Context

### File Tree (scoped)

```
src/
├── types/
│   ├── settings.ts         # <- read-only reference (StageMapping)
│   ├── task.ts             # <- read-only reference (TaskStage)
│   └── runner.ts           # <- read-only reference (RunState, QueueItem, RunResult)
├── services/
│   ├── frontmatter-service.ts  # <- read-only reference (parseTaskMarkdown)
│   ├── settings-service.ts     # <- read-only reference (getSettings)
│   ├── telemetry-logger.ts     # <- modify (add run event logging)
│   ├── queue-service.ts        # <- read-only reference (task 5.1)
│   ├── task-service.ts         # <- read-only reference (update task stage)
│   └── runner-engine.ts        # <- create (RunnerEngine class)
└── webview/
    └── messaging.ts        # <- read-only reference (message types)
```

### Architecture Excerpts

From `gemini-architecture.md` §4.4:
- "Every run started from UI must stream in visible VS Code terminal output"
- "Execution transparency first: Every run action must execute in a visible VS Code terminal"

From `gemini-architecture.md` §4.3:
- "Queue handler responsibilities: enqueue/dequeue, prevent duplicate concurrent runs, ordered execution, state transitions, cancel/retry, terminal panel integration"

From `skill-vscode.md`:
- "Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes"
- "Any state-changing action must flow through host logic and persist to filesystem"

### Skill Excerpts

From `skill-vscode.md`:
- Extension Host owns VS Code APIs (terminal spawning)
- Webview UI owns rendering only, no VS Code API imports
- Message handlers must validate envelope/type before acting
- On state changes, broadcast to all active webviews

### Code Excerpts

`src/types/runner.ts:1-16` - existing types to use:
```typescript
export type RunState = 'queued' | 'running' | 'success' | 'failed' | 'cancelled';

export interface QueueItem {
  taskId: string;
  scope: 'stage' | 'all';
  state: RunState;
  enqueuedAt: number;
}

export interface RunResult {
  taskId: string;
  state: RunState;
  output: string;
  error?: string;
  completedAt: number;
}
```

`src/services/telemetry-logger.ts:18-28` - telemetry event types:
```typescript
export interface TelemetryEventPayload {
  taskId?: string;
  filePath?: string;
  metadata?: Record<string, unknown>;
}

export interface TelemetryEventRecord extends TelemetryEventPayload {
  timestamp: string;
  eventType: string;
}
```

`src/services/frontmatter-service.ts:65-78` - parsing pattern:
```typescript
export const parseTaskMarkdown = (input: string): Task => {
  try {
    const parsed = matter(input);
    return {
      frontmatter: normalizeFrontmatter(parsed.data),
      body: parsed.content
    };
  } catch {
    return {
      frontmatter: createDefaultFrontmatter(),
      body: input
    };
  }
};
```

`.kanban2code/_providers/kimi.md` - provider config structure:
```yaml
---
cli: kimi
model: kimi-k2-thinking-turbo
unattended_flags:
  - '--print'
output_flags:
  - '--quiet'
prompt_style: flag
provider: moonshot
---
```

`.kanban2code/_providers/codex.md` - provider config structure:
```yaml
---
cli: codex
subcommand: exec
model: gpt-5.3-codex
unattended_flags:
  - '--yolo'
output_flags:
  - '--json'
prompt_style: stdin
provider: openai
---
```

`src/types/task.ts:1` - stage progression:
```typescript
export type TaskStage = 'inbox' | 'capture' | 'plan' | 'code' | 'audit' | 'completed' | 'unknown';
```

### Dependency Graph

Files importing from modified/created files:
- `src/services/runner-engine.ts` (new) will be imported by:
  - `src/extension.ts` (for service orchestration)
  - Command handlers for Run/Queue actions

Files that `runner-engine.ts` depends on:
- `src/types/runner.ts` (RunState, QueueItem, RunResult)
- `src/types/task.ts` (TaskStage)
- `src/types/settings.ts` (StageMapping)
- `src/services/settings-service.ts` (SettingsService)
- `src/services/telemetry-logger.ts` (TelemetryLogger)
- `src/services/frontmatter-service.ts` (parseTaskMarkdown)
- `src/services/queue-service.ts` (QueueService - from task 5.1)
- `src/services/task-service.ts` (TaskService for stage updates)
- `vscode` module (Terminal, window.createTerminal)

### Patterns to Follow

1. **Service class pattern**: Constructor with workspaceRoot and dependency injection (see TaskService, SettingsService, TelemetryLogger)
2. **VS Code API usage**: Import vscode dynamically or use injected dependencies for testability
3. **Event-driven updates**: Emit state changes via messaging, don't update UI directly
4. **Terminal naming**: Use descriptive names like `K2C: <task-title>` for user clarity
5. **Error handling**: Catch spawn errors, mark task failed, log telemetry

### Test Patterns

Example from `src/services/telemetry-logger.test.ts`:
- Mock VS Code APIs (workspace.fs, window.createTerminal)
- Mock filesystem for provider config reading
- Mock process/terminal events (onDidCloseTerminal, exit codes)
- Test command building logic in isolation
- Test stage transition logic

### Gotchas

- Terminal lifecycle: Reuse vs create new - create new per task for clarity
- Process exit codes: Non-zero doesn't always mean failure (some CLIs use specific codes)
- Provider config parsing: Use same gray-matter library as frontmatter-service
- Stage transitions: Only specific transitions allowed (plan→code→audit→completed)
- CLI stdin vs flag: Provider config `prompt_style` determines how to pass task content
- Terminal visibility: Must call `terminal.show()` to ensure user sees execution
- Process cleanup: Handle terminal disposal properly to avoid memory leaks
- Serialized pipeline: Must await each stage completion before starting next

### Scope Boundaries

This task (5.2) builds on task 5.1 (QueueService). It should NOT:
- Implement queue management itself (task 5.1)
- Add validation guardrails (task 5.3)
- Wire to UI components (task 5.4)
- Implement provider/model selection UI
- Handle task file editing

RunnerEngine consumes QueueService and executes tasks. Other tasks will add validation (5.3) and UI wiring (5.4).
