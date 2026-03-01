---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode, skill-frontend-design]
---

# SettingsPanel — webview host + panel navigation shell

## Goal

Create a settings webview panel with sidebar navigation and internal panel switching, following the single-file settings pattern.

## Definition of Done

- [ ] New `SettingsPanel` singleton webview panel
- [ ] Sidebar navigation: General, Task Defaults, Pipeline Defaults, Stage Runtime Mapping, Providers & Models, Agent Behavior, Roles, Queue & Execution, Project Overrides, Notifications, Telemetry & Logs
- [ ] Panel switching via DOM visibility (no page reload)
- [ ] Loads current settings from SettingsService on open
- [ ] Save/Reset section/Reset to defaults actions per panel

## Files

- `src/webview/SettingsPanel.ts` - create - settings webview host
- `src/webview/ui/settings.tsx` - create - settings DOM (all panels in one file)
- `src/webview/ui/settings.css` - create - settings styles
- `esbuild.mjs` - modify - add `settings` entry point
- `src/extension.ts` - modify - register openSettings command
- `package.json` - modify - register command

## Tests

- [ ] Panel opens and renders sidebar nav
- [ ] Panel switching shows correct content
- [ ] Settings data loads from service
- [ ] Save persists to disk

## Context

SettingsPanel follows the singleton pattern used by KanbanPanel and TaskEditorPanel.

Single-file pattern:
- All panels live in one `settings.tsx` file
- Panel switching via DOM visibility (hide/show)
- No page reloads when switching panels
- Follows `docs/design/settings-gemini.html` design reference

Sidebar navigation (11 panels):
1. General
2. Task Defaults
3. Pipeline Defaults
4. Stage Runtime Mapping
5. Providers & Models
6. Agent Behavior
7. Roles
8. Queue & Execution
9. Project Overrides
10. Notifications
11. Telemetry & Logs

Panel switching:
- Click sidebar item → hide all panels → show selected panel
- Update active state in sidebar
- No page reload (fast switching)

Settings loading:
- On panel open, load settings from SettingsService
- Populate form fields with current values
- Handle both global and project-specific settings

Actions per panel:
- Save: persist changes to disk via SettingsService
- Reset section: restore defaults for current panel only
- Reset to defaults: restore all settings to defaults

Command registration:
- Register `kanban2code.openSettings` command in package.json
- Wire command to `SettingsPanel.createOrShow()` in extension.ts
- Add activation event for settings command

Layout should use flexbox for sidebar + main content area, with independent scrolling.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/settings-gemini.html`
