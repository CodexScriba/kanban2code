---
tags: [feature, p1]
agent: auditor
stage: completed
contexts: [skill-vscode, skill-frontend-design]
---

# Center panel — tabbed markdown/yaml editor

## Goal

Implement the center panel of the task editor with tabbed editing for Task Body, Frontmatter, and Run Notes, including save, discard, and conflict detection.

## Definition of Done

- [ ] Three tabs: Task Body, Frontmatter, Run Notes
- [ ] Uses `<textarea>` with monospace font for editing (Monaco deferred to post-v1 if complex)
- [ ] Tab switching preserves content
- [ ] Bottom action bar: Discard changes / Save (or Saved state)
- [ ] Save posts `SaveTask` to host, host writes file via TaskService
- [ ] Conflict detection on save via ConflictDetector

## Files

- `src/webview/ui/taskeditor.tsx` - modify - center panel tabs + editor
- `src/webview/ui/taskeditor.css` - modify - editor/tab styles
- `src/webview/TaskEditorPanel.ts` - modify - handle `SaveTask`, conflict detection

## Tests

- [ ] Tab switching preserves content
- [ ] Save writes to disk
- [ ] Conflict detected shows modal
- [ ] Discard restores last-saved state

## Context

Center panel tabs:

1. **Task Body**
   - Editable textarea with markdown content
   - Monospace font (Noto Mono)
   - Auto-resize or scrollable

2. **Frontmatter**
   - Editable textarea with YAML frontmatter
   - Monospace font
   - Shows raw YAML including `---` delimiters

3. **Run Notes**
   - Editable textarea for run notes
   - Monospace font
   - Used for manual notes about task execution

Tab behavior:
- Tab switching preserves content in memory
- Active tab is visually highlighted
- Content is not auto-saved

Bottom action bar:
- Discard changes: restores last-saved state for all tabs
- Save: posts `SaveTask` message to host
- Saved state: shows "Saved" when no unsaved changes

Save flow:
1. User clicks Save
2. Webview posts `SaveTask` message with all changes
3. Host checks for conflicts via ConflictDetector
4. If conflict: show conflict resolution modal
5. If no conflict: write file via TaskService
6. Broadcast `TaskUpdated` to all webviews

Conflict detection:
- Check if file was modified externally since open
- If conflict detected: show modal with options (Keep Local, Keep Disk, Merge)
- Recovery snapshot created before any overwrite

Monaco editor is deferred to post-v1 if complexity is high. Use `<textarea>` for v1.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/taskeditor-codex.html`

## Refined Prompt

Objective: Implement the center panel tabbed editor with Task Body, Frontmatter, and Run Notes tabs, including dirty state tracking, save/discard actions, and conflict detection integration.

Implementation approach:
1. Add tab navigation (Task Body, Frontmatter, Run Notes) with active state styling
2. Implement textarea editors for each tab using monospace font (Noto Mono or system fallback)
3. Add in-memory content preservation when switching tabs (no auto-save)
4. Create bottom action bar with Discard changes / Save buttons
5. Implement dirty state tracking - any edit marks editor as dirty
6. Wire Save button to post `SaveTask` message with all tab contents
7. Handle `SaveTask` in TaskEditorPanel with conflict detection via ConflictDetector
8. Show conflict modal when external changes detected with Keep Local / Keep Disk / Merge options

Key decisions:
- Use `<textarea>` not Monaco: per spec, Monaco deferred to post-v1 if complexity is high
- Monospace font stack: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
- Content preservation: maintain unsaved content in component state, not localStorage
- Save flow: UI posts all three contents → host validates → conflict check → write file → broadcast TaskUpdated
- Dirty indicator: show in top bar chips via message to host, update on every content change

Edge cases:
- User switches tabs without saving: content must persist in memory
- User closes panel with unsaved changes: exit modal should show (handled by task 4.1 shell)
- External file change while editing: conflict modal with diff options
- Empty task body on save: valid, should save empty string
- Concurrent saves: block with loading state to prevent race conditions

## Context

### File Tree (scoped)
```
src/
└── webview/
    ├── TaskEditorPanel.ts          ← modify - handle SaveTask, conflict detection
    └── ui/
        ├── taskeditor.tsx          ← modify - center panel tabs + editor (created by 4.1)
        └── taskeditor.css          ← modify - editor/tab styles (created by 4.1)
