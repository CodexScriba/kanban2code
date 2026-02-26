---
stage: audit
agent: auditor
tags: [feature, p1]
contexts: []
---

# Terminal Executor

## Goal
One command opens a VS Code terminal, pastes the correct CLI invocation for a given task, and stays visible so the user watches and intervenes.

## Definition of Done
- [x] Triggering executeTaskInTerminal() in Extension Development Host opens a named terminal with the correct claude --prompt "..." command pasted in.

## Files
- `src/services/terminal-executor.ts` - create - executeTaskInTerminal

## Tests
- [x] tests/terminal-executor.test.ts - mock vscode.window.createTerminal, verify sendText called with correct command

## Refined Prompt

Objective: Create a service that opens a VS Code: terminal, builds the correct CLI command for a task, and pastes it into the terminal for the user to watch and intervene.

Implementation approach:
1. Create `src/services/terminal-executor.ts` with `executeTaskInTerminal(kanbanRoot: string, taskId: string, workspaceRoot: string): Promise<void>`
2. Load the task by ID using `findTaskById` from `src/services/scanner.ts`
3. Resolve provider config via `resolveProviderConfig` from `src/services/provider-service.ts`
4. Build the XML prompt via `buildXMLPrompt` from `src/services/prompt-builder.ts`
5. Get the CLI adapter via `getAdapterForCli` from `src/runner/adapter-factory.ts`
6. Build the command using `adapter.buildCommand(config, xmlPrompt)`
7. Format the command as a shell-ready string: `command + " " + args.join(" ")` (quote the prompt argument properly)
8. Open terminal with `vscode.window.createTerminal({ name: task.title })` - optionally reuse existing terminal with same name
9. Send the formatted command via `terminal.sendText(commandString)`
10. Show terminal via `terminal.show()`
11. Warn if prompt exceeds 50k characters (log warning but still execute)
12. Handle errors: task not found, provider not found, unsupported CLI - show VS Code: error message

