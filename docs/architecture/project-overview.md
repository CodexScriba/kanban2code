# Project Overview

Kanban2Code is a VS Code extension for running AI-assisted software delivery workflows from inside the editor.

## Product Direction

The v2 direction combines three layers:

1. Manual orchestration through a Kanban/sidebar workflow inside VS Code.
2. Conversational workflow through a chat interface.
3. Connected orchestration through an optional OpenClaw integration layer.

## Durable Truth

- Chat is the interface.
- Files are the heart.
- Task state, architecture memory, design memory, agent instructions, provider definitions, and orchestrator state should remain file-backed and Git-visible.

## Current Stack

- Runtime: Node.js.
- Language: TypeScript.
- Editor platform: VS Code Extension API.
- Bundler: esbuild.
- Type checking: TypeScript compiler.
- UI runtime: React 19 for webviews.

## Near-Term Goals

- Keep the sidebar home shell clean before wiring deeper behavior.
- Derive implementation specs from approved UI and architecture memory.
- Keep reusable primitives searchable so planners do not reinvent components.
- Keep architecture docs scannable so agents read only relevant topics.
- Evolve OpenClaw as a connected orchestration layer, not the only source of project truth.