```

### Architecture Excerpts
From `functionality.md` section 5.3 Center Panel:
- Tabs (locked): `Task Body`, `Frontmatter`, `Run Notes`
- Bottom action bar (required): `Discard changes`, `Save` (or `Saved` state when clean)
- Frontmatter Rules: Accept AI-generated YAML frontmatter, normalize legacy keys on load/save
- Run Notes Rules: Store per-task execution notes and log references

From `functionality.md` section 13 Conflict Handling:
- When opening a task file, store: `openedFingerprint` (hash or mtime+size)
- Conflict condition: disk fingerprint != openedFingerprint
- If conflict detected: block direct save, show modal with 3 actions:
  1. `Reload from Disk` (discard local unsaved)
  2. `Compare Changes` (show side-by-side diff)
  3. `Overwrite with Mine` (danger; requires confirmation)

### Skill Excerpts
From `skill-vscode.md`:
- Keep strict separation: Extension Host owns VS Code APIs + filesystem writes
- Webview UI owns rendering only
- All host/webview communication uses typed envelopes; no ad-hoc payloads
- Core layout must be class-based CSS (no inline layout sprawl)

From `skill-frontend-design.md`:
- No specific skill guidance needed beyond general conventions.

### Code Excerpts

**messaging.ts:76-82** - SaveTaskMessage type (already exists)
```typescript
export interface SaveTaskMessage {
  type: 'SaveTask';
  payload: {
    taskId?: string;
    task: TaskCreateInput;
  };
}
```

**conflict-detector.ts:27-31** - ConflictCheckResult interface
```typescript
export interface ConflictCheckResult {
  hasConflict: boolean;
  diskVersion?: string;
  localVersion?: string;
}
```

**conflict-detector.ts:42-104** - ConflictDetector class methods
- `openFile(filePath, content)` - store fingerprint on task open
- `checkConflict(filePath, currentContent)` - compare before save
- `createRecoverySnapshot(filePath, content)` - backup before overwrite

**task-service.ts:116-143** - TaskService.updateTask method
```typescript
async updateTask(filePath: string, changes: TaskUpdateInput): Promise<Task> {
  const existing = await this.readTask(filePath);
  // merges changes into existing task
  await this.writeTask(filePath, updated, deps);
  return updated;
}
```

**taskeditor-codex.html:344-401** - Tab structure and editor styling reference
```css
.editor-tabs {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  background: rgba(7,9,14,0.86);
}
.tab-btn { border: 1px solid var(--border-md); border-radius: 6px; ... }
.tab-btn.active { background: var(--accent-soft); border-color: var(--accent-border); color: #8fb6ff; }
.editor-box {
  width: 100%; min-height: 420px; border-radius: 8px;
  border: 1px solid var(--border); background: #0c1221;
  padding: 12px;
  font: 500 12px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
```

### Dependency Graph
Files importing from modified files:
- `src/extension.ts` - creates TaskEditorPanel instance
- `src/webview/KanbanPanel.ts` - opens task editor (currently opens text doc, will change to TaskEditorPanel)

Files modified by sibling tasks (4.1, 4.2, 4.4):
- `src/webview/ui/taskeditor.tsx` - shared, center panel is this task's scope
- `src/webview/ui/taskeditor.css` - shared, center panel styles this task's scope
- `src/webview/TaskEditorPanel.ts` - shared, SaveTask handling this task's scope

### Patterns to Follow
- CSS class naming: kebab-case, semantic (`.editor-tabs`, `.tab-btn`, `.editor-box`)
- Message passing: typed envelopes via `vscode.postMessage()`, validate with `isWebviewToHostMessage`
- State management: local component state, no external stores
- Color tokens: use CSS variables from design reference (`--accent-soft`, `--border`, etc.)
- Dirty state: track boolean per content area, propagate to parent for top-bar indicator

### Test Patterns
- Test location: `src/webview/__tests__/messaging.test.ts` for message validation
- Test pattern: validate message type guards (`isWebviewToHostMessage`)
- UI tests: not yet established, manual verification in Extension Development Host required

### Gotchas
- Task file path resolution: TaskEditorPanel receives taskId, must resolve to absolute path via workspaceRoot
- ConflictDetector requires `openFile()` call when task loads to establish baseline fingerprint
- SaveTask message payload uses TaskCreateInput but includes taskId for updates
- Tab content preservation: React state will reset on unmount; use parent state or keep all tab contents in parent
- Frontmatter tab shows raw YAML including `---` delimiters - must parse/serialize correctly

### Scope Boundaries
This task 4.3 focuses ONLY on the center panel tabbed editor:
- ✅ Tab navigation (Task Body, Frontmatter, Run Notes)
- ✅ Textarea editors with monospace font
- ✅ Tab content preservation
- ✅ Bottom action bar (Discard/Save)
- ✅ Save message handling with conflict detection

Out of scope (handled by sibling tasks):
- ❌ Left panel metadata form (task 4.2)
- ❌ Right panel execution rail (task 4.4)  
- ❌ Top bar with breadcrumb and chips (task 4.1 shell)
- ❌ Exit behavior / dirty modal on close (task 4.1 shell)
- ❌ Panel creation and HTML shell (task 4.1)
- ❌ Monaco editor (deferred to post-v1 per spec)
