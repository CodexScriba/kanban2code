---
stage: plan
agent: planner
tags: [bug, p1]
contexts: []
---

# Fix Webview Typecheck Regressions

## Goal
Resolve current TypeScript compilation failures in webview messaging/state handling.

## Problem
Direct `tsc --noEmit` run fails with multiple errors, including:
- `src/webview/SidebarProvider.ts` union narrowing / payload typing issues
- `src/webview/ui/App.tsx` invalid access on union payload types
- `src/webview/messaging.ts` schema typing mismatch for `WorkspaceSnapshot`

## Scope
- Fix type definitions and discriminated union narrowing in webview message handling
- Ensure `InitState`/other payload handling is safely typed in `App.tsx`
- Align schema typing in `messaging.ts` with `WorkspaceSnapshot`
- Keep runtime behavior unchanged unless required for correctness

## Definition of Done
- [ ] `bunx tsc --noEmit` passes
- [ ] Existing unit and E2E tests stay green
- [ ] No use of `any` for quick suppression

## Notes
Created from dogfooding findings in task13.1.
