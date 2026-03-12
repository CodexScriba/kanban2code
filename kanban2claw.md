# Kanban2Claw Orchestration Guide

This guide defines how to run Kanban2Code tasks through OpenClaw while preserving role behavior from `.kanban2code/_agents` and stage rules from `.kanban2code/_context/ai-guide.md`.

## 1) Required Context Load (Every Run)

Before dispatching any task, OpenClaw must load:

1. `.kanban2code/_context/ai-guide.md`
2. `.kanban2code/_agents/01-🗺️roadmapper.md`
3. `.kanban2code/_agents/02-🏛️architect.md`
4. `.kanban2code/_agents/03-✂️splitter.md`
5. `.kanban2code/_agents/04-📋planner.md`
6. `.kanban2code/_agents/05-⚙️coder.md`
7. `.kanban2code/_agents/06-✅auditor.md`
8. `.kanban2code/_agents/07-💬conversational.md`

Reason: the orchestrator must know each role contract and stage transition requirement before selecting a model.

## 2) Copy-XML Limitation (Critical)

OpenClaw agents cannot click "Copy XML" in UI snippets.  
So prompt assembly must be done in the orchestrator itself:

- Read the role file content directly from disk.
- Build a single composite prompt containing:
  - Role preface line
  - Full role instructions (or required excerpt)
  - Task route/path
  - Task markdown body
- Send that composite prompt to the selected model.

Do not rely on any UI-copy action.

## 3) Stage -> Role -> Model Routing

Use the task frontmatter `stage` as source of truth.

| Stage | Role file | Primary models |
|---|---|---|
| `plan` | `04-📋planner.md` | `kimi-2.5`, `google flash 3.1` |
| `code` | `05-⚙️coder.md` | `codex medium`, `sonnet 4.6`, `google 3.1 pro` (frontend/design) |
| `audit` | `06-✅auditor.md` | `codex high`, `codex xhigh`, `opus`, `google 3.1 pro` |

Non-core stages/roles (`roadmapper`, `architect`, `splitter`, `conversational`) are usually human-driven in this workflow. Keep them available for reference, but do not auto-run unless explicitly requested.

## 4) Mandatory Prompt Wrappers

### Planner task wrapper

Use this exact lead-in before task content:

```md
You're a planner you do not code, follow the planner instructions:

[PASTE .kanban2code/_agents/04-📋planner.md]

Task route: <absolute-or-workspace-relative-task-path>

[PASTE TASK CONTENT]
```

Also preserve planner first-contact requirement from role file:
`I'm Planner Agent, I do not code, I only refine the prompt and gather context.`

### Coder task wrapper

```md
You're a coder, follow the coder instructions:

[PASTE .kanban2code/_agents/05-⚙️coder.md]

Task route: <absolute-or-workspace-relative-task-path>

[PASTE TASK CONTENT]
```

### Auditor task wrapper

```md
You're an auditor, follow the auditor instructions:

[PASTE .kanban2code/_agents/06-✅auditor.md]

Task route: <absolute-or-workspace-relative-task-path>

[PASTE TASK CONTENT]
```

## 5) Pre-Run Balance Check (Codex + Claude Code)

Before every run, OpenClaw must verify available balance/credits for both stacks:

1. Codex/OpenAI balance check
2. Claude/Anthropic balance check

If either check fails or is below threshold, block the run and return a clear error.

Recommended implementation:

- Add a preflight hook `check_balances()` in the orchestrator.
- Keep provider-specific check commands in config (so they can be changed without code edits).
- Fail closed: no task dispatch without successful checks.

## 5.1) CLI Dispatch Contract (Critical)

OpenClaw should not execute task logic directly. It must open the target CLI and run an agent with instructions.

- Build the composite prompt.
- Start provider CLI process (Codex/Claude/etc.) with that prompt.
- Capture agent output and apply orchestration policies.
- Never bypass the agent runtime by short-circuiting task decisions in orchestrator code.

## 6) Multi-Account Switching (Codex)

## codex-auth

A command-line tool that lets you manage and switch between multiple Codex accounts instantly, no more constant logins and logouts.

> WARNING: Not affiliated with OpenAI or Codex. Not an official tool.

### How it works

Codex stores authentication in a single `auth.json`. `codex-auth` keeps named snapshots and swaps the active `~/.codex/auth.json` to switch accounts.

### Requirements

- Node.js 18+

### Install

```bash
npm i -g codex-auth
```

### Usage

```bash
# Save current logged-in token as named account
codex-auth save <name>

# Switch active account
codex-auth use <name>

# Or pick interactively
codex-auth use

# List accounts
codex-auth list

# Show current account
codex-auth current
```

### Command reference

- `codex-auth save <name>`: validates name, requires `auth.json`, snapshots to `~/.codex/accounts/<name>.json`
- `codex-auth use [name]`: switches account (symlink on macOS/Linux, copy on Windows), records active name
- `codex-auth list`: lists snapshots alphabetically, active one marked with `*`
- `codex-auth current`: prints active account name

Notes:

- macOS/Linux uses symlink strategy, Windows uses copy strategy
- requires Node 18+

## 7) Multi-Account Switching (Claude Code)

## Multi-Account Switcher for Claude Code

A simple switcher for Claude Code accounts on macOS, Linux, and WSL.

### Features

- Multi-account add/remove/list
- Quick switching
- Cross-platform support
- Secure storage
- Keeps themes/settings/preferences unchanged (auth only)

