---
stage: plan
tags: [feature, p1]
agent: planner
contexts: []
---

# Orchestrator Service

## Goal
A stateless function that takes conversation + context -> calls configured provider API -> returns response. No CLI, no spawning. Direct HTTP.

## Definition of Done
- [ ] `sendMessage()` with a mocked Anthropic client streams tokens correctly. System prompt contains workspace task list and skill summaries.

## Files
- `src/orchestrator/orchestrator.ts` - create - sendMessage(opts: OrchestratorCallOptions): AsyncIterable<string>
- `src/orchestrator/anthropic-client.ts` - create - Anthropic SDK wrapper, streaming
- `src/orchestrator/openai-client.ts` - create - OpenAI SDK wrapper, streaming
- `src/orchestrator/system-prompt-builder.ts` - create - buildOrchestratorSystemPrompt
- `src/types/orchestrator.ts` - create - OrchestratorCallOptions, ChatMessage

## Tests
- [ ] tests/orchestrator.test.ts - unit test with mocked SDK responses