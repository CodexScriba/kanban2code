# Repository Map

## Root

- `src/` contains extension host code, webview React code, shared webview libraries, and CSS tokens.
- `docs/` contains canonical architecture and design memory.
- `.kanban2code/` contains the scaffold workspace data that future projects should receive.
- `media/` contains extension contribution assets such as the activity bar icon.
- `dist/` is generated build output.
- `package.json` defines VS Code extension contribution points and scripts.
- `esbuild.mjs` builds extension/webview bundles and copies static scaffold assets into `dist/`.

## Important Source Areas

- `src/extension.ts` owns extension activation and the current home webview provider.
- `src/webviews/home/` owns the React home view.
- `src/webviews/components/ui/` owns reusable webview UI primitives.
- `src/styles/` owns token, base, and component CSS.

## Documentation Entry Points

- `docs/architecture/index.json` is the first hop for architecture questions.
- `docs/design/ui-components-index.json` is the first hop for UI/component questions.
