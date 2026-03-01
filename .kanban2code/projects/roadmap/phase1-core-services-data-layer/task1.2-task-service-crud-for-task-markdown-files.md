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

# TaskService — CRUD for task markdown files

## Goal

Create a service that provides full CRUD operations for task markdown files, including create, read, update, delete, and move operations with timestamp-based file naming.

## Definition of Done

- [ ] `createTask(data)` writes `.md` file with frontmatter + body to correct location
- [ ] `readTask(filePath)` returns parsed Task object
- [ ] `updateTask(filePath, changes)` updates frontmatter fields and/or body
- [ ] `deleteTask(filePath)` removes file from disk
- [ ] `moveTask(filePath, newStage)` updates `stage` in frontmatter, moves file if needed
- [ ] File naming uses timestamp-based ID: `{timestamp}-{slug}.md`

## Files

- `src/services/task-service.ts` - create - task CRUD operations
- `src/types/task.ts` - modify - add `TaskCreateInput`, `TaskUpdateInput` types

## Tests

- [ ] Creates task file at correct path with valid frontmatter
- [ ] Reads task and returns typed object
- [ ] Updates single field without clobbering others
- [ ] Deletes file from disk
- [ ] Stage change updates frontmatter

## Context

TaskService is the primary interface for all task file operations. It should use FrontmatterService internally for parsing and serialization.

File naming convention: `{timestamp}-{slug}.md` where timestamp is milliseconds since epoch and slug is a kebab-case version of the task title. This ensures unique, sortable filenames.

The service should handle both inbox and project locations:
- Inbox: `.kanban2code/inbox/{timestamp}-{slug}.md`
- Project: `.kanban2code/projects/{project-slug}/{timestamp}-{slug}.md`

Move operations should update the `stage` field in frontmatter and optionally move the file to a different location if the project changes.
