---
stage: completed
tags:
  - feature
  - p1
  - orchestration-wave1
agent: auditor
contexts:
  - skill-vscode
  - skill-typescript-config
skills: []
---

# SettingsService — global + per-project settings

## Goal

Create a settings service that reads global and per-project settings, merges them with proper precedence, validates provider/model/profile combinations, and supports reset operations.

## Definition of Done

- [] Reads `.kanban2code/settings.json` (global defaults)
- [] Reads `.kanban2code/projects/<slug>/settings.json` (project overrides)
- [] Merges: `project override > global default > hardcoded fallback`
- [ ] Writes settings back to correct file scope
- [ ] Validates provider/model/profile combinations
- [] Supports `resetSection()` and `resetToDefaults()`

## Files

- `src/services/settings-service.ts` - create - settings read/write/merge/validate
- `src/types/settings.ts` - create - settings shape types matching spec §7

## Tests

- [ ] Reads global settings
- [ ] Project override wins over global
- [ ] Hardcoded fallback fills missing keys
- [ ] Rejects invalid provider/model combo
- [ ] Reset section restores defaults for one group only

## Context

SettingsService manages all configuration for the extension. Settings are stored as JSON files with a two-level hierarchy:
- Global: `.kanban2code/settings.json`
- Project override: `.kanban2code/projects/<slug>/settings.json`

Merge precedence: project override values take priority over global defaults, which take priority over hardcoded fallbacks.

The service should validate provider/model/profile combinations to ensure they are compatible before allowing saves. Invalid combinations should be rejected with clear error messages.

Reset operations:
- `resetSection(section)`: Resets a specific section (e.g., "Task Defaults") to defaults
- `resetToDefaults()`: Resets all settings to hardcoded defaults

Settings shape should match the specification in functionality.md §7, including all 11 sections: General, Task Defaults, Pipeline Defaults, Stage Runtime Mapping, Providers & Models, Agent Behavior, Roles, Queue & Execution, Project Overrides, Notifications, Telemetry & Logs.

**Initial hardcoded provider/model combinations:**
- kimi yolo, gemini yolo, codex yolo, and claude yolo.

## Refined Prompt

Objective: Enhance the SettingsService to complete missing functionality including proper merging of global and per-project settings, provider/model validation, and reset operations.

Implementation approach:
1. Update `src/types/settings.ts` to include missing sections per spec §7.6:
   - Add `agentBehavior.modes` proper type (not `any[]`)
   - Add `notifications` section with channels, triggers, quiet hours
   - Add `projectOverrides` section for per-project defaults
   - Ensure all 11 sections from spec §7 are represented
2. Refactor `src/services/settings-service.ts`:
   - Fix the merge logic to properly handle deep merging: `project > global > fallback`
   - Add proper path resolution using `vscode.Uri.file()` with workspace root
   - Implement `validateProviderModel(provider, model)` that checks against DEFAULT_SETTINGS.providersAndModels
   - Implement `validateProfile(profile)` to ensure profile exists
   - Add `validateSettings(settings)` that validates all mappings before save
   - Fix `resetSection()` to correctly reset only specified section to fallback values
   - Ensure `resetToDefaults()` clears project overrides and resets to fallbacks
3. Add directory creation for settings files when writing to new project paths
4. Add proper error handling with descriptive messages for validation failures

Key decisions:
- Settings files are JSON (not YAML) for consistency with extension config
- Merge precedence: project overrides completely replace global for that section, not field-by-field
- Validation happens on write, not read — invalid settings in files are replaced with defaults
- Provider/model validation uses the hardcoded DEFAULT_SETTINGS as source of truth
- Reset operations write the reset values back to disk immediately
- Missing sections in files are filled from fallback at read time (non-destructive)

Edge cases:
- Missing global settings file: treat as empty object, use fallbacks
- Missing project settings file: treat as empty object, use global + fallbacks
- Corrupt JSON in settings file: treat as empty object, log warning
- Invalid provider/model in saved settings: replace with defaults on read, flag for reconfiguration
- Reset section that doesn't exist: no-op with warning
- Write to project that doesn't exist yet: auto-create directory structure
- Concurrent writes: trust VS Code's atomic file operations

Questions:
- None. All requirements are clear from spec §7 and sibling task patterns.

## Context

### File Tree (scoped)
```
src/
├── services/
│   ├── settings-service.ts         # <- modify (complete implementation)
│   ├── frontmatter-service.ts      # <- read-only reference (VS Code fs pattern)
│   ├── task-service.ts             # <- read-only reference (service pattern)
│   └── task-scanner.ts             # <- read-only reference (event emitter pattern)
├── types/
│   ├── settings.ts                 # <- modify (add missing sections)
│   └── task.ts                     # <- read-only reference (type patterns)
└── extension.ts                    # <- read-only reference (orchestration)
.kanban2code/
├── settings.json                   # Global settings file location
└── projects/{slug}/
    └── settings.json               # Project override location
```

### Architecture Excerpts

From `skill-vscode` — Extension Host Rules:
- Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes
- Any state-changing action must flow through host logic and persist to filesystem
- Use `vscode.workspace.fs` for file operations, not Node's `fs` module

From `skill-vscode` — Mandatory Project Structure:
- `extension.ts` must orchestrate dependencies, not business logic
- Services should be pure classes with constructor dependency injection

From `functionality.md` §7.2 — Required behavior:
- Settings must support both global defaults and per-project overrides
- Precedence: `project override > global default`
- Save flow: `Save settings`, `Reset section`, `Reset to defaults`
- Changes apply immediately to new actions; existing tasks are not silently rewritten

From `functionality.md` §7.3 — Validation:
- Block invalid provider/model/profile combinations
- If provider changes and model is incompatible, force model reselection
- Show inline validation, never silent failure

