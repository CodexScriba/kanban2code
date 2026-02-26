---
stage: plan
tags: [test, p2]
agent: planner
contexts: []
---

# E2E Integration and Hardening

## Goal
The full loop works. Every seam is tested. Error states handled gracefully.

## Definition of Done
- [ ] All scenarios above work manually. bun run test + bun run test:e2e fully green. bun run typecheck clean. bun run build produces valid VSIX.

## Files
- `tests/e2e/chat-flow.test.ts` - create
- `tests/e2e/terminal-executor.test.ts` - create
- `tests/integration/skill-selector.test.ts` - create
- `tests/integration/workspace-snapshot.test.ts` - create