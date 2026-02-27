# vscode-skill.md (Kanban2Code-aligned draft)

## Purpose
Define enforceable engineering rules for Kanban2Code VS Code extension work so planner/coder/auditor produce reliable, testable, and architecture-safe changes.

## Architecture Principles
- Keep strict separation:
  - Extension Host (`src/**` host modules) owns VS Code APIs + filesystem writes.
  - Webview Host (`SidebarProvider` + message bridge) owns serialization/broadcast.
  - Webview UI (`src/webview/ui/**`) owns rendering only.
- `.kanban2code/` markdown task files are workflow truth; avoid volatile-only UI truth.
- All host/webview communication uses typed envelopes; no ad-hoc payloads.

## Mandatory Project Structure (current repo)
- `src/extension.ts` keeps activation thin.
- `src/webview/SidebarProvider.ts` owns webview lifecycle + message handling.
- `src/webview/messaging.ts` is message contract source.
- `src/webview/ui/*` is React UI + `styles.css`.
- `.kanban2code/projects/roadmap/task*.md` is task pipeline contract.

## Extension Host Rules
- Register commands explicitly in one module (`src/commands/index.ts`).
- `extension.ts` must orchestrate dependencies, not business logic.
- Any state-changing action must flow through host logic and persist to filesystem.

## Webview Host Rules
- Webview HTML must load bundled script + stylesheet deterministically.
- Use `webview.asWebviewUri(...)` for local assets when host-generated HTML references assets.
- Message handlers must validate envelope/type before acting.
- On state changes, broadcast refresh/update events to UI.

## Webview UI Rules
- Core layout must be class-based CSS (no inline layout sprawl).
- Maintain explicit split layout: chat/sidebar behavior + kanban board behavior.
- Keep presentational logic in UI; never import VS Code API into React components.

## Build & Bundling Rules
- Build output must include webview JS and CSS consumed by the webview host.
- No task is complete if style assets fail to load in Extension Host runtime.
- Keep filenames/path contracts stable between build and host loader.

## Testing Standards
- Unit tests for message protocol and service logic.
- Integration tests for command wiring and task transitions.
- UI/webview tests for split layout and key interactions.
- For UI tasks: runtime smoke in Extension Development Host is required.

## Runtime Validation Checklist (must-pass before audit)
- [ ] `bun run build` passes.
- [ ] `bun run test` passes (or scoped tests + rationale).
- [ ] Extension activates and commands appear in Command Palette.
- [ ] Webview renders expected split layout (chat/sidebar + board) with styles applied.
- [ ] Message round-trip works (UI action -> host -> UI state update).
- [ ] No console/runtime errors blocking basic flow.

## Definition of Done Requirements
- Task frontmatter moved correctly (`plan -> code -> audit -> completed`).
- DoD boxes checked truthfully.
- `## Audit` file list included.
- Auditor review appended with explicit rating/verdict.
- For accepted tasks (>=8), architecture context update included.

## Planner Context Contract
Planner must output:
- Scope boundaries (what NOT to touch).
- Required files + dependencies.
- Validation steps tied to runtime checklist.
- Stage transition to `code` + `agent: coder`.

## Coder Execution Contract
Coder must:
- Implement only scoped files.
- Run required validation commands.
- Update task frontmatter to `audit` + `agent: auditor`.
- Append `## Audit` with touched files.

## Auditor Review Contract
Auditor must:
- Verify DoD + tests + runtime evidence.
- Append full `## Review` with findings and rating.
- Set `completed` only when quality threshold met.
- Update architecture context on acceptance.

## Anti-Patterns (forbidden)
- Inline styles for core layout structure.
- Untyped/unvalidated message payloads.
- Host/business logic leaking into React UI.
- Marking tasks complete without runtime proof.
- “Patch drift” that bypasses architecture contracts.

## Task Template Snippet (minimum)
- Goal
- Definition of Done
- Files
- Tests
- Refined Prompt
- Context
- Audit
- Review

## PR/Audit Evidence Template
- Commands run + outcome
- Runtime checks passed/failed
- Key screenshots/logs for UI tasks
- Risk notes + follow-ups