From `functionality.md` §7.6 — Required panel-level content (v1):
- **Notifications**: Master toggle, In-app/Telegram/sound channels, Status trigger selector, Quiet hours, Digest frequency
- **Project Overrides**: Per-project override controls with explicit precedence (`project > global`)

### Skill Excerpts

From `skill-vscode` — Extension Host Rules:
- Register commands explicitly in one module (`src/commands/index.ts`)
- `extension.ts` must orchestrate dependencies, not business logic
- Any state-changing action must flow through host logic and persist to filesystem

From `skill-vscode` — Testing Standards:
- Unit tests for message protocol and service logic
- Integration tests for command wiring

From `skill-typescript-config` — General conventions:
- Use strict TypeScript with explicit return types
- Export class-based service with constructor dependency injection

### Code Excerpts

Current `SettingsService` in `src/services/settings-service.ts:55-99`:
```typescript
export class SettingsService {
  constructor(private readonly workspaceRoot: string) {}

  async getSettings(projectSlug?: string): Promise<Settings> {
    const globalSettings = await this.readSettingsFile(this.getGlobalPath());
    let projectSettings: Partial<Settings> = {};

    if (projectSlug) {
      projectSettings = await this.readSettingsFile(this.getProjectPath(projectSlug));
    }

    return this.mergeSettings(DEFAULT_SETTINGS, globalSettings, projectSettings);
  }

  async updateSettings(settings: Partial<Settings>, projectSlug?: string): Promise<void> {
    const filePath = projectSlug ? this.getProjectPath(projectSlug) : this.getGlobalPath();
    const current = await this.readSettingsFile(filePath);
    const updated = { ...current, ...settings };
    
    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(path.join(this.workspaceRoot, filePath)),
      Buffer.from(JSON.stringify(updated, null, 2))
    );
  }

  async resetSection(section: SettingsSection, projectSlug?: string): Promise<void> {
    const settings = await this.getSettings(projectSlug);
    (settings as any)[section] = (DEFAULT_SETTINGS as any)[section];
    await this.updateSettings(settings, projectSlug);
  }

  async resetToDefaults(projectSlug?: string): Promise<void> {
    await this.updateSettings(DEFAULT_SETTINGS, projectSlug);
  }

  validateMapping(provider: string, model: string): { valid: boolean; error?: string } {
    const config = DEFAULT_SETTINGS.providersAndModels.providers[provider];
    if (!config) {
      return { valid: false, error: `Provider '${provider}' not found.` };
    }
    if (!config.models.includes(model)) {
      return { valid: false, error: `Model '${model}' not supported by provider '${provider}'.` };
    }
    return { valid: true };
  }
  // ...
}
```

Current `Settings` type in `src/types/settings.ts:17-63`:
```typescript
export interface Settings {
  general: { /* ... */ };
  taskDefaults: { /* ... */ };
  pipelineDefaults: { /* ... */ };
  stageRuntimeMapping: Record<string, StageMapping>;
  providersAndModels: { /* ... */ };
  agentBehavior: { modes: any[] };  // <- needs proper typing
  roles: { available: string[] };
  queueAndExecution: { /* ... */ };
  notifications: { /* MISSING */ };
  projectOverrides: { /* MISSING */ };
  telemetryAndLogs: { /* ... */ };
}
```

VS Code fs pattern from `src/services/task-service.ts:120-135`:
```typescript
const uri = vscode.Uri.file(path.join(this.workspaceRoot, filePath));
await vscode.workspace.fs.createDirectory(path.dirname(uri)); // Auto-create dirs
await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
```

### Dependency Graph

Files importing from modules to modify:
- `src/extension.ts` - instantiates SettingsService, passes workspaceRoot
- Future: UI components will call SettingsService for configuration

Files imported by modified modules:
- VS Code API: `vscode.workspace.fs`, `vscode.Uri`
- Node modules: `path`
- Project types: `src/types/settings.ts`

### Patterns to Follow

- Use VS Code's `workspace.fs` API for all file operations (not Node fs)
- Use `vscode.Uri.file(path.join(workspaceRoot, relativePath))` for URI construction
- Return `Promise<T>` from all async methods, throw on errors
- Export class-based service with constructor dependency injection
- Match SettingsService pattern: constructor takes `workspaceRoot: string`
- Use deep merge for nested settings objects, shallow merge for top-level sections

### Test Patterns

Test file: `src/services/settings-service.test.ts`
- Mock VS Code's `workspace.fs` API using `node:test` mocks
- Mock file system with in-memory storage for isolated testing
- Test patterns:
  - Global settings read returns merged with fallbacks
  - Project settings override global for same keys
  - Missing sections filled from fallbacks
  - Invalid provider/model rejected with clear error
  - Reset section restores only that section to defaults
  - Reset to defaults clears all customizations
  - Corrupt JSON handled gracefully (returns empty + fallbacks)

### Gotchas

- `workspace.fs.writeFile` does NOT auto-create parent directories — call `createDirectory` first
- `workspace.fs.createDirectory` is recursive (creates all parent dirs)
- Deep merge must handle nested objects correctly — current implementation has issues with partial overrides
- Provider validation must check both provider existence AND model compatibility
- SettingsSection type must include all 11 section keys for type safety
- JSON parse errors should not crash the service — catch and return empty object
- When resetting a section, must write to correct scope (global vs project)

### Scope Boundaries

This task focuses on the SettingsService core functionality. Do NOT implement:
- Settings UI components (separate UI task)
- Provider API key encryption (out of scope for v1)
- Settings migration from legacy formats (not required)
- Real-time settings sync between windows (not required)
- Telemetry logger implementation (Task 1.5: ConflictDetector handles telemetry)

SettingsService provides the data layer for configuration. UI components and other services will consume it.
