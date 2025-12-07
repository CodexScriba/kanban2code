---
stage: plan
title: Integrate copy-with-context with VS Code clipboard
tags:
  - mvp
  - context
  - clipboard
created: 2025-12-07T00:00:00Z
---

# Integrate Copy-With-Context with VS Code Clipboard

## Goal
Make "Copy XML (Full Context)" a one-click action that fills the clipboard.

## Scope
- Implement `kanban2code.copyTaskContext` command:
  - Accepts task identifier + `CopyMode`.
  - Uses `copyService.buildCopyPayload`.
  - Writes result to VS Code clipboard API.
- Show a toast or VS Code notification on success:
  - "Copied full XML context for '{title}'."
- Handle errors gracefully.

## Notes
This is one of the most-used actions; it should feel instant and reliable.