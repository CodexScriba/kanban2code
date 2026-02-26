---
stage: completed
agent: auditor
tags: [bug, p1]
contexts: []
---

# Restore Validation Scripts

## Goal
Restore the expected package scripts so the documented validation workflow runs as-is.

## Problem
Dogfooding found missing required scripts in `package.json`:
- `bun run test:e2e`
- `bun run typecheck`

This breaks roadmap/DoD workflows that depend on those script names.

## Scope
- Add `test:e2e` script pointing to `vitest run --config vitest.e2e.config.ts`
- Add `typecheck` script pointing to `tsc --noEmit`
- Ensure script names match roadmap documentation
- Add/adjust tests or checks if needed

## Definition of Done
- [x] `bun run test:e2e` executes E2E suite
- [x] `bun run typecheck` executes TypeScript check
- [x] No regression to existing scripts

## Notes
Created from dogfooding findings in task13.1.

## Refined Prompt

Objective: Add missing npm scripts to package.json for test:e2e and typecheck commands.

Implementation approach:
1. Verify package.json scripts section
2. Add `test:e2e` script with value `vitest run --config vitest.e2e.config.ts`
3. Add `typecheck` script with value `tsc --noEmit`
4. Verify scripts work by running them (if environment permits)

Key decisions:
- Script naming: Use exact names `test:e2e` and `typecheck` as documented in roadmap
- Command format: Use `vitest run` for E2E (not `bunx`) to use installed vitest
- No additional flags needed for basic operation

Edge cases:
- Scripts may already exist (idempotent edit)
- Different package manager (bun vs npm) - use commands that work with both

## Context

### File Tree (scoped)
```
├── package.json              <- modify
├── vitest.e2e.config.ts      <- read-only reference
├── tsconfig.json             <- read-only reference
└── tests/
    └── e2e/                  <- test files location
```

### Code Excerpts

package.json current scripts section (lines 81-90):
```json
"scripts": {
  "vscode:prepublish": "bun run package",
  "build": "bun run build.ts",
  "compile": "bun run build.ts",
  "watch": "bun run build.ts --watch",
  "package": "bun run build.ts --production",
  "test": "vitest run",
  "test:e2e": "vitest run --config vitest.e2e.config.ts",
  "typecheck": "tsc --noEmit"
}
```

vitest.e2e.config.ts (lines 1-26):
Config file exists and points to `tests/e2e/**/*.test.ts` pattern.

### Scope Boundaries
- Do NOT fix actual TypeScript errors (handled in task13.3)
- Do NOT fix build bundling issues (handled in task13.4)
- Only add/modify scripts in package.json
- No changes to test files or source code

<!-- STAGE_TRANSITION: audit -->

## Audit
.kanban2code/projects/roadmap/task13.2-restore-validation-scripts.md

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
The required validation scripts are present with the exact documented names and both commands execute successfully. The task meets its scope and DoD with no regressions observed in existing script behavior.

### Findings

#### Blockers
- [x] None.

#### High Priority
- [x] None.

#### Medium Priority
- [x] None.

#### Low Priority / Nits
- [ ] Deprecated Vitest config key: `test.poolOptions` triggers a runtime deprecation warning and should be migrated to Vitest 4 top-level pool options. - `vitest.e2e.config.ts:20`

### Test Assessment
- Coverage: Adequate
- Missing tests: None for this scoped script-restoration task

### What's Good
- `bun run test:e2e` passed (3 files, 18 tests) and `bun run typecheck` completed successfully, directly validating the restored workflow commands.
- Script values match roadmap documentation exactly: `test:e2e` -> `vitest run --config vitest.e2e.config.ts`, `typecheck` -> `tsc --noEmit`.

### Recommendations
- In a follow-up cleanup task, update `vitest.e2e.config.ts` to remove deprecated `poolOptions` usage to keep CI output warning-free on Vitest 4.
