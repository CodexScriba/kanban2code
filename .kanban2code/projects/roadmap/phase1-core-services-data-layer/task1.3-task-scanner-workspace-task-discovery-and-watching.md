---
stage: completed
tags:
  - feature
  - p1
  - orchestration-wave1
agent: auditor
contexts:
  - skill-vscode
skills: []
---

# TaskScanner — workspace task discovery and watching

## Goal

Create a scanner that discovers all task files in the workspace, provides filtering and sorting capabilities, and watches for file changes to trigger refresh events.

## Definition of Done

- [x] Scans `inbox/**/*.md` and `projects/**/*.md` for task files
- [x] Returns `TaskSnapshotItem[]` with full parsed metadata (title, stage, priority, role, project, tags, taskId)
- [x] Supports filtering by stage, priority, project, search text
- [x] Supports sorting by `createdAt` (derived from filename timestamp) with stable tiebreaker
- [x] Sets up `FileSystemWatcher` for `.md` changes and emits refresh events
- [x] Replaces current `getWorkspaceTasks()` in SidebarProvider (removes 4-second polling)

## Files

- `src/services/task-scanner.ts` - create - scan, filter, sort, watch
- `src/types/task.ts` - modify - extend `TaskSnapshotItem` with full metadata fields

## Tests

- [x] Scans and returns tasks from inbox + projects
- [x] Filters by stage, priority, project
- [x] Search matches title, tags, taskId (case-insensitive, partial)
- [x] Sorts newest-first with stable tiebreaker
- [x] File watcher triggers refresh on file add/change/delete

## Context

TaskScanner replaces the current polling-based `getWorkspaceTasks()` in SidebarProvider. The 4-second polling interval should be removed entirely.

The scanner should use VS Code's `FileSystemWatcher` API to watch for changes in `.kanban2code/**/*.md` files. When a file is added, changed, or deleted, the scanner should emit an event that triggers a refresh in all active webviews.

Filtering should support:
- Stage: inbox, plan, code, audit, completed
- Priority: high, medium, low
- Project: all projects or specific project slug
- Search: case-insensitive partial match on title, tags, and taskId

Sorting should default to newest-first (descending by timestamp derived from filename), with a stable tiebreaker using the taskId to ensure consistent ordering.

The `TaskSnapshotItem` type should include all metadata needed for board rendering without requiring full task file reads.

## Refined Prompt

Objective: Create a TaskScanner service that discovers all task files in the workspace, provides filtering/sorting capabilities, and uses FileSystemWatcher to emit refresh events on file changes.

Implementation approach:
1. Extend `TaskSnapshotItem` in `src/types/task.ts` with full metadata fields (priority, role, project, tags, taskId, createdAt)
2. Create `src/services/task-scanner.ts` with TaskScanner class
3. Implement `scan()` method using `vscode.workspace.findFiles()` for inbox + projects patterns
4. Parse each task file using `parseTaskMarkdown()` from frontmatter-service
5. Extract timestamp from filename (`{timestamp}-{slug}.md`) for createdAt sorting
6. Implement filter methods: byStage(), byPriority(), byProject(), bySearch()
7. Implement sort method: byCreatedAt() with stable tiebreaker on taskId
8. Set up `FileSystemWatcher` on `.kanban2code/**/*.md` pattern
9. Emit events on create/change/delete to trigger refresh
10. Update `SidebarProvider` to use TaskScanner instead of `getWorkspaceTasks()`, remove polling

Key decisions:
- Event emitter pattern: Use VS Code's EventEmitter API for type-safe event handling
- Scan caching: Cache scan results internally, invalidate on watcher events
- Search scope: Case-insensitive partial match on title, tags array, and taskId (filename)
- Timestamp extraction: Parse leading digits from filename as milliseconds since epoch
- File watching: Single watcher for both inbox and projects with glob pattern
- SidebarProvider integration: TaskScanner injected via constructor, no singleton pattern

Edge cases:
- Empty workspace: Return empty array, watcher inactive
- No .kanban2code directory: Return empty array
- Malformed task files: Skip with warning, include in results with 'unknown' stage
- Filename without timestamp: Use 0 as fallback for sorting
- Concurrent file operations: Trust FileSystemWatcher debouncing, no custom locking
- Watcher disposal: Clean up on extension deactivate via disposables

## Context

### File Tree (scoped)
```
src/
├── extension.ts                    # <- modify (instantiate TaskScanner, pass to SidebarProvider)
├── services/
│   ├── frontmatter-service.ts      # <- read-only reference (parseTaskMarkdown)
│   ├── task-service.ts             # <- read-only reference (file patterns)
│   └── task-scanner.ts             # <- create
├── types/
│   └── task.ts                     # <- modify (extend TaskSnapshotItem)
└── webview/
    ├── messaging.ts                # <- read-only reference (TaskSnapshotItem currently defined here)
    └── SidebarProvider.ts          # <- modify (use TaskScanner, remove getWorkspaceTasks)
```

### Architecture Excerpts

From `skill-vscode` — Extension Host Rules:
- Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes
- `extension.ts` must orchestrate dependencies, not business logic
- Any state-changing action must flow through host logic and persist to filesystem

From `skill-vscode` — Webview Host Rules:
- On state changes, broadcast refresh/update events to UI
- Message handlers must validate envelope/type before acting

From `skill-vscode` — Mandatory Project Structure:
- `src/webview/SidebarProvider.ts` owns webview lifecycle + message handling
- `src/webview/messaging.ts` is message contract source

