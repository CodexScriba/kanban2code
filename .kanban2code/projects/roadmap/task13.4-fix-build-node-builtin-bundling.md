---
stage: plan
agent: planner
tags: [bug, p1]
contexts: []
---

# Fix Build Node Builtin Bundling

## Goal
Make `bun run build` pass by resolving Node builtin module bundling errors in the webview pipeline.

## Problem
Current build fails in webview bundling with unresolved Node built-ins:
- `fs/promises`
- `path`

Errors originate from server-side modules (`task-generator`, `frontmatter`, `validation`) being pulled into webview bundle graph.

## Scope
- Identify and fix improper imports crossing extension/webview boundaries
- Ensure webview bundle does not include Node-only modules
- Update build configuration only as needed for correct targets

## Definition of Done
- [ ] `bun run build` exits successfully
- [ ] No Node builtin resolution errors in webview bundle
- [ ] Existing tests remain green

## Notes
Created from dogfooding findings in task13.1.