Key decisions:
- Terminal naming: Use task title for easy identification
- Terminal reuse: Reuse existing terminal with same name if already open (prevents terminal spam)
- Prompt size limit: Warn at 50k characters but still execute (don't block)
- Command formatting: Properly escape/quote the prompt argument when passed to shell
- Error handling: Use vscode.window.showErrorMessage for user-facing errors

Edge cases:
- Task not found: Throw error with clear message
- Provider not found or no provider configured: Throw error prompting user to configure
- Unsupported CLI adapter: Throw error listing supported CLIs
- Prompt exceeds 50k chars: Log warning via console.warn but proceed
- Terminal already exists with same name: Reuse it (clear previous content implicitly via new command)
- Workspace root differs from kanban root: Use workspaceRoot for CLI cwd (kanbanRoot for task files)

Questions: None

## Context

### File Tree (scoped)
```
src/
├── services/
│   ├── terminal-executor.ts    # <- create - executeTaskInTerminal
│   ├── scanner.ts              # <- read-only reference - findTaskById
│   ├── provider-service.ts     # <- read-only reference - resolveProviderConfig
│   ├── prompt-builder.ts       # <- read-only reference - buildXMLPrompt
│   └── skill-selector.ts       # <- read-only reference - loadSkillContents
├── runner/
│   ├── adapter-factory.ts      # <- read-only reference - getAdapterForCli
│   └── cli-adapter.ts          # <- read-only reference - CliAdapter interface
├── types/
│   ├── task.ts                 # <- read-only reference - Task interface
│   └── provider.ts             # <- read-only reference - ProviderConfig
└── tests/
    └── terminal-executor.test.ts # <- create - unit tests
```

### Architecture Excerpts
Source: `kanban2codev2.md:448-472` - Phase 7 Terminal Executor spec:
```
Goal: One command opens a VS Code: terminal, pastes the correct CLI invocation for a given task, and stays visible so the user watches and intervenes.

Steps:
1. Load task by ID via scanner.ts
2. Resolve provider config via provider-service.ts
3. Build CLI command via adapter-factory.ts + cli-adapter.buildCommand()
4. Build the full prompt string via prompt-builder.ts
5. Open terminal: vscode.window.createTerminal({ name: taskTitle })
6. Send command: terminal.sendText(command)
7. Show terminal: terminal.show()

Files to create:
- src/services/terminal-executor.ts
  - executeTaskInTerminal(kanbanRoot: string, taskId: string, workspaceRoot: string): Promise<void>
  - Handles prompt size limits (warn if prompt exceeds safe threshold)
  - Names terminal after task title for easy identification
  - Optionally reuses existing terminal with same name
```

Source: `kanban2codev2.md:946-962` - Terminal Executor vision:
```
Every task runs in a named, visible VS Code: terminal. This is non-negotiable based on kanban2code-v1 experience with hidden child processes.

Terminal name: "[task title] — [stage]"
- Example: "Fix login bug — code"

When the orchestrator runs a batch:
- Each task opens its own named terminal in sequence
- Previous terminal stays visible (you can scroll back)
- You can see exactly what each agent did, in order

No black boxes. No fire-and-forget. You are always in the room.
```

### Skill Excerpts
No specific skill guidance needed beyond general conventions.

### Code Excerpts
`src/services/scanner.ts:78-81` - findTaskById:
```typescript
export async function findTaskById(kanbanRoot: string, taskId: string): Promise<Task | undefined> {
  const tasks = await loadAllTasks(kanbanRoot);
  return tasks.find(t => t.id === taskId);
}
```

`src/services/provider-service.ts:75-84` - resolveProviderConfig:
```typescript
export async function resolveProviderConfig(
  kanbanRoot: string,
  providerIdentifier: string,
): Promise<ProviderConfig | undefined> {
  const providers = await listAvailableProviders(kanbanRoot);
  const match = providers.find((a) => a.id === providerIdentifier || a.name === providerIdentifier);
  return match?.config;
}
```

`src/services/prompt-builder.ts:135-139` - buildXMLPrompt:
```typescript
export async function buildXMLPrompt(task: Task, root: string): Promise<string> {
  const contextSection = await buildContextSection(task, root);
  const taskSection = buildTaskSection(task);
  return `<system>${contextSection}${taskSection}</system>`;
}
```

`src/runner/adapter-factory.ts:10-22` - getAdapterForCli:
```typescript
export function getAdapterForCli(cli: string): CliAdapter {
  switch (cli.toLowerCase()) {
    case 'claude': return new ClaudeAdapter();
    case 'codex': return new CodexAdapter();
    case 'kimi': return new KimiAdapter();
    case 'kilo': return new KiloAdapter();
    default: throw new Error(`Unsupported CLI adapter: ${cli}`);
  }
}
```

`src/runner/cli-adapter.ts:52-65` - CliAdapter interface:
```typescript
export interface CliAdapter {
  buildCommand(
    config: ProviderConfig,
    prompt: string,
    options?: CliAdapterOptions,
  ): CliCommandResult;
  parseResponse(stdout: string, exitCode: number): CliResponse;
}
```

### Dependency Graph
Files that will import terminal-executor:
- `src/extension.ts` (task 10.1) - will register `kanban2code.runTask` command
- `src/webview/SidebarProvider.ts` (task 9.1) - will call for "Run" button action

Files that terminal-executor imports from:
- `src/services/scanner.ts` - findTaskById
- `src/services/provider-service.ts` - resolveProviderConfig
- `src/services/prompt-builder.ts` - buildXMLPrompt
- `src/runner/adapter-factory.ts` - getAdapterForCli
- `vscode` - window.createTerminal, Terminal API

### Patterns to Follow
- No barrel exports - import directly from source files
- Use `import * as vscode from 'vscode'` for VS Code: API access
- Use async/await for all async operations
- Throw errors for failure cases; let caller handle with try/catch
- Log warnings to console but don't block execution for soft limits
- Quote/escape shell arguments properly when building command string
- Reuse existing resources (terminals) when possible to avoid pollution

### Test Patterns
Test structure from `tests/task-generator.test.ts`:
```typescript
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

let TEST_DIR: string;

beforeEach(async () => {
  TEST_DIR = path.join(os.tmpdir(), 'prefix-' + Date.now());
});

afterEach(async () => {
  await fs.rm(TEST_DIR, { recursive: true, force: true });
});
```

For mocking VS Code: API in terminal-executor tests:
- Create mock Terminal interface with sendText, show methods
- Mock vscode.window.createTerminal to return mock terminal
- Mock vscode.window.showErrorMessage for error case verification
- Verify sendText called with command string containing expected fragments

### Gotchas
- VS Code: Terminal API is not available in unit tests - must mock
- Prompt argument needs proper shell escaping (contains XML with quotes)
- workspaceRoot vs kanbanRoot: CLI should run in workspaceRoot, tasks live in kanbanRoot
- Terminal reuse: check existing terminals via vscode.window.terminals
- Provider config may be undefined if not configured - handle gracefully
- Task.provider may be undefined - need fallback or error
- buildCommand returns {command, args} - need to join into shell string

### Scope Boundaries
**This task (7.1) focuses on:**
- Opening VS Code: terminal with correct command
- Building CLI command from task + provider config + prompt
- Warning on large prompts but not blocking
- Unit tests with mocked VS Code: API

**Out of scope (handled by other tasks):**
- Task 5.1 (completed): Orchestrator service - provides responses, not needed here
- Task 6.1 (completed): Task file generator - creates tasks, we only read them
- Task 8.1 (pending): Messaging protocol - not needed for terminal executor
- Task 9.1 (pending): Chat UI - calls this service, don't implement UI here
- Task 10.1 (pending): Extension entry point - registers commands
- Don't implement the actual CLI adapters (already exist)
- Don't implement prompt builder logic (already exists)
- Don't implement terminal monitoring or completion detection

## Audit
src/services/terminal-executor.ts
tests/terminal-executor.test.ts

---

## Review

**Rating: 7/10**

**Verdict: NEEDS WORK**

### Summary
The terminal executor implementation is close and the current tests pass, but there is a root-path mismatch that can produce incorrect prompt context when `workspaceRoot` and `kanbanRoot` differ. This violates a stated edge-case requirement and should be fixed before acceptance.

### Findings

#### Blockers
- [ ] Prompt builder is called with `workspaceRoot` instead of `kanbanRoot`, so context loading can target the wrong root when they differ. This contradicts the task’s own edge-case requirement (`workspaceRoot` for CLI cwd, `kanbanRoot` for task files/context) and can generate incorrect prompts. - `src/services/terminal-executor.ts:54`

#### High Priority
- [ ] None.

#### Medium Priority
- [ ] Missing regression test to ensure `buildXMLPrompt` receives `kanbanRoot` while terminal cwd remains `workspaceRoot`, so the path-separation contract is unverified. - `tests/terminal-executor.test.ts:56`

#### Low Priority / Nits
- [ ] Missing explicit tests for additional required error paths (`no provider configured`, `provider not found`, and unsupported CLI adapter surfacing via `showErrorMessage`). - `tests/terminal-executor.test.ts:99`

### Test Assessment
- Coverage: Needs improvement
- Missing tests: root-path separation (`kanbanRoot` vs `workspaceRoot`) and remaining error branches listed above

### What's Good
- The implementation correctly wires task/provider lookup, terminal reuse, prompt-size warning, user-facing error display, and shell quoting behavior; the existing test file is clean and focused.

### Recommendations
- Fix prompt root usage (`buildXMLPrompt(task, kanbanRoot)`), then add targeted tests for root separation and the remaining error branches.
