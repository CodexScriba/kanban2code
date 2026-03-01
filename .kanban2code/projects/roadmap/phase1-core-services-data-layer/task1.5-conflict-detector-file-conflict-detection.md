---
stage: completed
tags: [feature, p1]
agent: auditor
contexts: [skill-vscode]
---

# ConflictDetector — file conflict detection

## Goal

Create a conflict detection service that tracks file fingerprints, detects external modifications, creates recovery snapshots, and logs telemetry events.

## Definition of Done

- [x] `openFile(path)` stores fingerprint (hash of content + mtime)
- [x] `checkConflict(path)` compares current disk fingerprint vs stored
- [x] Returns `{ hasConflict, diskVersion?, localVersion? }` when conflict detected
- [x] `createRecoverySnapshot(path)` saves `.kanban2code/.recovery/<filename>.bak`
- [x] Emits telemetry events per spec §13.5

## Files

- `src/services/conflict-detector.ts` - create - fingerprint, check, recovery
- `src/services/telemetry-logger.ts` - create - structured JSON log writer (also used by runner)

## Tests

- [x] No conflict when file unchanged since open
- [x] Conflict detected when external write changes file
- [x] Recovery snapshot created before overwrite
- [x] Telemetry events logged correctly

## Audit Result

- Rating: 9/10
- Verdict: Pass
- Notes:
  - `openFile()` stores fingerprint as `sha256(content + ":" + mtime)` in memory.
  - `checkConflict()` recomputes disk fingerprint and compares against opened fingerprint.
  - Conflict response shape is `{ hasConflict, diskVersion?, localVersion? }`.
  - `createRecoverySnapshot()` writes snapshots into `.kanban2code/.recovery/`.
  - `TelemetryLogger` writes JSON Lines to `.kanban2code/_logs/telemetry-YYYYMMDD.jsonl`.
  - Test status: `npm test` passes all compiled service test files (`6/6`), and source defines `32` individual `test(...)` cases across `src/services/*.test.ts`.

## Context

ConflictDetector prevents data loss when multiple processes or users modify the same task file. It uses a fingerprint-based approach combining content hash and modification time.

Fingerprint calculation: hash(file content + modification time). This ensures that both content changes and timestamp updates are detected.

When a conflict is detected:
1. Create a recovery snapshot in `.kanban2code/.recovery/<filename>.bak`
2. Return conflict details including both disk and local versions
3. Log telemetry event per spec §13.5

The service should be used by TaskEditorPanel before saving task files. If a conflict is detected, the user should be presented with options to resolve (keep local, keep disk, or merge manually).

TelemetryLogger is a shared service that will also be used by the runner engine. It should write structured JSON logs to `.kanban2code/_logs/` with timestamps and event types.

## Refined Prompt

Objective: Create a ConflictDetector service that tracks file fingerprints to detect external modifications, creates recovery snapshots before overwrites, and emits telemetry events via a shared TelemetryLogger service.

Implementation approach:
1. Create `src/services/telemetry-logger.ts` - shared structured JSON log writer
   - Write to `.kanban2code/_logs/telemetry-YYYYMMDD.jsonl` (JSON Lines format)
   - Events have: timestamp, eventType, taskId?, filePath?, metadata?
   - Methods: `logEvent(eventType, payload)`, `logConflictEvent(eventType, filePath, details)`
2. Create `src/services/conflict-detector.ts` - conflict detection service
   - `openFile(path, content)` calculates and stores fingerprint: hash(content + mtime)
   - `checkConflict(path, currentContent)` compares current disk fingerprint vs stored
   - Returns `{ hasConflict: boolean, diskVersion?: string, localVersion?: string }`
   - `createRecoverySnapshot(path, content)` saves to `.kanban2code/.recovery/<filename>.bak`
   - `clearFingerprint(path)` removes stored fingerprint (call after successful save)
3. Fingerprint storage: in-memory Map with path -> { hash, mtime }
4. Use Node.js `crypto.createHash('sha256')` for hashing
5. Read file mtime using VS Code's `workspace.fs.stat()` API
6. Emit telemetry events per spec §13.5 via TelemetryLogger

Key decisions:
- In-memory fingerprint storage (not persisted to disk): conflict detection only matters during active editing session
- SHA256 hash of content + mtime as fingerprint: catches both content changes and timestamp-only modifications
- Recovery directory auto-created on first snapshot: `.kanban2code/.recovery/`
- Telemetry logs use JSON Lines for append-only efficiency and easy parsing
- Services are class-based with constructor dependency injection (workspaceRoot, optional VS Code fs)

Edge cases:
- File deleted externally after open: checkConflict should detect missing file and return hasConflict=true
- File renamed externally: treated as deletion (old path missing)
- Recovery snapshot already exists: overwrite with timestamp suffix to preserve history
- Concurrent modifications: last-check-wins (TaskEditor will re-check before save)
- Very large files: hash first 10KB + mtime for performance (sufficient for change detection)
- VS Code fs not available (tests): accept injected fs interface like TaskService pattern

## Context

