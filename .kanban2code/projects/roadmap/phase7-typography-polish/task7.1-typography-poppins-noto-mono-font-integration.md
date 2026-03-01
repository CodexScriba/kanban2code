---
stage: plan
tags: [feature, p1]
agent: planner
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

## Files

- `src/webview/ui/board.css` - modify - apply font tokens
- `src/webview/ui/styles.css` - modify - apply font tokens
- `src/webview/ui/taskeditor.css` - modify - apply font tokens
- `src/webview/ui/settings.css` - modify - apply font tokens
- `src/webview/KanbanPanel.ts` - modify - update CSP for fonts
- `src/webview/SidebarProvider.ts` - modify - update CSP for fonts
- `src/webview/TaskEditorPanel.ts` - modify - update CSP for fonts

## Tests

- [ ] Fonts load without CSP errors
- [ ] UI text renders in Poppins
- [ ] Code surfaces render in Noto Mono

## Context

Typography should be consistent across all webview hosts (sidebar, board, task editor, settings).

Font sources:
- Option 1: Google Fonts (CDN)
- Option 2: Local bundled fonts
- Choose based on performance and offline requirements

Font tokens (CSS custom properties):
- `--font-ui`: Poppins (for all UI text)
- `--font-mono`: Noto Mono (for code surfaces)

Application:
- UI text: headings, labels, buttons, cards, badges → Poppins
- Code surfaces: editor textareas, run metadata, code badges → Noto Mono

CSP updates:
- Add `font-src` directive to allow font loading
- For Google Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`
- For local fonts: `self:` or specific paths
- Update CSP in all three webview hosts:
  - SidebarProvider
  - KanbanPanel
  - TaskEditorPanel

Font loading:
- Load fonts in HTML head before any content
- Use `@font-face` for local fonts or `<link>` for Google Fonts
- Ensure fonts are loaded before rendering to avoid FOUT (Flash of Unstyled Text)

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
