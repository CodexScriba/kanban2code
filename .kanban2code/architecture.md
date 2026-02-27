# Architecture

## Product Goal

Build a lightweight **Kanban2Code** VS Code extension that combines a kanban workflow with chat-driven orchestration.

- **Sidebar:** chat interface for planning, guidance, and task actions
- **Kanban view:** clear stage-based task board (`inbox -> plan -> code -> audit -> completed`)
- **Intent:** keep execution visible, simple, and reliable while wiring deeper automation incrementally

VS Code extension with sidebar webview support. Extension host registers a WebviewViewProvider that serves a bundled React-ready webview with CSP and theme integration.

## File Tree

```
kanban2code/
├── package.json                          # VS Code extension manifest (engines, activationEvents, contributes, build scripts)
├── tsconfig.json                         # TypeScript config — ES2020, NodeNext, JSX support
├── esbuild.mjs                           # Dual-entry bundler — extension host (CJS/node) + webview (IIFE/browser), watch mode
├── .vscodeignore                         # Excludes source/config/dev files from packaged extension
├── media/
│   └── kanban2code.svg                   # Activity bar icon (kanban column graphic)
├── src/
│   ├── extension.ts                      # Activation entry — registers SidebarProvider, thin orchestration
│   └── webview/
│       ├── SidebarProvider.ts            # WebviewViewProvider — CSP with nonce, asWebviewUri asset loading, HTML generation
│       └── ui/
│           ├── index.tsx                 # Webview entry point — stub, imports styles
│           └── styles.css                # Base styles using VS Code theme variables (--vscode-*)
├── docs/
│   └── design/                           # Design mockups directory (empty, future use)
├── kanbanboard-codex.html                # Design reference — kanban board mockup
├── kanbanboard-codex.png                 # Design reference — kanban board screenshot
├── sidebar-codex-blue.html               # Design reference — sidebar mockup
├── sidebar-codex-blue.png                # Design reference — sidebar screenshot
├── taskeditor-codex.html                 # Design reference — task editor mockup
└── taskeditor-codex.png                  # Design reference — task editor screenshot
```
