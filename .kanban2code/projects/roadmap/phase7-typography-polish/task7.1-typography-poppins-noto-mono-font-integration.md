---
stage: completed
agent: coder
tags: [feature, p1]
contexts: [skill-frontend-design]
---

# Typography — Poppins + Noto Mono font integration

## Goal

Integrate Poppins font for UI text and Noto Mono for code surfaces across all webview hosts with proper CSP configuration.

## Definition of Done

- [ ] Poppins loaded for all UI text (board, sidebar, task editor, settings)
- [ ] Noto Mono for code surfaces (editor, run metadata, badges)
- [ ] Font tokens defined: `--font-ui`, `--font-mono`
- [ ] CSP updated to allow font loading (Google Fonts or local bundled)
- [ ] Consistent across all three webview hosts

## Implementation Plan

### 1. Update CSP and Font Loading in Webview Hosts

**SidebarProvider.ts** (missing Google Fonts links):
```typescript
// Add to the HTML template:
// - font-src CSP directive
// - Google Fonts preconnect links
// - Poppins and Noto Sans Mono CSS links
```

**KanbanPanel.ts**:
```typescript
// Update existing Google Fonts link from:
//   Inter:wght@400;500;600;700
// To:
//   Poppins:wght@400;500;600;700&family=Noto+Sans+Mono:wght@400;500
```

**TaskEditorPanel.ts**:
```typescript
// Same update as KanbanPanel.ts
```

### 2. Define Font Tokens in CSS Files

Add CSS custom properties at the top of each file:

**styles.css (sidebar)**:
```css
:root {
  --font-ui: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Noto Sans Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  /* existing variables... */
}
```

**board.css**:
```css
:root {
  --font-ui: 'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: 'Noto Sans Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  /* existing variables... */
}
```

**taskeditor.css**:
```css
:root {
  --font-ui: 'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: 'Noto Sans Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  /* existing variables... */
}
```

**settings.css**:
```css
:root {
  --font-ui: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Noto Sans Mono', Consolas, 'Courier New', monospace;
  /* existing variables... */
}
```

### 3. Apply Font Tokens

**UI Text (Poppins / --font-ui)**:
Update `font-family` in:
- `body` styles
- Button styles (`.btn-*`, `.action-btn`, `.capture-btn`, etc.)
- Input/textarea styles (except code editors)
- Card and panel headers
- Navigation items
- Badge/chip text

**Code Surfaces (Noto Mono / --font-mono)**:
Update `font-family` in:
- Code editor textareas (`.editor-textarea`)
- JSON/config editors (`.settings-json`)
- Run metadata display
- Code badges/inline code
- Technical value displays

### 4. CSP Requirements

All three webview hosts need:
```
font-src https://fonts.gstatic.com;
style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com;
```

## Files

- `src/webview/ui/board.css` - modify - apply font tokens
- `src/webview/ui/styles.css` - modify - apply font tokens
- `src/webview/ui/taskeditor.css` - modify - apply font tokens
- `src/webview/ui/settings.css` - modify - apply font tokens
- `src/webview/KanbanPanel.ts` - modify - update CSP and font links
- `src/webview/SidebarProvider.ts` - modify - add font links and CSP
- `src/webview/TaskEditorPanel.ts` - modify - update CSP and font links

## Tests

- [ ] Fonts load without CSP errors
- [ ] UI text renders in Poppins
- [ ] Code surfaces render in Noto Mono

## Context

Typography should be consistent across all webview hosts (sidebar, board, task editor, settings).

Font sources:
- Google Fonts (CDN) - chosen for ease of integration
- Load both Poppins (400, 500, 600, 700) and Noto Sans Mono (400, 500)

Font tokens (CSS custom properties):
- `--font-ui`: Poppins (for all UI text)
- `--font-mono`: Noto Sans Mono (for code surfaces)

Application:
- UI text: headings, labels, buttons, cards, badges → Poppins
- Code surfaces: editor textareas, run metadata, code badges → Noto Sans Mono

Font loading:
- Load fonts in HTML head before any content
- Use Google Fonts `<link>` with preconnect for performance
- Ensure fonts are loaded before rendering to avoid FOUT

Consistency check:
- All UI text uses `--font-ui` token
- All code surfaces use `--font-mono` token
- No hardcoded font-family values outside token definitions

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary targets for this task: `docs/design/settings-gemini.html`, `docs/design/kanbanboard-codex.html`, `docs/design/taskeditor-codex.html`
