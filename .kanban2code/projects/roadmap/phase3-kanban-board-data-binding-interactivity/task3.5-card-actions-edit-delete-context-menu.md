---
stage: audit
agent: coder
tags: [feature, p1]
agent: planner
contexts: [skill-vscode]
---

# Card actions — edit, delete, context menu

## Goal

Add card-level actions for editing, deleting, and accessing a context menu with additional operations.

## Definition of Done

- [ ] Edit button (hover-visible) posts `OpenTaskEditor` message
- [ ] Delete button shows confirmation, then deletes task file
- [ ] Context menu matches existing spec (Open/Run/Run all/Move/Edit/Copy/Delete)
- [ ] Delete respects "confirm destructive actions" setting

## Files

- `src/webview/ui/board.tsx` - modify - card action handlers
- `src/webview/KanbanPanel.ts` - modify - handle `DeleteTask`, `OpenTaskEditor` messages

## Tests

- [ ] Edit opens task editor panel
- [ ] Delete removes file after confirmation
- [ ] Context menu shows correct options per card state

## Context

Card actions should be visible on hover and include:
- Edit button: opens TaskEditorPanel for the task
- Delete button: shows confirmation dialog, then deletes task file
- Context menu: right-click or three-dot menu with options

Context menu options (per spec):
- Open: opens task in TaskEditorPanel
- Run: runs current stage (if applicable)
- Run all: runs all stages (if applicable)
- Move: submenu to move to different stage
- Edit: opens task in TaskEditorPanel
- Copy: copies task to clipboard
- Delete: deletes task with confirmation

Delete confirmation:
- If "confirm destructive actions" setting is enabled: show confirmation dialog
- If disabled: delete immediately
- Confirmation dialog should show task title and ask for confirmation

Edit button should be visible on card hover and positioned in the card footer or header area.

Delete button should be visible on card hover and positioned near the edit button.

