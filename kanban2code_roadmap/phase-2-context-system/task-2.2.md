---
stage: plan
title: Implement XML prompt builder (9-layer context)
tags:
  - mvp
  - context
  - prompts
created: 2025-12-07T00:00:00Z
---

# Implement XML Prompt Builder (9-Layer Context)

## Goal
Assemble a complete XML prompt for a task, following the defined context order.

## Scope
- Implement `promptBuilder.buildXMLPrompt(task, root): Promise<string>`.
- Assembly order:
  1. `how-it-works.md`
  2. `architecture.md`
  3. `project-details.md`
  4. `_agents/{agent}.md` (if `agent` is set)
  5. `projects/{project}/_context.md` (if project)
  6. `projects/{project}/{phase}/_context.md` (if phase)
  7. `_templates/stages/{stage}.md`
  8. Custom contexts from `contexts:`
  9. Task body + metadata
- Wrap in `<system>`, `<context>`, `<task>` XML structure.

## Notes
Keep formatting clean and model-friendly; avoid unnecessary whitespace noise.

## Audit Instructions
After completing this task, please update the [Phase 2 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/services/promptBuilder.ts` - XML prompt assembly implementation
- **Tests Created**:
  - `tests/services/promptBuilder.test.ts` - Vitest tests for XML prompt building

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.