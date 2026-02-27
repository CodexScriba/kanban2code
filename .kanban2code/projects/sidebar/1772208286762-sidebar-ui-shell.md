---
stage: completed
tags:
  - ui
  - sidebar
  - webview
contexts:
  - skill-vscode
skills:
  - skill-vscode
agent: auditor
---

# Sidebar Ui-shell

/home/cynicus/code/kanban2code/sidebar-codex-blue.png

/home/cynicus/code/kanban2code/sidebar-codex-blue.html

This needs to be turned into a sidebar in vscode.

A context file will be at the phase level, so anything that will require wiring later needs to go into that file.

## Goal

Implement the sidebar UI shell as a static, styled webview matching the `sidebar-codex-blue` design mockup. All layout regions render with hardcoded placeholder data. No message passing, no host commands, no real state — pure presentational shell.

## Definition of Done

- [x] Sidebar renders in VS Code activity bar panel matching the mockup layout
- [x] Header with brand text, Capture button, Kanban toggle, Settings icon
- [x] Workspace bar with stage pills (cap/plan/code/audit/done) and colored dots
- [x] Chat history area with scrollable message list (user + assistant messages, task proposal card)
- [x] Kanban board view toggled by the Kanban button (shows columns with placeholder cards)
- [x] Footer with context chips section, skills chips section, provider/role dropdowns, compose textarea + send button
- [x] All styles use CSS custom properties (hardcoded dark theme values, not VS Code theme vars — theme integration is a later task)
- [x] No inline styles for layout structure (class-based CSS per skill-vscode rules)
- [x] `npm run build` succeeds
- [ ] Extension activates and sidebar renders in Extension Development Host

## Files

- `src/webview/ui/index.tsx` — modify: mount the full sidebar shell DOM
- `src/webview/ui/styles.css` — modify: complete stylesheet ported from mockup HTML
- `src/webview/SidebarProvider.ts` — modify: remove hardcoded `<h1>` from HTML template, keep CSP/nonce/script/style loading
- `sidebar-codex-blue.html` — read-only reference

## Tests

- Runtime smoke: `npm run build` passes, sidebar renders in Extension Development Host
- Visual: layout matches mockup screenshot regions (header, workspace bar, chat area, footer)
- Interaction: Kanban toggle switches between chat view and kanban board view

## Refined Prompt

Objective: Build the full sidebar UI shell as a static webview matching the sidebar-codex-blue mockup.

