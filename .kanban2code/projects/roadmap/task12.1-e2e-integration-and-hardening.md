---
stage: code
agent: coder
tags: [test, p2]
contexts: []
---

# E2E Integration and Hardening

## Goal
The full loop works. Every seam is tested. Error states handled gracefully.

## Definition of Done
- [ ] All scenarios above work manually. bun run test + bun run test:e2e fully green. bun run typecheck clean. bun run build produces valid VSIX.

## Audit
tests/e2e/chat-flow.test.ts
tests/e2e/terminal-executor.test.ts
tests/integration/skill-selector.test.ts
tests/integration/workspace-snapshot.test.ts

## Files
- `tests/e2e/chat-flow.test.ts` - create
- `tests/e2e/terminal-executor.test.ts` - create
- `tests/integration/skill-selector.test.ts` - create
- `tests/integration/workspace-snapshot.test.ts` - create

## Refined Prompt

Objective: Create comprehensive E2E and integration tests covering chat flow, terminal execution, skill selection, and workspace snapshot services.

Implementation approach:
1. Create `tests/e2e/chat-flow.test.ts` - Test end-to-end chat messaging flow including SendMessage, StreamChunk, MessageComplete, and CancelStream message exchanges
2. Create `tests/e2e/terminal-executor.test.ts` - Test terminal execution E2E flow with actual command spawning (mock where necessary for VS Code APIs)
3. Create `tests/integration/skill-selector.test.ts` - Test skill auto-selection integration with file system and framework detection
4. Create `tests/integration/workspace-snapshot.test.ts` - Test workspace snapshot building integration across services

Key decisions:
- Test structure: Follow existing E2E pattern in `tests/e2e/core-workflows.test.ts` with temp workspace setup/teardown
- Chat flow tests: Mock orchestrator streaming; focus on message protocol integrity and useChat hook state transitions
- Terminal executor tests: Use real spawn for command execution; mock VS Code terminal APIs
- Integration tests: Use real file system operations in temp directories; clean up after each test
- Error scenarios: Test graceful degradation when services fail or return unexpected data

Edge cases:
- Chat cancellation mid-stream leaves state consistent
- Terminal command execution with special characters in prompts (shell quoting)
- Skill selector with empty skills directory or malformed skill files
- Workspace snapshot with missing kanban root or corrupted config
- Concurrent operations (race conditions in state updates)

## Context

### File Tree (scoped)
```
tests/
├── e2e/
│   ├── setup.ts                    <- read-only reference
│   ├── core-workflows.test.ts      <- read-only reference
│   ├── chat-flow.test.ts           <- create
│   └── terminal-executor.test.ts   <- create
├── integration/
│   ├── skill-selector.test.ts      <- create
│   └── workspace-snapshot.test.ts  <- create
├── webview/
│   └── chat.test.tsx               <- read-only reference
├── setup.ts                        <- read-only reference
├── terminal-executor.test.ts       <- read-only reference (unit test pattern)
├── skill-selector.test.ts          <- read-only reference (unit test pattern)
└── workspace-snapshot.test.ts      <- read-only reference (unit test pattern)

src/
├── webview/
│   ├── messaging.ts                <- read-only reference
│   └── ui/hooks/useChat.ts         <- read-only reference
├── services/
│   ├── terminal-executor.ts        <- read-only reference
│   ├── skill-selector.ts           <- read-only reference
│   └── workspace-snapshot.ts       <- read-only reference
└── orchestrator/
    └── orchestrator.ts             <- read-only reference
```

### Architecture Excerpts
From `tests/e2e/setup.ts`:
- E2E tests use temp workspace at `os.tmpdir()/kanban2code-e2e-test`
- `e2eUtils.createKanbanWorkspace()` scaffolds folder structure
- `e2eUtils.createTask()` generates task files with frontmatter
- Tests run sequentially with `pool: 'forks'` and `singleFork: true`

