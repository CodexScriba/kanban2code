---
stage: plan
title: Implement context file loaders
tags:
  - mvp
  - context
  - filesystem
created: 2025-12-07T00:00:00Z
---

# Implement Context File Loaders

## Goal
Provide simple helpers for loading all context layers used in prompts.

## Scope
- In `contextService.ts`, implement:
  - `loadGlobalContext(root)` → `how-it-works.md`, `architecture.md`, `project-details.md`.
  - `loadAgentContext(root, agentName)`.
  - `loadProjectContext(root, projectName)`.
  - `loadPhaseContext(root, projectName, phaseName)`.
  - `loadCustomContexts(root, contextNames[])`.
- Return empty strings or `null` for missing files, never crash.

## Notes
These helpers will feed into the XML prompt builder.

## Audit Instructions
After completing this task, please update the [Phase 2 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `src/services/contextService.ts` - Context file loading implementation
- **Tests Created**:
  - `tests/services/contextService.test.ts` - Vitest tests for context loading

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.