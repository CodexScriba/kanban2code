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

# TaskService — CRUD for task markdown files

## Goal

Create a service that provides full CRUD operations for task markdown files, including create, read, update, delete, and move operations with timestamp-based file naming.

## Definition of Done

- [x] `createTask(data)` writes `.md` file with frontmatter + body to correct location
- [x] `readTask(filePath)` returns parsed Task object
- [x] `updateTask(filePath, changes)` updates frontmatter fields and/or body
- [x] `deleteTask(filePath)` removes file from disk
- [x] `moveTask(filePath, newStage)` updates `stage` in frontmatter, moves file if needed
- [x] File naming uses timestamp-based ID: `{timestamp}-{slug}.md`

## Files

- `src/services/task-service.ts` - create - task CRUD operations
- `src/types/task.ts` - modify - add `TaskCreateInput`, `TaskUpdateInput` types

## Tests

- [x] Creates task file at correct path with valid frontmatter
- [x] Reads task and returns typed object
- [x] Updates single field without clobbering others
- [x] Deletes file from disk
- [x] Stage change updates frontmatter

## Context

TaskService is the primary interface for all task file operations. It should use FrontmatterService internally for parsing and serialization.

File naming convention: `{timestamp}-{slug}.md` where timestamp is milliseconds since epoch and slug is a kebab-case version of the task title. This ensures unique, sortable filenames.

The service should handle both inbox and project locations:
- Inbox: `.kanban2code/inbox/{timestamp}-{slug}.md`
- Project: `.kanban2code/projects/{project-slug}/{timestamp}-{slug}.md`

Move operations should update the `stage` field in frontmatter and optionally move the file to a different location if the project changes.


## Refined Prompt

Objective: Create a TaskService that provides full CRUD operations for task markdown files using FrontmatterService internally, with timestamp-based file naming and support for both inbox and project locations.

Implementation approach:
1. Add `TaskCreateInput` and `TaskUpdateInput` types to `src/types/task.ts` with optional fields for partial updates
2. Create `src/services/task-service.ts` with methods: `createTask`, `readTask`, `updateTask`, `deleteTask`, `moveTask`
3. Implement filename generation using `{timestamp}-{slug}.md` pattern (timestamp = Date.now(), slug = kebab-case title)
4. Use VS Code's `workspace.fs` API for file operations (readFile, writeFile, delete, createDirectory)
5. Use `FrontmatterService.parseTaskMarkdown` and `serializeTaskMarkdown` for content handling
6. Handle directory creation for new project paths using `workspace.fs.createDirectory`
7. Implement `moveTask` to update frontmatter stage field and optionally relocate file between inbox/projects

Key decisions:
- File naming: Use `{timestamp}-{slug}.md` with timestamp (milliseconds since epoch) for sortability and uniqueness
- Slug generation: Convert title to kebab-case (lowercase, spaces→hyphens, remove special chars), truncate to 50 chars
- Input types: `TaskCreateInput` omits auto-generated fields; `TaskUpdateInput` makes all fields optional for partial updates
- Return types: Methods return `Promise<Task>` on success, throw descriptive errors on failure
- Stage-only moves: If newStage differs but path doesn't change, only update frontmatter stage field

Edge cases:
- Duplicate filenames: Append counter suffix `-1`, `-2` etc. if filename collision detected
- Missing directories: Auto-create parent directories when writing to new project paths
- Empty title: Use `untitled` as fallback slug
- File not found on read/update/delete: Throw with clear path in error message
- Concurrent writes: Trust VS Code's atomic file operations, no custom locking needed
- Move to same location: No-op if stage and path unchanged
- Invalid frontmatter on read: FrontmatterService returns defaults, TaskService returns valid Task object

## Context

### File Tree (scoped)
```
src/
├── services/
│   ├── frontmatter-service.ts      # <- read-only reference (parse/serialize)
│   ├── settings-service.ts         # <- read-only reference (VS Code fs pattern)
│   └── task-service.ts             # <- create
├── types/
│   ├── task.ts                     # <- modify (add input types)
│   └── settings.ts                 # <- read-only reference
└── extension.ts                    # <- read-only reference (orchestration)
.kanban2code/
├── inbox/                          # Default location for new tasks
└── projects/{slug}/                # Project-specific task locations
```

### Architecture Excerpts