From `src/webview/messaging.ts`:
- Message protocol uses versioned envelopes with Zod validation
- Host->Webview: InitState, StreamChunk, MessageComplete, TaskGenerated, WorkspaceUpdated, Error
- Webview->Host: RequestState, SendMessage, GenerateTask, RunTask, SaveTask, CancelStream

From `src/webview/ui/hooks/useChat.ts`:
- `useChat` manages messages array, isStreaming state, and error state
- `sendMessage` appends user message + empty assistant message, sets isStreaming
- `handleStreamChunk` accumulates tokens into last assistant message
- `handleMessageComplete` sets isStreaming false

From `src/services/terminal-executor.ts`:
- `executeTaskInTerminal` resolves task, provider config, builds XML prompt
- Uses CLI adapter to build command; shell-quotes arguments
- Creates/reuses VS Code terminal by name
- Warns if prompt exceeds 50k characters

### Skill Excerpts
No specific skill guidance needed beyond general conventions.

### Code Excerpts

`tests/e2e/setup.ts:36-50` - E2E utilities pattern:
```typescript
export const e2eUtils = {
  async createKanbanWorkspace(rootPath: string = TEST_WORKSPACE): Promise<void> {
    const kanbanPath = path.join(rootPath, '.kanban2code');
    const directories = [kanbanPath, /* subdirs */];
    for (const dir of directories) { fs.mkdirSync(dir, { recursive: true }); }
  },
  async createTask(title: string, stage: string = 'inbox', options = {}): Promise<string> { /* ... */ },
  async readTask(filePath: string): Promise<{ stage, title, content }> { /* ... */ },
};
```

`src/webview/ui/hooks/useChat.ts:25-39` - Chat hook interface:
```typescript
export interface UseChatResult {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  sendMessage: (text: string) => void;
  cancelStream: () => void;
  handleStreamChunk: (token: string) => void;
  handleMessageComplete: () => void;
  handleError: (message: string) => void;
}
```

`src/services/terminal-executor.ts:32-45` - Terminal execution flow:
```typescript
export async function executeTaskInTerminal(kanbanRoot: string, taskId: string, workspaceRoot: string): Promise<void> {
  const task = await findTaskById(kanbanRoot, taskId);
  if (!task) throw new Error(`Task not found: ${taskId}`);
  if (!task.provider) throw new Error(`No provider configured...`);
  const providerConfig = await resolveProviderConfig(kanbanRoot, task.provider);
  // ... build command, create terminal, send text
}
```

`tests/terminal-executor.test.ts:56-74` - Terminal executor test pattern:
```typescript
test('creates terminal, sends quoted command, and shows terminal', async () => {
  await executeTaskInTerminal('/kanban', 'task-1', '/workspace');
  expect(findTaskById).toHaveBeenCalledWith('/kanban', 'task-1');
  expect(mockTerminal.sendText).toHaveBeenCalledWith(`'claude' '-p' '...'`);
  expect(mockTerminal.show).toHaveBeenCalled();
});
```

`tests/skill-selector.test.ts:62-106` - Skill selector test pattern:
```typescript
describe('selectSkills', () => {
  test('returns alwaysAttach and matching trigger skills', async () => {
    await writeSkill('nextjs-core-skills.md', { skill_name: 'nextjs-core-skills', always_attach: true, ... });
    const result = await selectSkills(KANBAN_ROOT, 'add dashboard with caching in nextjs app router');
    expect(result.map(s => s.id)).toEqual(['nextjs-core-skills', ...]);
  });
});
```

### Dependency Graph
Files importing from services to test:
- `src/services/terminal-executor.ts` is imported by:
  - `src/commands/index.ts` (consumers)
  - `src/webview/SidebarProvider.ts` (consumers)
  - Tests mock `vscode` module and service dependencies

- `src/services/skill-selector.ts` is imported by:
  - `src/orchestrator/orchestrator.ts` (consumer)
  - `src/services/prompt-builder.ts` (consumer)

