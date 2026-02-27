---
stage: completed
agent: auditor
tags: [feature, p1]
contexts: []
---

# Extension Entry Point + Command Registration

## Goal
extension.ts is clean, minimal, wires everything together. Commands work from the Command Palette.

## Definition of Done
- [x] All four commands appear in Command Palette and execute without errors. Task watcher fires, workspace snapshot rebuilds, sidebar receives WorkspaceUpdated.

## Files
- `src/extension.ts` - create - rewrite
- `src/commands/index.ts` - create - registerCommands

## Refined Prompt

Objective: Create a clean, minimal extension entry point that wires all services together and registers four command palette commands.

Implementation approach:
1. Create `src/commands/index.ts` with `registerCommands()` function that registers all four commands
2. Implement `kanban2code.createWorkspace` command - calls `scaffoldWorkspace()`, shows success/info messages
3. Implement `kanban2code.runTask` command - shows quick pick of all tasks, then calls `executeTaskInTerminal()`
4. Implement `kanban2code.newTask` command - focuses sidebar view, sends message to webview to focus chat input
5. Implement `kanban2code.openSettings` command - opens `_providers/` folder in VS Code file explorer
6. Rewrite `src/extension.ts` activate() to: detect kanban root, initialize TaskWatcher, register commands, create SidebarProvider
7. Add command contributions to `package.json` so they appear in Command Palette
8. Ensure task watcher fires events and sidebar receives WorkspaceUpdated messages

Key decisions:
- Keep extension.ts under 150 lines - delegate all command logic to commands/index.ts
- Use existing SidebarProvider constructor pattern (extensionUri, options with kanbanRoot and workspaceRoot)
- Task watcher fires events naturally via SidebarProvider's internal watcher
- Run task command should filter to tasks that have a provider configured (only runnable tasks)
- New task command should focus sidebar and trigger a focusChatInput message (add to messaging protocol if needed)
- Open settings command should open the _providers folder to let users configure providers
- If no kanban workspace detected on activate, show info message with "Create Workspace" button

Edge cases:
- No workspace folder open: show error message "Please open a workspace folder first"
- Kanban workspace doesn't exist: show info with "Create Workspace" action button
- Run task with no runnable tasks: show info "No tasks with providers configured found"
- Sidebar already visible when newTask command runs: still send focus message to webview
- Extension re-activation (development): dispose old watcher, create fresh instances

## Context

### File Tree (scoped)
```
src/
├── extension.ts                  # <- create - rewrite - main entry point
├── commands/
│   └── index.ts                  # <- create - command implementations
├── webview/
│   ├── SidebarProvider.ts        # <- read-only reference - webview provider
│   └── messaging.ts              # <- read-only reference - may need new message type
├── services/
│   ├── scaffolder.ts             # <- read-only reference - scaffoldWorkspace()
│   ├── terminal-executor.ts      # <- read-only reference - executeTaskInTerminal()
│   ├── scanner.ts                # <- read-only reference - loadAllTasks()
│   └── task-watcher.ts           # <- read-only reference - TaskWatcher class
├── workspace/
│   ├── state.ts                  # <- read-only reference - WorkspaceState
│   └── validation.ts             # <- read-only reference - findKanbanRoot()
└── core/
    └── constants.ts              # <- read-only reference - KANBAN_FOLDER
```

### Architecture Excerpts
Source: `kanban2codev2.md:583-606` - Phase 10 Extension Entry Point spec:
```
Commands to register (minimal set):
| Command ID | Title | What it does |
|---|---|---|
| kanban2code.createWorkspace | Create Kanban Workspace | Runs scaffolder |
| kanban2code.runTask | Run Task in Terminal | Opens file picker → terminal executor |
| kanban2code.newTask | New Task (Chat) | Focuses sidebar, pre-fills chat prompt |
| kanban2code.openSettings | Open Settings | Opens _providers/ folder or config.json |

Files to rewrite:
- src/extension.ts — activate: detect workspace, start task watcher, register commands, 
  create SidebarProvider. No runner engine wired here (runner is terminal-driven now). 
  Clean, under 150 lines.
- src/commands/index.ts — registerCommands(context, kanbanRoot), one function per command,
  imports from services.
```