Context menu should be accessible via:
- Right-click on card
- Three-dot menu button on card hover

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/kanbanboard-codex.html`

## Refined Prompt

Objective: Implement card-level actions (edit, delete, context menu) for kanban board cards with hover visibility and settings-aware confirmation dialogs.

Implementation approach:
1. Modify `createCardMarkup()` in board.tsx to include:
   - Hover-visible action container (edit button, delete button, three-dot menu button)
   - Position action buttons in card header/footer area using CSS
   - Add data attributes to card (`data-task-id`) for event delegation
2. Add CSS styles to board.css for:
   - `.card-actions` container with `opacity: 0` default, `opacity: 1` on card hover
   - Action buttons styled with existing design tokens (--surface, --border-md)
   - Context menu dropdown positioning (absolute, z-index above cards)
3. Implement event delegation in board.tsx for:
   - Edit button click: post `OpenTaskEditor` message with taskId
   - Delete button click: check settings, show confirmation if enabled, then post `DeleteTask`
   - Three-dot menu click: toggle context menu visibility
   - Right-click on card: prevent default, show context menu
4. Implement context menu component in board.tsx:
   - Menu items: Open, Run, Run all, Move (submenu), Edit, Copy, Delete
   - Each item posts appropriate message to host
   - Close menu on item click, Escape key, or click outside
5. Handle messages in KanbanPanel.ts:
   - `OpenTaskEditor`: Use VS Code API to open task file in markdown editor (or show placeholder if TaskEditorPanel doesn't exist yet)
   - `DeleteTask`: Get settings via SettingsService, check `confirmDestructiveActions`, show confirmation via `vscode.window.showWarningMessage`, then call `taskService.deleteTask()`
6. Fetch settings on board load to get `confirmDestructiveActions` value

Key decisions:
- Use event delegation for card actions: avoids attaching individual handlers to each card, works with dynamic re-rendering
- Context menu as absolutely-positioned dropdown: follows existing UI patterns, easy to dismiss
- Confirmation via VS Code native dialogs: consistent with extension UX, no custom modal needed
- Settings fetched at board load: `confirmDestructiveActions` needed immediately for delete buttons
- TaskEditor opens in standard markdown editor for now: TaskEditorPanel is future work, standard editor works
- Copy action uses Clipboard API in webview: no host round-trip needed for simple copy

Edge cases:
- Settings not yet loaded when delete clicked: default to showing confirmation (safe default)
- Task file already deleted externally: catch error, show notification, refresh board
- Rapid clicks on action buttons: disable buttons during async operations
- Context menu overflow at screen edges: position intelligently (flip to left if near right edge)
- Right-click on card while another menu open: close old menu, open new one

## Context

### File Tree (scoped)

src/
├── webview/
│   ├── KanbanPanel.ts          # ← modify - handle DeleteTask, OpenTaskEditor
│   ├── messaging.ts            # ← read-only reference - message types exist
│   └── ui/
│       ├── board.tsx           # ← modify - add card action handlers, context menu
│       └── board.css           # ← modify - action button and context menu styles
├── services/
│   ├── task-service.ts         # ← read-only reference - deleteTask API
│   └── settings-service.ts     # ← read-only reference - confirmDestructiveActions setting
└── types/
    ├── task.ts                 # ← read-only reference - Task types
    └── settings.ts             # ← read-only reference - Settings type

### Architecture Excerpts

From `gemini-architecture.md` Section 3.7:
> Card quick actions:
> - edit (hover-visible) -> opens Task Editor
> - delete

From `skill-vscode.md`:
> - Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes.
> - Webview UI (`src/webview/ui/**`) owns rendering only.
> - All host/webview communication uses typed envelopes; no ad-hoc payloads.

### Skill Excerpts

From `.kanban2code/_context/skills/skill-vscode.md`:
- **Extension Host Rules**: Register commands explicitly in one module (`src/commands/index.ts`). Any state-changing action must flow through host logic and persist to filesystem.
- **Webview UI Rules**: Core layout must be class-based CSS (no inline layout sprawl). Keep presentational logic in UI; never import VS Code API into React components.

### Code Excerpts

**src/webview/messaging.ts:41-46** - DeleteTask message type:
```typescript
export interface DeleteTaskMessage {
  type: 'DeleteTask';
  payload: {
    taskId: string;
  };
}
```
Why: Message structure for deleting tasks from UI.

**src/webview/messaging.ts:65-70** - OpenTaskEditor message type:
```typescript
export interface OpenTaskEditorMessage {
  type: 'OpenTaskEditor';
  payload?: {
    taskId?: string;
  };
}
```
Why: Message to open task editor for the specified task.

**src/webview/ui/board.tsx:218-245** - createCardMarkup function:
```typescript
const createCardMarkup = (task: TaskSnapshotItem): string => {
  const priorityClass = toPriorityClass(task.priority);
  const priorityLabel = task.priority ?? 'unset';
  const roleChip = task.role
    ? `<span class="agent-chip">${escapeHtml(task.role)}</span>`
    : '';
  // ... returns HTML string
};
```
Why: This function generates card HTML; modify to include action buttons.

**src/services/task-service.ts:145-154** - deleteTask method:
```typescript
async deleteTask(filePath: string): Promise<void> {
  const deps = await this.getRuntimeDependencies();
  const uri = deps.toFileUri(this.toAbsolutePath(filePath));
  try {
    await deps.fs.delete(uri);
  } catch {
    throw new Error(`Task file not found: ${filePath}`);
  }
}
```
Why: Host-side API for deleting task files.

**src/services/settings-service.ts:42-48** - confirmDestructiveActions default:
```typescript
const DEFAULT_SETTINGS: Settings = {
  general: {
    // ...
    confirmDestructiveActions: true
  },
  // ...
};
```
Why: Settings shape showing the confirmation flag location at `settings.general.confirmDestructiveActions`.

**src/webview/KanbanPanel.ts:95-122** - handleWebviewMessage method:
```typescript
private async handleWebviewMessage(rawMessage: unknown): Promise<void> {
  if (!isWebviewToHostMessage(rawMessage)) {
    return;
  }
  if (rawMessage.type === 'RequestTaskSnapshot') {
    await this.postTaskSnapshot();
    return;
  }
  if (rawMessage.type === 'MoveTask') {
    // ... handle move
  }
}
```
Why: Add handlers for DeleteTask and OpenTaskEditor in this switch-style block.

### Dependency Graph

Files importing from modified files:
- `src/extension.ts` imports `KanbanPanel` - uses `createOrShow()`
- `src/webview/ui/board.tsx` imports from `../messaging` - uses message types

Files modified files import from:
- `KanbanPanel.ts` imports `TaskService`, `TaskScanner`, `SettingsService`, messaging types
- `board.tsx` imports messaging types

### Patterns to Follow

1. **Event delegation**: Current board.tsx uses `app.addEventListener` with target checks for drag/drop; follow same pattern for card actions
2. **CSS hover states**: Use `.card:hover .card-actions { opacity: 1; }` pattern
3. **VS Code dialogs**: Use `vscode.window.showWarningMessage()` for confirmations with "Delete" and "Cancel" buttons
4. **Settings access**: Inject `SettingsService` into `KanbanPanel` constructor (add to existing `TaskScanner`, `TaskService` pattern)
5. **Error handling**: Wrap async operations in try/catch, post error notifications via `vscode.window.showErrorMessage`

### Test Patterns

Tests for similar webview messaging in `src/webview/__tests__/messaging.test.ts`:
- Message validation tests using `isWebviewToHostMessage`
- Type guard tests for payload shapes

For this task, add tests in:
- `src/webview/__tests__/messaging.test.ts` - verify DeleteTask and OpenTaskEditor message validation
- Manual testing: edit opens file, delete shows confirmation, context menu appears on right-click

### Gotchas

- **No TaskEditorPanel yet**: Open task files in standard VS Code markdown editor using `vscode.workspace.openTextDocument()` and `vscode.window.showTextDocument()`
- **SettingsService injection**: KanbanPanel currently doesn't have SettingsService; add to constructor similar to TaskScanner/TaskService
- **Context menu positioning**: Must handle viewport edges to prevent menu clipping
- **Multiple menus**: Ensure only one context menu is open at a time (global state or close-on-open pattern)
- **File path resolution**: TaskService methods need file path, but UI only has taskId; map taskId to file path via TaskScanner or store path in TaskSnapshotItem
- **Confirmation default**: When settings not loaded, default to confirming (safer than accidental delete)

### Scope Boundaries

This task is part of Phase 3 (Kanban Board Data Binding & Interactivity). Related tasks:
- Task 3.4 (Capture modal): Already handles task creation, do NOT modify capture modal
- Task 3.6 (Full-viewport layout): Do NOT modify layout/CSS for board structure

Stay focused on card ACTIONS only. Do not add:
- Task editing forms/modals (separate TaskEditor work)
- Drag and drop changes
- Board header/filter changes
- Full TaskEditorPanel implementation (out of scope)

<!-- STAGE_TRANSITION: code -->
