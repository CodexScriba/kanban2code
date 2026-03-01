---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-frontend-design]
---

# Left panel — task metadata form

## Goal

Implement the left panel of the task editor with all metadata sections in the correct order, including form fields, chip lists, and the location creation action.

## Definition of Done

- [ ] Section order: Basic Info, Location, Pipeline, Assignment, Context, Skills, Tags
- [ ] Basic Info: title + smart summary inputs
- [ ] Location: type dropdown + phase dropdown + `+ New Location` action
- [ ] Pipeline: current stage (display), priority selector, policy flags
- [ ] Assignment: assignee, role, provider, model, profile fields
- [ ] Context/Skills/Tags: chip lists with add/remove
- [ ] Changes update dirty state; do not auto-save

## Files

- `src/webview/ui/taskeditor.tsx` - modify - left panel form rendering
- `src/webview/ui/taskeditor.css` - modify - form styles

## Tests

- [ ] All sections render in correct order
- [ ] Field changes mark form dirty
- [ ] Location `+ New Location` opens create dialog
- [ ] Chip add/remove works for tags/contexts/skills

## Context

Left panel sections (in order):

1. **Basic Info**
   - Title: text input
   - Smart summary: textarea (auto-generates from task content)

2. **Location**
   - Type: dropdown (Inbox, Project)
   - Phase: dropdown (discovered phases)
   - `+ New Location` action: opens dialog to create new project/phase

3. **Pipeline**
   - Current stage: display (read-only)
   - Priority: dropdown (Low, Medium, High)
   - Policy flags: checkboxes for various pipeline policies

4. **Assignment**
   - Assignee: text input
   - Role: dropdown (planner, coder, auditor)
   - Provider: dropdown (available providers)
   - Model: dropdown (models for selected provider)
   - Profile: dropdown (available profiles)

5. **Context**
   - Chip list with add/remove
   - Add button opens context picker

6. **Skills**
   - Chip list with add/remove
   - Add button opens skill picker

7. **Tags**
   - Chip list with add/remove
   - Add button opens tag input

Dirty state tracking:
- Any field change should mark the form as dirty
- Dirty indicator appears in top bar chip
- No auto-save - user must explicitly save

Chip lists should support:
- Click to remove
- Add button to open picker/input
- Visual feedback for empty state

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/taskeditor-codex.html`
