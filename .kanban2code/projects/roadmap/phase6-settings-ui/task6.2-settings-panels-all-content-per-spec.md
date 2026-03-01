---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-frontend-design]
---

# Settings panels — all content per spec §7.6

## Goal

Implement all 11 settings panels with correct form controls, validation, and naming consistency per the specification.

## Definition of Done

- [ ] All 11 panels render correct form controls per spec
- [ ] Stage Runtime Mapping has provider→model dependency (changing provider forces model reselection)
- [ ] Providers & Models: add/edit/disable provider, add/edit/remove model, endpoint + API key
- [ ] Agent Behavior: mode CRUD, role definition, instructions
- [ ] Project Overrides: per-project override controls
- [ ] Inline validation (no silent failure)
- [ ] Uses `assignee`/`role`/`provider`/`model`/`profile` naming consistently

## Files

- `src/webview/ui/settings.tsx` - modify - implement all panel contents
- `src/webview/ui/settings.css` - modify - form styles
- `src/webview/SettingsPanel.ts` - modify - handle all settings messages

## Tests

- [ ] Each panel renders expected form fields
- [ ] Provider/model dependency validation works
- [ ] Inline validation shows errors
- [ ] Naming consistency verified (no `agent` where `role` intended)

## Context

All 11 panels must be implemented with correct form controls per functionality.md §7.6.

Panel details:

1. **General**
   - Theme selection
   - Confirm destructive actions toggle
   - Auto-save toggle

2. **Task Defaults**
   - Default priority
   - Default role
   - Default project

3. **Pipeline Defaults**
   - Default pipeline type (simple/complex)
   - Default stages enabled

4. **Stage Runtime Mapping**
   - Per-stage provider/model/profile selection
   - Provider→model dependency: changing provider forces model reselection
   - Use `assignee`, `role`, `provider`, `model`, `profile` naming

5. **Providers & Models**
   - Add/edit/disable provider
   - Add/edit/remove model per provider
   - Endpoint URL input
   - API key input (masked)

6. **Agent Behavior**
   - Mode CRUD (create, edit, delete modes)
   - Role definition per mode
   - Instructions per mode

7. **Roles**
   - Role definitions
   - Role-specific settings

8. **Queue & Execution**
   - Max parallel runs
   - Timeout settings
   - Retry policy

9. **Project Overrides**
   - Per-project override controls
   - Override enable/disable per setting

10. **Notifications**
    - Notification preferences
    - Notification channels

11. **Telemetry & Logs**
    - Enable/disable telemetry
    - Log retention settings
    - Log level

Inline validation:
- Show errors immediately when invalid input detected
- No silent failures
- Clear error messages

Naming consistency:
- Use `assignee` (not `agent`)
- Use `role` (not `agent`)
- Use `provider`, `model`, `profile` consistently
- No legacy `agent` terminology in UI

Provider→model dependency:
- When provider changes, clear model selection
- Populate model dropdown with available models for new provider
- Validate that selected model is available for provider

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/settings-gemini.html`
