---
stage: plan
title: Create VS Code extension skeleton
tags:
  - mvp
  - infra
  - extension
  - foundation
created: 2025-12-07T00:00:00Z
---

# Create VS Code Extension Skeleton

## Goal
Set up a minimal but scalable VS Code extension project that can host the Kanban2Code sidebar and board webview.

## Scope
- Initialize a new VS Code extension in TypeScript.
- Configure bundler/build pipeline (esbuild/webpack/etc.) using Bun.
- Register core commands:
  - `kanban2code.openBoard`
  - `kanban2code.newTask`
  - `kanban2code.scaffoldWorkspace`
- Create a basic webview panel that can render a simple React app.
- Set up project structure (`src/commands`, `src/services`, `src/webview`, etc.).

## Notes
Focus on a clean, minimal scaffold. No real Kanban logic yet, just enough to iterate quickly.