### Skill Excerpts

From `skill-vscode` — Extension Host Rules:
- Register commands explicitly in one module (`src/commands/index.ts`)
- `extension.ts` must orchestrate dependencies, not business logic

From `skill-vscode` — Testing Standards:
- Unit tests for message protocol and service logic
- Integration tests for command wiring and task transitions

No specific skill guidance needed beyond general conventions.

### Code Excerpts

Current `TaskSnapshotItem` in `src/webview/messaging.ts:1-7`:
```typescript
export type TaskStage = 'inbox' | 'capture' | 'plan' | 'code' | 'audit' | 'completed' | 'unknown';

export interface TaskSnapshotItem {
  id: string;
  title: string;
  stage: TaskStage;
}
```

Current `getWorkspaceTasks()` in `src/webview/SidebarProvider.ts:114-135`:
```typescript
private async getWorkspaceTasks(): Promise<TaskSnapshotItem[]> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    return [];
  }

  const taskUris = await Promise.all([
    vscode.workspace.findFiles(
      new vscode.RelativePattern(workspaceFolder, '.kanban2code/inbox/**/*.md')
    ),
    vscode.workspace.findFiles(
      new vscode.RelativePattern(workspaceFolder, '.kanban2code/projects/**/*.md')
    )
  ]);

  const allUris = [...taskUris[0], ...taskUris[1]];
  const tasks = await Promise.all(allUris.map((uri) => this.readTaskSnapshotItem(uri, workspaceFolder)));

  return tasks
    .filter((task): task is TaskSnapshotItem => task !== null)
    .sort((left, right) => left.title.localeCompare(right.title));
}
```

Task types in `src/types/task.ts:1-24`:
```typescript
export type TaskStage = 'inbox' | 'capture' | 'plan' | 'code' | 'audit' | 'completed' | 'unknown';
export type Priority = 'low' | 'medium' | 'high';

export interface TaskFrontmatter {
  title?: string;
  stage: TaskStage;
  role?: string;
  agent?: string;
  provider?: string;
  model?: string;
  profile?: string;
  priority?: Priority;
  tags: string[];
  contexts: string[];
  skills: string[];
  project?: string;
  phase?: string;
}
```

FrontmatterService in `src/services/frontmatter-service.ts:65-78`:
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

Extension activation in `src/extension.ts:1-17`:
```typescript
export function activate(context: vscode.ExtensionContext): void {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider)
  );
  // ...
}
```

### Dependency Graph

Files importing from modified modules:
- `src/webview/SidebarProvider.ts` - consumes TaskScanner (injected)
- `src/webview/messaging.ts` - defines TaskSnapshotItem (may need move to types/task.ts)
- `src/extension.ts` - instantiates TaskScanner and passes to SidebarProvider

Future consumers (not in this task):
- `KanbanPanel` may use TaskScanner for board rendering
- Commands may use TaskScanner for task discovery

Files imported by new module:
- `src/services/frontmatter-service.ts` (parseTaskMarkdown)
- `src/types/task.ts` (Task, TaskFrontmatter, TaskStage, Priority)
- VS Code API: `vscode.FileSystemWatcher`, `vscode.EventEmitter`

### Patterns to Follow

- Use VS Code's `workspace.findFiles()` with `RelativePattern` for workspace-scoped searches
- Use `vscode.EventEmitter<T>` for type-safe event emission
- Use `vscode.Disposable` pattern for watcher cleanup
- Match TaskService pattern: constructor takes `workspaceRoot: string`
- Keep SidebarProvider thin: delegate scanning to TaskScanner
- Use `parseTaskMarkdown()` from frontmatter-service, avoid duplicating parse logic

### Test Patterns

Test file: `src/services/task-scanner.test.ts`
- Mock VS Code's `workspace.findFiles()` and `FileSystemWatcher`
- Mock `frontmatter-service.parseTaskMarkdown()` for isolated testing
- Test patterns:
  - Scan returns tasks from both inbox and projects
  - Filter byStage returns only matching tasks
  - Filter bySearch matches case-insensitive partial strings
  - Sort byCreatedAt returns newest-first with taskId tiebreaker
  - Watcher onDidCreate/onDidChange/onDidDelete emits refresh event
  - Malformed files are skipped gracefully

### Gotchas

- TaskSnapshotItem is currently in `messaging.ts` but should probably be in `types/task.ts` after extension
- FileSystemWatcher needs explicit disposal to avoid memory leaks
- Filename timestamp parsing: handle files without timestamp prefix gracefully
- Import cycles: Avoid importing from webview into services (keep services pure)
- EventEmitter typing: Use `vscode.EventEmitter<TaskSnapshotItem[]>` not generic Node EventEmitter
- SidebarProvider constructor change: Will need to accept TaskScanner as parameter

### Scope Boundaries

This task focuses on task discovery and file watching. Do NOT implement:
- Task CRUD operations (Task 1.2: TaskService handles this)
- Settings management (Task 1.4: SettingsService handles this)
- Conflict detection (Task 1.5: ConflictDetector handles this)
- UI rendering or webview components beyond refresh triggering
- Provider/model validation

TaskScanner provides read-only discovery and change notification. It does not write files.

## Audit

src/services/task-scanner.ts
src/services/task-scanner.test.ts
src/types/task.ts
src/webview/SidebarProvider.ts
src/extension.ts
src/webview/messaging.ts
src/webview/ui/index.tsx
