---
stage: completed
agent: auditor
tags: [feature, p1]
contexts: []
---

# Port Runner

## Goal
The execution engine lives in the new repo and all adapters work.

## Definition of Done
- [x] `bun run test` still fully green. Runner engine can be imported without errors.

## Files
- `src/runner/cli-adapter.ts` - create - port
- `src/runner/adapter-factory.ts` - create - port
- `src/runner/adapters/claude-adapter.ts` - create - port
- `src/runner/adapters/codex-adapter.ts` - create - port
- `src/runner/adapters/kimi-adapter.ts` - create - port
- `src/runner/adapters/kilo-adapter.ts` - create - port
- `src/runner/output-parser.ts` - create - port
- `src/runner/runner-state.ts` - create - port
- `src/runner/runner-log.ts` - create - port
- `src/runner/git-ops.ts` - create - port
- `src/runner/runner-engine.ts` - create - port

## Tests
- [x] tests/runner-log.test.ts
- [x] tests/runner-engine.test.ts
- [x] tests/e2e/setup.ts
- [x] tests/e2e/core-workflows.test.ts

## Context
Original files from the previous version are located at `/home/cynicus/code/kanban2code-v1/`.

---

## Refined Prompt
Objective: Port the complete runner execution engine and CLI adapters from v1 to v2, ensuring all tests pass.

Implementation approach:
1. Create `src/runner/` directory structure
2. Port `cli-adapter.ts` - Base interface and types for CLI adapters
3. Port adapter implementations in `src/runner/adapters/`:
   - `claude-adapter.ts` - Claude CLI with JSON output parsing
   - `codex-adapter.ts` - Codex CLI with JSONL stream parsing
   - `kimi-adapter.ts` - KIMI CLI with plain text output
   - `kilo-adapter.ts` - Kilo CLI with JSONL stream parsing
4. Port `adapter-factory.ts` - Factory to resolve adapter by CLI name
5. Port `output-parser.ts` - Structured marker extraction (STAGE_TRANSITION, AUDIT_RATING, AUDIT_VERDICT, FILES_CHANGED)
6. Port `runner-state.ts` - Simple event emitter for runner state management
7. Port `runner-log.ts` - Markdown report generation for runner runs
8. Port `git-ops.ts` - Git operations for working tree checks and auto-commits
9. Port `runner-engine.ts` - Core execution engine with pipeline logic
10. Port tests:
    - `tests/runner-log.test.ts` - Unit tests for log generation
    - `tests/runner-engine.test.ts` - Unit tests with mocked spawn and services
    - `tests/e2e/setup.ts` - E2E test utilities
    - `tests/e2e/core-workflows.test.ts` - E2E workflow tests
11. Run `bun run test` and fix any failures

Key decisions:
- Adapters use v2's `ProviderConfig` type from `src/types/provider.ts` - already ported
- Runner engine depends on v2 services (`prompt-builder`, `stage-manager`, `provider-service`, `scanner`, `frontmatter`) - already ported
- All imports should reference v2 paths (remove any `/dist/` references from v1)
- Keep the same test mocking pattern using `vi.mock()` for services

Edge cases:
- Claude adapter handles non-JSON output gracefully (crash scenario)
- Codex/Kilo adapters handle partial JSONL lines in streamed output
- Runner engine handles dirty git working tree (refuses to run)
- Audit failure loop: attempt 1 → back to code, attempt 2+ → hard stop
- Stop() cancels current process and aborts pipeline

Questions (only if blocked):
- None - all dependencies are already ported in task1.1

---

## Context

