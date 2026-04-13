# WorkforceMaster Orchestrator

This is the workspace-level orchestration entrypoint for Kody.

## What this does

- runs Kanban2Code task queues through `plan -> code -> audit`
- uses the workspace agents in `.kanban2code/_agents/`
- uses the workspace providers in `.kanban2code/_providers/`
- persists run state, summaries, and logs under `.kanban2code/orchestrator/`

## Why this exists

The imported orchestrator implementation lives in [`agent/orchestrator`](C:\code\workforcemaster\agent\orchestrator), but the active queue runner for this repo should execute against the workspace-owned `.kanban2code/` tree.

## Commands

```powershell
py .kanban2code/orchestrator/runner.py run --request-file .kanban2code/orchestrator/run-request.json
py .kanban2code/orchestrator/runner.py status --latest
py .kanban2code/orchestrator/runner.py continue --latest
```

## Current routing

- planner: `gpt-5.4-mini`
- coder: `gpt-5.4`
- auditor: `gpt-5.4`
- escalated auditor: `gpt-5.4`

## Runtime model

This runner already gives Kody the core event-driven handoff behavior we want for staged execution:

- Kody starts a planner/coder/auditor child process
- Kody waits for the child process to finish
- Kody parses the task result
- Kody advances the task and immediately triggers the next stage

That means the parent orchestrator keeps context while the stage agent does focused work.
