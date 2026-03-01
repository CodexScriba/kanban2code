---
stage: completed
tags:
  - feature
  - p1
  - orchestration-wave1
agent: auditor
contexts:
  - skill-vscode
  - skill-typescript-config
skills: []
---

# FrontmatterService — parse/serialize with normalization

## Goal

Create a service that parses YAML frontmatter from markdown task files, normalizes the `agent` field to `role`, and serializes back to markdown while preserving body content and list fields.

## Definition of Done

- [x] Parses YAML frontmatter from `.md` files using `gray-matter`
- [x] Normalizes `agent` → `role` on read
- [x] Serializes back to `.md` preserving body content
- [x] Preserves list fields: `tags`, `contexts`, `skills`
- [x] Handles missing/malformed frontmatter gracefully

## Files

- `src/services/frontmatter-service.ts` - create - frontmatter parse/serialize/normalize
- `src/types/task.ts` - create - `Task` interface, `TaskStage` type, `Priority` type
- `package.json` - modify - add `gray-matter` dependency

## Tests

- [x] Parses valid frontmatter with all fields
- [x] Normalizes `agent: planner` → `role: planner`
- [x] Round-trips without data loss
- [x] Handles empty/missing frontmatter
- [x] Preserves markdown body content unchanged

## Context

This is the foundation service that all other task operations depend on. The service must handle Unicode escapes in frontmatter (e.g., `\U0001F3DB`) gracefully and maintain backward compatibility with existing task files that use the `agent` field.

The `gray-matter` library is battle-tested for YAML frontmatter parsing and correctly handles `---` delimiters. The service should use this library rather than custom parsing.

List fields (`tags`, `contexts`, `skills`) must be preserved as arrays during round-trip serialization.

## Refined Prompt

Objective: Create a FrontmatterService that parses YAML frontmatter from markdown task files using gray-matter, normalizes the legacy `agent` field to `role`, and serializes back to markdown while preserving body content and array fields.

Implementation approach:
1. Add `gray-matter` dependency to package.json and run install
2. Create `src/types/task.ts` with Task interface, TaskStage type (compatible with existing in messaging.ts), and Priority type
3. Create `src/services/frontmatter-service.ts` with parse(), serialize(), and normalize() functions
4. Parse must handle missing/malformed frontmatter gracefully, returning defaults
5. Normalize must map `agent` → `role` on read while preserving original on write for backward compatibility
6. Serialize must preserve list fields (tags, contexts, skills) as YAML arrays and body content unchanged
7. Run build and typecheck to verify

Key decisions:
- Use gray-matter instead of custom regex: battle-tested, handles edge cases like `---` in body
- TaskStage values: align with existing `src/webview/messaging.ts` ('inbox' | 'capture' | 'plan' | 'code' | 'audit' | 'completed' | 'unknown')
- Normalization direction: only agent→role on parse; keep both fields in serialized output for compatibility
- Graceful degradation: return valid Task object with defaults when frontmatter is missing/invalid

Edge cases:
- Empty frontmatter block (---\n---)
- Malformed YAML syntax (unclosed quotes, invalid indentation)
- Unicode escape sequences in frontmatter values (\U0001F3DB)
- Body content containing `---` (gray-matter handles this)
- Empty or missing list fields should serialize as [] not undefined
- File with no frontmatter at all (just body)

## Context

### File Tree (scoped)
```
src/
├── extension.ts                    # <- read-only reference (orchestrates)
├── services/
│   └── frontmatter-service.ts      # <- create
├── types/
│   └── task.ts                     # <- create
└── webview/
    ├── messaging.ts                # <- read-only reference (TaskStage defined here)
    └── SidebarProvider.ts          # <- read-only reference (current ad-hoc parsing)
package.json                        # <- modify (add gray-matter)
```

### Architecture Excerpts

From `skill-vscode`:
- Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes
- Webview Host (`SidebarProvider` + message bridge) owns serialization/broadcast
- All host/webview communication uses typed envelopes; no ad-hoc payloads

From `src/webview/messaging.ts:1`:
```typescript
export type TaskStage = 'inbox' | 'capture' | 'plan' | 'code' | 'audit' | 'completed' | 'unknown';
```

### Skill Excerpts

From `skill-vscode` — Extension Host Rules:
- `extension.ts` must orchestrate dependencies, not business logic
- Any state-changing action must flow through host logic and persist to filesystem

From `skill-typescript-config` — Module Resolution:
- Use `moduleResolution: "bundler"` for modern bundlers
- TypeScript config provides autocomplete and catches invalid options at compile time

### Code Excerpts

