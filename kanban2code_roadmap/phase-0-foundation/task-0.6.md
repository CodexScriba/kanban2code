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

## Audit Instructions
After completing this task, please update the [Phase 0 Audit](../phase#_audit.md) with:
1. **Files Created**: List all files created in this task with their purpose
2. **Files Modified**: List any existing files that were modified and why
3. **Files Analyzed**: List any files that were examined for reference
4. **Key Changes**: Briefly describe the main changes made to support this task

Example format:
- **Files Modified**:
  - `package.json` - Added activation events and extension configuration
  - `src/extension.ts` - Implemented activation lifecycle and workspace handling