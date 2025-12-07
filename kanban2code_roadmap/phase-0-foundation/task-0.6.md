---
stage: plan
title: Define extension activation and lifecycle
tags:
  - mvp
  - infra
  - extension
  - activation
created: 2025-12-07T00:00:00Z
---

# Define Extension Activation and Lifecycle

## Goal
Ensure Kanban2Code activates at the right time and handles missing workspaces gracefully.

## Scope
- Set `activationEvents` in package.json:
  - `workspaceContains:.kanban2code`
  - `onCommand:kanban2code.scaffoldWorkspace`
  - `onView:kanban2code.sidebar`
- On activation without `.kanban2code`:
  - Show empty state in sidebar with "Scaffold Workspace" button
  - Do NOT auto-prompt (let user discover via sidebar)
- Multi-root handling:
  - Use first folder containing `.kanban2code`
  - If none found, target first workspace folder for scaffolding
- Store workspace root in extension context for all services to use

## Notes
Keep activation fast (<100ms). Defer heavy loading until actually needed.