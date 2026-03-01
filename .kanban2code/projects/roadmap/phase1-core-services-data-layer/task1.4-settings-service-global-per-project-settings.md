---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode, skill-typescript-config]
---

# SettingsService — global + per-project settings

## Goal

Create a settings service that reads global and per-project settings, merges them with proper precedence, validates provider/model/profile combinations, and supports reset operations.

## Definition of Done

- [ ] Reads `.kanban2code/settings.json` (global defaults)
- [ ] Reads `.kanban2code/projects/<slug>/settings.json` (project overrides)
- [ ] Merges: `project override > global default > hardcoded fallback`
- [ ] Writes settings back to correct file scope
- [ ] Validates provider/model/profile combinations
- [ ] Supports `resetSection()` and `resetToDefaults()`

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
