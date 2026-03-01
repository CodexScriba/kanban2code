---
stage: plan
tags:
  - feature
  - p1
  - orchestration-wave1
agent: planner
contexts:
  - skill-vscode
  - skill-typescript-config
skills: []
---

# FrontmatterService — parse/serialize with normalization

## Goal

Create a service that parses YAML frontmatter from markdown task files, normalizes the `agent` field to `role`, and serializes back to markdown while preserving body content and list fields.

## Definition of Done

- [ ] Parses YAML frontmatter from `.md` files using `gray-matter`
- [ ] Normalizes `agent` → `role` on read
- [ ] Serializes back to `.md` preserving body content
- [ ] Preserves list fields: `tags`, `contexts`, `skills`
- [ ] Handles missing/malformed frontmatter gracefully

## Files

- `src/services/frontmatter-service.ts` - create - frontmatter parse/serialize/normalize
- `src/types/task.ts` - create - `Task` interface, `TaskStage` type, `Priority` type
- `package.json` - modify - add `gray-matter` dependency

## Tests

- [ ] Parses valid frontmatter with all fields
- [ ] Normalizes `agent: planner` → `role: planner`
- [ ] Round-trips without data loss
- [ ] Handles empty/missing frontmatter
- [ ] Preserves markdown body content unchanged

## Context

This is the foundation service that all other task operations depend on. The service must handle Unicode escapes in frontmatter (e.g., `\U0001F3DB`) gracefully and maintain backward compatibility with existing task files that use the `agent` field.

The `gray-matter` library is battle-tested for YAML frontmatter parsing and correctly handles `---` delimiters. The service should use this library rather than custom parsing.

List fields (`tags`, `contexts`, `skills`) must be preserved as arrays during round-trip serialization.
