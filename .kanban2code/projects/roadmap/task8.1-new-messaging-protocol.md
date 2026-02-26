---
stage: plan
tags: [feature, p1]
agent: planner
contexts: []
---

# New Messaging Protocol

## Goal
A lean, typed message contract between the extension host and the chat webview. No legacy board/filter/tree messages.

## Definition of Done
- [ ] All message types have Zod schemas, round-trip test passes, no any types.

## Files
- `src/webview/messaging.ts` - create - full rewrite
- `src/webview/ui/vscodeApi.ts` - create - port from /home/cynicus/code/kanban2code-v1/