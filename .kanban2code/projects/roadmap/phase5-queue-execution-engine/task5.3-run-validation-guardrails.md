---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode]
---

# Run validation guardrails

## Goal

Add validation layer to runner engine that checks required fields before execution and opens Task Editor for missing configuration.

## Definition of Done

- [ ] `Run Stage` validates: location set, current stage has valid mapping (role/provider/model)
- [ ] `Run Pipeline` validates: all enabled steps have valid mappings
- [ ] If validation fails: do not enqueue, open Task Editor focused on missing fields
- [ ] After user saves required fields: resume run flow
- [ ] Settings defaults fill empty execution fields before validation

## Files

- `src/services/runner-engine.ts` - modify - add validation layer
- `src/services/settings-service.ts` - modify - add `getEffectiveMapping(stage, project)` helper

## Tests

- [ ] Run blocked when location empty
- [ ] Run blocked when provider/model missing
- [ ] Settings defaults fill gaps correctly
- [ ] Post-save resume works

## Context

Validation guardrails prevent execution of tasks with missing or invalid configuration.

Validation rules for `Run Stage`:
- Location must be set (inbox or project)
- Current stage must have valid mapping:
  - Role is set (planner, coder, auditor)
  - Provider is configured
  - Model is selected for the provider

Validation rules for `Run Pipeline`:
- All enabled pipeline steps must have valid mappings
- Each step requires: role, provider, model

Validation failure handling:
- Do not enqueue task
- Open Task Editor panel
- Focus on the first missing/invalid field
- Show validation error message

Settings defaults:
- Before validation, fill empty fields from SettingsService defaults
- Use `getEffectiveMapping(stage, project)` helper
- Priority: project override > global default > hardcoded fallback

Resume flow after save:
- User fixes missing fields in Task Editor
- Saves changes
- RunnerEngine detects save and resumes run flow
- No need to re-trigger run manually

The `getEffectiveMapping(stage, project)` helper should:
- Check project override settings for the stage
- Fall back to global default settings
- Return: { role, provider, model, profile }
