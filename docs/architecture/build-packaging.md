# Build And Packaging

## Build Script

`esbuild.mjs` builds:

- extension host bundle: `dist/extension.js`
- home webview bundle: `dist/webviews/home.js`

It also copies CSS into `dist/webviews/styles/`.

## Scaffold Assets

The build copies durable scaffold files into `dist/scaffold/`:

- `.kanban2code/` -> `dist/scaffold/.kanban2code/`
- `docs/architecture/` and `docs/architecture.md` -> `dist/scaffold/docs/architecture/` and `dist/scaffold/docs/architecture.md`
- `docs/design/` -> `dist/scaffold/docs/design/`

This keeps the next packaged extension aligned with the current scaffold and documentation memory.

## Packaging Boundary

`.vscodeignore` excludes source and development-only files. Generated build output under `dist/` remains packageable.
