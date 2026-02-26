---
stage: completed
agent: auditor
contexts: []
---

# Task File Generator

## Goal
When the orchestrator proposes a task, one function writes the .md file with correct frontmatter and returns the file path.

## Definition of Done
- [x] Parsing a mock orchestrator response produces a valid .md file that parseTaskFile() reads back without errors.

## Files
- `src/services/task-generator.ts` - create - parseTaskProposal, generateTaskFile
- `src/types/task-proposal.ts` - create - TaskProposal interface

## Tests
- [x] tests/task-generator.test.ts - parse proposal from mock response, verify written file has correct frontmatter

## Refined Prompt

Objective: Create a service that parses orchestrator task proposals and generates valid task .md files with correct frontmatter.

Implementation approach:
1. Define `TaskProposal` interface in `src/types/task-proposal.ts` with fields: title, description (markdown body), stage, agent?, tags?, project?, phase?, contexts?, skills?
2. Implement `parseTaskProposal(responseText: string): TaskProposal | null` in `src/services/task-generator.ts` - extracts structured task proposal from orchestrator response (look for fenced YAML block or JSON)
3. Implement `generateTaskFile(kanbanRoot: string, proposal: TaskProposal): Promise<string>` - writes .md file to appropriate location, returns relative file path
4. Use `stringifyTaskFile()` from `src/services/frontmatter.ts` to serialize the task with proper frontmatter
5. Use `ensureSafePath()` from `src/workspace/validation.ts` to validate target paths for security
6. Determine file location: inbox (if no project) or projects/{project}/{phase?}/
7. Generate filename from title (kebab-case, truncated if too long) with .md extension
8. Ensure target directory exists using `fs.mkdir({ recursive: true })`
9. Write test that mocks an orchestrator response, parses it, generates file, then reads it back with `parseTaskFile()` verifying all fields match

