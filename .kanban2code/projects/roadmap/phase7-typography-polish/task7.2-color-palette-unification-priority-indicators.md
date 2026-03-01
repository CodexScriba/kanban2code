---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [skill-frontend-design]
---

# Color palette unification + priority indicators

## Goal

Centralize CSS custom properties for all colors and implement priority color indicators per specification.

## Definition of Done

- [ ] CSS custom properties for all colors centralized in shared variables
- [ ] Priority colors: high=#fb7185 (red), medium=#fbbf24 (amber), low=#34d399 (green)
- [ ] Stage colors consistent across board/sidebar/editor
- [ ] Dark theme variables use consistent naming

## Files

- `src/webview/ui/board.css` - modify - centralize variables
- `src/webview/ui/styles.css` - modify - centralize variables
- `src/webview/ui/taskeditor.css` - modify - use shared variables
- `src/webview/ui/settings.css` - modify - use shared variables

## Tests

- [ ] Priority colors match spec
- [ ] No hardcoded color values outside variable definitions

## Context

Color palette should be centralized using CSS custom properties to ensure consistency across all webview hosts.

Priority colors (per spec):
- High: `#fb7185` (red)
- Medium: `#fbbf24` (amber)
- Low: `#34d399` (green)

CSS custom properties structure:
```css
:root {
  /* Priority colors */
  --color-priority-high: #fb7185;
  --color-priority-medium: #fbbf24;
  --color-priority-low: #34d399;
  
  /* Stage colors */
  --color-stage-inbox: ...;
  --color-stage-plan: ...;
  --color-stage-code: ...;
  --color-stage-audit: ...;
  --color-stage-completed: ...;
  
  /* UI colors */
  --color-background: ...;
  --color-surface: ...;
  --color-border: ...;
  --color-text: ...;
  --color-text-muted: ...;
  
  /* Status colors */
  --color-status-ready: ...;
  --color-status-queued: ...;
  --color-status-running: ...;
  --color-status-success: ...;
  --color-status-failed: ...;
  --color-status-cancelled: ...;
}
```

Centralization approach:
- Define all color variables in one location (e.g., at top of board.css or in a shared variables file)
- Import or reference these variables in all other CSS files
- Replace all hardcoded color values with variable references

Stage colors:
- Ensure stage colors are consistent across board, sidebar, and task editor
- Use same color values for stage badges, column headers, and indicators

Dark theme:
- Use consistent naming for dark theme variables
- Example: `--color-background-dark`, `--color-surface-dark`
- Or use CSS custom properties with media query for dark theme

Verification:
- Search all CSS files for hardcoded hex colors
- Replace with variable references
- Test that colors render correctly in all views

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary targets for this task: `docs/design/kanbanboard-codex.html`, `docs/design/taskeditor-codex.html`, `docs/design/settings-gemini.html`
