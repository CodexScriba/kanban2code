---
stage: code
tags: [feature, p1]
agent: coder
contexts: [skill-frontend-design]
---

# Full-viewport layout fix

## Goal

Fix the board layout to fill the entire available viewport width and height, working correctly on large monitors with proper column flex and per-column scrolling.

## Definition of Done

- [ ] Board fills entire available viewport width and height
- [ ] Works on large monitors (>2560px wide)
- [ ] Columns flex to fill horizontal space evenly
- [ ] Vertical scrolling per-column when cards overflow

## Files

- `src/webview/ui/board.css` - modify - fix viewport layout
- `src/webview/KanbanPanel.ts` - modify - ensure no size constraints on panel

## Tests

- [ ] Visual verification at various viewport sizes
- [ ] No horizontal scrollbar on wide monitors

## Context

The board should use a full-viewport layout that:
- Fills 100% of the available width and height
- Has no horizontal scrollbar on wide monitors
- Columns flex evenly to fill horizontal space
- Each column has independent vertical scrolling when cards overflow

CSS approach:
- Container: `display: flex; flex-direction: column; height: 100vh;`
- Header: fixed height, no overflow
- Columns container: `display: flex; flex: 1; overflow: hidden;`
- Each column: `flex: 1; overflow-y: auto; min-width: 0;`

The `min-width: 0` on columns is critical to prevent flex items from overflowing their containers.

KanbanPanel should ensure no size constraints are applied to the webview panel, allowing it to fill the entire editor area.

The layout should work correctly at various viewport sizes:
- Small laptops (1366x768)
- Standard desktop (1920x1080)
- Large monitors (2560x1440 and wider)

No horizontal scrollbar should appear on wide monitors - the columns should flex to fill the available space evenly.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/kanbanboard-codex.html`

## Refined Prompt

Objective: Fix the kanban board layout to fill the entire viewport width and height with flex-based columns that distribute evenly across large monitors and enable per-column vertical scrolling.

Implementation approach:
1. Update board.css `.board-columns` container
   - Change from `overflow-x: auto` to `overflow-x: hidden`
   - Keep `display: flex; flex: 1; min-height: 0;`
   - Remove gap or reduce it proportionally when columns flex
2. Update board.css `.column` styles
   - Change from fixed `width: 320px; min-width: 320px;` to `flex: 1; min-width: 0;`
   - Keep `max-width` constraint if needed for readability (e.g., `max-width: 480px`)
   - Maintain `display: flex; flex-direction: column; overflow: hidden;`
3. Ensure `.col-cards` scrolls independently
   - Keep `flex: 1; overflow-y: auto;` on `.col-cards`
   - Ensure column header stays fixed via `flex-shrink: 0` on `.col-header`
4. Verify `.board-area` fills viewport
   - Confirm `flex: 1; min-width: 0;` is set on board-area
   - Ensure parent containers use `height: 100vh` or equivalent
5. Check KanbanPanel.ts webview HTML
   - Verify viewport meta tag is present
   - Ensure no explicit width/height constraints on the webview container

Key decisions:
- Flex-based columns: Using `flex: 1` allows columns to distribute available space evenly
- Min-width zero: Critical for flex items to shrink below their content size
- No max-width: Allow columns to stretch fully on ultra-wide monitors, or set generous max-width (480-520px) for readability
- Per-column scroll: Only the `.col-cards` container scrolls, headers remain visible

Edge cases:
- Very narrow viewports: Media queries already handle this (column width reduces to 300px below 1360px)
- Many columns with content: Flex distribution may cause columns to become too narrow - consider `min-width` on flex items
- Column content overflow: `min-width: 0` prevents flex items from expanding beyond container

## Context

### File Tree (scoped)
```
src/
├── webview/
│   ├── KanbanPanel.ts              # <- modify - verify no size constraints
│   └── ui/
│       ├── board.css               # <- modify - flex layout, viewport sizing
│       └── board.tsx               # <- read-only reference - structure reference
```

### Architecture Excerpts
From `.kanban2code/architecture.md`:
- VS Code extension with sidebar webview support
- WebviewViewProvider serves bundled webview with CSP and theme integration
- Extension host registers webview panels that fill available editor area

From `src/webview/KanbanPanel.ts:63-72`:
- WebviewPanel created with `vscode.window.createWebviewPanel`
- No explicit size constraints in panel creation options
- `retainContextWhenHidden: true` for state preservation

### Skill Excerpts
From `.kanban2code/_context/skills/skill-frontend-design.md`:
- Use CSS custom properties for values
- Layout: Keep presentational logic in UI, maintain visual hierarchy
- Motion: CSS-only first with @keyframes and transitions

### Code Excerpts

`src/webview/ui/board.css:548-571` (current board-columns and column - NEEDS CHANGE):
```css
.board-columns {
  display: flex;
  gap: 16px;
  overflow-x: auto;          /* <- CHANGE TO: overflow-x: hidden */
  flex: 1;
  min-height: 0;
  padding: 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(59,130,246,0.16) transparent;
}

