# Kanban2Code Orchestrator

This folder contains the queue runner that executes Kanban2Code task files through the `planner -> coder -> auditor` pipeline.

## Files
- `runner.py` - CLI entry point for `run`, `status`, and `continue`
- `config.json` - default provider routing, timeouts, retry policy, and CLI detection
- `run-request.json` - request file that the `orchestrator` agent prepares before a run
- `run-orchestrator.sh` - small wrapper so the runner can be launched with a stable repo-local command

## Commands
```bash
python .kanban2code/orchestrator/runner.py run --request-file .kanban2code/orchestrator/run-request.json
python .kanban2code/orchestrator/runner.py status --latest
python .kanban2code/orchestrator/runner.py continue --latest
bash .kanban2code/orchestrator/run-orchestrator.sh run --request-file .kanban2code/orchestrator/run-request.json
bash .kanban2code/orchestrator/run-orchestrator.sh status --latest
bash .kanban2code/orchestrator/run-orchestrator.sh continue --latest
```

## Request file
`run-request.json` can contain explicit task files, folders, or both.

- `ordered_tasks` preserves an exact queue if you already know the order
- `targets` lets the orchestrator expand folders into sorted task lists
- `provider_selection` can only override a stage's provider if it still matches the configured model usage rules
- `timeout_overrides` can override `plan`, `code`, or `audit` timeouts

Model usage is controlled in `config.json` under `providers`. Each stage entry
defines the provider alias, model, and required reasoning effort, and the
runner rejects request-file overrides that would violate those rules.

If `ordered_tasks` is empty, the runner will derive the queue from `targets`.

## Runtime outputs
The runner creates these at execution time:
- `.kanban2code/orchestrator/logs/YYYY-MM-DD/<run-id>.jsonl`
- `.kanban2code/orchestrator/logs/YYYY-MM-DD/<run-id>.md`
- `.kanban2code/orchestrator/logs/YYYY-MM-DD/<run-id>-human-readme.md` when the queue stops for a human
- `.kanban2code/orchestrator/runs/<run-id>.json`
- `.kanban2code/orchestrator/state.json`

## Agent entry
Use `.kanban2code/_agents/10-orchestrator.md` when you want an agent to prepare the queue request and launch the runner.
