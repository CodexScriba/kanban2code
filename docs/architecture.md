# Kanban2Code Architecture

## Project Scope

Kanban2Code is a VS Code extension for running AI-assisted software delivery workflows from inside the editor.

The v2 direction combines three layers:

1. **Manual orchestration** via a Kanban/sidebar workflow inside VS Code
2. **Conversational workflow** via a chat interface
3. **Connected orchestration** through an optional OpenClaw integration layer

The product is being redesigned so files remain the durable source of truth while AI agents operate as focused workers on top of that file-backed system.

### Current product direction

- VS Code sidebar home with primary entry points:
  - Connect OpenClaw
  - Open Chat
  - Open Sidebar
  - Create Kanban
- Keep file-backed task/project management inside `.kanban2code/`
- Add an orchestrator layer that owns run state, context, and memory
- Preserve a UI-shell-first workflow for new features
- Preserve planner-readable design memory and architecture memory
- Support plan -> code -> audit orchestration with specialized agents
- Allow future execution choices such as Run in Terminal vs Run in OpenClaw

### Durable project truth

The long-term design direction is:

- **Chat is the interface**
- **Files are the heart**

That means Kanban2Code should store durable workflow state, orchestration state, design memory, architecture references, and task state in the repo so Git remains the backbone.

## Tech Stack

### Current confirmed stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Editor platform:** VS Code Extension API
- **Bundler:** esbuild
- **Package manager/runtime tooling:** Bun is present in the repo (`bun.lock`), though current scripts are standard Node-based build scripts
- **Type checking:** TypeScript compiler (`tsc`)

### Current package setup

- `vscode` engine: `^1.90.0`
- Main extension entry: `dist/extension.js`
- Source entry: `src/extension.ts`

### Current extension focus

The repo is currently at an early bootstrap stage as a VS Code extension:

- minimal extension activation exists in `src/extension.ts`
- built assets exist in `dist/`
- Kanban2Code workspace data lives under `.kanban2code/`
- architecture and design memory docs now live under `docs/architecture/` and `docs/design/`

## System Areas

### 1. VS Code Extension Shell
Responsible for activation, commands, webviews, sidebar surfaces, and future chat/OpenClaw entry points.

### 2. File-backed Workspace System
The `.kanban2code/` folder stores agents, providers, inbox/project data, context, and orchestrator state.

### 3. Orchestrator Layer
The orchestrator is expected to coordinate staged execution such as planner -> coder -> auditor while keeping parent run context.

### 4. Design Memory System
`docs/design/` stores durable UI-system memory, reusable component mappings, and planner-readable primitive references.

### 5. Architecture Memory System
`docs/architecture/` stores focused architecture docs, with `architecture-index.json` as the scannable entry point for future architecture-aware agents.

## Near-Term Architectural Goals

- Turn the frontend into a clean UI shell before wiring full behavior
- Derive implementation specs from the approved UI shell
- Keep reusable primitives searchable so planners do not reinvent components
- Keep architecture docs scannable so agents read only relevant domains
- Evolve OpenClaw into a connected orchestration/remote-control layer, not the only source of project truth

## Notes

This document is the high-level architecture overview. Over time, detailed architecture domains should move into `docs/architecture/` and be indexed through `docs/architecture/architecture-index.json`.
