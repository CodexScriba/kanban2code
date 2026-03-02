---
stage: audit
tags: [feature, p1]
agent: coder
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

## Refined Prompt

Objective: Add validation layer to RunnerEngine that checks required fields before execution, opens Task Editor for missing configuration, and resumes run flow after user saves.

Implementation approach:
1. Add `getEffectiveMapping(stage, projectSlug)` helper to SettingsService that resolves mapping with priority: project override > global default > hardcoded fallback
2. Create validation types and interfaces in runner types: ValidationError, ValidationResult
3. Implement `validateTaskForRun(task, projectSlug)` method in RunnerEngine that checks:
   - Location is set (project or inbox)
   - Current stage has valid mapping (role, provider, model)
4. Implement `validateTaskForPipeline(task, projectSlug)` that validates all enabled pipeline steps have valid mappings
5. Before enqueuing, apply settings defaults to fill empty execution fields
6. If validation fails: do not enqueue, store pending run intent, open Task Editor focused on missing fields
7. Add save event listener to RunnerEngine that detects when a saved task had pending validation
8. On save detection, re-validate and auto-resume run flow if now valid
9. Add telemetry logging for validation failures and auto-resumes
10. Write comprehensive unit tests for validation logic and resume flow

Key decisions:
- Settings defaults applied before validation: Keeps configuration centralized, allows users to set fallback values
- Task Editor opened with field focus: Provides immediate remediation path for missing fields
- Pending run intent stored in memory: Simple approach, no persistence needed for v1
- Auto-resume on save: Seamless UX, user doesn't need to re-trigger run
- Validation errors returned as structured objects: Enables flexible UI presentation

Edge cases:
- Task saved but still invalid: Keep Task Editor open, show updated validation errors
- User cancels Task Editor without saving: Clear pending run intent, do not enqueue
- Multiple rapid run clicks on same task: Deduplicate, only open one Task Editor
- Project override partially defined: Fill missing fields from global defaults
- Provider exists but model not in allowed list: Treat as invalid mapping
- Task moved to different project while pending: Re-validate with new project context

Questions: None, requirements are clear from spec and sibling tasks.

## Context

### File Tree (scoped)

```
src/
├── types/
│   ├── runner.ts           # <- modify (add ValidationResult, ValidationError types)
│   ├── task.ts             # <- read-only reference (TaskFrontmatter structure)
│   └── settings.ts         # <- read-only reference (StageMapping, Settings)
├── services/
│   ├── settings-service.ts # <- modify (add getEffectiveMapping helper)
│   ├── runner-engine.ts    # <- create (validation layer, resume flow)
│   ├── queue-service.ts    # <- read-only reference (enqueue interface from task 5.1)
│   └── telemetry-logger.ts # <- read-only reference (log validation events)
└── webview/
    └── TaskEditorPanel.ts  # <- read-only reference (open/focus mechanism)
```

### Architecture Excerpts

From `gemini-architecture.md` §6 Validation and Guardrails:
- "Empty-task Run Guardrail: If user clicks Run and required fields are missing: do not enqueue, open Task Editor focused on missing required fields, after save/confirm, resume run flow"
- "Run Guard Minimums: `Run Stage` requires valid location, valid stage mapping for current step; `Run Pipeline` requires valid mappings for all enabled steps"

From `skill-vscode.md`:
- "Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes"
- "All host/webview communication uses typed envelopes; no ad-hoc payloads"
- "On state changes, broadcast refresh/update events to UI"

### Skill Excerpts

From `skill-vscode.md`:
- Services follow class-based pattern with dependency injection
- Message handlers must validate envelope/type before acting
- Keep strict separation: Extension Host owns business logic, Webview UI owns rendering only

No specific skill guidance needed beyond general conventions.

### Code Excerpts

`src/types/settings.ts:1-8` - StageMapping structure:
```typescript
export interface StageMapping {
  role: string;
  provider: string;
  model: string;
  profile: string;
}
```

