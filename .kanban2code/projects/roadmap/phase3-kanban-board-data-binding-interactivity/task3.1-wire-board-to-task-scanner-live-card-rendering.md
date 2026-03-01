---
stage: completed
tags: [feature, p1]
agent: auditor
contexts: [skill-vscode, skill-frontend-design]
---

# Wire board to TaskScanner — live card rendering

## Goal

Replace the hardcoded board cards with dynamic rendering from the TaskScanner, enabling real-time updates when task files change.

## Definition of Done

- [x] Board requests `TaskSnapshot` on load and renders real cards from filesystem
- [x] Cards show: title, description (truncated), priority indicator, role badge, project badge
- [x] Column counts update dynamically
- [x] File watcher triggers board refresh (no polling)
- [x] Empty columns show placeholder text

## Files

- `src/webview/KanbanPanel.ts` - modify - wire TaskScanner, handle messages
- `src/webview/ui/board.tsx` - modify - replace hardcoded cards with dynamic rendering
- `src/webview/ui/board.css` - modify - priority color indicators per spec

## Tests

- [x] Board renders cards from filesystem
- [x] Cards appear in correct columns by stage
- [x] Priority colors match spec (high=red, medium=amber, low=green)
- [x] Adding a task file triggers board update

## Audit Result

- Rating: 8.5/10
- Verdict: Pass
- Notes:
  - `KanbanPanel` is wired to `TaskScanner`, subscribes to `onDidRefresh`, and posts a fresh `TaskSnapshot` to the board webview.
  - Board UI sends `RequestTaskSnapshot` on load, receives `TaskSnapshot`, and dynamically renders cards from `TaskSnapshotItem[]` with per-column counts.
  - Empty-column placeholder is implemented as `No tasks in this stage`.
  - Priority colors match spec values: high `#fb7185`, medium `#fbbf24`, low `#34d399`.
  - Automated test suite passes (`npm test`: 6/6 passing). Coverage is service-heavy; there are no dedicated webview rendering tests yet.

## Context

The current board.tsx has ~200 lines of hardcoded placeholder cards. This task replaces all of that with dynamic rendering based on TaskScanner data.

