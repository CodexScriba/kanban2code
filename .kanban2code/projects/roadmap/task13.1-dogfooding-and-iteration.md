---
stage: completed
agent: auditor
tags: [chore, p1]
contexts: []
---

# Dogfooding and Iteration

## Goal
Use Kanban2Code V2 to build Kanban2Code V2 features. Find what's missing by using it daily.

## Definition of Done
- [ ] Dogfooding complete, issues identified and addressed.

## Files
- No production files modified in this task
- Findings documented in this task file
- Follow-up tasks created for code fixes

## Refined Prompt

Objective: Execute dogfooding process to validate Kanban2Code V2 functionality by using it to build V2 features, identify gaps, and document findings for iteration.

Implementation approach:
1. Run E2E tests to verify baseline functionality: `bun run test` and `bun run test:e2e`
2. Verify build pipeline: `bun run typecheck` and `bun run build`
3. Perform daily usage simulation of core workflows:
   - Chat -> Task File generation flow
   - Task File -> Terminal execution flow
   - Skill auto-selection with various conversation prompts
   - Workspace snapshot accuracy
4. Document friction points, bugs, and missing features encountered
5. Cross-reference findings with Phase 12 Hardening checklist from roadmap
6. Update this task file with findings and recommendations

Key decisions:
- Testing scope: Focus on workflows defined in Phase 12 E2E scenarios
- Issue severity: Classify findings as Blocker/High/Medium/Low
- Follow-up actions: Create new tasks for issues requiring code changes

Edge cases:
- Test with missing API keys (graceful degradation)
- Test with malformed skill files
- Test with concurrent task operations
- Test cancellation at various stages

## Execution Log
- `bun run test` -> PASS (`37` files, `282` tests)
- `bun run test:e2e` -> FAIL (`Script not found "test:e2e"`)
- `bun run typecheck` -> FAIL (`Script not found "typecheck"`)
- `bun run build` -> FAIL (webview bundle resolves Node built-ins `fs/promises`, `path`)
- `bunx vitest run --config vitest.e2e.config.ts` -> PASS (`3` files, `18` tests)
- `bunx tsc --noEmit` -> FAIL (webview/message typing errors in `src/webview/SidebarProvider.ts`, `src/webview/ui/App.tsx`, `src/webview/messaging.ts`)

## Dogfooding Findings

### Blocker
1. Missing required scripts in `package.json`
- Issue: `test:e2e` and `typecheck` scripts are missing.
- Impact: Documented validation commands for roadmap tasks cannot run as written.
- Recommendation: Add both scripts to align with roadmap workflow.
- Follow-up: `task13.2-restore-validation-scripts.md`

2. Build pipeline failure in current mainline
- Issue: `bun run build` fails due to Node-only modules entering webview bundle graph.
- Impact: Build baseline for dogfooding/hardening is not green.
- Recommendation: Fix extension/webview boundary or bundling config so webview excludes Node-only imports.
- Follow-up: `task13.4-fix-build-node-builtin-bundling.md`

3. Typecheck regression in webview messaging/state surfaces
- Issue: `tsc --noEmit` fails with multiple discriminated-union/schema typing issues.
- Impact: Type safety gate is currently red, increasing regression risk.
- Recommendation: Correct message envelope narrowing and payload/schema typing.
- Follow-up: `task13.3-fix-webview-typecheck-regressions.md`

### Medium
1. Hardening checklist coverage gap for “cancel on sidebar close”
- Issue: Cancellation behavior is represented (`CancelStream` flow + `onDidDispose` watcher cleanup), but there is no direct test proving stream cancellation specifically on sidebar close/dispose.
- Impact: Potential lifecycle edge-case remains unverified.
- Recommendation: Add explicit disposal/cancellation coverage in a follow-up hardening test task.

## Phase 12 Hardening Checklist Validation
- [ ] Streaming response cancelled cleanly when user closes sidebar
  Evidence: `CancelStream` protocol exists and is tested; direct sidebar-close cancellation test not found.
- [ ] Task generator rejects malformed proposals gracefully
  Evidence: `parseTaskProposal` returns `null` on invalid proposal, but current tests cover happy-path only.
- [x] Terminal executor warns if prompt exceeds 50k characters
  Evidence: `tests/terminal-executor.test.ts` includes explicit warning test.
- [x] Skills not found logs warning, continues without skill
  Evidence: `tests/integration/skill-selector.test.ts` validates malformed/empty skills gracefully and continues.
- [ ] Provider API key missing -> clear error message in chat
  Evidence: orchestrator throws clear missing-key error; explicit chat-bubble level assertion not found.
- [x] Task watcher debounce prevents snapshot rebuild storm
  Evidence: `tests/task-watcher.test.ts` validates debounced update behavior.

## Follow-Up Tasks Created
- `.kanban2code/projects/roadmap/task13.2-restore-validation-scripts.md`
- `.kanban2code/projects/roadmap/task13.3-fix-webview-typecheck-regressions.md`
- `.kanban2code/projects/roadmap/task13.4-fix-build-node-builtin-bundling.md`

## Audit
.kanban2code/projects/roadmap/task13.1-dogfooding-and-iteration.md
.kanban2code/projects/roadmap/task13.2-restore-validation-scripts.md
.kanban2code/projects/roadmap/task13.3-fix-webview-typecheck-regressions.md
.kanban2code/projects/roadmap/task13.4-fix-build-node-builtin-bundling.md

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
The dogfooding pass is documented clearly, surfaced real baseline breakages, and created focused follow-up tasks to resolve each blocker. This satisfies the task goal for iterative validation and issue capture.

### Findings

#### Blockers
- None.

#### High Priority
- None.

#### Medium Priority
- [ ] Edge-case execution evidence is partial: concurrent task operations and cancellation-at-multiple-stages are listed in the refined prompt but not explicitly evidenced in the execution log/results.

#### Low Priority / Nits
- [ ] Definition of Done checkbox remains unchecked despite completion-level findings and follow-up task creation.

### Test Assessment
- Coverage: Needs improvement
- Missing tests: explicit sidebar-close cancellation assertion; malformed task proposal rejection test; missing-provider-key chat-surface assertion

### What's Good
- Blockers were translated into concrete follow-up tasks with clear goals, scope, and DoD (`task13.2`, `task13.3`, `task13.4`).
- Hardening checklist traceability is strong and links findings to current test coverage.
- Commands and outcomes are recorded with enough detail to reproduce baseline status.

### Recommendations
- Add a small reproducibility matrix in future dogfooding tasks mapping each planned scenario to evidence (command, test name, or manual check result).
