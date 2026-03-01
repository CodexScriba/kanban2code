---
stage: plan
tags: [feature, p1]
agent: coder
contexts: [skill-frontend-design, skill-vscode]
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

## Refined Prompt

Objective: Implement all 11 settings panel contents in `settings.tsx` with full form controls, validation, and naming consistency per functionality.md §7.6.

Implementation approach:
1. Create panel content components for all 11 settings panels with proper form controls
2. Implement provider→model dependency in Stage Runtime Mapping panel
3. Add inline validation with visible error states (no silent failures)
4. Ensure consistent naming: `assignee`, `role`, `provider`, `model`, `profile` (no `agent`)
5. Extend SettingsPanel.ts message handlers to support all settings operations
6. Wire up Save/Reset section/Reset to defaults actions

Key decisions:
- Panel visibility via DOM show/hide (single-file pattern): Keeps consistency with design reference
- Form state managed locally in settings.tsx, synced with host on save: Prevents premature persistence
- Provider→model dependency: When provider changes, model dropdown repopulates and selection clears
- Validation errors displayed inline with red borders + text, not console-only
- Naming: Use `role` not `agent` throughout UI labels and data structures

Edge cases:
- Empty provider list: Show "Add a provider first" placeholder in model selectors
- Invalid provider/model combo after provider edit: Force reselection, preserve other fields
- API key display: Always mask, show reveal toggle per field
- Project scope switch: Warn about unsaved changes before switching global/project scope

## Context

### File Tree (scoped)
```
src/
├── extension.ts                    # ← read-only reference (command wiring)
├── webview/
│   ├── SettingsPanel.ts            # ← modify (message handlers)
│   ├── messaging.ts                # ← read-only reference (message types)
│   └── ui/
│       ├── settings.tsx            # ← modify (all panel contents)
│       └── settings.css            # ← modify (form styles)
├── services/
│   └── settings-service.ts         # ← read-only reference (SettingsService)
└── types/
    └── settings.ts                 # ← read-only reference (Settings type)
```

### Architecture Excerpts

From `skill-vscode.md`:
- "Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes"
- "Webview Host (`SidebarProvider` + message bridge) owns serialization/broadcast"
- "Webview UI (`src/webview/ui/**`) owns rendering only"
- "All host/webview communication uses typed envelopes; no ad-hoc payloads"
- "Build output must include webview JS and CSS consumed by the webview host"

From `functionality.md` §7.6:
- Stage Runtime Mapping: "Provider->Model dependency required, No free-text runtime mapping"
- Providers & Models: "Add/edit/disable provider controls, Add/edit/remove model controls"
- Agent Behavior: "Mode setup (select/add/edit/delete), API config selector, Role definition"
- Naming: "Use `assignee`, `role`, `provider`, `model`, `profile` consistently"

### Skill Excerpts

From `skill-frontend-design.md`:
- "Never default to Arial, Inter, Roboto, system stacks"
- "Override shadcn defaults aggressively — tokens, spacing, radius, components"
- "Commit to a cohesive position. Palettes must take a stance."
- "Motion should feel choreographed, not scattered"

### Code Excerpts

`src/types/settings.ts:1-109` — Full Settings type definitions
```typescript
export interface Settings {
  general: { timezone: string; dateFormat: string; uiDensity: 'comfortable' | 'compact'; confirmDestructiveActions: boolean; };
  taskDefaults: { titleTemplate: string; smartSummaryBehavior: 'manual' | 'ai-assist'; priority: 'low' | 'medium' | 'high'; tags: string[]; contexts: string[]; skills: string[]; };
  pipelineDefaults: { template: 'simple' | 'complex'; createStage: TaskStage; auditBounceCap: number; };
  stageRuntimeMapping: Record<string, StageMapping>;
  providersAndModels: { providers: Record<string, ProviderConfig>; profiles: Record<string, ProviderProfile>; };
  agentBehavior: { modes: AgentBehaviorMode[]; };
  roles: { available: string[]; };
  queueAndExecution: { defaultMode: 'stage' | 'all stages'; schedulingPolicy: 'FIFO'; serializedPipeline: boolean; maxParallelRuns: number; autoOpenTerminal: boolean; };
  notifications: { enabled: boolean; channels: NotificationChannel[]; triggers: NotificationTrigger[]; quietHours: NotificationQuietHours; digestFrequency: NotificationDigestFrequency; };
  projectOverrides: { projects: Record<string, ProjectOverrideConfig>; };
  telemetryAndLogs: { enabled: boolean; redactSensitive: boolean; retentionPolicy: string; };
}
```

