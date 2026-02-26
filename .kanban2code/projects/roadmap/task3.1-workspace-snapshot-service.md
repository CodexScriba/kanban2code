---
stage: completed
agent: auditor
tags: [feature, p1]
contexts: []
---

# Workspace Snapshot Service

## Goal
A single function that returns a clean JSON snapshot of everything the orchestrator needs to know.

## Definition of Done
- [x] `buildWorkspaceSnapshot()` returns correct data from a fixture workspace, test passes.

## Files
- `src/services/workspace-snapshot.ts` - create - buildWorkspaceSnapshot(kanbanRoot: string): Promise<WorkspaceSnapshot>
- `src/types/snapshot.ts` - create - WorkspaceSnapshot interface

## Tests
- [x] tests/workspace-snapshot.test.ts - unit test against a temp workspace

## Refined Prompt

Objective: Create a workspace snapshot service that aggregates all Kanban2Code workspace state into a single JSON structure for orchestrator consumption.

Implementation approach:
1. Define `WorkspaceSnapshot` interface in `src/types/snapshot.ts` containing: config, tasks (grouped by stage), agents list, contexts list, skills list, providers list
2. Implement `buildWorkspaceSnapshot(kanbanRoot: string)` in `src/services/workspace-snapshot.ts` that loads data using existing services (configService, loadAllTasks, listAvailableAgents, listAvailableContexts, listAvailableSkills)
3. Group tasks by stage in the snapshot (inbox, plan, code, audit, completed)
4. Include counts and metadata for quick orchestrator decisions
5. Create unit test with temporary workspace fixture in `tests/workspace-snapshot.test.ts`

Key decisions:
- Snapshot returns raw data, not XML: Keeps it flexible for different orchestrator formats
- Use existing scanner/service functions: Avoid code duplication, ensures consistency
- Group tasks by stage: Most orchestrator queries are stage-centric
- Config loaded via configService singleton: Follows existing pattern

Edge cases:
- Empty workspace (no tasks): Return empty arrays, not errors
- Missing config.json: configService returns DEFAULT_CONFIG
- Kanban root doesn't exist: Function should throw clear error
- Invalid task files: scanner filters them out (graceful degradation)

## Context

### File Tree (scoped)
```
src/
├── types/
│   ├── task.ts              # <- read-only reference (Task interface)
│   ├── config.ts            # <- read-only reference (Kanban2CodeConfig)
│   └── snapshot.ts          # <- create
├── services/
│   ├── scanner.ts           # <- read-only reference (loadAllTasks)
│   ├── context.ts           # <- read-only reference (listAvailableAgents, listAvailableContexts, listAvailableSkills)
│   ├── config.ts            # <- read-only reference (configService singleton)
│   └── workspace-snapshot.ts # <- create
├── core/
│   └── constants.ts         # <- read-only reference
└── tests/
    └── workspace-snapshot.test.ts # <- create
```

### Architecture Excerpts
Source: `.kanban2code/_context/ai-guide.md`
- Task files are markdown with optional YAML frontmatter
- Stages: `inbox -> plan -> code -> audit -> completed`
- Context assembled in layers: global context files, agent instructions, project/phase context

Source: `src/core/constants.ts`
- `KANBAN_FOLDER = '.kanban2code'`
- `INBOX_FOLDER = 'inbox'`
- `PROJECTS_FOLDER = 'projects'`
- `AGENTS_FOLDER = '_agents'`
- `CONTEXT_FOLDER = '_context'`
- `PROVIDERS_FOLDER = '_providers'`

### Skill Excerpts
No specific skill guidance needed beyond general conventions.

### Code Excerpts

`src/types/task.ts:1-20` - Task interface used in snapshot:
```typescript
export type Stage = 'inbox' | 'plan' | 'code' | 'audit' | 'completed';

export interface Task {
  id: string;
  filePath: string;
  title: string;
  stage: Stage;
  project?: string;
  phase?: string;
  agent?: string;
  provider?: string;
  parent?: string;
  tags?: string[];
  contexts?: string[];
  skills?: string[];
  order?: number;
  created?: string;
  attempts?: number;
  content: string;
}
```

`src/types/config.ts:53-62` - Config structure for snapshot:
```typescript
export interface Kanban2CodeConfig {
  version: string;
  project?: ProjectConfig;
  agents: Record<string, AgentConfig>;
  tags: TagsConfig;
  stages: Record<string, StageConfig>;
  preferences: PreferencesConfig;
  personalities?: Record<string, PersonalityConfig>;
  providerDefaults?: Record<string, string>;
}
```