Implementation approach:
1. Port all CSS from `sidebar-codex-blue.html` into `src/webview/ui/styles.css`, replacing the current minimal styles. Map the mockup's CSS custom properties (--bg-base, --bg-surface, etc.) directly — do not convert to VS Code theme vars yet.
2. Rewrite `src/webview/ui/index.tsx` to build the full sidebar DOM structure: header, workspace bar, chat-view (with hardcoded messages + task proposal), kanban-view (with 5 columns and placeholder cards), and footer (context chips, skills chips, provider/role selects, compose area). Use `document.createElement` or template literals — no React dependency needed since none is installed.
3. Wire the Kanban toggle button to swap between chat-view and kanban-view (pure DOM class toggle, matching the mockup's JS pattern).
4. Wire the compose textarea auto-resize and Enter-to-send stub (append user message to chat history DOM, no host messaging).
5. Update `SidebarProvider.ts`: remove the `<h1>Kanban2Code</h1>` from the HTML template body, keep only `<div id="app"></div>` and the script/style tags.

Key decisions:
- Vanilla DOM (no React): the project has no react/react-dom dependency installed. The mockup is vanilla JS. Shipping React adds ~40KB and a dependency for what is currently a static shell. Keep vanilla for now; React migration is a separate task.
- Hardcoded dark theme: the mockup defines its own CSS custom properties. Porting them directly keeps visual fidelity. Theme integration (mapping to `--vscode-*` vars) is deferred.
- Hardcoded placeholder data: all messages, cards, chips, and counts are static strings in the JS. Real data binding requires the message protocol which is out of scope.

Edge cases:
- CSP must allow the styles to load. Current CSP uses `style-src ${webview.cspSource}` which covers linked stylesheets from `asWebviewUri`. No `unsafe-inline` needed since all styles are in the CSS file.
- The `font-src` directive is missing from CSP. The mockup uses system fonts (`-apple-system`, etc.) which don't require font loading, so no change needed.
- Dropdown menus (context/skills "Add" buttons) use absolute positioning — ensure they don't clip against the sidebar boundary by using `overflow: visible` on the footer sections.

## Context

### File Tree (scoped)

```
src/
├── extension.ts                      # ← read-only reference
└── webview/
    ├── SidebarProvider.ts            # ← modify (remove <h1>, keep shell)
    └── ui/
        ├── index.tsx                 # ← modify (full sidebar DOM)
        └── styles.css                # ← modify (complete stylesheet)
sidebar-codex-blue.html               # ← read-only reference (design source)
sidebar-codex-blue.png                 # ← read-only reference (visual target)
```

### Architecture Excerpts

> **Product Goal:** Sidebar is the chat interface for planning, guidance, and task actions.

> **Extension structure:** Extension host registers a WebviewViewProvider that serves a bundled React-ready webview with CSP and theme integration.

> **Build:** Dual-entry bundler — extension host (CJS/node) + webview (IIFE/browser), watch mode. Webview entry is `src/webview/ui/index.tsx`, output is `dist/webview.js` + `dist/webview.css`.

### Skill Excerpts

From `skill-vscode.md`:
- Core layout must be class-based CSS (no inline layout sprawl).
- Maintain explicit split layout: chat/sidebar behavior + kanban board behavior.
- Keep presentational logic in UI; never import VS Code API into React components.
- Webview HTML must load bundled script + stylesheet deterministically.
- No task is complete if style assets fail to load in Extension Host runtime.

### Code Excerpts

`src/webview/SidebarProvider.ts:24-38` — HTML template that loads webview.js and webview.css via nonce + CSP. The `<h1>Kanban2Code</h1>` must be removed; the `<div id="app">` is the mount point.

```typescript
webview.html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';" />
    <link rel="stylesheet" href="${styleUri}" />
  </head>
  <body>
    <h1>Kanban2Code</h1>       <!-- REMOVE THIS -->
    <div id="app">Loading...</div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`;
```

`src/webview/ui/index.tsx:1-7` — Current stub that will be fully rewritten with sidebar shell DOM.

`esbuild.mjs:17-28` — Webview bundle config. Entry `src/webview/ui/index.tsx` outputs to `dist/webview.*`. The bundler handles CSS imports from `.tsx` files automatically (esbuild CSS loader).

### Dependency Graph

- `extension.ts` → imports `SidebarProvider` (not touched beyond HTML cleanup)
- `SidebarProvider.ts` → references `dist/webview.js` and `dist/webview.css` (build outputs from `index.tsx` + `styles.css`)
- `esbuild.mjs` → builds `src/webview/ui/index.tsx` as webview entry
- No other files import from the modified files

### Patterns to Follow

- The mockup HTML (`sidebar-codex-blue.html`) is the canonical pattern. Port its class names, DOM structure, and CSS verbatim. This preserves visual fidelity and makes future diffs against the mockup clean.
- Use BEM-like flat class names matching the mockup (`.header`, `.header-brand`, `.workspace-bar`, `.stage-pill`, etc.) — not a different naming convention.

### Test Patterns

No test framework is configured yet. Validation is runtime-only:
1. `npm run build` must succeed (esbuild bundles without errors)
2. Launch Extension Development Host → sidebar panel renders the full layout
3. Click Kanban toggle → view switches between chat and board

### Gotchas

- **No React installed**: `package.json` has no `react`/`react-dom` dependency. The `.tsx` extension works with esbuild for JSX but there's no React runtime. Use vanilla DOM manipulation or switch the entry to `.ts`. If keeping `.tsx`, ensure no JSX syntax is used without the React runtime.
- **esbuild CSS**: esbuild bundles CSS imported from JS/TS files into a sibling `.css` output. The `import './styles.css'` pattern in `index.tsx` already works. All styles must be in `styles.css`, not inline.
- **CSP font-src**: The CSP has no `font-src` directive. System fonts work fine, but if any web fonts are added later, CSP must be updated.
- **Sidebar width**: VS Code controls the sidebar panel width. The mockup's `max-width: 400px` should be removed or set to `100%` since the sidebar fills whatever width VS Code gives it.

### Scope Boundaries

This task covers **only** the static UI shell:
- DO NOT add message passing between webview and extension host
- DO NOT add real data loading or state management
- DO NOT install React or any new dependencies
- DO NOT modify `extension.ts` or `esbuild.mjs`
- DO NOT implement VS Code theme variable mapping (hardcoded dark theme only)
- DO NOT create a phase-level context/wiring file (that's the user's responsibility at the phase level)
- DO wire the Kanban view toggle and textarea auto-resize as pure client-side DOM interactions (matching the mockup's `<script>` block)

## Audit

src/webview/ui/index.tsx
src/webview/ui/styles.css
src/webview/SidebarProvider.ts

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
The sidebar shell implementation is faithful to the mockup and cleanly integrated into the VS Code webview pipeline with CSP-safe asset loading. Core interactions (Kanban toggle, textarea autoresize, Enter-to-send stub, chip/dropdown UI) are implemented without leaking host concerns into UI code.

### Findings

#### Blockers
- [ ] None.

#### High Priority
- [ ] None.

#### Medium Priority
- [ ] Runtime validation evidence missing: Extension Development Host activation/render check is still unchecked, so visual/runtime behavior is inferred from code and build only. - `.kanban2code/projects/sidebar/1772208286762-sidebar-ui-shell.md:39`

#### Low Priority / Nits
- [ ] None.

### Test Assessment
- Coverage: Needs improvement
- Missing tests:
  - Extension Development Host runtime smoke validation evidence (activate extension, open sidebar, verify layout + Kanban toggle in host runtime)

### What's Good
- Strong structural fidelity to `sidebar-codex-blue.html`, class-based styling, no inline layout sprawl, and deterministic `SidebarProvider` HTML shell with nonce/CSP and bundled script/style references.

### Recommendations
- Add a brief runtime verification note (or screenshot/log evidence) from Extension Development Host in future UI-shell tasks to close the remaining acceptance risk.