### File Tree (scoped)
```
src/
├── services/
│   ├── conflict-detector.ts        # <- create
│   ├── conflict-detector.test.ts   # <- create
│   ├── telemetry-logger.ts         # <- create
│   ├── telemetry-logger.test.ts    # <- create
│   ├── task-service.ts             # <- read-only reference
│   └── settings-service.ts         # <- read-only reference
├── types/
│   └── task.ts                     # <- read-only reference
└── extension.ts                    # <- read-only reference
.kanban2code/
├── .recovery/                      # <- create on demand
│   └── <filename>.bak
└── _logs/
    └── telemetry-YYYYMMDD.jsonl    # <- create on demand
```

### Architecture Excerpts

From `skill-vscode` — Extension Host Rules:
- Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes
- Any state-changing action must flow through host logic and persist to filesystem
- Use `vscode.workspace.fs` for file operations, not Node's `fs` module

From `functionality.md` §13.5 — Telemetry events (required):
- `file_conflict_detected`
- `file_conflict_reload_disk`
- `file_conflict_compare_opened`
- `file_conflict_overwrite_confirmed`
- `file_conflict_merged_saved`

From `functionality.md` §13.1-13.3 — Conflict detection model:
- Store `openedFingerprint` (hash or mtime+size) when opening file
- Conflict condition: disk fingerprint != openedFingerprint
- Before save: recalculate current disk fingerprint

### Skill Excerpts

From `skill-vscode` — Mandatory Project Structure:
- Services should be pure classes with constructor dependency injection
- `extension.ts` must orchestrate dependencies, not business logic

From `skill-vscode` — Testing Standards:
- Unit tests for message protocol and service logic
- Mock VS Code APIs using `node:test` mocks

### Code Excerpts

VS Code fs pattern from `src/services/task-service.ts:247-266`:
```typescript
private async getRuntimeDependencies(): Promise<RuntimeDependencies> {
  if (this.runtimeDependencies) {
    return this.runtimeDependencies;
  }
  const vscode = await import('vscode');
  this.runtimeDependencies = {
    fs: vscode.workspace.fs,
    toFileUri: vscode.Uri.file
  };
  return this.runtimeDependencies;
}
```

Stat/mtime pattern from `src/services/task-service.ts:15-16`:
```typescript
stat?(uri: UriLike): Thenable<{ type: number; ctime: number; mtime: number; size: number }>;
```

Service class pattern from `src/services/settings-service.ts:55-60`:
```typescript
export class SettingsService {
  constructor(private readonly workspaceRoot: string) {}
  async getSettings(projectSlug?: string): Promise<Settings> { /* ... */ }
}
```

### Dependency Graph

Files importing from new modules (expected consumers):
- `src/extension.ts` - will instantiate both services, pass to future TaskEditor
- Future: TaskEditor UI will call ConflictDetector before save
- Future: Runner engine will use TelemetryLogger for execution events

Files imported by new modules:
- VS Code API: `vscode.workspace.fs`, `vscode.Uri` (lazy-imported for testability)
- Node modules: `crypto`, `path`

### Patterns to Follow

- Use VS Code's `workspace.fs` API for all file operations (lazy import for testability)
- Return `Promise<T>` from all async methods, throw on errors with descriptive messages
- Export class-based service with constructor dependency injection
- Match existing service pattern: constructor takes `workspaceRoot: string`, optional `options` for fs injection
- Use strict TypeScript with explicit return types
- JSON Lines format for telemetry: one JSON object per line, append-only

### Test Patterns

Test files: `src/services/conflict-detector.test.ts`, `src/services/telemetry-logger.test.ts`

ConflictDetector tests:
- No conflict when file unchanged since open (same content + mtime)
- Conflict detected when external write changes file (different hash)
- Conflict detected when file deleted externally
- Recovery snapshot created successfully
- Recovery directory auto-created on first snapshot
- Fingerprint cleared after `clearFingerprint()` call

TelemetryLogger tests:
- Event written to correct log file path
- JSON Lines format valid (one JSON object per line)
- Timestamp included in each event
- Multiple events appended to same file
- Directory auto-created on first log

### Gotchas

- `workspace.fs.writeFile` does NOT auto-create parent directories — call `createDirectory` first
- `workspace.fs.createDirectory` is recursive (creates all parent dirs)
- Hash algorithm: use `sha256` from Node.js `crypto` module
- Fingerprint must include BOTH content hash AND mtime to catch timestamp-only changes
- Recovery filename: preserve original filename + `.bak` suffix in `.kanban2code/.recovery/`
- Telemetry log rotation: use daily files (YYYYMMDD suffix) to prevent unbounded growth
- VS Code fs `stat()` returns mtime in milliseconds (number)

### Scope Boundaries

This task focuses on the core conflict detection and telemetry logging services. Do NOT implement:
- UI conflict resolution modal (Task 3.3 covers UI integration)
- Task Editor integration (Task 3.x covers editor shell)
- Runner engine telemetry calls (Task 4.2 covers runner)
- Automatic conflict resolution policies
- Network-based telemetry forwarding

ConflictDetector and TelemetryLogger provide the infrastructure layer. UI and other services will consume them.
