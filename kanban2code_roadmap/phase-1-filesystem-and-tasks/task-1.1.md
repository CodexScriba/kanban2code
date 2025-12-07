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