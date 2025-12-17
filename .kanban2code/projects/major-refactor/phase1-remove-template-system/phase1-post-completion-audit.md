---
stage: completed
tags: []
contexts: []
---
# Phase 1 Post-Completion Audit (Remove Template System)

This audit focuses on (1) code-quality / maintainability concerns and (2) potential breaking changes for existing workspaces/users after Phase 1.

## Status (After Follow-up Fixes)

The major Phase 1 “template remnants” identified in this audit have been removed:

- No `template:` frontmatter support in `kanban2code.newTask` anymore.
- No stage-template layer in prompt generation (`stage_template` removed).
- No task-template plumbing in host/webview init payloads (`templates: []` removed).
- No `TemplateError` class.
- Scaffold seed content moved to `src/assets/seed-content.ts` (no longer “templates.ts”).

## Current Validation Status

- `bun run typecheck`: PASS
- `bun run lint`: PASS
- `bun run test` (vitest): PASS
- `bun run test:e2e`: PASS
- `bun run compile`: PASS

Note: `bun test` runs Bun’s built-in runner (not Vitest) and will fail in this repo because it bypasses Vitest config (e.g., the `vscode` alias and jsdom test setup).

## Breaking / Behavior Changes (User-Facing)

### 1) Legacy `.kanban2code/_templates/` is no longer used

- Existing workspaces that relied on `.kanban2code/_templates/` (task/stage/context templates) will no longer have those templates loaded/used by the extension.
- Migration guidance exists in `docs/user_guide.md` under “Legacy `_templates/` folder (migration)”.

### 2) Stage templates are removed from prompt context

- There is no stage-template loader and no `<section name="stage_template">…</section>` in the XML prompt anymore.

## Code Quality / Maintainability Issues

### 1) Vestigial “template” types, fields, and terminology remain

These do not currently break tests, but create ongoing confusion and “dead surface area”:

- (Resolved) `TemplateError` removed.
- (Resolved) `loadStageTemplate` removed.
- (Resolved) `templates` plumbing removed from webview init state.
- (Resolved) scaffold seed content renamed to `src/assets/seed-content.ts`.

Recommendation:
- Decide whether to keep compatibility shims (names/types) through Phase 3, then remove or rename to reduce confusion.

### 2) Folder-context loading can be expensive / unsafe for large workspaces

- `src/services/context.ts` supports `contexts: ["folder:<path>"]` and will recursively read *all* files under that folder into the prompt.

Risks:
- Performance: large repositories can blow up prompt size and slow file reads.
- Content type: binary files or large generated files may be read and embedded.

Recommendation:
- Add guardrails (file count/size limits, extension allowlist, ignore globs like `node_modules`, `.git`, `dist`, etc.).

## Documentation Drift / Developer-Facing Breaks

### 1) `docs/architecture.md` still documents removed template components

Examples that appear stale relative to Phase 1:

- (Resolved) removed references to `src/services/template.ts`
- (Resolved) removed references to template message types
- (Resolved) removed `TemplateError` documentation

Risk:
- New contributors will implement against non-existent APIs or hunt for removed files.

### 2) `docs/user_guide.md` includes inaccurate frontmatter examples

- The example includes `project:` and `phase:` in YAML, but code infers these from path (`src/services/frontmatter.ts`) and does not read them from frontmatter.

Risk:
- Users may add fields that appear to “do nothing”, leading to confusion.

## Suggested Follow-up Tasks (If You Want to Track)

- Remove `template` option from `kanban2code.newTask` or explicitly label it “legacy/no-op”.
- Remove or rename `TemplateError` / `loadStageTemplate` shims, or consolidate into a neutral “stage guidance” concept.
- Remove `templates` plumbing in webview data model (`useTaskData`) if permanently unsupported.
- Update `docs/architecture.md` message list and file tree to match `src/webview/messaging.ts` and current services.
- Add guardrails to `folder:` context ingestion (limits + ignore patterns).
