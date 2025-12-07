---
stage: plan
title: Improve error handling and logging
tags:
  - mvp
  - polish
  - robustness
created: 2025-12-07T00:00:00Z
---

# Improve Error Handling and Logging

## Goal
Make Kanban2Code resilient and transparent when things go wrong.

## Scope
- Wrap filesystem operations with try/catch and user-facing messages:
  - Missing `.kanban2code`.
  - Invalid frontmatter.
  - Failed archive/move operations.
- Write debug logs to VS Code output channel for troubleshooting.
- Avoid blocking the entire UI on a single failing task.

## Notes
Good error messages prevent frustration and mysterious failures.