# Orchestrator Workflow

## Scaffold

The orchestrator scaffold lives under `.kanban2code/orchestrator/`.

Current files include:

- `README.md`
- `config.json`
- `runner.py`
- `run-orchestrator.sh`

Runtime artifacts such as logs, run folders, and generated state are expected to stay in `.kanban2code/orchestrator/` during local use.

## Workflow Shape

Kanban2Code tasks normally move through:

1. plan
2. code
3. audit
4. completed

Specialized agents own each stage. The orchestrator coordinates stage execution and preserves run context.

## Packaging Rule

The extension build copies `.kanban2code/` into `dist/scaffold/.kanban2code` so the next packaged extension has the current scaffold files available as assets.