.column {
  width: 320px;              /* <- CHANGE TO: flex: 1 */
  min-width: 320px;          /* <- CHANGE TO: min-width: 0 */
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: rgba(10, 14, 24, 0.88);
  overflow: hidden;
  flex-shrink: 0;            /* <- REMOVE or keep with flex:1 */
}
```

`src/webview/ui/board.css:284-295` (board-area - current state):
```css
.board-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:
    radial-gradient(circle at 96% -8%, rgba(59,130,246,0.14), transparent 36%),
    radial-gradient(circle at 4% -10%, rgba(148,104,240,0.06), transparent 30%),
    var(--bg);
}
```

`src/webview/ui/board.css:634-644` (col-cards - keep as-is):
```css
.col-cards {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scrollbar-width: thin;
  scrollbar-color: rgba(59,130,246,0.14) transparent;
  transition: background 0.12s ease, box-shadow 0.12s ease;
}
```

`src/webview/KanbanPanel.ts:142-158` (HTML template - verify viewport):
```typescript
return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="..." />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />  <!-- <- OK -->
    ...
  </head>
  <body>
    <div id="app"></div>
    ...
  </body>
</html>`;
```

### Dependency Graph

Files importing from modified files:
- `src/webview/KanbanPanel.ts` -> no imports of board.css (injected via webview)
- `src/webview/ui/board.tsx` -> imports board.css (bundled at build time)

Consumers not in task scope:
- SidebarProvider.ts (separate webview, separate CSS)
- extension.ts (creates panel but doesn't affect layout)

### Patterns to Follow

1. Flex Layout Pattern for Full Viewport:
   ```css
   .container {
     display: flex;
     flex-direction: column;
     height: 100vh;
   }
   .content {
     flex: 1;
     min-height: 0;
     overflow: hidden;
   }
   ```

2. Flex Column Distribution:
   ```css
   .columns {
     display: flex;
     flex: 1;
     overflow-x: hidden;
   }
   .column {
     flex: 1;
     min-width: 0;
     overflow: hidden;
   }
   ```

3. Independent Scroll Containers:
   ```css
   .scrollable-content {
     flex: 1;
     overflow-y: auto;
     min-height: 0;
   }
   ```

### Test Patterns

Visual verification checklist:
- [ ] Board fills entire VS Code editor panel (no unused space)
- [ ] Columns distribute evenly across full width
- [ ] No horizontal scrollbar appears on wide monitors
- [ ] Column headers remain fixed when scrolling cards
- [ ] Each column scrolls independently
- [ ] Layout works at: 1366px, 1920px, 2560px+ widths

### Gotchas

- `min-width: 0` is essential: Without it, flex items won't shrink below their intrinsic content size
- `flex-shrink: 0` on columns prevents shrinking: Must remove or combine with `flex: 1`
- `overflow-x: auto` causes horizontal scroll: Must change to `hidden` for flex distribution
- Column readability: On ultra-wide monitors, columns may become too wide - consider `max-width: 480px` or similar
- VS Code panel sizing: Webview fills available space by default, but verify no parent constraints
- Media queries: Existing `@media (max-width: 1360px)` rules may need adjustment for flex columns

### Scope Boundaries

This task (3.6) is about VIEWPORT LAYOUT FIXES only.
Do NOT implement:
- Card rendering/data binding (Task 3.1 completed this)
- Search/filter/sort logic (Task 3.2 handles this)
- Drag and drop functionality (Task 3.3 completed this)
- Modal/creation flow (Task 3.4 handles this)
- Card actions/edit/delete (Task 3.5 handles this)

Focus only on:
1. CSS layout for full viewport fill
2. Flex-based column distribution
3. Per-column vertical scrolling
4. No horizontal scrollbar on wide monitors
5. KanbanPanel webview size verification
