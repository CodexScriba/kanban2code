# Kanban2Code Architecture

This is the landing page for Kanban2Code architecture docs. The extension uses an index-first documentation system so agents and humans can read the smallest relevant topic before widening out.

## Reading Rule

Open [`docs/architecture/index.json`](architecture/index.json) first, then open the smallest matching topic file. Treat this page as navigation only.

## Start Here

- [Project overview](architecture/project-overview.md)
- [Repository map](architecture/repository-map.md)
- [Extension shell](architecture/extension-shell.md)
- [File-backed workspace](architecture/file-backed-workspace.md)
- [Orchestrator workflow](architecture/orchestrator-workflow.md)
- [Design memory](architecture/design-memory.md)
- [Build and packaging](architecture/build-packaging.md)
- [Testing strategy](architecture/testing-strategy.md)

## Durable Product Truth

- Chat is the interface.
- Files are the heart.
- Git-backed docs, task files, agent definitions, provider definitions, and run state are the durable source of truth.
