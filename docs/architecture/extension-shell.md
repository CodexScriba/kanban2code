# Extension Shell

## Activation Surface

- `package.json` contributes the `kanban2code` activity bar container.
- `package.json` contributes `kanban2code.homeView` as the current webview.
- `src/extension.ts` exports `activate` and `deactivate`.

## Home Webview

- `HomeViewProvider` implements `vscode.WebviewViewProvider`.
- The provider enables scripts and restricts local resource roots to `dist`.
- The webview loads:
  - `dist/webviews/home.js`
  - `dist/webviews/styles/tokens.css`
  - `dist/webviews/styles/webview-base.css`
  - `dist/webviews/styles/components.css`

## Security Boundary

The home webview uses a per-render nonce and a restrictive CSP:

- `default-src 'none'`
- style loads from the webview CSP source
- scripts load only with the generated nonce

## Current Entry Points

The current home view exposes placeholder actions for:

- Create Kanban
- Open Sidebar
- Open Chat
- Connect OpenClaw