Source: `kanban2codev2.md:39-52` - VS Code extension structure:
```
Three Layers:
┌─────────────────────────────────────┐
│  Chat UI (VS Code Sidebar)          │  ← SidebarProvider creates this
├─────────────────────────────────────┤
│  Orchestrator (Stateless API Call)  │  ← Called by SidebarProvider
├─────────────────────────────────────┤
│  Terminal Executor                  │  ← executeTaskInTerminal()
└─────────────────────────────────────┘
```

### Skill Excerpts
No specific skill guidance needed beyond general VS Code extension API conventions.

### Code Excerpts
`src/extension.ts:1-12` - current stub:
```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel('Kanban2Code');
  context.subscriptions.push(output);

  output.appendLine('Kanban2Code V2 activated');
  output.show(true);
  console.log('Kanban2Code V2 activated');
}

export function deactivate() {}
```
Why: This is the current minimal stub that needs complete rewrite.

`src/webview/SidebarProvider.ts:28-48` - constructor and resolveWebviewView:
```typescript
export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'kanban2code.sidebar';

  private view?: vscode.WebviewView;
  private snapshot: WorkspaceSnapshot | null = null;
  private watcher: TaskWatcher;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly options: { kanbanRoot: string; workspaceRoot: string },
  ) {
    this.watcher = new TaskWatcher(options.kanbanRoot);
    this.watcher.on('event', () => {
      void this.refreshSnapshotAndBroadcast();
    });
    this.watcher.start();
  }
```
Why: SidebarProvider is constructed with extensionUri and options, starts its own watcher.

`src/services/scaffolder.ts:22-35` - scaffoldWorkspace signature:
```typescript
export async function scaffoldWorkspace(rootPath: string): Promise<void> {
  const kanbanRoot = path.join(rootPath, KANBAN_FOLDER);
  // Throws 'Kanban2Code already initialized.' if exists
```
Why: Create workspace command calls this with workspace root.

`src/services/terminal-executor.ts:32-40` - executeTaskInTerminal signature:
```typescript
export async function executeTaskInTerminal(
  kanbanRoot: string,
  taskId: string,
  workspaceRoot: string,
): Promise<void>
```
Why: Run task command needs taskId from selected task, kanbanRoot and workspaceRoot.

`src/services/scanner.ts:30-50` - loadAllTasks for quick pick:
```typescript
export async function loadAllTasks(kanbanRoot: string): Promise<Task[]> {
  const files = await findAllTaskFiles(kanbanRoot);
  // ... parses all tasks
  return sortTasks(tasks);
}
```
Why: Run task command needs to list all tasks for quick pick.

`src/workspace/state.ts:1-20` - WorkspaceState singleton:
```typescript
export class WorkspaceState {
  private static _kanbanRoot: string | null = null;
  static get kanbanRoot(): string | null { return this._kanbanRoot; }
  static setKanbanRoot(path: string | null) { this._kanbanRoot = path; }
}
```
Why: Store kanban root globally for commands to access.

### Dependency Graph
Files SidebarProvider.ts imports from:
- Uses services for task generation, terminal execution, workspace snapshot
- Commands will use these same services

Commands index.ts will import from:
- `vscode` - command registration and UI
- `../services/scaffolder` - scaffoldWorkspace
- `../services/scanner` - loadAllTasks for task picker
- `../services/terminal-executor` - executeTaskInTerminal
- `../workspace/state` - WorkspaceState for kanban root
- `../webview/SidebarProvider` - to reveal/focus sidebar

extension.ts will import from:
- `./commands/index` - registerCommands
- `./webview/SidebarProvider` - SidebarProvider class
- `./workspace/state` - WorkspaceState
- `./workspace/validation` - findKanbanRoot (if exists)