From `skill-vscode` — Extension Host Rules:
- Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes
- Any state-changing action must flow through host logic and persist to filesystem
- Use `vscode.workspace.fs` for file operations, not Node's `fs` module

From `skill-vscode` — Mandatory Project Structure:
- `extension.ts` must orchestrate dependencies, not business logic
- Services should be pure classes/functions with explicit dependencies

### Skill Excerpts

From `skill-vscode` — Extension Host Rules:
- Register commands explicitly in one module (`src/commands/index.ts`)
- `extension.ts` must orchestrate dependencies, not business logic
- Any state-changing action must flow through host logic and persist to filesystem

From `skill-vscode` — Testing Standards:
- Unit tests for message protocol and service logic
- Integration tests for command wiring and task transitions

### Code Excerpts

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

export interface Task {
  frontmatter: TaskFrontmatter;
  body: string;
}
```

FrontmatterService in `src/services/frontmatter-service.ts:65-78,80-94`:
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

export const serializeTaskMarkdown = (task: Task): string => {
  const normalized = normalizeFrontmatter(task.frontmatter);
  // ... normalization
  return matter.stringify(task.body, frontmatterForWrite);
};
```

VS Code fs pattern in `src/services/settings-service.ts:74-77,109-116`:
```typescript
await vscode.workspace.fs.writeFile(
  vscode.Uri.file(path.join(this.workspaceRoot, filePath)),
  Buffer.from(JSON.stringify(updated, null, 2))
);

private async readSettingsFile(relativePath: string): Promise<Partial<Settings>> {
  const uri = vscode.Uri.file(path.join(this.workspaceRoot, relativePath));
  try {
    const content = await vscode.workspace.fs.readFile(uri);
    return JSON.parse(content.toString());
  } catch {
    return {};
  }
}
```

### Dependency Graph

Files importing from modules to modify:
- `src/services/task-scanner.ts` (Task 1.3) will import `TaskService` for task operations
- `src/webview/SidebarProvider.ts` may use `TaskService` for task management actions
- `src/extension.ts` will instantiate `TaskService` and pass to other components

Files imported by new module:
- `src/services/frontmatter-service.ts` (parseTaskMarkdown, serializeTaskMarkdown)
- `src/types/task.ts` (Task, TaskFrontmatter, TaskStage types)

### Patterns to Follow

- Use VS Code's `workspace.fs` API for all file operations (not Node fs)
- Use `vscode.Uri.file(path.join(workspaceRoot, relativePath))` for URI construction
- Return `Promise<T>` from all async methods, throw on errors
- Export class-based service with constructor dependency injection
- Use kebab-case for utility functions (e.g., `toKebabCase`)
- Match SettingsService pattern: constructor takes `workspaceRoot: string`

### Test Patterns

Test file: `src/services/task-service.test.ts`
- Mock VS Code's `workspace.fs` API using `node:test` mocks
- Test file paths use temp directory to avoid side effects
- Test patterns:
  - Create task writes valid markdown with frontmatter
  - Read task parses and returns typed Task object
  - Update task modifies only specified fields without clobbering others
  - Delete task removes file from disk
  - Move task updates frontmatter stage and file location
  - Filename collision handling appends counter suffix
  - Missing directory auto-creation

### Gotchas

- VS Code fs methods return `Uint8Array`, convert with `Buffer.from(content).toString('utf-8')`
- `workspace.fs.writeFile` does NOT auto-create parent directories — call `createDirectory` first
- `workspace.fs.createDirectory` is recursive (creates all parent dirs)
- Frontmatter arrays must be explicitly copied to avoid mutation leaks
- Kebab-case conversion: handle edge cases like multiple spaces, leading/trailing non-alphanumerics
- Path separators: Use `path.join()` for cross-platform compatibility

### Scope Boundaries

This task focuses on CRUD operations for individual task files. Do NOT implement:
- Workspace scanning or file watching (Task 1.3: TaskScanner)
- Batch operations or query filtering (Task 1.3)
- Conflict detection or recovery snapshots (Task 1.5: ConflictDetector)
- Settings management (Task 1.4: SettingsService)
- UI components or webview message handling
- Provider/model validation (handled by SettingsService)

TaskService provides the low-level file operations that TaskScanner (1.3) will use for bulk operations.

## Audit

src/services/task-service.ts
src/services/task-service.test.ts
src/types/task.ts
src/services/frontmatter-service.ts