`src/types/task.ts:5-20` - TaskFrontmatter with execution fields:
```typescript
export interface TaskFrontmatter {
  title?: string;
  stage: TaskStage;
  role?: string;
  provider?: string;
  model?: string;
  profile?: string;
  project?: string;
  phase?: string;
  // ... other fields
}
```

`src/services/settings-service.ts:62-66` - Default stage mappings:
```typescript
stageRuntimeMapping: {
  plan: { role: 'planner', provider: 'claude', model: 'yolo', profile: 'default' },
  code: { role: 'coder', provider: 'codex', model: 'yolo', profile: 'coder-default' },
  audit: { role: 'auditor', provider: 'claude', model: 'yolo', profile: 'default' }
},
```

`src/services/settings-service.ts:123-138` - Service constructor pattern:
```typescript
export class SettingsService {
  constructor(
    private readonly workspaceRoot: string,
    private readonly deps: SettingsServiceDeps = createDefaultDeps()
  ) {}

  async getSettings(projectSlug?: string): Promise<Settings> {
    // merges DEFAULT_SETTINGS, global, project settings
  }
}
```

`src/webview/TaskEditorPanel.ts:46-77` - Opening Task Editor:
```typescript
public static createOrShow(
  extensionUri: vscode.Uri,
  taskService: TaskService,
  taskPath?: string
): void {
  // Reveals existing or creates new panel
  // If taskPath provided, loads that task
}
```

### Dependency Graph

Files importing from modified files:
- `src/services/runner-engine.ts` (new) will be imported by:
  - `src/extension.ts` (for command registration)
  - `src/services/queue-service.ts` (for enqueue after validation)

Files that runner-engine.ts depends on:
- `src/types/runner.ts` (QueueItem, RunState, new validation types)
- `src/types/task.ts` (Task, TaskFrontmatter)
- `src/services/settings-service.ts` (SettingsService, getEffectiveMapping)
- `src/services/queue-service.ts` (QueueService for actual enqueue)
- `src/services/telemetry-logger.ts` (TelemetryLogger for validation events)
- `src/webview/TaskEditorPanel.ts` (for opening editor on validation fail)

### Patterns to Follow

1. **Service class pattern**: Constructor with workspaceRoot and optional dependencies injection
2. **Validation error structure**: Return { valid: boolean, errors: ValidationError[] } pattern
3. **Settings resolution priority**: project override > global default > hardcoded fallback
4. **Event-driven resume**: Use event listeners or callbacks for save detection
5. **Telemetry logging**: Log structured events with taskId, eventType, metadata

### Test Patterns

Example from `src/services/settings-service.test.ts`:
- Mock filesystem for SettingsService tests
- Test setting resolution priority (project > global > default)
- Test validation edge cases (missing fields, invalid combinations)

Example validation test structure:
```typescript
describe('RunnerEngine validation', () => {
  it('should reject run when location is empty', async () => {
    // Arrange: task with no project/phase
    // Act: validateTaskForRun(task)
    // Assert: valid=false, errors contain 'location'
  });
  
  it('should fill defaults from settings before validation', async () => {
    // Arrange: task with empty role, settings has default
    // Act: applyDefaults then validate
    // Assert: validation passes with settings default applied
  });
});
```

### Gotchas

- Settings defaults must be applied BEFORE validation, not as fallback during validation
- Pending run intent must be keyed by taskId to handle multiple tasks
- Task Editor focus on specific field may require messaging protocol extension
- Project slug extraction from task path must handle inbox vs project locations
- Validation for Run Pipeline needs to check ALL enabled steps, not just current stage
- Circular dependency risk: RunnerEngine -> TaskEditorPanel -> RunnerEngine (avoid via callbacks/events)

### Scope Boundaries

This task (5.3) validation and guardrails. It should NOT:
- Implement actual CLI process spawning (task 5.2 - RunnerEngine core)
- Create QueueService itself (task 5.1 - already created)
- Add UI components for run badges or queue display (task 5.4 - UI wiring)
- Modify task file persistence layer (TaskService handles this)
- Implement full Task Editor field focus messaging (task 5.4 may extend this)

RunnerEngine in this task validates and enqueues. Task 5.2 RunnerEngine handles actual execution.
