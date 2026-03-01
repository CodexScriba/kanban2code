---
stage: completed
agent: auditor
tags: [feature, p1]
contexts: [skill-vscode, skill-frontend-design]
---

# TaskEditorPanel — webview host + three-panel layout shell

## Goal

Create a new singleton webview panel for the task editor with a three-panel layout (metadata, editor, execution rail) and proper exit behavior handling.

## Definition of Done

- [x] New `TaskEditorPanel` singleton webview panel
- [x] Receives task file path via message, loads full task data
- [x] Renders three-panel layout: left (metadata), center (editor), right (execution rail)
- [x] Top bar with breadcrumb, live chips (stage/role/provider/dirty), action buttons
- [x] Exit behavior: clean close or dirty-state modal (Save & Exit / Discard & Exit / Cancel)

## Files

- `src/webview/TaskEditorPanel.ts` - create - webview host for task editor
- `src/webview/ui/taskeditor.tsx` - create - task editor DOM
- `src/webview/ui/taskeditor.css` - create - task editor styles
- `esbuild.mjs` - modify - add `taskeditor` entry point
- `src/extension.ts` - modify - register openTaskEditor command

## Tests

- [x] Panel opens with task data loaded
- [x] Three-panel layout renders correctly
- [x] Top bar shows correct breadcrumb and chips
- [x] Exit with no changes closes immediately
- [x] Exit with dirty state shows modal

## Context

TaskEditorPanel follows the singleton pattern used by KanbanPanel, with a static `currentPanel` property to ensure only one instance exists.

Three-panel layout:
- Left panel: task metadata form (Basic Info, Location, Pipeline, Assignment, Context, Skills, Tags)
- Center panel: tabbed editor (Task Body, Frontmatter, Run Notes)
- Right panel: execution rail (Task Preview, Pipeline Steps, Recent Runs)

Top bar components:
- Breadcrumb: project / task title
- Live chips: stage, role, provider, dirty indicator
- Action buttons: Save, Close

Exit behavior:
- Clean close: if no unsaved changes, close immediately
- Dirty state: show modal with options:
  - Save & Exit: save changes and close
  - Discard & Exit: discard changes and close
  - Cancel: keep panel open

The panel should receive the task file path via `OpenTaskEditor` message from the board or sidebar.