Key decisions:
- Proposal format: Support fenced YAML block (```yaml) in orchestrator response for easy parsing
- Filename generation: kebab-case from title, max 50 chars, ensure uniqueness by appending counter if needed
- Location logic: inbox for capture tasks, projects/{project}/{phase}/ for project tasks
- Stage validation: Only allow valid Stage values ('inbox' | 'plan' | 'code' | 'audit' | 'completed')
- Defaults: stage defaults to 'inbox', tags defaults to [], contexts/skills default to []

Edge cases:
- Proposal block not found in response: return null from parseTaskProposal
- Invalid stage value: default to 'inbox' with warning
- Path traversal attempt: throw error via ensureSafePath
- Directory creation fails: propagate filesystem error
- Filename collision: append -1, -2, etc. until unique
- Title is empty or whitespace-only: use 'untitled-task' as base filename

Questions: None

## Context

### File Tree (scoped)
```
src/
├── types/
│   ├── task.ts                 # <- read-only reference - Task interface
│   └── task-proposal.ts        # <- create - TaskProposal interface
├── services/
│   ├── frontmatter.ts          # <- read-only reference - stringifyTaskFile
│   ├── task-generator.ts       # <- create - parseTaskProposal, generateTaskFile
│   └── scanner.ts              # <- read-only reference - loadAllTasks pattern
├── workspace/
│   └── validation.ts           # <- read-only reference - ensureSafePath
└── tests/
    └── task-generator.test.ts  # <- create - unit tests
```

### Architecture Excerpts
Source: `kanban2codev2.md:424-445` - Phase 6 Task File Generator spec:
```
Files to create (new):
- src/services/task-generator.ts
  - parseTaskProposal(responseText: string): TaskProposal | null
  - generateTaskFile(kanbanRoot: string, proposal: TaskProposal): Promise<string>
  - Uses stringifyTaskFile() from src/services/frontmatter.ts
  - Uses ensureSafePath() from src/workspace/validation.ts
- src/types/task-proposal.ts
  - TaskProposal — title, description (markdown body), stage, agent?, tags?, project?, phase?
```

Source: `src/types/task.ts:1-20` - Stage type and Task interface:
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
  tags?: string[];
  contexts?: string[];
  skills?: string[];
  content: string;
}
```

Source: `src/services/frontmatter.ts:102-147` - stringifyTaskFile signature:
```typescript
export function stringifyTaskFile(
  task: Task,
  originalContent?: string,
  options?: ParseOptions,
): string
```

Source: `src/workspace/validation.ts:66-70` - ensureSafePath:
```typescript
export async function ensureSafePath(root: string, target: string): Promise<void> {
  if (!(await isSafePath(root, target))) {
    throw new Error(`Path validation failed: '${target}' is outside valid root.`);
  }
}
```

Source: `src/core/constants.ts:1-13` - folder constants:
```typescript
export const INBOX_FOLDER = 'inbox';
export const PROJECTS_FOLDER = 'projects';
export const STAGES: Stage[] = ['inbox', 'plan', 'code', 'audit', 'completed'];
```

### Skill Excerpts
No specific skill guidance needed beyond general conventions.

### Code Excerpts
`src/services/scanner.ts` - task loading pattern (simplified):
```typescript
// Pattern for loading/writing files with async fs operations
export async function loadAllTasks(kanbanRoot: string): Promise<Task[]> {
  // Uses fs.readdir, fs.readFile with Promise.all
}
```

`tests/skill-selector.test.ts:1-21` - test pattern reference:
```typescript
import { afterEach, beforeEach, expect, test } from 'vitest';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
// Uses temp dir, beforeEach/afterEach cleanup
```

### Dependency Graph
Files that will import task-generator:
- `src/webview/SidebarProvider.ts` (task 9.1) - will call generateTaskFile for "Generate .md" action
- Future: Chat UI components for task capture flow

Files that task-generator imports from:
- `src/types/task.ts` - Task, Stage types
- `src/services/frontmatter.ts` - stringifyTaskFile
- `src/workspace/validation.ts` - ensureSafePath
- `src/core/constants.ts` - INBOX_FOLDER, PROJECTS_FOLDER, STAGES

### Patterns to Follow
- No barrel exports - import directly from source files
- Use vitest for testing: `import { expect, test, describe, beforeEach, afterEach } from 'vitest'`
- Use temp directory pattern in tests: `path.join(os.tmpdir(), 'prefix-' + Date.now())`
- Use `beforeEach`/`afterEach` for test setup/cleanup with `fs.rm(TEST_DIR, { recursive: true, force: true })`
- Use async/await consistently for filesystem operations
- Validate all paths with ensureSafePath before writing
- Use gray-matter compatible frontmatter structure

### Test Patterns
Test structure from `tests/skill-selector.test.ts`:
```typescript
let TEST_DIR: string;
let KANBAN_ROOT: string;

beforeEach(async () => {
  TEST_DIR = path.join(os.tmpdir(), 'task-gen-test-' + Date.now());
  KANBAN_ROOT = path.join(TEST_DIR, '.kanban2code');
  await fs.mkdir(path.join(KANBAN_ROOT, 'inbox'), { recursive: true });
});

afterEach(async () => {
  await fs.rm(TEST_DIR, { recursive: true, force: true });
});
```

### Gotchas
- project/phase must NOT be written to frontmatter (they're inferred from path by parseTaskFile)
- id is derived from filename, not stored in frontmatter
- created timestamp should be ISO format if set
- ensureSafePath check must happen before any file write operations
- StringifyTaskFile requires a Task object with all required fields populated

### Scope Boundaries
**This task (6.1) focuses on:**
- Parsing orchestrator responses for task proposals
- Generating valid task .md files with correct frontmatter
- Writing to correct location (inbox vs projects/)
- Unit tests with mock responses

**Out of scope (handled by other tasks):**
- Task 5.1 (completed): Orchestrator service - provides the response text to parse
- Task 7.1 (pending): Terminal executor - runs tasks, not related to task generation
- Task 9.1 (pending): Chat UI - calls generateTaskFile, don't implement UI here
- Don't implement the orchestrator itself or LLM calling
- Don't implement file watching or board updates (task-watcher handles that)
- Don't implement task editing or stage transitions (stage-manager handles that)

## Audit
src/types/task-proposal.ts
src/services/task-generator.ts
tests/task-generator.test.ts
.kanban2code/projects/roadmap/task6.1-task-file-generator.md

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
Implementation meets the Definition of Done: a mock orchestrator response is parsed, a task file is generated, and `parseTaskFile()` reads it back successfully with expected metadata. The core design is clean and aligns with existing frontmatter and path-safety utilities.

### Findings

#### Blockers
- [x] None.

#### High Priority
- [x] None.

#### Medium Priority
- [ ] Missing edge-case coverage: current tests only cover the happy path and do not validate invalid stage fallback, filename collision handling, JSON proposals, inbox path behavior, or traversal-like project/phase inputs. - `tests/task-generator.test.ts:18`

#### Low Priority / Nits
- [x] None.

### Test Assessment
- Coverage: Needs improvement
- Missing tests: JSON fenced block parsing, invalid/missing fields handling, invalid `stage` fallback to `inbox`, filename uniqueness (`-1`, `-2`), and project/phase sanitization/path constraints.

### What's Good
- Reuses existing primitives correctly (`stringifyTaskFile`, `ensureSafePath`) and keeps project/phase out of frontmatter as expected.
- Parsing logic is resilient to both YAML and JSON fenced blocks, with normalization of optional arrays.

### Recommendations
- Add a compact edge-case test suite for parser and path/filename behavior to reduce regression risk as orchestrator formats evolve.
