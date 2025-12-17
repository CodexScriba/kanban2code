---
stage: audit
tags:
  - refactor
  - p1
agent: react-dev
contexts: []
---

# Remove Template Messaging

## Goal
Remove all template-related message types and handlers from the messaging system.

## Definition of Done
- [x] `messaging.ts` - Remove template message types:
  - `TemplatesLoaded`, `TemplateContentLoaded`, `TemplateContentLoadFailed`
  - `CreateTemplate`, `UpdateTemplate`, `RequestTemplates`, `RequestTemplateContent`
- [x] `SidebarProvider.ts` - Remove template message handlers
- [x] `KanbanPanel.ts` - Remove template message handlers

## Context
This task cleans up the messaging system by removing all template-related communication between the webview and extension. This includes message types and their corresponding handlers.

## Audit
.kanban2code/projects/major-refactor/phase1-remove-template-system/task1.5-remove-template-messaging.md
src/webview/KanbanPanel.ts
src/webview/SidebarProvider.ts
src/webview/messaging.ts
