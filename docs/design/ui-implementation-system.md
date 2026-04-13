# UI Implementation System

## Purpose

This folder is the design-system memory for Kanban2Code. It exists so every webview, panel, and UI surface shares the same visual language and components are never reinvented under different names.

## Source of Truth

- Visual baseline: `GLM5-sidebar.html`
- Design rules: `docs/design/design-system.md`
- Component inventory: `docs/design/ui-components-index.json`
- Token file: `src/styles/tokens.css`
- Component library: `src/webviews/components/ui/`

## Before Building Any UI

Read `docs/design/design-system.md` first. Answer:

1. Does a component already exist in `ui-components-index.json` that covers this visual pattern?
2. Should the task reuse it, extend it via props, or create something genuinely new?
3. Is the new surface using tokens from `tokens.css`, not hardcoded values?

## Reuse Rules

**Reuse** when the approved pattern matches in layout, spacing rhythm, typography hierarchy, and interaction model.

**Extend via props** when the base component fits but needs a variant (different accent, different label, optional slot).

**Create new** when the visual identity or behavior is distinct enough that forcing it into an existing component would require messy conditionals or misrepresent what the component is.

**Never** create `HomeActionCard` and `SidebarActionCard` as two names for the same thing.

## Current Component Set

See `docs/design/ui-components-index.json` for the full inventory.

Primitives currently available: `ActionCard`, `ActionIcon`, `BrandLogo`, `StatusCard`, `Divider`.

## Update Rule

When a new reusable component is built:

1. Confirm it is genuinely shared across more than one surface.
2. Add it to `ui-components-index.json`.
3. Document its props and visual contract in `design-system.md`.
