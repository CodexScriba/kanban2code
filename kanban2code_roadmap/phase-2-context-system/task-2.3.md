---
stage: plan
title: Implement stage template resolution
tags:
  - mvp
  - context
  - templates
created: 2025-12-07T00:00:00Z
---

# Implement Stage Template Resolution

## Goal
Load the correct stage template for a task's current stage.

## Scope
- Implement `loadStageTemplate(root, stage)`:
  - Resolve `_templates/stages/{stage}.md`.
  - Read file content or return a minimal fallback template if missing.
- Integrate this into the XML prompt builder so every prompt gets stage-specific guidance.

## Notes
These templates define "what to do at this stage" for the AI agent.

## Audit Instructions
After completing this task, please update the [Phase 2 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/services/templateService.ts` - Stage template resolution implementation
- **Tests Created**:
  - `tests/services/templateService.test.ts` - Vitest tests for template resolution

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.