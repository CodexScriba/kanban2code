---
stage: completed
agent: auditor
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

---

## Implementation Plan

### Phase 1: Foundation & Types

**1.1. Update settings.tsx structure**

Replace the current JSON textarea approach with proper form components. Keep the single-file pattern per §7.5.

Current state: Each panel has `<textarea id="json-${panel.id}" class="settings-json">`
Target state: Each panel has structured form controls matching the Settings type

**1.2. Define panel renderers map**

Create a `PANEL_RENDERERS` object that maps each `SettingsSection` to its content renderer:

```typescript
type PanelRenderer = (props: {
  settings: Settings;
  onChange: (section: SettingsSection, value: unknown) => void;
  errors: Record<string, string>;
}) => string;

const PANEL_RENDERERS: Record<SettingsSection, PanelRenderer> = {
  general: renderGeneralPanel,
  taskDefaults: renderTaskDefaultsPanel,
  pipelineDefaults: renderPipelineDefaultsPanel,
  stageRuntimeMapping: renderStageRuntimeMappingPanel,
  providersAndModels: renderProvidersAndModelsPanel,
  agentBehavior: renderAgentBehaviorPanel,
  roles: renderRolesPanel,
  queueAndExecution: renderQueueAndExecutionPanel,
  projectOverrides: renderProjectOverridesPanel,
  notifications: renderNotificationsPanel,
  telemetryAndLogs: renderTelemetryAndLogsPanel,
};
```

### Phase 2: Panel-by-Panel Implementation

#### Panel 1: General

**Form controls:**
- Timezone: `<select>` with common timezones (UTC, America/Los_Angeles, Europe/London, Asia/Tokyo)
- Date format: `<select>` with options (YYYY-MM-DD HH:mm, DD/MM/YYYY HH:mm, MM/DD/YYYY hh:mm A)
- UI density: `<select>` (comfortable, compact)
- Confirm destructive actions: toggle switch

**Validation:**
- Date format must be non-empty
- Timezone must be valid IANA timezone

#### Panel 2: Task Defaults

**Form controls:**
- Title template: `<input type="text">` with placeholder "[{{phase}}] {{title}}"
- Smart summary behavior: `<select>` (manual, ai-assist)
- Default priority: pill group (low, medium, high)
- Default tags: `<input type="text">` comma-separated
- Default contexts: `<textarea>` one per line
- Default skills: `<input type="text">` comma-separated

**Validation:**
- Priority must be one of allowed values
- Tags/contexts/skills parsed and validated as arrays

#### Panel 3: Pipeline Defaults

**Form controls:**
- Default pipeline template: pill group (simple, complex)
- Default current stage on create: `<select>` (capture, plan, architecture, code, audit)
- Audit bounce cap: `<input type="number">` min 1, max 10

**Validation:**
- Template must be 'simple' or 'complex'
- Stage must be valid TaskStage
- Bounce cap must be positive integer

#### Panel 4: Stage Runtime Mapping (CRITICAL - provider→model dependency)

**Form controls:**
- Grid layout with columns: Stage | Role | Provider | Model | Profile
- Each stage row has:
  - Stage pill with color dot (plan=blue, architecture=cyan, code=amber, audit=violet)
  - Role: `<select>` populated from settings.roles.available
  - Provider: `<select>` populated from Object.keys(settings.providersAndModels.providers)
  - Model: `<select>` populated based on selected provider
  - Profile: `<select>` or `<input>` for profile name

**Provider→Model Dependency Logic:**
```typescript
// When provider changes:
function handleProviderChange(stage: string, newProvider: string) {
  // 1. Clear current model selection for this stage
  const currentMapping = settings.stageRuntimeMapping[stage];
  currentMapping.model = '';
  currentMapping.provider = newProvider;
  
  // 2. Repopulate model dropdown
  const availableModels = settings.providersAndModels.providers[newProvider]?.models || [];
  
  // 3. Show validation error if no models available
  if (availableModels.length === 0) {
    setError(`stage-${stage}-model`, 'No models configured for this provider');
  }
}
```

**Validation:**
- All fields required for each stage
- Model must be in provider's model list
- Provider must be enabled

