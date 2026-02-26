# Kanban2Code Architecture

## Overview
Kanban2Code is a VS Code extension with a minimal bootstrap baseline. The extension entrypoint activates from workspace/view events, and a lightweight React webview bundle is built alongside the extension bundle.

## Directory Structure
```text
.
|-- build.ts
|-- package.json
|-- tsconfig.json
|-- vitest.config.ts
|-- vitest.e2e.config.ts
|-- eslint.config.mjs
|-- .prettierrc
|-- .vscodeignore
`-- src
    |-- extension.ts
    `-- webview
        `-- ui
            |-- main.tsx
            `-- vscodeApi.ts
```

## Core Components
- `src/extension.ts`: VS Code extension entrypoint with `activate()` and `deactivate()` lifecycle functions.
- `src/webview/ui/main.tsx`: Minimal React mount file that renders bootstrap UI content.
- `src/webview/ui/vscodeApi.ts`: Shared singleton acquisition of `acquireVsCodeApi()` for webview messaging.
- `build.ts`: Esbuild-based bundling pipeline for both extension and webview targets.

## Build and Runtime Flow
1. `bun run build` executes `build.ts`.
2. Esbuild emits `dist/extension.js` for VS Code host runtime.
3. Esbuild emits `dist/webview.js` for browser/webview runtime.
4. On activation, the extension logs to the Kanban2Code Output Channel.
