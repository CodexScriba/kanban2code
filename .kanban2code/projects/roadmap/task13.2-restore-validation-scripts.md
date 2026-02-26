---
stage: plan
agent: planner
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
- [ ] `bun run test:e2e` executes E2E suite
- [ ] `bun run typecheck` executes TypeScript check
- [ ] No regression to existing scripts

## Notes
Created from dogfooding findings in task13.1.