#### Panel 5: Providers & Models

**Form controls - Providers list:**
- List of provider cards showing:
  - Provider name
  - Status indicator (enabled/disabled)
  - Model count
  - Actions: Edit, Disable/Enable, Delete
- "Add Provider" button

**Provider edit modal/form:**
- Provider ID: `<input>` (key, immutable after creation)
- Enabled: toggle switch
- Endpoint URL: `<input type="text">`
- API Key: `<input type="password">` with reveal toggle

**Form controls - Models list:**
- List of models per provider:
  - Model name
  - Provider badge
  - Actions: Edit, Remove
- "Add Model" button

**Model edit modal/form:**
- Model ID: `<input>`
- Provider: `<select>` (which provider owns this model)

**Validation:**
- Provider ID must be unique
- Endpoint URL must be valid URL format
- API key must be non-empty (when adding)
- Model ID must be unique within provider

#### Panel 6: Agent Behavior

**Form controls - Mode selection:**
- Mode selector dropdown: `<select>` with current modes
- Actions: Add, Edit, Delete mode buttons

**Mode edit form:**
- Mode ID: `<input>`
- API Config selector: `<select>` (references provider profile)
- Role definition: `<textarea>`
- Short description: `<input type="text">`
- "When to use" guidance: `<textarea>`
- Mode-specific instructions: `<textarea>` (mono font)
- Global instructions: `<textarea>` (mono font)
- Available tools: checkbox grid or tag input

**Validation:**
- Mode ID must be unique
- Role must reference valid role from settings.roles.available
- Required fields: id, role, instructions

#### Panel 7: Roles

**Form controls:**
- List of role cards:
  - Role name
  - Availability badges (assignment, pipeline)
  - Actions: Edit, Delete
- "Add Role" button

**Role edit form:**
- Role ID: `<input>`
- Allow human assignment: toggle
- Include in pipeline mapping: toggle

**Validation:**
- Role ID must be unique
- At least one role must exist

#### Panel 8: Queue & Execution

**Form controls:**
- Default queue mode: `<select>` (stage, all stages)
- Scheduling policy: `<input>` disabled (shows "FIFO")
- Max parallel runs: `<input type="number">` min 1, max 10
- Serialized pipeline: toggle switch
- Auto-open terminal on run: toggle switch
- Prompt missing fields: toggle switch
- Auto-resume on save: toggle switch

**Validation:**
- Max parallel runs must be positive integer

#### Panel 9: Project Overrides

**Form controls:**
- Info box explaining precedence (project > global)
- List of configured overrides per project:
  - Project slug
  - Override categories enabled
  - Actions: Edit, Remove
- Override edit form:
  - Project: `<select>` of available projects
  - Enable/disable per category checkboxes:
    - Task defaults
    - Pipeline defaults
    - Runtime mapping

**Validation:**
- Project must exist
- At least one override category must be enabled

#### Panel 10: Notifications

**Form controls:**
- Master toggle: switch
- Delivery channels checkboxes:
  - In-app toast alerts
  - Telegram bot updates
  - System sound alerts
- Status trigger selector: `<select multiple>`
  - Task Created
  - Task Stage Changed
  - Task Completed
  - Error Encountered
- Quiet hours: time inputs (from/to)
- Digest frequency: `<select>` (real-time, hourly, daily, never)

**Validation:**
- Quiet hours format must be HH:MM
- At least one channel if master is enabled

#### Panel 11: Telemetry & Logs

**Form controls:**
- Enable run logging: toggle
- Redact sensitive fields: toggle
- Minimum log level: `<select>` (Error, Warning, Information, Debug)
- Log retention policy: `<select>` (7 days, 30 days, 90 days, Indefinite)
- Anonymous telemetry: toggle
- Info box showing captured fields

**Validation:**
- Retention must be valid duration string

### Phase 3: CSS Styling

**Add to settings.css:**

