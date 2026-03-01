---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode]
---

# ConflictDetector — file conflict detection

## Goal

Create a conflict detection service that tracks file fingerprints, detects external modifications, creates recovery snapshots, and logs telemetry events.

## Definition of Done

- [ ] `openFile(path)` stores fingerprint (hash of content + mtime)
- [ ] `checkConflict(path)` compares current disk fingerprint vs stored
- [ ] Returns `{ hasConflict, diskVersion?, localVersion? }` when conflict detected
- [ ] `createRecoverySnapshot(path)` saves `.kanban2code/.recovery/<filename>.bak`
- [ ] Emits telemetry events per spec §13.5

## Files

- `src/services/conflict-detector.ts` - create - fingerprint, check, recovery
- `src/services/telemetry-logger.ts` - create - structured JSON log writer (also used by runner)

## Tests

- [ ] No conflict when file unchanged since open
- [ ] Conflict detected when external write changes file
- [ ] Recovery snapshot created before overwrite
- [ ] Telemetry events logged correctly

## Context

ConflictDetector prevents data loss when multiple processes or users modify the same task file. It uses a fingerprint-based approach combining content hash and modification time.

Fingerprint calculation: hash(file content + modification time). This ensures that both content changes and timestamp updates are detected.

When a conflict is detected:
1. Create a recovery snapshot in `.kanban2code/.recovery/<filename>.bak`
2. Return conflict details including both disk and local versions
3. Log telemetry event per spec §13.5

The service should be used by TaskEditorPanel before saving task files. If a conflict is detected, the user should be presented with options to resolve (keep local, keep disk, or merge manually).

TelemetryLogger is a shared service that will also be used by the runner engine. It should write structured JSON logs to `.kanban2code/_logs/` with timestamps and event types.