### Patterns to Follow
- VS Code extension API patterns for commands (vscode.commands.registerCommand)
- Use vscode.window.showQuickPick for task selection
- Use vscode.window.showInformationMessage with action buttons
- Use vscode.workspace.fs for file operations
- Dispose all subscriptions via context.subscriptions.push()
- SidebarProvider.viewType is 'kanban2code.sidebar' - use with vscode.window.registerWebviewViewProvider
- Package.json commands format: "command": "kanban2code.commandName" in contributes.commands

### Test Patterns
Source: existing service tests show pattern:
```typescript
import { describe, expect, test, vi } from 'vitest';
// Mock vscode API
global.vscode = { window: { showQuickPick: vi.fn() } };
```
Commands would need mocking of VS Code APIs for testing.

### Gotchas
- SidebarProvider needs to be registered BEFORE trying to reveal it
- Task watcher in SidebarProvider auto-starts, don't create a second one in extension.ts
- Extension activates on `workspaceContains:.kanban2code` or `onView:kanban2code.sidebar`
- Quick pick items need label (task title) and detail (description), with task id as data
- Only tasks with `provider` field can be executed - filter in quick pick
- Commands must handle case where no workspace folder is open (vscode.workspace.workspaceFolders)
- Sidebar webview may not be initialized when command runs - handle gracefully

### Scope Boundaries
This task (10.1) focuses on:
- Extension entry point (extension.ts)
- Command registration and implementation (commands/index.ts)
- Package.json command contributions
- Wiring SidebarProvider with task watcher

Out of scope (handled by other tasks):
- Task 9.1 (completed): Chat + Board Webview UI - SidebarProvider is read-only
- Task 7.1 (completed): Terminal executor - use executeTaskInTerminal as-is
- Task 1.1 (completed): Core services - scaffolder, scanner are read-only
- Task 8.1 (completed): Messaging protocol - may need FocusChatInput message

Do not modify:
- Any files in src/webview/ui/ (task 9.1 completed)
- Any service implementations (scaffolder.ts, scanner.ts, terminal-executor.ts)
- SidebarProvider.ts (read-only reference)

## Audit
src/extension.ts
src/webview/SidebarProvider.ts
src/webview/messaging.ts
tests/webview/messaging.test.ts

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
Implementation meets the command registration and extension wiring goals with clean separation between `extension.ts` and `commands/index.ts`. Core behavior is validated by command tests, messaging protocol tests, and typecheck, with a remaining integration-level coverage gap around activation/watcher wiring.

### Findings

#### Blockers
- [ ] None.

#### High Priority
- [ ] None.

#### Medium Priority
- [ ] Missing extension integration coverage: There is no direct test around `activate()` wiring for initial kanban root discovery, sidebar provider registration lifecycle, and create-workspace prompt flow in `src/extension.ts`.

#### Low Priority / Nits
- [ ] None.

### Test Assessment
- Coverage: Needs improvement
- Missing tests: activation path coverage in `src/extension.ts` (workspace present/missing, create prompt action, sidebar registration/watcher lifecycle behavior).

### What's Good
- `src/extension.ts` stays minimal and delegates command logic cleanly.
- All four commands are contributed in `package.json` and registered in `src/commands/index.ts`.
- Command behavior is covered by `tests/commands.test.ts` (6/6 passing), including runnable-task filtering, quick-pick selection, new-task focus callback, and settings reveal.
- Sidebar watcher/event flow remains centralized in `SidebarProvider`, including `WorkspaceUpdated` broadcasts and `FocusChatInput` support.
- Validation checks passed: `bun run test tests/commands.test.ts`, `bun run test tests/webview/messaging.test.ts`, `bun run typecheck`.

### Recommendations
- Add an activation-focused test suite (or lightweight integration test) for `src/extension.ts` to verify startup wiring and create-workspace prompt behavior.