### File Tree (scoped)
```
src/
├── runner/                          # ← create
│   ├── adapters/                    # ← create
│   │   ├── claude-adapter.ts        # ← create
│   │   ├── codex-adapter.ts         # ← create
│   │   ├── kimi-adapter.ts          # ← create
│   │   └── kilo-adapter.ts          # ← create
│   ├── cli-adapter.ts               # ← create
│   ├── adapter-factory.ts           # ← create
│   ├── output-parser.ts             # ← create
│   ├── runner-state.ts              # ← create
│   ├── runner-log.ts                # ← create
│   ├── git-ops.ts                   # ← create
│   └── runner-engine.ts             # ← create
├── types/
│   ├── provider.ts                  # ← read-only reference
│   └── task.ts                      # ← read-only reference
├── services/
│   ├── prompt-builder.ts            # ← read-only reference
│   ├── stage-manager.ts             # ← read-only reference
│   ├── provider-service.ts          # ← read-only reference
│   ├── scanner.ts                   # ← read-only reference
│   └── frontmatter.ts               # ← read-only reference
└── core/
    └── constants.ts                 # ← read-only reference
tests/
├── runner-log.test.ts               # ← create
├── runner-engine.test.ts            # ← create
└── e2e/                             # ← create
    ├── setup.ts                     # ← create
    └── core-workflows.test.ts       # ← create
```

### Architecture Excerpts
From `src/runner/cli-adapter.ts`:
- `CliAdapter` interface: `buildCommand(config, prompt, options)` → `CliCommandResult`
- `CliResponse` type: success, result, error, sessionId, cost, turns
- `CliAdapterOptions`: systemPrompt, maxTurns, sessionId

From `src/runner/runner-engine.ts`:
- `RunnerEngine` extends `EventEmitter` with events: taskStarted, stageStarted, stageCompleted, taskCompleted, taskFailed, runnerStopped
- Pipeline stages: plan → code → audit
- Audit acceptance: rating >= 8 OR verdict === 'ACCEPTED'
- Git working tree must be clean before running

From `src/runner/output-parser.ts`:
- Markers: `<!-- STAGE_TRANSITION: stage -->`, `<!-- AUDIT_RATING: N -->`, `<!-- AUDIT_VERDICT: ACCEPTED|NEEDS_WORK -->`, `<!-- FILES_CHANGED: file1, file2 -->`
- Prose fallback patterns for rating extraction

### Skill Excerpts
No specific skill guidance needed beyond general conventions. This is a TypeScript port task following existing v1 patterns.

### Code Excerpts

**src/runner/cli-adapter.ts** - Core adapter interface:
```typescript
// v1/src/runner/cli-adapter.ts:46-76
export interface CliAdapter {
  buildCommand(
    config: ProviderConfig,
    prompt: string,
    options?: CliAdapterOptions,
  ): CliCommandResult;

  parseResponse(stdout: string, exitCode: number): CliResponse;
}
```

**src/runner/runner-engine.ts** - Key pipeline logic:
```typescript
// v1/src/runner/runner-engine.ts:94-140
export class RunnerEngine extends EventEmitter {
  constructor(kanbanRoot: string, deps: RunnerEngineDeps = {}) { ... }
  stop(): void { ... }
  async runTask(task: Task): Promise<RunnerRunResult> { ... }
  async runColumn(stage: Stage): Promise<RunnerRunResult> { ... }
}
```

**src/runner/adapters/claude-adapter.ts** - Example adapter:
```typescript
// v1/src/runner/adapters/claude-adapter.ts:26-80
export class ClaudeAdapter implements CliAdapter {
  buildCommand(config, prompt, options): CliCommandResult { ... }
  parseResponse(stdout, exitCode): CliResponse { ... }
}
```

**src/runner/output-parser.ts** - Marker extraction:
```typescript
// v1/src/runner/output-parser.ts:28-32
export function parseStageTransition(output: string): Stage | undefined { ... }
// v1/src/runner/output-parser.ts:37-64
export function parseAuditRating(output: string): number | undefined { ... }
// v1/src/runner/output-parser.ts:69-87
export function parseAuditVerdict(output: string): AuditVerdict | undefined { ... }
```

**tests/runner-engine.test.ts** - Test pattern:
```typescript
// v1/tests/runner-engine.test.ts:32-87
class MockChildProcess extends EventEmitter {
  stdout = new EventEmitter();
  stderr = new EventEmitter();
  stdin = { write: vi.fn(), end: vi.fn() };
  killed = false;
  kill = vi.fn(() => { this.killed = true; });
}
// Mocks: vi.mock('node:fs/promises'), vi.mock('../src/services/frontmatter'), etc.
```

