---
stage: plan
title: Implement New Task modal
tags:
  - mvp
  - ui
  - tasks
  - creation
created: 2025-12-07T00:00:00Z
---

# Implement New Task Modal

## Goal
Provide a rich task creation flow that defaults to Inbox-first but supports projects/phases.

## Scope
- `<TaskModal />` with fields:
  - Location: Inbox or Project.
  - If Project: project + optional phase selection.
  - Title (required).
  - Stage (default `inbox`).
  - Agent (dropdown from `_agents/`).
  - Tags (free-text with chips).
  - Template (optional, from `_templates/tasks/`).
- On submit:
  - Generate filename: `{timestamp}-{slug(title)}.md`.
  - Apply selected template to build frontmatter + body.
  - Write file into appropriate folder.
  - Reload tasks.

## Notes
This should reflect your "I don't mind filling the form if it captures my thinking" preference.

## Audit Instructions
After completing this task, please update the [Phase 3 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/webview/components/TaskModal.tsx` - Task creation modal component
  - `src/services/taskCreationService.ts` - Task creation logic
- **Tests Created**:
  - `tests/webview/components/TaskModal.test.tsx` - Vitest tests for task creation modal

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.