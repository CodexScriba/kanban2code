# Kanban2Code Design System

## Purpose

This document is the authoritative design reference for all Kanban2Code UI — webviews, panels, and any future surfaces. Every component must derive from the tokens defined here. Do not hardcode color, spacing, or typography values in component files.

## Visual Reference

The approved visual baseline is `GLM5-sidebar.html` in the repo root. All new components must match its aesthetic: dark-first, compact density, layered surfaces, accent-tinted icons.

## Token Architecture

Tokens are defined in `src/styles/tokens.css` using a three-layer pattern:

### Layer 1 — VS Code ambient
These tokens defer to VS Code's own CSS variables so the extension respects the user's editor theme. Each has a hard-coded fallback that matches the approved dark design.

```css
--k2c-bg-base:        var(--vscode-sideBar-background, #0e1017);
--k2c-bg-surface:     var(--vscode-editor-background, #14161e);
--k2c-text-primary:   var(--vscode-foreground, #e4e7f1);
--k2c-text-secondary: var(--vscode-descriptionForeground, #7a7f96);
--k2c-border:         var(--vscode-sideBar-border, rgba(255,255,255,0.055));
--k2c-focus-ring:     var(--vscode-focusBorder, #6b82f7);
```

### Layer 2 — Brand constants
These are always Kanban2Code's values and are never overridden by VS Code themes.

```css
--k2c-accent-blue:   #6b82f7;
--k2c-accent-cyan:   #5ec4d4;
--k2c-accent-violet: #a78bfa;
--k2c-accent-amber:  #f0a862;
--k2c-accent-green:  #5ad8a0;
--k2c-accent-red:    #f06464;
```

### Layer 3 — Component tokens
Composed from layers 1 and 2. Components consume these, not raw layer 1/2 values directly.

```css
--k2c-card-bg:        var(--vscode-editor-background, #181b24);
--k2c-card-bg-hover:  #1d2030;
--k2c-card-border:    var(--k2c-border);
--k2c-card-shadow:    0 2px 12px rgba(0,0,0,0.35), 0 0.5px 1px rgba(0,0,0,0.25);
```

## Spacing

Not yet tokenized. Current usage pulled from GLM5:

| Role              | Value  |
|-------------------|--------|
| Page padding      | 20px   |
| Section gap       | 28px   |
| Card padding      | 14px 16px |
| Card gap          | 10px   |
| Icon size (card)  | 36px   |
| Icon svg (card)   | 18px   |

Spacing should be tokenized as work progresses. Use these values consistently until then.

## Typography

| Role           | Size    | Weight | Color                  |
|----------------|---------|--------|------------------------|
| Brand title    | 15px    | 600    | `--k2c-text-primary`   |
| Card label     | 13px    | 500    | `--k2c-text-primary`   |
| Card desc      | 11px    | 400    | `--k2c-text-secondary` |
| Status text    | 11.5px  | 400    | `--k2c-text-secondary` |
| Footer         | 10.5px  | 400    | `--k2c-text-tertiary`  |

Font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Helvetica Neue", Arial, sans-serif`

## Border Radius

| Token          | Value |
|----------------|-------|
| `--k2c-radius-lg` | 12px |
| `--k2c-radius-md` | 10px |
| `--k2c-radius-sm` |  8px |

## Accent System

Cards and icons use a `data-accent` prop to apply per-component color tinting. The approved accent values are:

| Accent   | Token                  | Use case           |
|----------|------------------------|--------------------|
| `blue`   | `--k2c-accent-blue`    | Primary actions    |
| `cyan`   | `--k2c-accent-cyan`    | Chat / comms       |
| `violet` | `--k2c-accent-violet`  | Navigation / views |
| `amber`  | `--k2c-accent-amber`   | Create / new       |
| `green`  | `--k2c-accent-green`   | Status / success   |
| `red`    | `--k2c-accent-red`     | Connections / alert|

Icon containers use a 10–12% opacity tint of the accent as background, with a matching 7–8% inset border.

## Interaction States

| State    | Treatment                                      |
|----------|------------------------------------------------|
| Hover    | `--k2c-card-bg-hover` bg, `translateY(-1px)`, elevated shadow, chevron reveal |
| Active   | `translateY(0.5px) scale(0.995)`, reduced shadow |
| Focus    | `outline: 2px solid var(--k2c-focus-ring)` offset 2px — never remove focus styles |
| Disabled | 40% opacity, no pointer events                 |

## Animation

| Role            | Duration | Easing       |
|-----------------|----------|--------------|
| Card hover      | 200ms    | ease         |
| Card shadow     | 250ms    | ease         |
| Card transform  | 180ms    | ease         |
| Active press    | 60ms     | ease         |
| Chevron reveal  | 200ms    | ease         |
| Status pulse    | 2500ms   | ease-in-out infinite |

## Component Inventory

| Component      | Location                                  | Status  |
|----------------|-------------------------------------------|---------|
| ActionCard     | `src/webviews/components/ui/ActionCard`   | active  |
| ActionIcon     | `src/webviews/components/ui/ActionIcon`   | active  |
| BrandLogo      | `src/webviews/components/ui/BrandLogo`    | active  |
| StatusCard     | `src/webviews/components/ui/StatusCard`   | active  |
| Divider        | `src/webviews/components/ui/Divider`      | active  |

## Rules

- Never hardcode a color, shadow, or radius in a component file. Use tokens.
- Never remove `:focus-visible` styles. VS Code is keyboard-navigable.
- Never create a second version of an existing component. Extend via props.
- The `data-accent` pattern is the approved way to vary icon tinting. Do not create per-accent component variants.
- If a VS Code theme variable does not exist for a given surface, use the approved fallback value from GLM5.