Layout should use flexbox to ensure panels fill the available space and scroll independently when content overflows.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/taskeditor-codex.html`

## Refined Prompt

Objective: Create TaskEditorPanel webview host with three-panel layout shell

Implementation approach:
1. Create `src/webview/TaskEditorPanel.ts` following KanbanPanel singleton pattern
2. Create `src/webview/ui/taskeditor.tsx` with three-panel layout structure
3. Create `src/webview/ui/taskeditor.css` with design system from taskeditor-codex.html
4. Add `taskeditor` entry point to `esbuild.mjs`
5. Register `kanban2code.openTaskEditor` command in `src/extension.ts`
6. Add `LoadTaskEditor` message type and handler for initial task data loading

Key decisions:
- Singleton pattern: Follow KanbanPanel exactly with `currentPanel` static property
- Message protocol: Add `LoadTaskEditor` host→webview message for initial data
- Layout: Flexbox-based three-panel with independent scrolling
- Dirty state: Track in webview UI, communicate to host via message
- Exit modal: Implement in webview UI (not host modal) for consistency

Edge cases:
- Opening same task while already open: just reveal panel, don't reload
- Opening different task while editor has dirty changes: show save/discard modal first
- Panel closed by VS Code (not user): handle in `onDidDispose`
- Task file deleted while open: show error toast, close panel

## Context

### File Tree (scoped)

src/
├── extension.ts                    # ← modify - register openTaskEditor command
├── webview/
│   ├── KanbanPanel.ts              # ← read-only reference (singleton pattern)
│   ├── TaskEditorPanel.ts          # ← create - webview host for task editor
│   ├── messaging.ts                # ← modify - add LoadTaskEditor message
│   └── ui/
│       ├── board.tsx               # ← read-only reference
│       ├── taskeditor.tsx          # ← create - task editor DOM
│       └── taskeditor.css          # ← create - task editor styles
├── services/
│   └── task-service.ts             # ← read-only reference
└── types/
    └── task.ts                     # ← read-only reference
esbuild.mjs                         # ← modify - add taskeditor entry point

### Architecture Excerpts

From `skill-vscode.md`:
- Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes
- Webview Host (`SidebarProvider` + message bridge) owns serialization/broadcast
- Webview UI (`src/webview/ui/**`) owns rendering only
- All host/webview communication uses typed envelopes; no ad-hoc payloads
- Webview HTML must load bundled script + stylesheet deterministically
- Use `webview.asWebviewUri(...)` for local assets

From KanbanPanel pattern:
- Static `currentPanel` for singleton behavior
- `createOrShow()` method to reveal or create
- `_getHtmlForWebview()` returns CSP-compliant HTML with nonce
- Message handlers validate envelope/type before acting

### Skill Excerpts

skill-vscode.md:
- Keep strict separation: Extension Host owns VS Code APIs, Webview UI owns rendering only
- `.kanban2code/` markdown task files are workflow truth
- Build output must include webview JS and CSS consumed by the webview host
- Runtime validation: `bun run build` passes, webview renders with styles, message round-trip works

skill-frontend-design.md (implied from design references):
- Use CSS variables for theming (colors, spacing, borders)
- Flexbox for layout structures
- No inline styles for core layout

### Code Excerpts

KanbanPanel.ts:13-20 - Singleton pattern
```typescript
export class KanbanPanel {
  public static currentPanel: KanbanPanel | undefined;
  public static readonly viewType = 'kanban2code-board';
  // ...
}
```

KanbanPanel.ts:57-70 - createOrShow method
```typescript
public static createOrShow(
  extensionUri: vscode.Uri,
  taskScanner: TaskScanner,
  // ...
): void {
  const column = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : undefined;

  if (KanbanPanel.currentPanel) {
    KanbanPanel.currentPanel._panel.reveal(column);
    return;
  }
  // ... create new panel
}
```

KanbanPanel.ts:229-255 - HTML generation with CSP
```typescript
private _getHtmlForWebview(webview: vscode.Webview): string {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(this._extensionUri, 'dist', 'board.js')
  );
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(this._extensionUri, 'dist', 'board.css')
  );
  const nonce = getNonce();
  // ... returns HTML with CSP nonce
}
```

extension.ts:25-40 - Command registration pattern
```typescript
context.subscriptions.push(
  vscode.commands.registerCommand('kanban2code.openBoard', () => {
    // ...
    KanbanPanel.createOrShow(context.extensionUri, taskScanner, taskService, settingsService);
  })
);
```

### Dependency Graph

Files consuming TaskEditorPanel:
- `src/extension.ts` - registers command, creates panel
- `src/webview/KanbanPanel.ts` - sends `OpenTaskEditor` message (will target TaskEditorPanel instead of opening text doc)

Files consumed by TaskEditorPanel:
- `src/webview/messaging.ts` - message types
- `src/services/task-service.ts` - for loading/saving tasks
- `src/services/task-scanner.ts` - for resolving task paths

### Patterns to Follow

- Singleton webview pattern from KanbanPanel
- CSP-compliant HTML generation with nonce
- Message validation using `isWebviewToHostMessage` / `isHostToWebviewMessage`
- CSS design system from taskeditor-codex.html (variables for colors, spacing)
- Three-panel flexbox layout with independent scroll areas
- Dispose pattern: clean up disposables, reset static currentPanel

### Test Patterns

No existing tests for webview panels. Add tests in:
- Unit: Message type validation
- Integration: Command registration in extension.ts
- Manual: Extension Development Host smoke test

### Gotchas

- CSP nonce must be regenerated per panel instance
- `retainContextWhenHidden: true` needed for panel state persistence
- Webview URI paths must use `asWebviewUri()` for security
- Dirty state must be tracked separately from host file state
- Modal implementation must be in webview (host modal API not available for webviews)

### Scope Boundaries

This task (4.1) creates ONLY the shell/layout. Do NOT implement:
- Left panel metadata form fields (task 4.2)
- Center panel tabbed editor content (task 4.3)
- Right panel execution rail content (task 4.4)
- Actual save/load logic beyond message handlers (task 4.2-4.4)
- Monaco editor integration (deferred post-v1)

Focus on: panel host, three-panel layout skeleton, top bar structure, exit behavior framework.
