---
agent: auditor
stage: completed
tags: [feature, p1]
contexts: [skill-vscode]
---

# Wire runner to board + sidebar UI

## Goal

Connect runner state to board and sidebar UI, showing run status badges, queue counts, and enabling run actions from context menus.

## Definition of Done

- [ ] Board cards show run status badges (queued/running/success/failed)
- [ ] Queue chip in board header shows `Queue: N`
- [ ] Sidebar shows active run indicator
- [ ] Run/Queue/Cancel/Retry actions work from board context menu
- [ ] Runner state changes broadcast to all active webviews

## Files

- `src/webview/ui/board.tsx` - modify - run badges on cards, queue chip
- `src/webview/ui/board.css` - modify - badge styles (pulsing for running)
- `src/webview/KanbanPanel.ts` - modify - handle runner messages, broadcast state
- `src/webview/SidebarProvider.ts` - modify - handle runner messages

## Tests

- [ ] Card badge updates when run state changes
- [ ] Queue chip shows correct count
- [ ] Cancel from context menu stops running task

## Context

Runner state must be visible across all UI components for real-time feedback.

Board card badges:
- Show run status badge on each card
- Badge states: queued, running, success, failed
- Running badge should pulse (CSS animation)
- Badge positioned in card footer or header

Queue chip:
- Display in board header
- Format: `Queue: N` where N is number of queued tasks
- Updates dynamically as tasks are enqueued/dequeued

Sidebar indicator:
- Show active run indicator when runner is active
- Could be a status icon or text indicator
- Updates when runner state changes

Context menu actions:
- Run: enqueue task for current stage
- Run all: enqueue all stages (pipeline)
- Queue: enqueue without starting immediately
- Cancel: cancel running or queued task
- Retry: re-enqueue failed task

State broadcasting:
- RunnerEngine emits state change events
- KanbanPanel and SidebarProvider subscribe to events
- Broadcast `RunnerStateChanged` message to all webviews
- Webviews update UI based on new state

Message flow:
1. User clicks Run from context menu
2. Webview posts `RunStage` or `RunAllStages` message
3. Host validates and enqueues task via QueueService
4. RunnerEngine starts execution
5. State changes broadcast via `RunnerStateChanged`
6. All webviews update UI (badges, queue chip, indicator)

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary targets for this task: `docs/design/kanbanboard-codex.html` and `docs/design/sidebar-codex-blue.html`

## Refined Prompt

Objective: Wire runner state to board and sidebar UI components for real-time task execution visibility.

Implementation approach:
1. Update `KanbanPanel.ts` to subscribe to QueueService events and broadcast `RunnerStateChanged` + `QueueSnapshot` messages to webview
2. Update `SidebarProvider.ts` to subscribe to QueueService events and post runner state messages to sidebar webview
3. Modify `board.tsx` to handle `RunnerStateChanged` and `QueueSnapshot` messages, maintain local run state map
4. Add run status badges to card rendering in `createCardMarkup()` - show queued/running/success/failed states
5. Add queue chip to board header HTML template showing `Queue: N` count
6. Implement context menu actions for Cancel (`CancelRun` message) and Retry (`RetryRun` message)
7. Add pulsing animation CSS for running state badge in `board.css`
8. Add active run indicator to sidebar UI (status text or icon)
9. Update context menu to conditionally show Cancel when task is running/queued

Key decisions:
- Local state in board.tsx: Maintain `Map<taskId, RunState>` for quick badge lookups without re-rendering entire board
- Queue chip position: Add to toolbar-right area in board header next to filters
- Badge position: Card footer alongside existing chips, use distinct styling for run states
- State broadcast pattern: QueueService emits events → KanbanPanel/SidebarProvider subscribe → postMessage to webviews
- Context menu conditionals: Show "Cancel" when task is queued/running, show "Retry" when task failed

Edge cases:
- Multiple webviews open: Broadcast must reach all active webviews (board + sidebar)
- Rapid state changes: Debounce UI updates or use requestAnimationFrame to prevent jank
- Cancel non-running task: Should still send CancelRun message; host validates
- Task deleted while running: Badge should disappear on next TaskSnapshot update

## Context

### File Tree (scoped)

```
src/
├── webview/
│   ├── KanbanPanel.ts      <- modify (subscribe to queue events, broadcast state)
│   ├── SidebarProvider.ts  <- modify (subscribe to queue events, show indicator)
│   ├── messaging.ts        <- read-only reference (message types exist)
│   └── ui/
│       ├── board.tsx       <- modify (badges, queue chip, context menu actions)
│       └── board.css       <- modify (badge styles, pulse animation)
├── services/
│   └── queue-service.ts    <- read-only reference (event emitter pattern)
└── types/
    └── runner.ts           <- read-only reference (RunState, QueueItem types)
```

### Architecture Excerpts

From `skill-vscode.md`:
- "Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes"
- "Webview Host (`SidebarProvider` + message bridge) owns serialization/broadcast"
- "Webview UI (`src/webview/ui/**`) owns rendering only"
- "All host/webview communication uses typed envelopes; no ad-hoc payloads"
- "On state changes, broadcast refresh/update events to UI"