Card display requirements:
- Title: full task title
- Description: truncated to ~2 lines with ellipsis
- Priority indicator: colored dot/badge (high=#fb7185 red, medium=#fbbf24 amber, low=#34d399 green)
- Role badge: shows the role (planner, coder, auditor)
- Project badge: shows project name if task is in a project folder

Column counts should update dynamically as cards are added/removed/moved.

The board should subscribe to TaskScanner's file watcher events and refresh automatically when files change, eliminating the need for polling.

Empty columns should show a placeholder message like "No tasks in this stage" to guide users.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/kanbanboard-codex.html`

## Refined Prompt

Objective: Wire the KanbanPanel and board.tsx to TaskScanner for live card rendering with file watcher updates.

Implementation approach:
1. Extend KanbanPanel.ts to wire TaskScanner via message bridge (similar to SidebarProvider)
   - Accept TaskScanner in constructor
   - Subscribe to onDidRefresh for live updates
   - Handle RequestTaskSnapshot message from board webview
   - Post TaskSnapshot messages to board webview
2. Update board.tsx to request tasks on load and render dynamically
   - Remove hardcoded HTML cards (~200 lines)
   - Add message listener for TaskSnapshot from host
   - Add postMessage to request snapshot on init
   - Render cards from TaskSnapshotItem[] data
   - Show placeholder when column is empty
3. Add priority color indicators to board.css
   - high priority: #fb7185 (red)
   - medium priority: #fbbf24 (amber)
   - low priority: #34d399 (green)
4. Update extension.ts to pass TaskScanner to KanbanPanel

Key decisions:
- Use existing messaging.ts types (TaskSnapshotMessage, RequestTaskSnapshotMessage) - already defined
- Follow SidebarProvider pattern for scanner wiring and disposal
- Board columns map to stages: capture, plan, code, audit, completed (inbox/unknown go to capture)
- Card display: title, description truncated 2 lines, priority dot, role badge, project badge, tags
- Description sourced from first paragraph of task body (first 120 chars)

Edge cases:
- Task has no priority: show neutral gray dot
- Task has no role: omit agent-chip
- Task has no project: omit project badge
- Empty column: show "No tasks in this stage" placeholder
- Task description longer than 2 lines: truncate with ellipsis

## Context

### File Tree (scoped)
```
src/
├── extension.ts                    # <- modify - wire TaskScanner to KanbanPanel
├── webview/
│   ├── KanbanPanel.ts              # <- modify - add TaskScanner, message handling
│   ├── SidebarProvider.ts          # <- read-only reference - scanner wiring pattern
│   ├── messaging.ts                # <- read-only reference - message types
│   └── ui/
│       ├── board.tsx               # <- modify - dynamic rendering
│       ├── board.css               # <- modify - priority colors
│       └── index.tsx               # <- read-only reference
├── services/
│   └── task-scanner.ts             # <- read-only reference - TaskScanner API
└── types/
    └── task.ts                     # <- read-only reference - TaskSnapshotItem type
```

### Architecture Excerpts
From `.kanban2code/architecture.md`:
- Extension host owns VS Code APIs + filesystem writes
- Webview host owns serialization/broadcast via message bridge
- Webview UI owns rendering only, never imports VS Code API
- All host/webview communication uses typed envelopes from messaging.ts

From `src/webview/messaging.ts` (lines 11-167):
- RequestTaskSnapshotMessage: webview requests tasks
- TaskSnapshotMessage: host sends TaskSnapshotItem[] to webview
- Message validation via isHostToWebviewMessage / isWebviewToHostMessage

### Skill Excerpts
From `.kanban2code/_context/skills/skill-vscode.md`:
- Keep strict separation: Extension Host (VS Code APIs) vs Webview Host (message bridge) vs Webview UI (rendering)
- Message handlers must validate envelope/type before acting
- On state changes, broadcast refresh/update events to UI
- Core layout must be class-based CSS (no inline layout sprawl)

From `.kanban2code/_context/skills/skill-frontend-design.md`:
- Use CSS custom properties for color values
- Motion: CSS-only first with @keyframes and transitions
- Layout: Keep presentational logic in UI, maintain visual hierarchy

### Code Excerpts

`src/webview/KanbanPanel.ts:1-42` (current state - needs TaskScanner wiring):
```typescript
import * as vscode from 'vscode';

export class KanbanPanel {
  public static currentPanel: KanbanPanel | undefined;
  public static readonly viewType = 'kanban2code-board';
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  // TODO: Add TaskScanner injection
```

`src/webview/SidebarProvider.ts:16-25` (reference pattern for scanner wiring):
```typescript
constructor(
  private readonly extensionUri: vscode.Uri,
  private readonly taskScanner: TaskScanner
) {
  this.disposables.push(
    this.taskScanner.onDidRefresh(() => {
      void this.postTaskSnapshot();
    })
  );
}
```

`src/services/task-scanner.ts:103-140` (TaskScanner API):
```typescript
export class TaskScanner implements DisposableLike {
  public readonly onDidRefresh = this.refreshEmitter.event;
  async scan(options: TaskScanOptions = {}): Promise<TaskSnapshotItem[]>
  dispose(): void
}
```

`src/types/task.ts:26-36` (TaskSnapshotItem structure):
```typescript
export interface TaskSnapshotItem {
  id: string;
  taskId: string;
  title: string;
  stage: TaskStage;
  priority?: Priority;
  role?: string;
  project?: string;
  tags: string[];
  createdAt: number;
}
```

`src/webview/messaging.ts:162-167` (TaskSnapshotMessage type):
```typescript
export interface TaskSnapshotMessage {
  type: 'TaskSnapshot';
  payload: {
    tasks: TaskSnapshotItem[];
  };
}
```

`src/webview/ui/board.tsx:59-160` (hardcoded cards to replace):
```typescript
// Current board.tsx renders ~200 lines of static HTML cards
// All hardcoded card markup should be replaced with dynamic generation
// based on TaskSnapshotItem[] received via message event
```

### Dependency Graph

Files importing from modified files:
- `src/extension.ts` -> imports KanbanPanel, TaskScanner
- `src/webview/KanbanPanel.ts` -> imports messaging types, vscode
- `src/webview/ui/board.tsx` -> imports board.css (bundled)

Consumers not in task scope:
- SidebarProvider.ts (separate webview, separate bundle)
- task-scanner.ts (service layer, already integrated)

### Patterns to Follow

1. Message Bridge Pattern (from SidebarProvider.ts):
   - postMessage to webview via `this._panel.webview.postMessage()`
   - Receive messages via `webview.onDidReceiveMessage()`
   - Always validate with `isWebviewToHostMessage()`

2. TaskScanner Subscription Pattern:
   - Subscribe in constructor: `this.taskScanner.onDidRefresh()`
   - Push disposable to disposables array for cleanup
   - Fire `postTaskSnapshot()` on refresh events

3. VS Code Webview Panel Pattern:
   - Static createOrShow() factory method
   - Dispose properly in dispose() method
   - Use getNonce() for CSP

4. CSS Priority Colors (add to board.css):
   ```css
   .priority-dot.high { background: #fb7185; }
   .priority-dot.med { background: #fbbf24; }
   .priority-dot.low { background: #34d399; }
   ```

### Test Patterns

Tests for this feature should follow patterns in:
- `src/services/task-scanner.test.ts` - TaskScanner mocking
- `src/webview/__tests__/messaging.test.ts` - message type validation

Test structure:
```typescript
describe('KanbanPanel', () => {
  it('should request and receive task snapshot', async () => {
    // Mock TaskScanner.scan() to return test tasks
    // Verify webview.postMessage called with TaskSnapshotMessage
  });
});
```

### Gotchas

- TaskScanner scan() returns cached tasks on subsequent calls - always await it
- KanbanPanel uses a different bundle (board.js) than sidebar (webview.js)
- Board CSS variables already defined in board.css but priority-dot classes need mapping
- Message listener in board.tsx must use window.addEventListener('message', handler)
- TaskSnapshotItem.stage may be 'inbox' or 'unknown' - map these to 'capture' column for display
- Column counts must update when filtered/search hides cards (cross-task concern with 3.2)

### Scope Boundaries

This task (3.1) is about DATA BINDING - getting real task data to render.
Do NOT implement:
- Search/filter/sort logic (Task 3.2 handles this)
- Drag and drop (Task 3.3 handles this)
- Modal/creation flow (Task 3.4 handles this)
- Card actions/edit/delete (Task 3.5 handles this)
- Full viewport layout fixes (Task 3.6 handles this)

Focus only on:
1. Wiring KanbanPanel to TaskScanner
2. Requesting tasks on board load
3. Rendering cards from TaskSnapshotItem[]
4. Updating when files change (via onDidRefresh)
5. Empty column placeholder

## Tests

- [ ] Board renders cards from filesystem
- [ ] Cards appear in correct columns by stage
- [ ] Priority colors match spec (high=#fb7185 red, medium=#fbbf24 amber, low=#34d399 green)
- [ ] Adding a task file triggers board update
