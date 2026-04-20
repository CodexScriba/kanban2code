# Design Memory

## Purpose

Design memory keeps webview UI implementation consistent across Kanban2Code surfaces.

## Canonical Design Docs

- `docs/design/ui-implementation-system.md` explains the design workflow.
- `docs/design/ui-components-index.json` is the machine-readable component inventory.
- `docs/design/design-system.md` documents tokens, spacing, typography, interaction states, and component rules.

## Source Files

- `src/styles/tokens.css` defines VS Code-aware and brand design tokens.
- `src/styles/webview-base.css` defines base webview layout.
- `src/styles/components.css` defines reusable component styling.
- `src/webviews/components/ui/` contains shared React primitives such as `ActionCard`, `ActionIcon`, `BrandLogo`, `StatusCard`, and `Divider`.

## Rule

For UI/component work, open `docs/design/ui-components-index.json` before creating or renaming components.