```css
/* Form layout */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.form-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.form-row > * {
  flex: 1;
}

/* Input styling per design reference */
input[type="text"],
input[type="password"],
input[type="number"],
select,
textarea {
  width: 100%;
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 13px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-primary-soft);
}

input.error, select.error, textarea.error {
  border-color: var(--accent-error);
}

.error-text {
  font-size: 12px;
  color: var(--accent-error);
  margin-top: 4px;
}

/* Toggle switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-active);
  transition: .3s;
  border-radius: 20px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: var(--text-secondary);
  transition: .3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--accent-primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(16px);
  background-color: white;
}

/* Pill selection */
.pill-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pill {
  padding: 6px 14px;
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.pill:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.pill.active {
  background: var(--accent-primary-soft);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* Mapping grid for Stage Runtime */
.mapping-table {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mapping-header {
  display: grid;
  grid-template-columns: 120px 1fr 1fr 1fr 1fr;
  gap: 12px;
  padding: 0 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
}

.mapping-row {
  display: grid;
  grid-template-columns: 120px 1fr 1fr 1fr 1fr;
  gap: 12px;
  align-items: center;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 12px;
}

.stage-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--text-primary);
}

.stage-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* List items for providers/roles */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  transition: border-color 0.2s ease;
}

.list-item:hover {
  border-color: var(--border-default);
}

.item-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-title {
  font-weight: 500;
  color: var(--text-primary);
}

.item-sub {
  font-size: 11px;
  color: var(--text-muted);
}

.item-actions {
  display: flex;
  gap: 4px;
}

/* Cards for grouping */
.settings-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.card-description {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

/* Checkbox group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--accent-primary);
}
```

### Phase 4: State Management & Validation

**4.1. Local form state**

```typescript
// In settings.tsx
interface FormState {
  settings: Settings | null;
  dirty: Set<SettingsSection>;
  errors: Record<string, string>; // key: "section.field" or "section.index.field"
  saving: boolean;
}

let formState: FormState = {
  settings: null,
  dirty: new Set(),
  errors: {},
  saving: false,
};

function updateSection<T extends SettingsSection>(
  section: T,
  value: Settings[T]
): void {
  if (!formState.settings) return;
  
  // Validate before accepting
  const errors = validateSection(section, value);
  if (Object.keys(errors).length > 0) {
    formState.errors = { ...formState.errors, ...errors };
    renderErrors();
    return;
  }
  
  formState.settings[section] = value;
  formState.dirty.add(section);
  delete formState.errors[section];
  renderSection(section);
}
```

**4.2. Validation functions**

```typescript
const VALIDATORS: Record<SettingsSection, (value: unknown) => Record<string, string>> = {
  general: validateGeneral,
  taskDefaults: validateTaskDefaults,
  pipelineDefaults: validatePipelineDefaults,
  stageRuntimeMapping: validateStageRuntimeMapping,
  providersAndModels: validateProvidersAndModels,
  agentBehavior: validateAgentBehavior,
  roles: validateRoles,
  queueAndExecution: validateQueueAndExecution,
  projectOverrides: validateProjectOverrides,
  notifications: validateNotifications,
  telemetryAndLogs: validateTelemetryAndLogs,
};

function validateStageRuntimeMapping(value: unknown): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!value || typeof value !== 'object') {
    return { 'stageRuntimeMapping': 'Invalid mapping structure' };
  }
  
  const mapping = value as Record<string, StageMapping>;
  for (const [stage, config] of Object.entries(mapping)) {
    if (!config.role) errors[`${stage}.role`] = 'Role is required';
    if (!config.provider) errors[`${stage}.provider`] = 'Provider is required';
    if (!config.model) errors[`${stage}.model`] = 'Model is required';
    if (!config.profile) errors[`${stage}.profile`] = 'Profile is required';
  }
  
  return errors;
}

function validateProvidersAndModels(value: unknown): Record<string, string> {
  const errors: Record<string, string> = {};
  const pm = value as Settings['providersAndModels'];
  
  for (const [providerId, config] of Object.entries(pm.providers)) {
    if (config.endpoint && !isValidUrl(config.endpoint)) {
      errors[`provider.${providerId}.endpoint`] = 'Invalid URL format';
    }
  }
  
  return errors;
}
```

### Phase 5: Message Handlers (SettingsPanel.ts)

