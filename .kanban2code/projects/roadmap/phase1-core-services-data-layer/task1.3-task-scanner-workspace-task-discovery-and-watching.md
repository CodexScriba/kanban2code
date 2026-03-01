---
stage: plan
tags:
  - feature
  - p1
  - orchestration-wave1
agent: planner
contexts:
  - skill-vscode
skills: []
---

# TaskScanner — workspace task discovery and watching

## Goal

Create a scanner that discovers all task files in the workspace, provides filtering and sorting capabilities, and watches for file changes to trigger refresh events.

## Definition of Done

- [ ] Scans `inbox/**/*.md` and `projects/**/*.md` for task files
- [ ] Returns `TaskSnapshotItem[]` with full parsed metadata (title, stage, priority, role, project, tags, taskId)
- [ ] Supports filtering by stage, priority, project, search text
- [ ] Supports sorting by `createdAt` (derived from filename timestamp) with stable tiebreaker
- [ ] Sets up `FileSystemWatcher` for `.md` changes and emits refresh events
- [ ] Replaces current `getWorkspaceTasks()` in SidebarProvider (removes 4-second polling)

## Files

- `src/services/task-scanner.ts` - create - scan, filter, sort, watch
- `src/types/task.ts` - modify - extend `TaskSnapshotItem` with full metadata fields

## Tests

- [ ] Scans and returns tasks from inbox + projects
- [ ] Filters by stage, priority, project
- [ ] Search matches title, tags, taskId (case-insensitive, partial)
- [ ] Sorts newest-first with stable tiebreaker
- [ ] File watcher triggers refresh on file add/change/delete

## Context

TaskScanner replaces the current polling-based `getWorkspaceTasks()` in SidebarProvider. The 4-second polling interval should be removed entirely.

The scanner should use VS Code's `FileSystemWatcher` API to watch for changes in `.kanban2code/**/*.md` files. When a file is added, changed, or deleted, the scanner should emit an event that triggers a refresh in all active webviews.

Filtering should support:
- Stage: inbox, plan, code, audit, completed
- Priority: high, medium, low
- Project: all projects or specific project slug
- Search: case-insensitive partial match on title, tags, and taskId

Sorting should default to newest-first (descending by timestamp derived from filename), with a stable tiebreaker using the taskId to ensure consistent ordering.

The `TaskSnapshotItem` type should include all metadata needed for board rendering without requiring full task file reads.
