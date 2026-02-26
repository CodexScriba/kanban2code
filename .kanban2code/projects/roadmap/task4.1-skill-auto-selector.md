stage: completed
agent: auditor
tags: [feature, p1]
contexts: []
---

# Skill Auto-Selector

## Goal
Given conversation text and the current workspace, return the right skill files to attach to the orchestrator call.

## Definition of Done
- [x] Given a Next.js workspace and "add dashboard with caching", returns nextjs-core-skills.md + skill-caching-data-fetching.md in the right order.

## Files
- `src/services/skill-selector.ts` - create - detectFrameworks, selectSkills, loadSkillContents
- `src/types/skill.ts` - create - SelectedSkill interface, SkillsIndex schema

## Tests
- [x] tests/skill-selector.test.ts - unit tests for framework detection, keyword matching, ordering

## Refined Prompt

Objective: Create a skill auto-selection service that analyzes conversation text and workspace context to return the most relevant skill files for the orchestrator.

Implementation approach:
1. Define `SelectedSkill` interface in `src/types/skill.ts` with: id, name, path, content, priority, reason (why selected)
2. Define `SkillsIndex` type for caching loaded skill metadata
3. Implement `detectFrameworks(text: string): string[]` in skill-selector.ts - extracts framework hints (nextjs, react, python) from text and file paths
4. Implement `selectSkills(kanbanRoot: string, conversationText: string): Promise<SelectedSkill[]>` that:
   - Loads all available skills via `listAvailableSkills()`
   - Checks `alwaysAttach` flag first (always include these)
   - Matches triggers against conversation text (case-insensitive substring match)
   - Matches framework field against detected frameworks
   - Scores skills by: alwaysAttach > framework match + trigger match > trigger match only
   - Sorts by priority (high > medium > low), then by match score
   - Returns top N skills (configurable, default 5)
5. Implement `loadSkillContents(kanbanRoot: string, skillIds: string[]): Promise<SelectedSkill[]>` to hydrate with content
6. Create unit tests with fixture skills directory and sample conversations

Key decisions:
- Framework detection looks for: nextjs/next.js, react, python, django, flask, etc. in text
- Trigger matching is substring-based (e.g., "cache" matches "caching", "cached")
- Skills with `alwaysAttach: true` are always included regardless of matching
- Priority ordering: high > medium > low > undefined (from SkillFile.priority)
- Multiple framework matches accumulate (Next.js + React = higher score)
- Return hydrated SelectedSkill with full content, not just IDs

Edge cases:
- No skills match: return empty array (or just alwaysAttach skills)
- Skills directory doesn't exist: return empty array gracefully
- Duplicate skill matches: dedupe by ID, keep highest score
- Conversation text is empty: return only alwaysAttach skills
- Framework-specific and trigger-specific matches overlap: include both, dedupe

## Context

### File Tree (scoped)
```
src/
├── types/
│   ├── skill.ts              # <- create
│   └── snapshot.ts           # <- read-only reference (SkillFile[] pattern)
├── services/
│   ├── skill-selector.ts     # <- create
│   └── context.ts            # <- read-only reference (SkillFile interface, listAvailableSkills)
└── tests/
    └── skill-selector.test.ts # <- create
```

### Architecture Excerpts
Source: `src/services/context.ts:18-27` - SkillFile interface with metadata fields:
```typescript
export interface SkillFile {
  id: string;
  name: string;
  description: string;
  path: string;
  framework?: string;        // e.g., "Next.js", "React", "Python"
  priority?: 'high' | 'medium' | 'low';
  alwaysAttach?: boolean;    // Always include this skill
  triggers?: string[];       // Keywords that trigger this skill
}
```

Source: `src/services/context.ts:112-192` - `listAvailableSkills()` loads all skills with metadata from frontmatter.

Source: `.kanban2code/_context/skills/nextjs-core-skills.md:1-19` - Example skill file frontmatter:
```yaml
---
skill_name: nextjs-core-skills
framework: Next.js
always_attach: true
priority: 10
triggers:
  - nextjs
  - next.js
  - app router
---
```

Source: `.kanban2code/_context/skills/skill-caching-data-fetching.md:1-20` - Example specialized skill:
```yaml
---
skill_name: skill-caching-data-fetching
framework: Next.js
always_attach: false
priority: 8
triggers:
  - cache
  - fetch
  - revalidate
---
```

### Skill Excerpts
No specific skill guidance needed beyond general conventions.

### Code Excerpts

`src/services/context.ts:112-192` - Skill loading pattern to reuse:
```typescript
export async function listAvailableSkills(kanbanRoot: string): Promise<SkillFile[]> {
  const skillsDir = path.join(kanbanRoot, CONTEXT_FOLDER, 'skills');
  // ... walks directory, parses frontmatter, returns SkillFile[]
  return skills.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
    const pA = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3;
    const pB = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3;
    if (pA !== pB) return pA - pB;
    return a.name.localeCompare(b.name);
  });
}
```

