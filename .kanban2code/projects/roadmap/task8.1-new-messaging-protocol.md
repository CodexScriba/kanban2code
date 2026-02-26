---
stage: completed
agent: auditor
tags: [feature, p1]
contexts: []
---

# New Messaging Protocol

## Goal
A lean, typed message contract between the extension host and the chat webview. No legacy board/filter/tree messages.

## Definition of Done
- [x] All message types have Zod schemas, round-trip test passes, no any types.

## Files
- `src/webview/messaging.ts` - create - full rewrite
- `src/webview/ui/vscodeApi.ts` - create - port from /home/cynicus/code/kanban2code-v1/

## Refined Prompt

Objective: Create a lean, typed messaging protocol with Zod schemas for extension host ↔ chat webview communication.

Implementation approach:
1. Create `src/webview/messaging.ts` with new V2 message types only
2. Define HostToWebview message types: InitState, StreamChunk, MessageComplete, TaskGenerated, WorkspaceUpdated, Error
3. Define WebviewToHost message types: RequestState, SendMessage, GenerateTask, RunTask, CancelStream
4. Create Zod schemas for each message payload
5. Keep `createEnvelope`/`validateEnvelope` pattern from v1
6. Export typed message interfaces (no `any` types)
7. Port `src/webview/ui/vscodeApi.ts` from v1 (singleton pattern, acquireVsCodeApi once)
8. Create round-trip test verifying all message types serialize/deserialize correctly

Key decisions:
- MESSAGE_VERSION: 2 (new protocol, breaking change from v1)
- Use discriminated union pattern for type-safe message handling
- Keep envelope pattern for consistent wrapping
- vscodeApi.ts is already ported and working - no changes needed
- No legacy messages (board/filter/tree) - clean slate for V2

Edge cases:
- Invalid message version: validateEnvelope throws clear error
- Unknown message type: validation fails with descriptive message
- Payload schema mismatch: Zod error with path information
- Missing required fields: validation catches before runtime

Questions: None

## Context

### File Tree (scoped)
```
src/
├── webview/
│   ├── messaging.ts            # <- create - V2 message protocol
│   └── ui/
│       └── vscodeApi.ts        # <- read-only reference - already ported
├── types/
│   ├── task.ts                 # <- read-only reference - Task, Stage
│   ├── snapshot.ts             # <- read-only reference - WorkspaceSnapshot
│   └── provider.ts             # <- read-only reference - ProviderConfig
└── tests/
    └── webview/
        └── messaging.test.ts   # <- create - round-trip tests
```

### Architecture Excerpts
Source: `kanban2codev2.md:484-514` - Phase 8 Messaging Protocol spec:
```
Host → Webview:
- InitState — kanban root exists, workspace snapshot, active orchestrator provider
- StreamChunk — token from orchestrator streaming response
- MessageComplete — orchestrator response finished
- TaskGenerated — task file was written, path + title
- WorkspaceUpdated — filesystem changed, new snapshot
- Error — something failed, message

Webview → Host:
- RequestState — webview mounted, send InitState (handshake from v1)
- SendMessage — user sent chat message, text
- GenerateTask — user clicked "Generate .md", confirmed proposal
- RunTask — user clicked "Run", task file path
- CancelStream — user cancelled in-progress orchestrator response
```

Source: `kanban2codev2.md:508-511` - File requirements:
```
- src/webview/messaging.ts — full rewrite. Keep createEnvelope/validateEnvelope 
  pattern from /home/cynicus/code/kanban2code-v1/, new message types only.
- src/webview/ui/vscodeApi.ts — already ported from v1 in Phase 0, no changes needed
```

### Skill Excerpts
No specific skill guidance needed beyond general conventions.