The SettingsPanel.ts message handlers are already implemented for:
- `SaveSettings`
- `ResetSection`
- `ResetToDefaults`

**Verify no changes needed** - the existing handlers already support the full settings object. The UI changes don't require new message types.

### Phase 6: Naming Consistency Checklist

Before submitting, verify no legacy "agent" terminology:

**Search for in settings.tsx:**
- [ ] "agent" in UI labels → replace with "role"
- [ ] "agent" in placeholder text → replace with "role"
- [ ] "agent" in comments → replace with "role" or remove
- [ ] "Agent" in panel titles → keep "Agent Behavior" (this is the mode name per spec)

**Correct usage examples:**
```typescript
// WRONG:
<label>Default Agent</label>
placeholder="Select an agent"

// CORRECT:
<label>Default Role</label>
placeholder="Select a role"
```

### Phase 7: Test Implementation

**7.1. Unit test structure** (create `src/webview/ui/settings.test.tsx`)

```typescript
describe('Settings Panels', () => {
  describe('General Panel', () => {
    it('renders timezone select', () => { });
    it('renders date format select', () => { });
    it('renders confirm destructive actions toggle', () => { });
  });

  describe('Stage Runtime Mapping Panel', () => {
    it('renders mapping rows for each stage', () => { });
    it('clears model when provider changes', () => { });
    it('populates model dropdown from provider models', () => { });
    it('shows error when model incompatible with provider', () => { });
  });

  describe('Providers & Models Panel', () => {
    it('renders provider list', () => { });
    it('shows add provider form', () => { });
    it('masks API key input', () => { });
    it('validates endpoint URL format', () => { });
  });

  describe('Validation', () => {
    it('shows inline error for invalid input', () => { });
    it('prevents save with validation errors', () => { });
    it('clears error when input corrected', () => { });
  });

  describe('Naming Consistency', () => {
    it('uses "role" not "agent" in labels', () => { });
    it('uses "assignee" for human assignment', () => { });
  });
});
```

---

## Implementation Notes

### Key Technical Decisions

1. **Keep single-file pattern** (`settings.tsx`): Per §7.5, all settings UI lives in one file. Use internal functions for panel rendering, not separate components.

2. **DOM-based panel switching**: Continue using CSS `display: none/block` with `.panel.is-active` classes. Don't use React Router or similar.

3. **Form state in memory only**: Settings are synced with host on explicit save only. No auto-save to prevent premature persistence.

4. **Provider→Model dependency**: Implemented via event delegation on the mapping table. When provider `<select>` changes, immediately clear and repopulate the corresponding model `<select>`.

5. **Validation timing**: Validate on blur for individual fields, on change for cross-field dependencies (like provider→model).

### Edge Cases to Handle

1. **Empty provider list**: Show "Add a provider first" message in Stage Runtime Mapping model selectors
2. **Provider disabled**: Show warning badge, don't filter from list (user may want to re-enable)
3. **Model removed from provider**: On load, validate all mappings. If model no longer exists in provider's model list, clear it and show validation error.
4. **API key security**: Always use `type="password"`. Add reveal toggle button per field.
5. **Unsaved changes warning**: Before switching panels, check `formState.dirty`. If dirty, confirm with user.

### File Size Considerations

The current `settings.tsx` is ~300 lines. After adding all 11 panel renderers, expect ~1500-2000 lines. This is acceptable per the single-file contract in §7.5.

Structure the file as:
1. Imports (10 lines)
2. Types and interfaces (50 lines)
3. Constants (PANEL_CONFIGS, etc.) (50 lines)
4. Panel renderer functions (11 × ~100 lines = 1100 lines)
5. Validation functions (11 × ~30 lines = 330 lines)
6. State management and event handlers (200 lines)
7. Initialization code (50 lines)

---

## UI Design References

- `docs/design/settings-gemini.html` - Primary reference for form controls, colors, spacing
- `docs/design/sidebar-codex-blue.html` - Color palette reference
- `functionality.md` §7.6 - Behavioral specification

When design mock and spec conflict:
- **Behavior**: Follow `functionality.md`
- **Visual style**: Follow `docs/design/settings-gemini.html`