### Installation

```bash
curl -O https://raw.githubusercontent.com/ming86/cc-account-switcher/main/ccswitch.sh
chmod +x ccswitch.sh
```

### Usage

```bash
# Add current account
./ccswitch.sh --add-account

# List managed accounts
./ccswitch.sh --list

# Switch to next account
./ccswitch.sh --switch

# Switch to specific account
./ccswitch.sh --switch-to 2
./ccswitch.sh --switch-to user2@example.com

# Remove account
./ccswitch.sh --remove-account user2@example.com

# Help
./ccswitch.sh --help
```

### Requirements

- Bash 4.4+
- `jq`

Install `jq`:

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq
```

### Important operational rule

After each Claude account switch, restart Claude Code before running tasks.

## 8) Run Sequence (OpenClaw)

1. Load `ai-guide.md` + all role files.
2. Parse task frontmatter and determine `stage`.
3. Select role file from stage.
4. Select model from routing matrix.
5. Run preflight balance checks (Codex + Claude).
6. Send Telegram notification to human before implementation starts.
7. Assemble composite prompt (role wrapper + route + task body).
8. Open provider CLI and run the selected agent with assembled instructions.
9. Validate output for required stage behavior from role + `ai-guide.md`.

## 9) Validation Rules Before Accepting Output

- Planner output must stay non-coding and hand off to `code`.
- Coder output must include implementation + tests and hand off to `audit`.
- Auditor output must include rating/verdict and stage decision.
- In automated runner mode, enforce structured markers from `ai-guide.md`:
  - `<!-- STAGE_TRANSITION: ... -->`
  - `<!-- FILES_CHANGED: ... -->`
  - `<!-- AUDIT_RATING: ... -->`
  - `<!-- AUDIT_VERDICT: ... -->`

## 10) Commit, Retry, and Stop-Line Policy

- After each successful audit (`rating >= 8` / `ACCEPTED`), orchestrator must commit immediately.
- Commit must happen after auditor updates architecture documentation and stage outcome is applied.
- The agent is responsible for tracking failed-audit count per task.
- If the same task fails audit 2 times, stop the production line and contact a human for intervention.
- No automatic third retry is allowed once two failed audits are reported for that task.

## 11) Task Ordering and Dependency Policy

- Execute tasks in sequence within a phase unless explicitly marked safe for parallel execution.
- Example: `task1.1` must complete audit + architecture update before `task1.2` planning starts if `task1.2` depends on that context.
- Treat architecture updates from accepted audits as new source-of-truth context for subsequent planning.
- Architecture documentation path may vary by project. Agent should resolve it from project context; if ambiguous, ask human before commit.

## 12) Controlled Parallelism Policy

- Orchestrator may run non-blocking tasks in parallel only when dependency analysis confirms no ordering conflict.
- Maximum concurrency is 2 tasks at the same time.
- If uncertainty exists about dependency safety, default to sequential execution.
- Required safety checks before parallel run:
  - No dependency edge between candidate tasks.
  - No overlap in target files (planned or discovered).
  - No shared write to architecture docs in same execution window.
  - No concurrent git commit operations.
- Use a single global commit lock so only one accepted task can finalize and commit at a time.

## 13) Human Notification Policy (Telegram)

- Send a Telegram notification before each task enters implementation (`code`) execution.
- Minimum notification payload:
  - task id/path
  - stage (`code`)
  - selected role/provider/model
  - run mode (manual/automated)
- Wait for configured acknowledgment rule (if enabled) before dispatching implementation.
- Send Telegram alerts when something goes wrong:
  - audit failure
  - run error/CLI crash/timeout
  - production-line stop triggered after 2 failed audits
- Include in failure alert:
  - task id/path
  - failure reason
  - latest stage/agent/provider/model
  - required human action

## 14) Suggested Config Snippet

```yaml
routing:
  plan:
    roleFile: ".kanban2code/_agents/04-📋planner.md"
    models: ["kimi-2.5", "google-flash-3.1"]
  code:
    roleFile: ".kanban2code/_agents/05-⚙️coder.md"
    models: ["codex-medium", "sonnet-4.6", "google-3.1-pro"]
  audit:
    roleFile: ".kanban2code/_agents/06-✅auditor.md"
    models: ["codex-high", "codex-xhigh", "opus", "google-3.1-pro"]

preflight:
  requireBalanceCheck: true
  codexBalanceCommand: "<configure-command>"
  claudeBalanceCommand: "<configure-command>"

dispatch:
  mode: "cli-agent-only"
  codexCliCommand: "<configure-command>"
  claudeCliCommand: "<configure-command>"

execution:
  maxParallelTasks: 2
  stopLineOnFailedAuditsPerTask: 2
  failedAuditCounterSource: "agent-reported"
  commitOnAuditAccepted: true
  enforceTaskOrderByDefault: true
  commitLock: "global"
  forbidParallelSharedFileWrites: true
  forbidParallelArchitectureWrites: true
  onArchitecturePathAmbiguity: "ask-human"

notifications:
  telegram:
    enabled: true
    notifyBeforeImplementation: true
    notifyOnFailure: true
    notifyOnStopLine: true
    chatId: "<configure-chat-id>"
    botTokenEnv: "TELEGRAM_BOT_TOKEN"
```

This keeps role behavior deterministic and avoids UI-copy limitations by assembling prompts directly in OpenClaw.
