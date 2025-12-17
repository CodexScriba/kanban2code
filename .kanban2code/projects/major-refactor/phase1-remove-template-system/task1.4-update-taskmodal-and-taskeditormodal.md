---
stage: audit
tags:
  - refactor
  - p1
agent: coder
contexts: []
---

# Update TaskModal and TaskEditorModal

## Goal
Remove template-related functionality from task creation and editing modals.

## Definition of Done
- [x] `TaskModal.tsx` - Template picker section removed
- [x] `TaskEditorModal.tsx` - Template picker and loading removed
- [x] Template warning dialog removed from TaskEditorModal
- [x] Both modals render correctly without templates

## Context
This task updates the main task creation and editing modals to work without the template system. The modals should still function for creating and editing tasks, but without any template-related UI.

## Audit
.kanban2code/projects/major-refactor/phase1-remove-template-system/task1.4-update-taskmodal-and-taskeditormodal.md