`src/webview/messaging.ts:85-98` — Settings message types already defined
```typescript
export interface OpenSettingsMessage { type: 'OpenSettings'; payload?: { projectSlug?: string; }; }
export interface SaveSettingsMessage { type: 'SaveSettings'; payload: { settings: Record<string, unknown>; projectSlug?: string; }; }
export interface SettingsLoadedMessage { type: 'SettingsLoaded'; payload: { settings: Record<string, unknown>; projectSlug?: string; }; }
```

`src/services/settings-service.ts:42-123` — DEFAULT_SETTINGS provides structure reference
- Contains all default values for every settings section
- Use as reference for initial form state

`esbuild.mjs:17-32` — Webview build config
```javascript
const webviewConfig = {
  entryPoints: { webview: 'src/webview/ui/index.tsx', board: 'src/webview/ui/board.tsx', taskeditor: 'src/webview/ui/taskeditor.tsx' },
  outdir: 'dist', bundle: true, platform: 'browser', format: 'iife', target: 'es2020'
};
```
Note: Settings entry point needs to be added (task 6.1 handles this, but verify)

### Dependency Graph

Files importing from modified files:
- `src/extension.ts` imports `SettingsPanel` (consumer)
- `src/webview/SidebarProvider.ts` may send `OpenSettings` messages (consumer)

Files that modified files import from:
- `src/webview/ui/settings.tsx` imports from `../messaging` (typed messages)
- `src/webview/SettingsPanel.ts` imports from `../services/settings-service`

### Patterns to Follow

- Panel switching: Use CSS `display: none/block` with `.panel` and `.panel.active` classes per design reference
- Form controls: Use semantic HTML with consistent styling from `settings-gemini.html`
- Toggle switches: Custom CSS toggle (see design reference `.toggle-switch` pattern)
- Mapping tables: Grid layout with `grid-template-columns` for aligned columns
- Validation errors: Red border + error text below field, not console-only

### Test Patterns

From `src/services/settings-service.test.ts`:
- SettingsService tests use mock filesystem adapter
- Follow similar pattern for settings UI tests

Test structure should verify:
- Panel renders with correct form controls
- Provider change triggers model dropdown update
- Validation shows inline errors
- Save sends correct message payload

### Gotchas

- No `agent` terminology: Check all labels, placeholders, and comments for "agent", replace with "role"
- Settings entry point: Ensure `esbuild.mjs` has settings entry (task 6.1 scope, verify exists)
- Provider→model sync: Must handle async provider list updates, model may become invalid
- Masked API keys: Input type="password" but allow reveal toggle
- Scope switching: Global vs Project scope requires settings refresh

### Scope Boundaries

Task 6.1 (SettingsPanel webview host + panel navigation shell) owns:
- SettingsPanel.ts webview host creation
- Sidebar navigation shell
- Panel switching infrastructure
- esbuild.mjs entry point registration

Task 6.2 (this task) owns:
- All panel content forms and controls
- Provider→model dependency logic
- Inline validation implementation
- Naming consistency enforcement

Do NOT modify:
- Panel navigation shell structure (task 6.1)
- Command registration in extension.ts (task 6.1)
- SettingsService.ts (service layer, not UI)