`src/services/context.ts:514-542` - Skill content loading pattern:
```typescript
export async function loadSkills(root: string, skillIds?: string[] | null): Promise<string> {
  if (!skillIds || skillIds.length === 0) return '';
  const skillsDir = path.join(CONTEXT_FOLDER, 'skills');
  const contents = await Promise.all(
    skillIds.map(async (skillId) => {
      const normalized = ensureExtension(skillId);
      const skillPath = path.join(skillsDir, normalized);
      return readFileIfExists(root, skillPath);
    }),
  );
  return contents.filter(Boolean).join('\n\n');
}
```

`src/types/snapshot.ts:1-5` - Type imports pattern:
```typescript
import type { SkillFile } from '../services/context';
// Reuse existing types rather than redefining
```

### Dependency Graph

Files that will import skill-selector:
- `src/services/prompt-builder.ts` - likely consumer for orchestrator prompts
- `src/orchestrator/system-prompt-builder.ts` (task 5.1) - will use selectSkills()

Files that skill-selector imports from:
- `src/services/context.ts` - `listAvailableSkills()`, `SkillFile` interface
- `src/core/constants.ts` - `CONTEXT_FOLDER` constant

### Patterns to Follow
- Use existing `listAvailableSkills()` to load skill metadata - don't reimplement file walking
- Use `SkillFile` interface from context.ts - don't redefine
- Follow test pattern from `tests/workspace-snapshot.test.ts`: temp dir, beforeEach/afterEach
- Use vitest for testing: `import { expect, test, describe, beforeEach, afterEach } from 'vitest'`
- Sort results by priority first, then by relevance score
- No barrel exports - import directly from source files

### Test Patterns
Create fixture skills in temp directory:
```typescript
const TEST_DIR = path.join(os.tmpdir(), 'skill-selector-test-' + Date.now());
const KANBAN_ROOT = path.join(TEST_DIR, '.kanban2code');
const SKILLS_DIR = path.join(KANBAN_ROOT, '_context', 'skills');

beforeEach(async () => {
  await fs.mkdir(SKILLS_DIR, { recursive: true });
  // Write test skill files with frontmatter
});

afterEach(async () => {
  await fs.rm(TEST_DIR, { recursive: true, force: true });
});
```

Test cases to include:
- Framework detection (nextjs, react, python)
- Trigger matching (keyword substrings)
- alwaysAttach flag handling
- Priority ordering
- Multiple framework overlap
- Empty/no-match scenarios

### Gotchas
- `always_attach` in frontmatter maps to `alwaysAttach` in SkillFile (snake_case -> camelCase)
- `skill_name` in frontmatter maps to `name` field
- Skills can have `priority: 10` (numeric) but SkillFile interface defines it as 'high'|'medium'|'low' - handle both
- Framework field is case-sensitive ("Next.js" !== "nextjs")
- Return full content in SelectedSkill, not just metadata

### Scope Boundaries

**This task (4.1) focuses on:**
- Skill selection logic based on conversation text
- Framework detection from text and file paths
- Keyword/trigger matching
- Returning hydrated skill objects with content

**Out of scope (handled by other tasks):**
- Task 3.1 (completed): Workspace snapshot service - already provides skill listing
- Task 5.1 (pending): Orchestrator service - will consume selectSkills(), don't implement API calls here
- Don't implement HTTP clients, provider APIs, or streaming - that's task 5.1
- Don't integrate into prompt-builder yet - just expose the service function

The skill selector is a pure service function that takes text and returns skills. The orchestrator (task 5.1) will call it and attach skills to system prompts.

## Audit
src/services/skill-selector.ts
src/types/skill.ts
tests/skill-selector.test.ts

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
Implementation is clean, tested, and satisfies the defined outcome for Next.js + caching selection with correct ordering. One requirement-alignment gap remains in trigger matching semantics (`cache` does not match `caching` with current logic).

### Findings

#### Blockers
- [ ] None.

#### High Priority
- [ ] None.

#### Medium Priority
- [ ] Trigger stemming mismatch: `triggerMatches()` uses `normalized.includes(trigger)`, so `cache` will not match `caching` despite task guidance expecting that behavior; currently this is masked in the DoD example by framework matching. - `src/services/skill-selector.ts:43`

#### Low Priority / Nits
- [ ] Minor efficiency note: numeric priority requires re-reading every skill file via `gray-matter` although metadata was already loaded by `listAvailableSkills()`. This is acceptable at current scale but may become expensive as skills grow. - `src/services/skill-selector.ts:63`

### Test Assessment
- Coverage: Adequate
- Missing tests: Add a direct assertion for morphological trigger behavior (`cache` -> `caching`/`cached`) to lock intended semantics.

### What's Good
- Strong unit coverage for ordering, always-attach behavior, hydration, and empty/missing-skill scenarios.
- Good separation of concerns across `detectFrameworks`, selection/scoring, and hydration helpers.
- Robust failure handling when files are missing or unreadable.

### Recommendations
- If strict requirement compliance is desired, switch trigger matching to token-prefix/regex stemming logic and add tests for `cache`, `caching`, and `cached`.
