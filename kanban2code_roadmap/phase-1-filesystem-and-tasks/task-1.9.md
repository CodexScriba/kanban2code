---
stage: plan
title: Define webview architecture and messaging protocol
tags:
  - mvp
  - infra
  - webview
  - architecture
created: 2025-12-07T00:00:00Z
---

# Define Webview Architecture and Messaging Protocol

## Goal
Establish foundation for React webviews with proper state management and host communication.

## Scope
- Define message types for host ↔ webview communication:
  - TaskUpdated, TaskSelected, FilterChanged, etc.
  - Request types: CreateTask, MoveTask, CopyContext
- Set up React state management with Zustand:
  - Create stores for tasks, filters, UI state
  - Define actions and selectors
- Create base component library:
  - Button, Modal, Tree, Card components
  - Use shadcn/ui for consistent styling
- Establish CSS/styling approach:
  - Tailwind CSS for utility classes
  - CSS-in-JS for component-specific styles
- Define webview initialization pattern:
  - Consistent setup for sidebar and board webviews
  - Message handling registration

## Notes
This provides the foundation that both Phase 3 (sidebar) and Phase 4 (board) will build upon.