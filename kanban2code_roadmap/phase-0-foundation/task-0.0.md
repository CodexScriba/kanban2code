---
stage: plan
title: Initialize project and build tooling
tags:
  - mvp
  - infra
  - foundation
created: 2025-12-07T00:00:00Z
---

# Initialize Project and Build Tooling

## Goal
Create the foundational project structure using Bun before building the extension.

## Scope
- Run `bun init` to create package.json
- Configure TypeScript (`tsconfig.json`)
- Set up esbuild for bundling
- Create `.gitignore` (node_modules, dist, .vscode-test)
- Set up ESLint + Prettier
- Create initial folder structure:
  - `src/`
  - `tests/`
  - `webview/`

## Notes
This is the prerequisite for all other Phase 0 tasks.

## Audit Instructions
After completing this task, please update the [Phase 0 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task
5. **Tests Created**: List all test files created with Vitest for the new/modified functionality

Example format:
- **Files Created**:
  - `package.json` - Project configuration and dependencies
  - `tsconfig.json` - TypeScript compiler configuration
  - `.gitignore` - Git ignore patterns for the project
- **Tests Created**:
  - `tests/build.test.ts` - Vitest tests for build configuration

**Testing Requirements**: All created/modified files that can be tested must have corresponding Vitest test files. Run `bun test` to verify all tests pass before completing this task.