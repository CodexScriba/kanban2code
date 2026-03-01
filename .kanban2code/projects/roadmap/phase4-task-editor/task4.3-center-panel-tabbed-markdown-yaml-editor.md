---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-vscode]
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
