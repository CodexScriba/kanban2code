---
stage: plan
tags: [feature, p1]
agent: planner
contexts: []
---

# Workspace Snapshot Service

## Goal
A single function that returns a clean JSON snapshot of everything the orchestrator needs to know.

## Definition of Done
- [ ] `buildWorkspaceSnapshot()` returns correct data from a fixture workspace, test passes.

## Files
- `src/services/workspace-snapshot.ts` - create - buildWorkspaceSnapshot(kanbanRoot: string): Promise<WorkspaceSnapshot>
- `src/types/snapshot.ts` - create - WorkspaceSnapshot interface

## Tests
- [ ] tests/workspace-snapshot.test.ts - unit test against a temp workspace