- `src/services/workspace-snapshot.ts` is imported by:
  - `src/orchestrator/orchestrator.ts` (consumer)
  - `src/webview/SidebarProvider.ts` (consumer)
  - `src/webview/KanbanPanel.ts` (consumer)

### Patterns to Follow
1. E2E test structure: Use `beforeEach` to clean workspace, `e2eUtils.createKanbanWorkspace()` to scaffold
2. Temp directories: Use `os.tmpdir()` with timestamp to avoid conflicts
3. File cleanup: Use `afterEach` with `fs.rm(..., { recursive: true, force: true })`
4. Mock VS Code APIs: Follow pattern in `tests/setup.ts` for `vi.mock('vscode', () => ({...}))`
5. Test timeouts: E2E tests use 60s timeout, integration tests use default 5s
6. Sequential execution: E2E tests use `pool: 'forks'` with `singleFork: true` to avoid conflicts

### Test Patterns
Existing E2E tests (`tests/e2e/core-workflows.test.ts`):
- Test workspace creation with folder structure verification
- Test task creation with frontmatter parsing
- Test stage progression through state changes
- Test archive operations

Existing unit tests to reference:
- `tests/terminal-executor.test.ts` - Mocks VS Code APIs, service dependencies
- `tests/skill-selector.test.ts` - Uses real temp directory with skill files
- `tests/workspace-snapshot.test.ts` - Uses real temp directory with full workspace

### Gotchas
- VS Code terminal API cannot be tested in true E2E without VS Code test host; mock `vscode.window.createTerminal`
- Orchestrator streaming requires API keys; mock `sendMessage` generator in chat flow tests
- E2E tests must run sequentially to avoid temp directory conflicts
- Skill selector caches framework hints; ensure clean state between tests
- Workspace snapshot calls `configService.initialize()`; call `configService.dispose()` in cleanup
- Shell quoting in terminal executor uses single-quote escaping; test edge cases with quotes in prompts

### Scope Boundaries
This task is the second-to-last in the roadmap phase (before dogfooding). It focuses on:
- Testing existing functionality (NOT implementing new features)
- E2E coverage for chat flow and terminal execution
- Integration coverage for skill selector and workspace snapshot

Do NOT:
- Modify production code except to fix bugs exposed by tests
- Add new features or extend existing functionality
- Refactor existing code unless tests reveal critical issues
- Duplicate test coverage already in unit tests (focus on integration seams)

Previous task (11.1) completed MiniMax adapter. Next task (13.1) is dogfooding which will use these tests.

---

## Review

**Rating: 6/10**

**Verdict: NEEDS WORK**

### Summary
The four requested test files were created and the test suite currently passes, but the Definition of Done is not met due to missing required scripts and a failing build/package path. One of the new E2E tests also validates a local state simulator instead of the real chat hook seam.

### Findings

#### Blockers
- [ ] DoD commands cannot be executed as written because `test:e2e` and `typecheck` scripts are missing from `package.json` - `package.json:81`
- [ ] `bun run build` and `bun run package` fail in this workspace with unresolved Node built-ins during the webview bundle, so “build produces valid VSIX” is not currently satisfied - `build.ts:138`

#### High Priority
- [ ] None.

#### Medium Priority
- [ ] `chat-flow` test uses a custom `applyHostEnvelope` reducer and local state model, which does not exercise `useChat`/webview integration behavior and can pass even if real hook logic regresses - `tests/e2e/chat-flow.test.ts:24`

#### Low Priority / Nits
- [ ] None.

### Test Assessment
- Coverage: Needs improvement
- Missing tests: true hook-level chat lifecycle integration (including cancellation behavior against real `useChat` state transitions)

### What's Good
- Integration hardening tests for `skill-selector` and `workspace-snapshot` are practical, cover malformed/corrupt inputs, and all current Vitest tests pass (`282/282`).

### Recommendations
- Add/fix scripts required by DoD, fix build/package path so it passes in CI, and replace the custom chat-state simulator with tests that drive the real chat hook/message handling seam.
