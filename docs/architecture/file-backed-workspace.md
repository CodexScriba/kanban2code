# File-Backed Workspace

## Purpose

The `.kanban2code/` folder is the default scaffold for Kanban2Code-managed workspaces. It keeps task state, agent behavior, provider configuration, context, and orchestration metadata visible in Git.

## Scaffold Contents

- `.kanban2code/_agents/` contains role instructions.
- `.kanban2code/_providers/` contains provider/runtime instructions.
- `.kanban2code/_context/` contains shared AI guidance and skills.
- `.kanban2code/inbox/` contains starter tasks.
- `.kanban2code/project-details.md` stores project-level details.
- `.kanban2code/how-it-works.md` explains the default board workflow.

## Architecture Context Rule

Implementation architecture should live under `docs/architecture/`, not as a copied app-specific architecture file inside `.kanban2code/`. Agent instructions should open `docs/architecture/index.json` first when architecture context is needed.

## Design Context Rule

UI/design memory should live under `docs/design/`. Agent instructions should open `docs/design/ui-components-index.json` first for component or visual-system questions.