`src/services/scanner.ts:30-50` - Loading tasks:
```typescript
export async function loadAllTasks(kanbanRoot: string): Promise<Task[]> {
  const files = await findAllTaskFiles(kanbanRoot);
  const tasks: Task[] = [];
  const errors: Error[] = [];
  await Promise.all(
    files.map(async (file) => {
      try {
        const task = await parseTaskFile(file);
        tasks.push(task);
      } catch (err: any) {
        console.error(`Failed to load task: ${file}`, err);
        errors.push(err);
      }
    })
  );
  return sortTasks(tasks);
}
```

`src/services/config.ts:18-37` - Config service singleton pattern:
```typescript
class ConfigService {
  private config: Kanban2CodeConfig = DEFAULT_CONFIG;
  private kanbanRoot: string | null = null;
  
  async initialize(kanbanRoot: string): Promise<void> {
    this.kanbanRoot = kanbanRoot;
    await this.loadConfig();
    this.setupWatcher();
  }
  
  getConfig(): Kanban2CodeConfig {
    return this.config;
  }
}
export const configService = new ConfigService();
```

`src/services/context.ts:10-34` - Types for agents/contexts/skills:
```typescript
export interface ContextFile {
  id: string;
  name: string;
  description: string;
  path: string;
  scope?: 'global' | 'project';
}

export interface SkillFile {
  id: string;
  name: string;
  description: string;
  path: string;
  framework?: string;
  priority?: 'high' | 'medium' | 'low';
  alwaysAttach?: boolean;
  triggers?: string[];
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  path: string;
}
```

### Dependency Graph

Files that import scanner (consumers of task data):
- `src/runner/runner-engine.ts` - uses `loadAllTasks`, `getOrderedTasksForStage`
- `src/services/task-content.ts` - uses `findTaskById`, `loadAllTasks`
- `src/services/stage-manager.ts` - uses `findTaskById`
- `src/services/delete-task.ts` - uses `findTaskById`, `loadAllTasks`

Files that import context service:
- `src/services/prompt-builder.ts` - uses `loadGlobalContext`, `listAvailableAgents`, `loadSkills`

### Patterns to Follow
- Use `configService.initialize(kanbanRoot)` before accessing config
- Use existing `loadAllTasks()` for task loading (handles file scanning + parsing)
- Use `listAvailableAgents()`, `listAvailableContexts()`, `listAvailableSkills()` for metadata
- Follow existing test pattern: use `os.tmpdir()` for temp test directories, `beforeEach`/`afterEach` for setup/teardown
- Import from relative paths (`../types/snapshot`, `../services/context`)
- No barrel exports (index.ts) in this codebase - import directly from source files

### Test Patterns
Source: `tests/scanner.test.ts`, `tests/context-service.test.ts`
- Use vitest: `import { expect, test, describe, afterEach, beforeEach } from 'vitest'`
- Use `fs/promises` for file operations
- Create temp dir with `path.join(os.tmpdir(), 'prefix-' + Date.now())`
- Construct kanban root: `path.join(TEST_DIR, KANBAN_FOLDER)`
- Clean up with `fs.rm(TEST_DIR, { recursive: true, force: true })` in `afterEach`
- Create fixture files with `fs.writeFile()` and `fs.mkdir(..., { recursive: true })`
- Import constants from `src/core/constants`

### Gotchas
- ConfigService is a singleton: must call `initialize()` before use; snapshot function should initialize it
- Stage values are defined in `STAGES` constant from `src/core/constants.ts`
- Task project/phase are inferred from file path, not frontmatter (see `inferProjectAndPhase` in frontmatter.ts)
- Provider listing: no dedicated service exists; scan `_providers/` folder directly using `fs.readdir` or similar

### Scope Boundaries
No sibling tasks in roadmap phase - this task is standalone for workspace snapshot service.

## Audit
src/types/snapshot.ts
src/services/workspace-snapshot.ts
tests/workspace-snapshot.test.ts

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
Implementation matches the definition of done and produces a clean, stage-grouped workspace snapshot with useful metadata. Test coverage is good for core behavior and key edge cases, and all reviewed tests pass.

### Findings

#### Blockers
- [x] None.

#### High Priority
- [x] None.

#### Medium Priority
- [x] None.

#### Low Priority / Nits
- [x] None.

### Test Assessment
- Coverage: Adequate
- Missing tests: No critical gaps identified for this task scope.

### What's Good
- Reuses existing services (`configService`, scanner/context/provider services) to avoid duplication and keep behavior consistent with the rest of the codebase.
- Includes explicit invalid-root error handling and complete metadata counts for orchestrator decision-making.
- Unit tests cover populated fixture, empty workspace/default config behavior, and clear missing-root failure.

### Recommendations
- Consider adding a future test for graceful handling when a malformed task file exists alongside valid files, to explicitly lock in scanner-degradation behavior at snapshot level.