From `messaging.ts:206-222` - Existing message types:
```typescript
export interface RunnerStateChangedMessage {
  type: 'RunnerStateChanged';
  payload: {
    taskId: string;
    state: RunState;
    timestamp: number;
  };
}

export interface QueueSnapshotMessage {
  type: 'QueueSnapshot';
  payload: {
    items: QueueItem[];
    activeTaskId: string | null;
    totalQueued: number;
  };
}
```

From `messaging.ts:100-140` - Runner action messages exist:
```typescript
export interface RunStageMessage { type: 'RunStage'; payload: { taskId: string; } }
export interface RunAllStagesMessage { type: 'RunAllStages'; payload: { taskId: string; } }
export interface CancelRunMessage { type: 'CancelRun'; payload: { taskId: string; } }
export interface RetryRunMessage { type: 'RetryRun'; payload: { taskId: string; } }
```

### Skill Excerpts

From `skill-vscode.md`:
- Extension Host owns business logic, Webview UI owns rendering only
- Message handlers must validate envelope/type before acting
- On state changes, broadcast to all active webviews
- Build output must include webview JS and CSS consumed by the webview host

### Code Excerpts

`src/webview/KanbanPanel.ts:44-51` - Message handler pattern:
```typescript
this._panel.webview.onDidReceiveMessage(
  (message: unknown) => {
    void this.handleWebviewMessage(message);
  },
  null,
  this._disposables
);
```

`src/webview/KanbanPanel.ts:107-191` - Existing message handling:
```typescript
private async handleWebviewMessage(rawMessage: unknown): Promise<void> {
  if (!isWebviewToHostMessage(rawMessage)) { return; }
  // ... handles MoveTask, CreateTask, DeleteTask, etc.
}
```

`src/webview/ui/board.tsx:403-441` - Card markup creation:
```typescript
const createCardMarkup = (task: TaskSnapshotItem): string => {
  // Returns HTML string for card - ADD BADGE HERE
  // Badge should show run state if task has active run state
};
```

`src/webview/ui/board.tsx:378-396` - Context menu structure:
```typescript
contextMenu.innerHTML = `
  <div class="cm-section">
    <button class="cm-item" type="button" data-context-action="open">Open</button>
    <button class="cm-item" type="button" data-context-action="run">Run</button>
    <button class="cm-item" type="button" data-context-action="run-all">Run all</button>
  </div>
  // ... ADD Cancel/Retry conditionally
`;
```

`src/webview/ui/board.tsx:1129-1147` - Message listener pattern:
```typescript
window.addEventListener('message', (event: MessageEvent<unknown>) => {
  if (!isHostToWebviewMessage(event.data)) { return; }
  if (event.data.type === 'SettingsLoaded') { /* ... */ }
  if (event.data.type !== 'TaskSnapshot') { return; }
  // ADD handling for RunnerStateChanged, QueueSnapshot
});
```

`src/webview/ui/board.css:950-984` - Existing badge styles to extend:
```css
.running-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--amber);
  background: var(--amber-soft);
  border: 1px solid var(--amber-border);
}
.running-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--amber);
  animation: pulse 1.4s ease-in-out infinite;
}
```

### Dependency Graph

Files importing from modified files:
- `KanbanPanel.ts` is imported by `src/extension.ts`
- `SidebarProvider.ts` is imported by `src/extension.ts`
- `board.tsx` and `board.css` are bundled and loaded by `KanbanPanel.ts`

Files modified files depend on:
- `messaging.ts` (type definitions)
- `types/runner.ts` (RunState, QueueItem)
- `services/queue-service.ts` (event emitter - for subscription)

### Patterns to Follow

1. **Event subscription pattern**: Use `EventEmitter` from `queue-service.ts` (task 5.1 creates this)
2. **Message handling**: Validate with `isHostToWebviewMessage()` before processing
3. **State management**: Local state in closure variables, update on message receive
4. **CSS naming**: Use kebab-case with state prefixes (`.run-badge`, `.run-badge-running`)
5. **Badge styling**: Follow existing chip patterns (agent-chip, tag-chip, project-chip)

### Test Patterns

From `src/webview/__tests__/messaging.test.ts` - Message validation tests:
- Test `isHostToWebviewMessage` with `RunnerStateChanged` payload
- Test `isHostToWebviewMessage` with `QueueSnapshot` payload

UI tests should verify:
- Badge appears when run state received
- Queue chip updates when snapshot received
- Context menu posts correct message on Cancel/Retry click

### Gotchas

- QueueService may not exist yet: Task 5.1 creates it; assume EventEmitter interface with `on(event, listener)`
- KanbanPanel disposal: Unsubscribe from QueueService events in `dispose()` method
- Sidebar lifecycle: `resolveWebviewView` may be called multiple times; handle gracefully
- Multiple boards: Only one KanbanPanel can exist at a time (static `currentPanel`)
- State sync on open: When board opens, request current queue state to sync badges

### Scope Boundaries

This task (5.4) is the UI layer for Phase 5. It should NOT:
- Implement QueueService logic (task 5.1)
- Spawn CLI processes or manage terminals (task 5.2 - RunnerEngine)
- Validate task configuration (task 5.3)
- Modify message type definitions in `messaging.ts` (types already exist)
- Modify runner types in `types/runner.ts` (types already exist)

This task CONSUMES the QueueService events and displays them. The actual queue operations happen in tasks 5.1-5.3.
