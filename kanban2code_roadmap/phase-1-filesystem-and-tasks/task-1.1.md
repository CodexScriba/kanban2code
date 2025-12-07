---
stage: plan
title: Implement task parsing and serialization
tags:
  - mvp
  - filesystem
  - frontmatter
  - tasks
created: 2025-12-07T00:00:00Z
---

# Implement Task Parsing and Serialization

## Goal
Parse markdown task files into `Task` objects and write them back without losing metadata.

## Scope
- Create `frontmatter.ts` using `gray-matter`:
  - `parseTaskFile(filePath): Promise<Task>`
  - `stringifyTaskFile(task, originalBody): string`
- Rules:
  - `stage` is required; default to `inbox` if missing.
  - `project` and `phase` are inferred from path (not trusted from frontmatter).
  - `tags` is an array of strings.
  - Unknown frontmatter fields are preserved.
- Handle invalid frontmatter gracefully with warnings, not crashes.

## Notes
This is the bridge between disk state and the in-memory board.

## Audit Instructions
After completing this task, please update the [Phase 1 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/services/frontmatter.ts` - Task parsing and serialization implementation
- **Tests Created**:
  - `tests/services/frontmatter.test.ts` - Vitest tests for parsing and serialization

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.