### Dependency Graph
Files that import from runner modules:
- `src/commands/index.ts` - Will import RunnerEngine for command registration (future task)
- `src/extension.ts` - Will import for singleton lifecycle (future task)
- Tests import runner modules directly

Runner imports from (already ported):
- `src/types/task.ts` - Stage, Task types
- `src/types/provider.ts` - ProviderConfig
- `src/services/prompt-builder.ts` - buildRunnerPrompt
- `src/services/stage-manager.ts` - getDefaultAgentForStage, getDefaultProviderForAgent
- `src/services/provider-service.ts` - resolveProviderConfig
- `src/services/scanner.ts` - loadAllTasks, getOrderedTasksForStage
- `src/services/frontmatter.ts` - parseTaskFile, stringifyTaskFile
- `src/core/constants.ts` - KANBAN_FOLDER, LOGS_FOLDER

### Patterns to Follow
- Use Node.js `events.EventEmitter` for runner event handling
- Spawn processes with `node:child_process` spawn
- Mock service dependencies in tests using `vi.mock()`
- Keep adapter response parsing defensive (handle malformed output)
- Runner state is global singleton pattern (via `runner-state.ts` module-level state)

### Test Patterns
- Mock `node:fs/promises`, all service modules, and `child_process.spawn`
- Use `MockChildProcess` pattern to simulate CLI output via event emission
- E2E tests use real filesystem in temp directories
- Test file naming: `*.test.ts`

### Gotchas
- Import paths: v1 uses `../src/...`, v2 should use `../...` relative to runner files
- `prompt-builder.ts` in v2 has `buildRunnerPrompt` export (already available)
- `stage-manager.ts` has `getDefaultAgentForStage` and `getDefaultProviderForAgent` (already available)
- `provider-service.ts` has `resolveProviderConfig` (already available)
- Constants `KANBAN_FOLDER` and `LOGS_FOLDER` are in `src/core/constants.ts`
- E2E tests rely on temp directories - clean up in `afterAll`

### Scope Boundaries
This task (task2.1) is Phase 2 of the port. It should NOT touch:
- Command registration in VS Code (task10.1)
- Webview/UI runner controls (task9.1)
- Extension entry point modifications (future tasks)

Previous task (task1.1) completed: all types, core, utils, workspace, services, and assets.
Next tasks handle: workspace snapshot (task3.1), skill auto-selector (task4.1), orchestrator (task5.1), etc.

---

## CRITICAL: Stage Transition

**You MUST update the task file frontmatter when done:**
```yaml
---
stage: code
agent: coder
---
`

## Audit
src/runner/cli-adapter.ts
src/runner/adapter-factory.ts
src/runner/adapters/claude-adapter.ts
src/runner/adapters/codex-adapter.ts
src/runner/adapters/kimi-adapter.ts
src/runner/adapters/kilo-adapter.ts
src/runner/output-parser.ts
src/runner/runner-state.ts
src/runner/runner-log.ts
src/runner/git-ops.ts
src/runner/runner-engine.ts
tests/runner-log.test.ts
tests/runner-engine.test.ts
tests/e2e/setup.ts
tests/e2e/core-workflows.test.ts
.kanban2code/projects/roadmap/task2.1-port-runner.md

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
Runner engine and adapters are correctly ported, covered by tests, and satisfy the task Definition of Done. `bun run test` is fully green (21 files, 227 tests), and the audited files align with the requested port scope.

### Findings

#### Blockers
- [x] None.

#### High Priority
- [x] None.

#### Medium Priority
- [x] None.

#### Low Priority / Nits
- [ ] `RunnerEngine` provider fallback currently uses `DEFAULT_CONFIG.preferences.defaultAgent` as an intermediate fallback, which is semantically agent-focused rather than provider-focused. Consider a future cleanup for clarity. - `src/runner/runner-engine.ts`

### Test Assessment
- Coverage: Adequate
- Missing tests: None identified for the scoped ported runner files

### What's Good
- Audit markers, retry behavior, dirty-tree guard, stop behavior, and adapter parsing logic are implemented defensively and validated with focused tests.

### Recommendations
- Consider adding a small integration test around provider fallback semantics to make intended behavior explicit.
