---
stage: plan
agent: coder
tags: [feature, p1]
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

## Refined Prompt

Objective: Create a singleton SettingsPanel webview with sidebar navigation and DOM-based panel switching for 11 settings sections.

Implementation approach:
1. Create `SettingsPanel.ts` following KanbanPanel/TaskEditorPanel singleton pattern with `createOrShow()` method
2. Create `settings.tsx` with all 11 panels in one file using DOM visibility switching (display:none/block)
3. Create `settings.css` matching the dark theme from settings-gemini.html design reference
4. Add `settings` entry point to esbuild.mjs webview config
5. Register `kanban2code.openSettings` command in extension.ts and package.json
6. Implement message handlers: LoadSettings, SaveSettings, ResetSection, ResetToDefaults
7. Wire SettingsService to load and persist settings

Key decisions:
- Use singleton pattern: Ensures only one settings panel is open at a time, consistent with other panels
- DOM visibility switching: Faster than separate webviews, preserves form state when switching panels
- Single-file React-like pattern: Follows existing codebase patterns (taskeditor.tsx, board.tsx)
- SettingsService integration: Use existing service for persistence, validation, and defaults

Edge cases:
- Settings panel already open: Reveal existing panel instead of creating new one
- Invalid settings on save: Show error message, don't close panel
- Project scope toggle: Handle both global and project-specific settings
- Navigation during unsaved changes: Prompt user before switching panels (optional for MVP)

## Context

### File Tree (scoped)
```
src/
├── extension.ts                    # ← modify - register openSettings command
├── services/
│   └── settings-service.ts         # ← read-only reference - SettingsService API
└── webview/
    ├── KanbanPanel.ts              # ← read-only reference - singleton pattern
    ├── TaskEditorPanel.ts          # ← read-only reference - panel lifecycle
    ├── messaging.ts                # ← read-only reference - message types
    ├── SettingsPanel.ts            # ← create - new settings panel host
    └── ui/
        ├── settings.tsx            # ← create - settings UI entry
        └── settings.css            # ← create - settings styles
esbuild.mjs                         # ← modify - add settings entry point
package.json                        # ← modify - register command + activationEvent
```

### Architecture Excerpts

From `.kanban2code/architecture.md`:
- Extension host (`src/**` host modules) owns VS Code APIs + filesystem writes
- Webview Host owns serialization/broadcast via SidebarProvider + message bridge
- Webview UI (`src/webview/ui/**`) owns rendering only
- All host/webview communication uses typed envelopes from `messaging.ts`

From `skill-vscode.md`:
- Webview HTML must load bundled script + stylesheet deterministically
- Use `webview.asWebviewUri(...)` for local assets
- Message handlers must validate envelope/type before acting
- Build output must include webview JS and CSS consumed by webview host

### Skill Excerpts

From `skill-frontend-design.md`:
- Use CSS custom properties for theme tokens
- Dark theme: deep layered backgrounds, selective light sources
- Form controls: focus states with box-shadow, transition animations
- Layout: flexbox with independent scrolling areas

### Code Excerpts

KanbanPanel singleton pattern (`src/webview/KanbanPanel.ts:14-109`):
```typescript
export class KanbanPanel {
  public static currentPanel: KanbanPanel | undefined;
  public static readonly viewType = 'kanban2code-board';
  
  public static createOrShow(...): void {
    if (KanbanPanel.currentPanel) {
      KanbanPanel.currentPanel._panel.reveal(column);
      return;
    }
    // create new panel
  }
}
```

SettingsService API (`src/services/settings-service.ts:125-187`):
```typescript
export class SettingsService {
  async getSettings(projectSlug?: string): Promise<Settings>
  async updateSettings(settings: Partial<Settings>, projectSlug?: string): Promise<void>
  async resetSection(section: SettingsSection, projectSlug?: string): Promise<void>
  async resetToDefaults(projectSlug?: string): Promise<void>
}
```

Message types (`src/webview/messaging.ts:85-98`):
```typescript
export interface OpenSettingsMessage {
  type: 'OpenSettings';
  payload?: { projectSlug?: string };
}
export interface SaveSettingsMessage {
  type: 'SaveSettings';
  payload: { settings: Record<string, unknown>; projectSlug?: string };
}
```

esbuild webview config (`esbuild.mjs:17-32`):
```javascript
const webviewConfig = {
  entryPoints: {
    webview: 'src/webview/ui/index.tsx',
    board: 'src/webview/ui/board.tsx',
    taskeditor: 'src/webview/ui/taskeditor.tsx'
    // add: settings: 'src/webview/ui/settings.tsx'
  },
  outdir: 'dist',
  bundle: true,
  platform: 'browser',
  format: 'iife'
}
```

### Dependency Graph

Files importing from modified files:
- `src/extension.ts` - imports and instantiates SettingsPanel
- `src/webview/ui/settings.tsx` - imports message types from `../messaging`

Consumers of new SettingsPanel:
- Command palette via `kanban2code.openSettings` command
- Sidebar UI settings button (future)

### Patterns to Follow

1. **Singleton pattern**: Static `currentPanel` + `createOrShow()` method
2. **Nonce generation**: Use `getNonce()` for CSP compliance
3. **Webview HTML template**: Load CSS first, then JS with nonce
4. **Message validation**: Use `isWebviewToHostMessage()` and `isHostToWebviewMessage()`
5. **VS Code API**: Use `acquireVsCodeApi()` for message passing
6. **CSS class patterns**: Use BEM-like naming (`.settings-sidebar`, `.panel--active`)
7. **Panel visibility**: Toggle `display: none` / `display: block` with CSS transition

### Test Patterns

Tests should verify:
1. Panel opens via command palette
2. Sidebar navigation items are clickable
3. Panel switching updates visible content
4. Settings load from SettingsService on open
5. Save button persists to SettingsService
6. Reset buttons restore defaults

### Gotchas

- CSP nonce: Must generate 32-char random nonce for script tag
- Webview URI: Use `webview.asWebviewUri()` for local assets
- Panel reveal: Check if `currentPanel` exists before creating new
- Message types: May need to add new message types to `messaging.ts` for settings-specific operations
- CSS isolation: Webview styles are isolated, copy relevant design tokens from settings-gemini.html
- Settings type: Import `Settings` type from `../types/settings` in SettingsPanel.ts

### Scope Boundaries

This task (6.1) is scoped to:
- Creating the panel shell and navigation structure
- Basic settings loading and saving
- DOM-based panel switching

Task 6.2 will handle:
- Full panel content implementation per spec
- Provider→model dependency logic
- Complex form controls (CRUD for providers, modes, etc.)
- Inline validation
- Naming consistency fixes

Do NOT implement in 6.1:
- Detailed form controls for all 11 panels (placeholder content is fine)
- Provider→model cascading dropdowns
- Complex CRUD operations
- Inline validation logic
