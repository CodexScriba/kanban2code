---
stage: completed
tags:
  - refactor
  - p0
agent: react-dev
contexts:
  - architecture
---

# Remove Template UI Components

## Goal
Delete all UI components related to template selection and management.

## Definition of Done
- [x] `src/webview/ui/components/TemplatePicker.tsx` deleted
- [x] `src/webview/ui/components/TemplateModal.tsx` deleted
- [x] Template imports removed from `index.ts`
- [x] TemplateIcon removed from Icons.tsx (or kept if used elsewhere)

## Context
This task removes the UI components that allow users to select and manage templates. These components will no longer be needed in the agent-driven workflow.

## Audit
.kanban2code/projects/major-refactor/phase1-remove-template-system/task1.3-remove-template-ui-components.md
src/webview/ui/components/Board.tsx
src/webview/ui/components/Icons.tsx
src/webview/ui/components/Sidebar.tsx
src/webview/ui/components/SidebarActions.tsx
src/webview/ui/components/TaskEditorModal.tsx
src/webview/ui/components/TaskModal.tsx
src/webview/ui/components/TemplateModal.tsx
src/webview/ui/components/TemplatePicker.tsx
src/webview/ui/components/index.ts
src/webview/ui/styles/main.css