Current ad-hoc stage parsing in `src/webview/SidebarProvider.ts:167-193`:
```typescript
private parseStage(content: string): TaskStage {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return 'unknown';
  }
  const stageLine = frontmatterMatch[1]
    .split('\n')
    .find((line) => line.trimStart().startsWith('stage:'));
  // ... regex-based parsing
}
```
This will be replaced by FrontmatterService calls in Task 1.2.

Existing TaskStage and TaskSnapshotItem in `src/webview/messaging.ts:1-7`:
```typescript
export type TaskStage = 'inbox' | 'capture' | 'plan' | 'code' | 'audit' | 'completed' | 'unknown';

export interface TaskSnapshotItem {
  id: string;
  title: string;
  stage: TaskStage;
}
```

### Dependency Graph

Files importing from new modules (expected in future tasks):
- `src/services/task-service.ts` (Task 1.2) will import `FrontmatterService`
- `src/services/task-scanner.ts` (Task 1.3) may import types from `task.ts`

No existing consumers yet — this is foundational infrastructure.

### Patterns to Follow

- Use strict TypeScript with explicit return types
- Export pure functions from service modules (no classes unless state needed)
- Match error handling pattern: return Result<T, E> or throw with descriptive messages
- Follow existing import style: `import * as vscode from 'vscode'` for VS Code APIs

### Test Patterns

Tests should be in a `__tests__` subdirectory or `*.test.ts` alongside source files.
Use the following patterns:
- Test file: `src/services/frontmatter-service.test.ts`
- Test valid parse, invalid parse, round-trip serialization
- Test edge cases: empty frontmatter, missing fields, unicode escapes

### Gotchas

- gray-matter returns `data` as `any` — type guard or cast carefully
- YAML list fields may parse as single values if not properly formatted — validate arrays
- Do NOT import from 'vscode' in the service — keep it pure for testability
- TaskStage in new types should reference the existing type from messaging.ts or duplicate values

### Scope Boundaries

This task is foundational — it only provides parse/serialize utilities. Do NOT implement:
- File I/O operations (Task 1.2: TaskService handles CRUD)
- File watching or workspace scanning (Task 1.3: TaskScanner handles discovery)
- Task creation with timestamp-based filenames (Task 1.2)
- Settings management (Task 1.4: SettingsService)
- Conflict detection (Task 1.5: ConflictDetector)

## Audit

src/services/frontmatter-service.ts
src/services/frontmatter-service.test.ts
package.json
package-lock.json

---

## Review

**Rating: 7/10**

**Verdict: NEEDS WORK**

### Summary
Implementation is close and most required behaviors are present, but there is a mutable-default correctness bug and the added tests are not currently executable in the repo setup.

### Findings

#### Blockers
- [ ] Shared default array references can leak state across parses when callers mutate result arrays (e.g. `tags.push(...)` on a no-frontmatter parse affects later parses). Return fresh arrays for defaults in all code paths. - `src/services/frontmatter-service.ts:47`

#### High Priority
- [ ] Test file cannot run as-is with the current project tooling (`ERR_MODULE_NOT_FOUND` for `./frontmatter-service` under Node test execution), so the claimed test coverage is not verifiable in automation yet. - `src/services/frontmatter-service.test.ts:3`

#### Medium Priority
- [ ] No test currently covers the Unicode escape case called out in task context (`\U0001F3DB`), leaving that requirement unverified. - `src/services/frontmatter-service.test.ts:5`

#### Low Priority / Nits
- [ ] `TaskStage` is duplicated instead of sourced from the existing canonical type, which may drift over time. - `src/types/task.ts:1`

### Test Assessment
- Coverage: Needs improvement
- Missing tests: Unicode escape frontmatter parsing; mutation-safety regression for default arrays; runnable test command/script integration

### What's Good
- Clean separation of parse/normalize/serialize logic, proper use of `gray-matter`, and good handling of malformed frontmatter fallback paths.

### Recommendations
- Use a `createDefaultFrontmatter()` factory (or deep clone) to avoid shared mutable defaults, and wire tests into a project-level runnable command before re-audit.

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
The previously reported issues were addressed: defaults are now safely recreated per parse, test execution is wired into `npm test`, and Unicode escape handling is covered by tests.

### Findings

#### Blockers
- [ ] None.

#### High Priority
- [ ] None.

#### Medium Priority
- [ ] None.

#### Low Priority / Nits
- [ ] `TaskStage` remains duplicated rather than imported from a shared source; acceptable for now but worth consolidating in a later refactor. - `src/types/task.ts:1`

### Test Assessment
- Coverage: Adequate
- Missing tests: None identified for this task's definition of done

### What's Good
- Regression tests now cover malformed frontmatter, default-array mutation safety, and Unicode escape parsing while preserving round-trip behavior.

### Recommendations
- Optional future cleanup: centralize shared stage/priority types to avoid drift across modules.