### Code Excerpts
`/home/cynicus/code/kanban2code-v1/src/webview/messaging.ts:1-141` - v1 pattern to preserve:
```typescript
import { z } from 'zod';

export const MESSAGE_VERSION = 1 as const;

export interface MessageEnvelope<TPayload = unknown> {
  version: typeof MESSAGE_VERSION;
  type: MessageType;
  payload: TPayload;
}

export const EnvelopeSchema = z.object({
  version: z.literal(MESSAGE_VERSION),
  type: z.union([z.enum(HostToWebviewMessageTypes), z.enum(WebviewToHostMessageTypes)]),
  payload: z.unknown(),
});

export function createEnvelope<TPayload>(
  type: MessageType,
  payload: TPayload,
): MessageEnvelope<TPayload> {
  return { version: MESSAGE_VERSION, type, payload };
}

export function validateEnvelope<TPayload = unknown>(data: unknown): MessageEnvelope<TPayload> {
  const result = EnvelopeSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid message envelope: ${result.error.message}`);
  }
  return result.data as MessageEnvelope<TPayload>;
}
```

`src/webview/ui/vscodeApi.ts:1-4` - already ported, no changes:
```typescript
declare const acquireVsCodeApi: (() => { postMessage: (message: unknown) => void }) | undefined;
export const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : undefined;
```

`src/types/task.ts:1-2` - Stage type for schemas:
```typescript
export type Stage = 'inbox' | 'plan' | 'code' | 'audit' | 'completed';
```

`src/types/orchestrator.ts:5-10` - ChatMessage for SendMessage payload:
```typescript
export type ChatMessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}
```

`src/types/snapshot.ts:23-31` - WorkspaceSnapshot for InitState:
```typescript
export interface WorkspaceSnapshot {
  config: Kanban2CodeConfig;
  tasks: WorkspaceSnapshotTasks;
  agents: Agent[];
  contexts: ContextFile[];
  skills: SkillFile[];
  providers: ProviderConfigFile[];
  metadata: WorkspaceSnapshotMetadata;
}
```

### Dependency Graph
Files that will import messaging.ts:
- `src/webview/SidebarProvider.ts` (task 9.1) - sends InitState, handles incoming messages
- `src/webview/ui/hooks/useChat.ts` (task 9.1) - sends SendMessage, receives StreamChunk
- `src/webview/ui/App.tsx` (task 9.1) - receives InitState, sends RequestState

Files messaging.ts imports from:
- `zod` - schema validation
- `src/types/task.ts` - Stage type
- `src/types/snapshot.ts` - WorkspaceSnapshot type
- `src/types/orchestrator.ts` - ChatMessage type
- `src/types/provider.ts` - ProviderConfig type

### Patterns to Follow
- Use Zod for all payload schemas with `.strict()` for extra safety
- Export inferred TypeScript types from schemas (e.g., `export type InitStatePayload = z.infer<typeof InitStatePayloadSchema>`)
- Keep envelope version check to prevent cross-version communication
- Use `z.literal()` for message type discrimination
- Type parameter on validateEnvelope for caller-side payload typing
- No barrel exports - import directly from source files

### Test Patterns
Test structure from `tests/task-generator.test.ts`:
```typescript
import { describe, expect, test } from 'vitest';
import { createEnvelope, validateEnvelope, InitStatePayloadSchema } from '../src/webview/messaging';

describe('messaging', () => {
  test('round-trip InitState message', () => {
    const payload = { /* valid payload */ };
    const envelope = createEnvelope('InitState', payload);
    const validated = validateEnvelope(envelope);
    expect(validated.type).toBe('InitState');
    expect(validated.payload).toEqual(payload);
  });
});
```

Test coverage needed:
- Each message type round-trip (serialize → validate → deserialize)
- Invalid version rejection
- Invalid payload schema rejection
- Type inference correctness

### Gotchas
- MESSAGE_VERSION must be 2 (not 1) - this is a breaking protocol change
- Do NOT include legacy v1 message types (FilterChanged, RunnerStateChanged, etc.)
- WorkspaceSnapshot is a complex nested type - import from types/snapshot.ts, don't redefine
- acquireVsCodeApi can only be called once per webview - singleton pattern is critical
- StreamChunk payload needs token string field for incremental rendering
- TaskGenerated payload needs both path and title for UI display

### Scope Boundaries
**This task (8.1) focuses on:**
- Message type definitions and Zod schemas only
- Envelope creation and validation functions
- Round-trip unit tests
- vscodeApi.ts is already done (Phase 0) - no changes

**Out of scope (handled by other tasks):**
- Task 7.1 (completed): Terminal executor - not needed here
- Task 9.1 (pending): Chat + Board UI - will consume this messaging layer
- Task 9.1 (pending): SidebarProvider - will use these message types
- Don't implement the actual message handlers (host-side or UI-side)
- Don't implement orchestrator streaming logic (task 5.1)
- Don't implement workspace snapshot building (task 3.1)

## Audit
src/webview/messaging.ts
tests/webview/messaging.test.ts

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
Implementation meets the V2 protocol requirements with strongly typed envelopes, strict Zod payload validation, and comprehensive round-trip coverage across all required message types. No blocking defects were found in scope.

### Findings

#### Blockers
- [x] None

#### High Priority
- [x] None

#### Medium Priority
- [x] None

#### Low Priority / Nits
- [ ] `WorkspaceSnapshotSchema` intentionally validates a protocol-level shape with `unknown` internals; if future consumers depend on deep runtime guarantees, consider gradually tightening nested schemas. - `src/webview/messaging.ts`

### Test Assessment
- Coverage: Adequate
- Missing tests: None required for this task scope

### What's Good
- Clean discriminated-union envelope design, strict payload schemas per message type, and explicit rejection tests for invalid version/type/payload paths.

### Recommendations
- Optional: add one assertion that extra unknown envelope-level keys are rejected, to lock in `.strict()` behavior at protocol boundaries.
