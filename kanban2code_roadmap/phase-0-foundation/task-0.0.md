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