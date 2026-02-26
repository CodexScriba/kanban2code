---
stage: plan
tags: [feature, p1]
agent: planner
contexts: []
---

# MiniMax Adapter + Provider Expansion

## Goal
MiniMax works as an execution provider. Kimi K2 confirmed working end-to-end.

## Definition of Done
- [ ] A task runs end-to-end via MiniMax in the terminal. Kimi K2 runs end-to-end via terminal.

## Files
- `src/runner/adapters/minimax-adapter.ts` - create
- `src/assets/providers.ts` - update
- `.kanban2code/_providers/minimax.md` - create
- `src/runner/adapter-factory.ts` - update
- `src/orchestrator/openai-client.ts` - update