# Kanban2Code V2 — Project Outline

_Distilled from design conversation, 2026-02-19_

**Note:** Original files from the previous version are located at `/home/cynicus/code/kanban2code-v1/`. All references to "v1" or "old project" refer to this location.

---

## The Vision

A VS Code extension where a **chat interface drives everything**. You talk to an orchestrator, it assembles the right context and skills, generates task files, and executes them in a terminal you can watch and intervene in. No fire-and-forget. Human-in-the-loop by design.

**One sentence architecture:**
> The extension is a smart context assembler. The AI is a stateless function. The terminal is the executor.

---

## What Goes (Left Behind)

| What | Why |
|------|-----|
| Sidebar tree/filter UI | Never used. Chat replaces it. |
| Board webview | Deprioritized. Maybe revisit later. |
| Runner-from-kanban-view | Broken. Terminal control replaces it. |
| Accumulated spaghetti | Mental debt. Clean slate is faster. |
| Stateful webview messaging complexity | Overkill for the new model. |

---

## What Stays (Carry Over)

| What | Why |
|------|-----|
| `.kanban2code/` directory structure | Proven. Users already have it. |
| Frontmatter schema + stage model | Inbox → Plan → Code → Audit → Completed. Solid. |
| `_agents/` config files | Provider config already there. |
| `skills-index.json` | Already has framework detection + conditional skill routing. |
| `_context/skills/*.md` | All the skill files themselves. |
| `scanner.ts` | Filesystem scanning works. (from `/home/cynicus/code/kanban2code-v1/`) |
| `frontmatter.ts` | Parsing/serialization works. (from `/home/cynicus/code/kanban2code-v1/`) |
| `stage-manager.ts` | Stage transition logic works. (from `/home/cynicus/code/kanban2code-v1/`) |
| `runner-engine.ts` | Execution logic, extract and clean up. (from `/home/cynicus/code/kanban2code-v1/`) |

---

## New Architecture

### Three Layers

```
┌─────────────────────────────────────┐
│  Chat UI (VS Code Sidebar)          │  ← you talk here
│  - Conversation thread              │
│  - "Generate .md" button            │
│  - "Run" button                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Orchestrator (Stateless API Call)  │  ← reasons here
│  - Receives: history + workspace    │
│    state + available skills         │
│  - Decides: which agent, which      │
│    skills, what the task file says  │
│  - Returns: task .md or next msg    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Terminal Executor                  │  ← runs here, you watch
│  - Opens VS Code terminal           │
│  - Pastes: command + task context   │
│    + selected skills                │
│  - You can see output, answer       │
│    questions, catch wrong turns     │
└─────────────────────────────────────┘
```

### Stateless Design (No Vendor Lock-in)

- Extension owns conversation history in memory
- Each API call assembles fresh: `history + workspace_state + skills → response`
- Swap the agent config file → swap the model → done
- AI landscape changes fast. This survives that.

---

## Agent Routing

Different models for different jobs:

| Role | Model Candidates | Notes |
|------|-----------------|-------|
| Orchestrator | Sonnet, Kimi K2 | Reasoning, planning. Sonnet best but pricey. K2 = "temu sonnet". |
| Planner | Haiku, MiniMax | Fast, cheap, good enough for decomposition. |
| Coder | Sonnet, Codex | Implementation. |
| Auditor | Codex-high, Opus | High accuracy, gates completion. |

Each agent config (`_agents/*.md`) defines: provider, model, endpoint, api_key env var, and which stage it handles.

---

## Skills Auto-Selection

`skills-index.json` already handles this:

1. **Framework detection** — scans workspace files + `package.json` deps
2. **Core skills** — always attached for detected framework
3. **Conditional skills** — triggered by keywords in conversation / task description

Orchestrator receives a compact skills summary. Attaches relevant skill files to the task before routing to execution agent.

---

## Workspace State (Orchestrator Context)

What the orchestrator sees on every call:

```json
{
  "tasks": [
    { "id": "...", "title": "...", "stage": "plan", "project": "...", "tags": [] }
  ],
  "projects": ["...", "..."],
  "available_skills": ["Next.js Core", "Tailwind v4", "..."],
  "available_agents": ["opus", "sonnet", "kimi", "codex"]
}
```

Built by scanning `.md` files live — not cached, not a memory file that can drift. Truth comes from the filesystem.

---

## Chat UI Flows

### Flow 1: Conversation → Task File
```
You: "I want to add a dashboard to the admin panel"
Orchestrator: detects Next.js + Tailwind → selects relevant skills
             → asks clarifying questions if needed
             → proposes task structure
You: [approve / refine]
→ "Generate .md" → creates task file with frontmatter + context
```

### Flow 2: Task File → Execution
```
You: [press Run on a task]
Extension: assembles command (agent CLI + task + skills)
         → opens VS Code terminal
         → pastes command
You: watch it run, answer questions, intervene if needed
```

### Flow 3: Orchestrator Awareness
```
You: "plan all my inbox tasks"
Orchestrator: sees workspace state (5 inbox tasks)
            → processes each, generates plan files
            → queues terminal runs or reports back
```

---

## Build Order

1. **Provider adapter layer** — clean interface: send(messages, model, endpoint) → response. Plugs into existing `_agents/` config files.
2. **Workspace state assembler** — JSON snapshot from filesystem scan. Feed to orchestrator.
3. **Chat UI** — simple message thread in sidebar webview. "Generate .md" + "Run" buttons.
4. **Orchestrator integration** — wire chat → provider adapter → response rendering.
5. **Skill auto-selection** — consume `skills-index.json`, attach to API calls.
6. **Terminal executor** — VS Code terminal API, paste command, stay visible.
7. **Task file generator** — orchestrator output → write `.md` with correct frontmatter.
8. **Carry over** — port scanner, frontmatter, stage-manager, runner-engine cleanly (from `/home/cynicus/code/kanban2code-v1/`).

---

## What Success Looks Like

- You open VS Code, open the Kanban2Code sidebar
- You type "build a dark mode toggle"
- The orchestrator detects React/Tailwind, attaches the right skills, asks one clarifying question
- You click "Generate .md" — task file created
- You click "Run" — terminal opens, agent starts working, you watch
- You see it heading the wrong direction — you type a correction in the terminal
- Task completes, stage moves to audit automatically
- You move to the next task

---

## Roadmap

> Development sequence for Kanban2Code V2. Each phase has a single clear goal, lists every file involved (existing to port vs. new to create), and defines what "done" means before moving on.

---

### Phase 0 — Clean Slate Bootstrap

**Goal:** New repo skeleton compiles, extension activates in VS Code, nothing more.

**Why first:** Everything else depends on the build pipeline working. Don't carry over build tech debt.

**Files to create (new):**
- `package.json` — strip old commands, old webview contributors; keep core VS Code extension manifest, Bun scripts, esbuild
- `tsconfig.json` — copy from `/home/cynicus/code/kanban2code-v1/`, verify paths
- `build.ts` — copy from `/home/cynicus/code/kanban2code-v1/`, trim board bundle references
- `vitest.config.ts` — copy from `/home/cynicus/code/kanban2code-v1/`
- `vitest.e2e.config.ts` — copy from `/home/cynicus/code/kanban2code-v1/`
- `.vscodeignore` — copy from `/home/cynicus/code/kanban2code-v1/`
- `.prettierrc` — copy from `/home/cynicus/code/kanban2code-v1/`
- `eslint.config.mjs` — copy from `/home/cynicus/code/kanban2code-v1/`
- `src/extension.ts` — stub only: `activate()` logs "Kanban2Code V2 activated", `deactivate()` is empty
- `src/webview/ui/main.tsx` — stub: renders `<div>Loading...</div>`
- `src/webview/ui/vscodeApi.ts` — **port from `/home/cynicus/code/kanban2code-v1/`** (`src/webview/ui/vscodeApi.ts`), singleton pattern must be preserved

**Done when:** `bun run build` succeeds, extension loads in Extension Development Host, Output Channel shows activation message.

---

### Phase 1 — Port Core Types and Services

**Goal:** All battle-tested backend logic lives in the new repo. No UI yet. Tests pass.

**Why second:** These are the foundation every later phase sits on. Port them cleanly once, never touch again.

**Files to port (copy + verify, no rewrites):**

_Types:_
- `src/types/task.ts` — Task, Stage, frontmatter shape
- `src/types/provider.ts` — ProviderConfig, ProviderSafetySchema, PromptStyle
- `src/types/config.ts` — KanbanConfig, DEFAULT_CONFIG
- `src/types/errors.ts` — KanbanError, FileSystemError, StageTransitionError, etc.
- `src/types/filters.ts` — FilterState, tag taxonomy, color utilities
- `src/types/context.ts` — ContextFile, ContextConfig
- `src/types/copy.ts` — CopyOptions, CopyResult
- `src/types/gray-matter.d.ts` — declaration file

_Core:_
- `src/core/constants.ts` — STAGES, folder names, PROVIDERS_FOLDER
- `src/core/rules.ts` — stage transition rules, validation logic

_Utils:_
- `src/utils/text.ts` — text processing helpers

_Workspace:_
- `src/workspace/state.ts` — WorkspaceState, kanban root detection
- `src/workspace/validation.ts` — ensureSafePath, workspace detection

_Services:_
- `src/services/scanner.ts` — loadAllTasks, getOrderedTasksForStage
- `src/services/frontmatter.ts` — parseTaskFile, stringifyTaskFile
- `src/services/stage-manager.ts` — getDefaultAgentForStage, stage transition logic
- `src/services/task-content.ts` — load/save task file content + relocation
- `src/services/task-watcher.ts` — debounced filesystem watcher
- `src/services/projects.ts` — listProjects, listPhases, createProject
- `src/services/archive.ts` — archiveTask, archiveProject
- `src/services/delete-task.ts` — deleteTaskById
- `src/services/copy.ts` — copyTaskContext to clipboard
- `src/services/fs-move.ts` — atomic file move helper
- `src/services/scaffolder.ts` — scaffold new workspace
- `src/services/config.ts` — load/validate `.kanban2code/config.json`
- `src/services/logging.ts` — createModuleLogger, log levels, Output Channel
- `src/services/error-recovery.ts` — handleError, withRecovery, createRecoverableOperation
- `src/services/prompt-builder.ts` — buildRunnerPrompt, XML assembly
- `src/services/context.ts` — load context files from `_context/`
- `src/services/provider-service.ts` — listAvailableProviders, resolveProviderConfig, full CRUD

_Assets:_
- `src/assets/providers.ts` — BUNDLED_PROVIDERS (auto-generated, copy as-is)
- `src/assets/agents.ts` — BUNDLED_AGENTS
- `src/assets/contexts.ts` — BUNDLED_CONTEXTS
- `src/assets/seed-content.ts` — seed files for scaffolding

_Port tests alongside each service:_
- `tests/setup.ts`, `tests/vscode-stub.ts`
- `tests/frontmatter.test.ts`
- `tests/scanner.test.ts` (task-loading.test.ts)
- `tests/stage-manager.test.ts`
- `tests/archive.test.ts`
- `tests/scaffolder.test.ts`
- `tests/config-service.test.ts`
- `tests/logging.test.ts`
- `tests/errors.test.ts`
- `tests/tag-taxonomy.test.ts`
- `tests/validation.test.ts`
- `tests/rules.test.ts`
- `tests/delete-task.test.ts`
- `tests/task-content.test.ts`
- `tests/task-watcher.test.ts`
- `tests/context-service.test.ts`
- `tests/copy-service.test.ts`
- `tests/prompt-builder.test.ts`
- `tests/error-recovery.test.ts`

**Done when:** `bun run test` passes for all ported tests. No UI, no runner yet.

---

### Phase 2 — Port Runner

**Goal:** The execution engine lives in the new repo and all adapters work.

**Why its own phase:** The runner is self-contained and complex. Isolating it makes verification easier.

**Files to port:**
- `src/runner/cli-adapter.ts` — CliAdapter interface, CliResponse, CliCommandResult
- `src/runner/adapter-factory.ts` — getAdapterForCli (claude, codex, kimi, kilo)
- `src/runner/adapters/claude-adapter.ts` — Claude CLI adapter
- `src/runner/adapters/codex-adapter.ts` — Codex/OpenAI adapter
- `src/runner/adapters/kimi-adapter.ts` — Kimi K2 adapter
- `src/runner/adapters/kilo-adapter.ts` — GLM/ZAI adapter via kilo CLI
- `src/runner/output-parser.ts` — parseAuditRating, parseAuditVerdict, parseFilesChanged, parseStageTransition
- `src/runner/runner-state.ts` — RunnerState, queue management
- `src/runner/runner-log.ts` — RunnerLog, RunnerStageRecord, per-run markdown reports
- `src/runner/git-ops.ts` — git operations helper
- `src/runner/runner-engine.ts` — EventEmitter-based engine, runTask, stop, event types

_Port runner tests:_
- `tests/runner-log.test.ts`
- `tests/runner-engine.test.ts`
- `tests/e2e/setup.ts`
- `tests/e2e/core-workflows.test.ts`

**Done when:** `bun run test` still fully green. Runner engine can be imported without errors.

---

### Phase 3 — Workspace Snapshot Service

**Goal:** A single function that returns a clean JSON snapshot of everything the orchestrator needs to know.

**Why now:** The orchestrator can't work without this. Build and test it in isolation before wiring it to anything.

**Files to create (new):**
- `src/services/workspace-snapshot.ts`
  - `buildWorkspaceSnapshot(kanbanRoot: string): Promise<WorkspaceSnapshot>`
  - Calls `loadAllTasks()` from scanner (from `/home/cynicus/code/kanban2code-v1/`) — tasks with id, title, stage, project, tags, agent
  - Calls `listAvailableProviders()` from provider-service (from `/home/cynicus/code/kanban2code-v1/`) — available agent names
  - Reads `skills-index.json` — available skill names + descriptions (compact, not full file content)
  - Calls `listProjects()` from projects (from `/home/cynicus/code/kanban2code-v1/`) — active project/phase names
  - Returns `WorkspaceSnapshot` type (defined in same file or `src/types/snapshot.ts`)

**WorkspaceSnapshot shape:**
```ts
interface WorkspaceSnapshot {
  tasks: { id: string; title: string; stage: Stage; project?: string; phase?: string; tags: string[]; agent?: string }[];
  projects: string[];
  providers: { id: string; name: string; model: string }[];
  skills: { name: string; description: string; framework: string }[];
  generatedAt: string;
}
```

**Files to create (new):**
- `src/types/snapshot.ts` — WorkspaceSnapshot interface
- `tests/workspace-snapshot.test.ts` — unit test against a temp workspace

**Done when:** `buildWorkspaceSnapshot()` returns correct data from a fixture workspace, test passes.

---

### Phase 4 — Skill Auto-Selector

**Goal:** Given conversation text and the current workspace, return the right skill files to attach to the orchestrator call.

**Why now:** Needed by orchestrator. Needs workspace snapshot as input (Phase 3 dependency).

**How it works:**
1. Read `skills-index.json`
2. Detect frameworks from workspace (`package.json` deps + file patterns from `framework_detection`)
3. Always include `core_skills` for detected frameworks
4. Score `conditional_skills` by keyword overlap with conversation text
5. Return ordered list of skill file paths to read and attach

**Files to create (new):**
- `src/services/skill-selector.ts`
  - `detectFrameworks(workspaceRoot: string): Promise<string[]>`
  - `selectSkills(opts: { kanbanRoot: string; workspaceRoot: string; conversationText: string }): Promise<SelectedSkill[]>`
  - `loadSkillContents(kanbanRoot: string, skills: SelectedSkill[]): Promise<string>` — reads and concatenates skill .md files
- `src/types/skill.ts` — SelectedSkill interface, SkillsIndex schema matching `skills-index.json`
- `tests/skill-selector.test.ts` — unit tests for framework detection, keyword matching, ordering

**Done when:** Given a Next.js workspace and "add dashboard with caching", returns `nextjs-core-skills.md` + `skill-caching-data-fetching.md` in the right order.

---

### Phase 5 — Orchestrator Service

**Goal:** A stateless function that takes conversation + context → calls configured provider API → returns response. No CLI, no spawning. Direct HTTP.

**Why direct API (not CLI):** The chat interface needs streaming responses to feel alive. CLI adapters capture full output after the process exits — too slow for chat. Execution (run button) still uses CLI via terminal.

**Two separate paths, forever separate:**
- **Chat path:** Orchestrator → direct API call → stream tokens to UI
- **Execution path:** Terminal executor → CLI runner → visible terminal (Phase 7)

**Provider support (implement in order of priority):**
1. Anthropic (`@anthropic-ai/sdk`) — `claude-sonnet-4-6`, `claude-haiku-4-5`, `claude-opus-4-6`
2. OpenAI (`openai` SDK) — covers Codex models
3. Moonshot (HTTP, OpenAI-compatible) — covers Kimi K2
4. MiniMax (HTTP, OpenAI-compatible) — Phase 11

**Files to create (new):**
- `src/orchestrator/orchestrator.ts`
  - `sendMessage(opts: OrchestratorCallOptions): AsyncIterable<string>` — streams response tokens
  - Assembles system prompt: workspace snapshot + selected skills + persona instructions
  - Calls the right SDK based on provider field in the active orchestrator config
  - No conversation history stored internally — caller passes full history
- `src/orchestrator/anthropic-client.ts` — Anthropic SDK wrapper, streaming
- `src/orchestrator/openai-client.ts` — OpenAI SDK wrapper, streaming (also covers Moonshot via baseURL override)
- `src/orchestrator/system-prompt-builder.ts`
  - `buildOrchestratorSystemPrompt(snapshot: WorkspaceSnapshot, skills: string): string`
  - Injects: workspace state, available providers, persona ("you are the orchestrator for a dev workflow...")
  - Teaches the orchestrator the task .md format so it can propose valid files
- `src/types/orchestrator.ts`
  - `OrchestratorCallOptions` — history, snapshot, skills, active provider config
  - `ChatMessage` — role: 'user' | 'assistant', content: string
- `tests/orchestrator.test.ts` — unit test with mocked SDK responses

**Done when:** `sendMessage()` with a mocked Anthropic client streams tokens correctly. System prompt contains workspace task list and skill summaries.

---

### Phase 6 — Task File Generator

**Goal:** When the orchestrator proposes a task, one function writes the `.md` file with correct frontmatter and returns the file path.

**Why its own phase:** This is a critical correctness boundary. The generated file must parse correctly with `frontmatter.ts`, be in the right location, and have valid stage/agent values.

**How it works:**
1. Orchestrator response contains a structured task proposal (title, description, stage, agent, tags, project/phase)
2. The orchestrator is prompted to return proposals in a parseable block (e.g., fenced YAML block)
3. Generator parses the block, validates fields, picks the location (inbox vs. project/phase), writes the file

**Files to create (new):**
- `src/services/task-generator.ts`
  - `parseTaskProposal(responseText: string): TaskProposal | null` — extracts structured block from orchestrator response
  - `generateTaskFile(kanbanRoot: string, proposal: TaskProposal): Promise<string>` — writes .md, returns relative path
  - Uses `stringifyTaskFile()` from `src/services/frontmatter.ts` (from `/home/cynicus/code/kanban2code-v1/`)
  - Uses `ensureSafePath()` from `src/workspace/validation.ts` (from `/home/cynicus/code/kanban2code-v1/`)
- `src/types/task-proposal.ts`
  - `TaskProposal` — title, description (markdown body), stage, agent, tags, project?, phase?
- `tests/task-generator.test.ts` — parse proposal from mock response, verify written file has correct frontmatter

**Done when:** Parsing a mock orchestrator response produces a valid `.md` file that `parseTaskFile()` reads back without errors.

---

### Phase 7 — Terminal Executor

**Goal:** One command opens a VS Code terminal, pastes the correct CLI invocation for a given task, and stays visible so the user watches and intervenes.

**Why now:** This replaces the broken hidden runner. Must work before any UI ships.

**How it works:**
1. Read task file (frontmatter to get agent/provider)
2. Resolve provider config via `provider-service.ts` (from `/home/cynicus/code/kanban2code-v1/`)
3. Build CLI command via `adapter-factory.ts` (from `/home/cynicus/code/kanban2code-v1/`) + `cli-adapter.buildCommand()`
4. Build the full prompt string via `prompt-builder.ts` (from `/home/cynicus/code/kanban2code-v1/`) (task content + skill files)
5. Open terminal: `vscode.window.createTerminal({ name: taskTitle })`
6. Send command: `terminal.sendText(command)` — terminal becomes interactive
7. Show terminal: `terminal.show()`

**Files to create (new):**
- `src/services/terminal-executor.ts`
  - `executeTaskInTerminal(kanbanRoot: string, taskId: string, workspaceRoot: string): Promise<void>`
  - Handles prompt size limits (warn if prompt exceeds safe threshold)
  - Names terminal after task title for easy identification
  - Optionally reuses existing terminal with same name
- `tests/terminal-executor.test.ts` — mock vscode.window.createTerminal, verify sendText called with correct command

**Done when:** Triggering `executeTaskInTerminal()` in Extension Development Host opens a named terminal with the correct `claude --prompt "..."` command pasted in.

---

### Phase 8 — New Messaging Protocol

**Goal:** A lean, typed message contract between the extension host and the chat webview. No legacy board/filter/tree messages.

**Why its own phase:** Getting this right before building the UI prevents the class of bugs `/home/cynicus/code/kanban2code-v1/` had (race conditions, message loss, API acquired twice).

**Message types needed:**

_Host → Webview:_
- `InitState` — kanban root exists, workspace snapshot, active orchestrator provider
- `StreamChunk` — token from orchestrator streaming response
- `MessageComplete` — orchestrator response finished
- `TaskGenerated` — task file was written, here's the path + title
- `WorkspaceUpdated` — filesystem changed, here's new snapshot
- `Error` — something failed, here's the message

_Webview → Host:_
- `RequestState` — webview mounted, send me InitState (keep ready handshake from `/home/cynicus/code/kanban2code-v1/`)
- `SendMessage` — user sent a chat message, here's the text
- `GenerateTask` — user clicked "Generate .md", here's the confirmed proposal
- `RunTask` — user clicked "Run", here's the task file path
- `CancelStream` — user cancelled an in-progress orchestrator response

**Files to create (new):**
- `src/webview/messaging.ts` — full rewrite. Keep `createEnvelope`/`validateEnvelope` pattern from `/home/cynicus/code/kanban2code-v1/`, new message types only.

**Files to port (keep):**
- `src/webview/ui/vscodeApi.ts` — already ported from `/home/cynicus/code/kanban2code-v1/` in Phase 0, no changes needed

**Done when:** All message types have Zod schemas, round-trip test passes, no `any` types.

---

### Phase 9 — Chat Webview UI

**Goal:** The sidebar shows a working chat interface. User types, sees streamed responses, can click "Generate .md" and "Run".

**Component breakdown:**

```
SidebarProvider.ts (host)
  └── App.tsx
        ├── Chat.tsx                    ← main container
        │     ├── WorkspaceBar.tsx      ← collapsible: task counts by stage
        │     ├── ChatHistory.tsx       ← scrollable message list
        │     │     └── ChatMessage.tsx ← user bubble / assistant bubble
        │     │           └── TaskProposalCard.tsx  ← when assistant proposes a task
        │     │                 ├── [Generate .md] button
        │     │                 └── [Edit] inline before generating
        │     └── ChatInput.tsx         ← textarea + send button + provider selector
        └── EmptyState.tsx              ← when no kanban workspace found
```

**Files to create (new):**
- `src/webview/SidebarProvider.ts` — rewrite. Handles `RequestState` → `InitState`, `SendMessage` → orchestrator → stream chunks, `GenerateTask` → task-generator, `RunTask` → terminal-executor, `task-watcher` (from `/home/cynicus/code/kanban2code-v1/`) events → `WorkspaceUpdated`
- `src/webview/ui/App.tsx` — rewrite. Chat-only. No board toggle, no filter state. Receives `InitState`, renders `<Chat />` or `<EmptyState />`
- `src/webview/ui/components/Chat.tsx` — conversation state (array of ChatMessage), streams incoming tokens into last assistant message
- `src/webview/ui/components/ChatMessage.tsx` — renders user vs assistant bubble, parses assistant message for task proposal blocks, renders `<TaskProposalCard />` when found
- `src/webview/ui/components/TaskProposalCard.tsx` — displays proposed task (title, stage, agent, tags), "Generate .md" button sends `GenerateTask`, shows confirmation when file created
- `src/webview/ui/components/WorkspaceBar.tsx` — counts tasks per stage (inbox: 3, plan: 1, code: 2...), collapses to a single line, click to expand list
- `src/webview/ui/components/ChatInput.tsx` — auto-resizing textarea, Shift+Enter for newline, Enter to send, provider selector dropdown (shows available orchestrators)
- `src/webview/ui/components/EmptyState.tsx` — **port from `/home/cynicus/code/kanban2code-v1/`** (`src/webview/ui/components/EmptyState.tsx`), "Create Kanban Workspace" button
- `src/webview/ui/hooks/useChat.ts` — chat state: messages array, streaming state, send handler, cancel handler

**Files to port (keep with minor updates):**
- `src/webview/ui/components/Icons.tsx` — port from `/home/cynicus/code/kanban2code-v1/`, keep useful icons, add new ones as needed

**Files to delete (do not port):**
- All of `src/webview/ui/components/` not listed above — Sidebar.tsx, TaskTree.tsx, TreeNode.tsx, TreeSection.tsx, FilterBar.tsx, QuickFilters.tsx, QuickViews.tsx, Board.tsx, BoardHeader.tsx, BoardHorizontal.tsx, BoardSwimlane.tsx, Column.tsx, Swimlane.tsx, TaskCard.tsx, TaskItem.tsx, TaskModal.tsx, TaskEditorModal.tsx, TaskContextMenu.tsx, MoveModal.tsx, AgentModal.tsx, AgentPicker.tsx, ContextModal.tsx, ContextMenu.tsx, ContextPicker.tsx, SkillPicker.tsx, LocationPicker.tsx, ProjectModal.tsx, LayoutToggle.tsx, KeyboardHelp.tsx, SidebarActions.tsx, SidebarToolbar.tsx, BoardHeader.tsx, MentionsTextarea.tsx
- `src/webview/KanbanPanel.ts` — board panel gone
- `src/webview/viewRegistry.ts` — no longer needed

**Webview component tests (new):**
- `tests/webview/chat.test.tsx` — render Chat, send message, verify message appears
- `tests/webview/task-proposal-card.test.tsx` — render proposal, click Generate, verify message sent
- `tests/webview/workspace-bar.test.tsx` — render with snapshot, verify counts

**Done when:** Extension Development Host shows the chat sidebar. Typing a message sends `SendMessage`. Streamed tokens appear in the assistant bubble. "Generate .md" button appears when orchestrator proposes a task.

---

### Phase 10 — Extension Entry Point + Command Registration

**Goal:** `extension.ts` is clean, minimal, wires everything together. Commands work from the Command Palette.

**Why last among the core phases:** Depends on all services, the orchestrator, and the UI being ready.

**Commands to register (minimal set):**

| Command ID | Title | What it does |
|---|---|---|
| `kanban2code.createWorkspace` | Create Kanban Workspace | Runs scaffolder |
| `kanban2code.runTask` | Run Task in Terminal | Opens file picker → terminal executor |
| `kanban2code.newTask` | New Task (Chat) | Focuses sidebar, pre-fills chat prompt |
| `kanban2code.openSettings` | Open Settings | Opens `_providers/` folder or config.json |

**Files to rewrite:**
- `src/extension.ts` — activate: detect workspace, start task watcher (from `/home/cynicus/code/kanban2code-v1/`), register commands, create SidebarProvider. No runner engine wired here (runner is terminal-driven now). Clean, under 150 lines.
- `src/commands/index.ts` — registerCommands(context, kanbanRoot), one function per command, imports from services.

**Files to delete (do not port):**
- `src/services/migration.ts` — agents→modes migration no longer relevant
- `src/services/mode-service.ts` — modes replaced by providers

**Done when:** All four commands appear in Command Palette and execute without errors. Task watcher fires, workspace snapshot rebuilds, sidebar receives `WorkspaceUpdated`.

---

### Phase 11 — MiniMax Adapter + Provider Expansion

**Goal:** MiniMax works as an execution provider. Kimi K2 confirmed working end-to-end.

**Why after core:** Provider additions don't block the main flow. Get the flow right first.

**Files to create (new):**
- `src/runner/adapters/minimax-adapter.ts` — MiniMax CLI or API adapter
- `src/assets/providers.ts` — add `minimax.md` entry (update build.ts to pick it up)
- `.kanban2code/_providers/minimax.md` — provider config file for dogfooding workspace

**Files to update:**
- `src/runner/adapter-factory.ts` (from `/home/cynicus/code/kanban2code-v1/`) — add `'minimax'` case
- `src/orchestrator/openai-client.ts` — MiniMax is OpenAI-compatible, add `baseURL` branch for `provider: minimax`

**Done when:** A task runs end-to-end via MiniMax in the terminal. Kimi K2 runs end-to-end via terminal.

---

### Phase 12 — E2E Integration and Hardening

**Goal:** The full loop works. Every seam is tested. Error states handled gracefully.

**Integration scenarios to verify:**

1. **Happy path:** Chat → orchestrator proposes task → Generate .md → Run → terminal opens with correct command → task .md updated by agent → task watcher fires → workspace bar updates
2. **Skill selection:** "add caching to the dashboard" → orchestrator system prompt contains `skill-caching-data-fetching.md` content
3. **Workspace awareness:** "plan all my inbox tasks" → orchestrator system prompt lists all 5 inbox tasks → proposes a plan for each
4. **Wrong direction:** Agent in terminal asks a question → user types answer in terminal → agent continues (this is just terminal UX, verify it doesn't break anything)
5. **No workspace:** Sidebar shows EmptyState, "Create Workspace" button scaffolds correctly
6. **Provider swap:** Change orchestrator provider from sonnet to kimi in settings → next chat message uses kimi

**Files to create (new):**
- `tests/e2e/chat-flow.test.ts` — end-to-end test: chat message → task file generated
- `tests/e2e/terminal-executor.test.ts` — verify terminal command string correctness
- `tests/integration/skill-selector.test.ts` — full skill selection from fixture workspace
- `tests/integration/workspace-snapshot.test.ts` — full snapshot from fixture workspace

**Hardening checklist:**
- [ ] Streaming response cancelled cleanly when user closes sidebar
- [ ] Task generator rejects malformed proposals gracefully (shows error in chat, not crash)
- [ ] Terminal executor warns if prompt exceeds 50k characters
- [ ] Skills not found (missing file) logs warning, continues without that skill
- [ ] Provider API key missing → clear error message in chat bubble, not silent failure
- [ ] Task watcher debounce prevents snapshot rebuild storm during fast file writes

**Done when:** All scenarios above work manually. `bun run test` + `bun run test:e2e` fully green. `bun run typecheck` clean. `bun run build` produces valid VSIX.

---

### Phase 13 — Dogfooding and Iteration

**Goal:** Use Kanban2Code V2 to build Kanban2Code V2 features. Find what's missing by using it daily.

**What to watch for:**
- Which orchestrator model actually performs best for planning (sonnet vs kimi)
- Prompt quality: is the system prompt giving the orchestrator enough context to ask the right questions?
- Skill file quality: are the conditional skills triggering on the right conversations?
- Terminal UX: is the command format working cleanly for each provider?
- Workspace bar: is the task count summary actually useful or just noise?

**Likely follow-up features (don't build now, collect here):**
- Board view (read-only at minimum) — was useful for overview, may want back
- Conversation persistence — save chat history to `.kanban2code/_chat/` so it survives VS Code restarts
- Bulk task operations — "run all plan-stage tasks" queues multiple terminals
- Orchestrator personas — different system prompts for different conversation modes (planning vs debugging vs reviewing)
- Cost tracking — display token usage + USD cost per orchestrator call in the chat bubble footer
- Provider health check — ping configured provider on activation, warn if unreachable

---

### Phase Summary

| Phase | Goal | New Files | Ported Files | Blocks |
|-------|------|-----------|--------------|--------|
| 0 | Bootstrap | extension stub, build | vscodeApi.ts (from `/home/cynicus/code/kanban2code-v1/`) | nothing |
| 1 | Core services | — | 30+ services, types, tests (from `/home/cynicus/code/kanban2code-v1/`) | P0 |
| 2 | Runner | — | 10 runner files + tests (from `/home/cynicus/code/kanban2code-v1/`) | P1 |
| 3 | Workspace snapshot | workspace-snapshot.ts, snapshot.ts | — | P1 |
| 4 | Skill selector | skill-selector.ts, skill.ts | — | P3 |
| 5 | Orchestrator service | orchestrator/, system-prompt-builder | — | P3, P4 |
| 6 | Task file generator | task-generator.ts, task-proposal.ts | frontmatter.ts (already from `/home/cynicus/code/kanban2code-v1/`) | P5 |
| 7 | Terminal executor | terminal-executor.ts | provider-service, adapter-factory (already from `/home/cynicus/code/kanban2code-v1/`) | P2 |
| 8 | Messaging protocol | messaging.ts (rewrite) | — | P0 |
| 9 | Chat UI | Chat, ChatMessage, ChatInput, WorkspaceBar, TaskProposalCard, SidebarProvider, App | EmptyState, Icons (from `/home/cynicus/code/kanban2code-v1/`) | P5, P6, P7, P8 |
| 10 | Extension entry point | extension.ts (rewrite), commands/index.ts | — | P9 |
| 11 | MiniMax + providers | minimax-adapter.ts | adapter-factory (update) | P7 |
| 12 | E2E hardening | e2e tests | — | P10 |
| 13 | Dogfood | — | — | P12 |

**Critical path:** P0 → P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8 → P9 → P10 → ship

Phases 11–13 are parallel or post-launch work.

# Kanban2Code V2 — Design Document

_Distilled from design conversation, 2026-02-21_

---

## The Vision

A VS Code extension where a **chat interface drives everything** and a **kanban board shows you the truth**. You talk to an orchestrator, it assembles context and skills, generates task files, and runs them in a terminal you can watch and steer. The board is always visible — your ground truth at a glance.

**One sentence architecture:**
> The chat is the control surface. The architecture file is the project memory. The terminal is the executor. The board is the progress window.

---

## Screen Layout

```
┌─────────────────┬──────────────────────────────────────────┐
│  Sidebar        │  Main Editor Area                        │
│  (Chat)         │  (Kanban Board — always visible)         │
│                 │                                          │
│  Context panel  │  Capture │ Plan │ Code │ Audit │ Done   │
│  Chat history   │                                          │
│  Chat input     │  [card]  [card]  [card]  [card]          │
│  Provider sel.  │                                          │
│  ~300px         │  rest of screen                          │
└─────────────────┴──────────────────────────────────────────┘
```

The board never hides. It is not a view you toggle to — it is the default state of your workspace.

---

## Visual Design Direction

- **Dark theme** — near-black background (#0d0d0d range), not navy, not grey
- **Old school + modern** — bold typography, high contrast, chunky UI. Think industrial tooling aesthetic. Heavy borders, visible structure, nothing floaty or glassmorphic.
- **Big buttons** — controls are large and clearly labeled. No icon-only ambiguity. If it does something important, it has a visible label.
- **Board cards** — compact but readable. Priority badge, agent tag, title, run buttons. No decoration.
- **Color language** — stage colors are functional, not decorative. Capture = neutral, Plan = blue, Code = amber, Audit = purple, Completed = green.

---

## The Three-Level Architecture Stack

This is the project memory system. Every agent reads from it. The auditor writes to it. It is the handoff mechanism between tasks.

```
architecture.md                    ← GLOBAL TRUTH
  Every file in the entire codebase.
  Every component, service, connection.
  Updated LAST — when a project is fully complete.
  ↑
  fed into by

[project]-architecture.md          ← PROJECT TRUTH (per project)
  Created when a project starts.
  Task 1 writes: what files were created, what decisions were made, schema shape.
  Task 2 reads: task 1 created X, I connect X to Y — that is my task.
  Each task's auditor appends what was done before marking complete.
  When all tasks finish → Final Task merges this up into architecture.md.
  ↑
  informed by

kanban2code-architecture.md        ← TOOL/SYSTEM MAP
  Where skills live. Where agents are. How context works.
  Smaller file. Rarely changes.
  Gives LLMs orientation within the tool itself.
```

### Force Summary

A special context file, max 50 lines. Written once per project, manually or by a "summarize this project" command. Answers: what is this, what stack, what's the main entry point, what are the 3 things to know before touching it.

Used in chat: inject this as the default lightweight project context without loading full architecture.md. Saves 4–6 back-and-forths on every new conversation.

---

## Agent Pipeline

### Two Tiers

**Orchestration Tier** — shapes work, produces files:

| Agent | Role | Output |
|-------|------|--------|
| `roadmapper` | Vision → roadmap document | `.kanban2code/projects/<name>/roadmap.md` |
| `architect` | Roadmap → technical design + phases | Updated roadmap with decisions |
| `splitter` | Roadmap → task files | Phase folders + task `.md` files + `[project]-architecture.md` stub |

**Execution Tier** — builds + verifies, per task:

| Agent | Model | Role |
|-------|-------|------|
| `planner` | Haiku (cheap) | Context distiller — reads architecture + skills, extracts snippets for coder |
| `coder` | Sonnet | Implementer — reads pre-digested brief, writes code |
| `auditor` | Opus | Gatekeeper — reviews, rates (8+ accepted), updates architecture |

### The Planner Is a Context Compiler

The planner's job is not to refine requirements. It is to **eliminate expensive reading by the coder**.

```
Planner (Haiku) reads:
  - architecture.md (relevant sections)
  - [project]-architecture.md (what previous tasks did)
  - skills-index.json → reads matched skill files
  - sibling task files (scope boundaries)
  - actual codebase files (signatures, types, interfaces)

Planner outputs (appended to task file):
  - Refined prompt (objective + implementation steps)
  - File tree (scoped, 20 lines max, marked modify/create/reference)
  - Architecture excerpts (30 lines max, only what coder must follow)
  - Skill excerpts (20 lines per skill, only relevant sections)
  - Code excerpts (signatures and shapes, not full implementations)
  - Dependency graph (what imports what)
  - Scope boundaries (what this task must NOT touch)

Coder (Sonnet) reads:
  - That pre-digested ~150-line brief
  - Does not read architecture, does not search files, does not index
```

A cheap model does the expensive token work. An expensive model gets a focused input. This is why accuracy is high and cost stays manageable.

### Sequential Execution Is the Feature

Tasks within a project ALWAYS run sequentially. This is not a limitation.

```
Task 1 auditor → appends to [project]-architecture.md → marks complete
Task 2 planner → reads UPDATED [project]-architecture.md → correct context
Task 2 coder   → implements against actual schema from task 1
```

If tasks run in parallel, the planner reads stale architecture, the coder builds on wrong assumptions, the auditor catches it, the run is wasted. Sequential is the guarantee that each task inherits accurate truth.

**Exception:** Tasks in completely independent projects with no shared files or schema can run in parallel.

---

## The Final Task Pattern

When the last real task in a project is accepted (auditor rating 8+), the auditor creates one more task:

**File:** `Final-task-[project-name].md`
**Stage:** plan (runs through the full pipeline)
**Instructions:** Read `[project]-architecture.md`. Merge all new files, decisions, schema changes, and component relationships into the global `architecture.md`. Do not duplicate existing content. Update the relevant directory tree sections and functionality descriptions.

This is just another task. No special handling. No new agent type. The same pipeline runs it. When it completes, `architecture.md` reflects the full project.

---

## Orchestrator

The orchestrator is a **cheap LLM running in the chat sidebar** that manages the pipeline and responds to your messages. It is NOT the agent that does the work — it is the dispatcher and monitor.

### What It Knows

On every call the orchestrator receives:
```json
{
  "tasks": [{ "id", "title", "stage", "project", "audit_returns", "provider" }],
  "projects": ["..."],
  "run_log": { "current_run": "...", "tasks_completed": 0, "tasks_failed": 0 },
  "available_providers": ["haiku", "sonnet", "opus", "kimi", "glm"],
  "conversation_history": [...]
}
```

### Pipeline Management

When you say "build the review system project":
1. Orchestrator reads project tasks ordered by stage
2. Queues tasks sequentially
3. For each task: selects the correct provider by stage, opens VS Code terminal, pastes command, waits for completion signal (stage transition in task file)
4. Moves to next task only after current task's stage changes in the filesystem

### The 2-Strike Rule

```
Task enters audit stage
  → auditor returns: audit_returns = 1
  → task goes back to code
  → coder revises
  → task enters audit again
  → auditor returns: audit_returns = 2
  → HALT
  → orchestrator stops the queue
  → sends message to chat: "Task '[title]' failed audit twice. Review the task and intervene."
  → waits for human decision
```

You decide: fix the task manually, change the agent, skip the task, or restart it. The orchestrator does not retry indefinitely.

### Provider Analytics Log

Every task run records:

```
run_id, task_id, task_title, provider, stage, audit_returns, subtask_count, result (accepted/failed/halted)
```

Aggregated over time:

```
Provider Performance Report
───────────────────────────
gemini-2.5-pro
  Tasks with ≤3 subtasks:  82% pass first audit
  Tasks with 4+ subtasks:  11% pass first audit  ← stop using for complex tasks

haiku
  Planning tasks:  94% complete without issues
  Coding tasks:    not used (by design)

sonnet
  Avg audit returns before acceptance:  1.1
  Fail rate (2 returns):  8%
```

This becomes a data-driven model selection guide. You stop guessing. The log tells you.

---

## Terminal Executor

Every task runs in a **named, visible VS Code terminal**. This is non-negotiable based on `/home/cynicus/code/kanban2code-v1/` experience with hidden child processes.

```
Terminal name: "[task title] — [stage]"
Command pasted: claude --dangerously-skip-permissions "<prompt>"
Terminal shown: yes, immediately
User can: read output, type corrections, answer questions, kill it
```

When the orchestrator runs a batch:
- Each task opens its own named terminal in sequence
- Previous terminal stays visible (you can scroll back)
- You can see exactly what each agent did, in order

No black boxes. No fire-and-forget. You are always in the room.

---

## Chat UI

### Context Panel (top of sidebar, collapsible)

```
┌─ CONTEXT ────────────────────────────────────┐
│ ☑ Force Summary (~50 lines)                  │
│ ☐ architecture.md (global)                   │
│ ☑ review-system-architecture.md              │
│ ☑ api-architecture.md                        │
│ ─── Skills ───────────────────────────────── │
│ ☑ nextjs-core-skills (auto-detected)         │
│ ☐ skill-drizzle-orm                          │
│ ─── Always On ────────────────────────────── │
│   Workspace snapshot (tasks, stages, agents) │
│   ~6,200 tokens  ████████░░░░  budget: 32k   │
└──────────────────────────────────────────────┘
```

**Rules:**
- Force summary is on by default — lightweight project context without full architecture
- Workspace snapshot is always on, always assembled fresh from filesystem (never cached)
- Domain architecture files are toggleable — pick the one relevant to your conversation
- Skills are auto-detected from workspace, toggleable for manual override
- Token estimate shows before you send — no surprises

### Chat Flow

```
You:         "I want to build a review system"
             [api-architecture.md ☑] [force-summary ☑]
             → 200 lines of context injected automatically

Orchestrator: asks 2 clarifying questions about scale, auth, data model

You:         answers

Orchestrator: "Here's what I'm proposing:"
             [Task proposal card appears]
               Title: Review System — Backend API
               Stage: capture
               Agent: architect
               Skills: [drizzle-orm, server-actions]
               Tags: [feature, p1]
               [Capture Task]  [Edit]

You:         [Capture Task]
             → task file created with full context + skills pre-selected
             → board updates
```

### Capture Task Flow

When you click **Capture Task**:
1. Orchestrator generates a structured task proposal from the conversation
2. A preview card appears in chat — title, stage, agent, skills, tags
3. You can edit inline before confirming
4. On confirm → task `.md` file written with correct frontmatter + conversation context as task body
5. Board reflects the new card immediately

### Provider Selector

Bottom of chat input. Dropdown shows available configured providers. Selected provider is the orchestrator for this conversation. Swap it, next message uses the new model.

---

## Board UI

### Card Design

```
┌────────────────────────────────────┐
│ ● HIGH                             │
│                                    │
│ Review System — Backend API        │
│ Build review schema and endpoints  │
│                                    │
│ [architect]  [api] [feature]       │
│                            [▶][▶▶] │
└────────────────────────────────────┘
```

- `▶` — run current stage, advance one step (plan → code, or code → audit, etc.)
- `▶▶` — run all remaining stages to completed (plan → code → audit → completed)
- Click card title → opens task file in editor
- Right-click → context menu (move, archive, edit, copy context)

### Run Buttons

Both buttons open a VS Code terminal with the correct agent CLI command for the current stage. The `▶▶` button queues the full pipeline through the orchestrator — it runs sequentially, each stage in its own terminal.

### Columns

| Column | Stage | Color |
|--------|-------|-------|
| Capture | capture | neutral |
| Plan | plan | blue |
| Code | code | amber |
| Audit | audit | purple |
| Completed | completed | green |

---

## Key Flows

### Flow 1: New Feature (Chat → Task → Run)

```
1. Open chat sidebar
2. Toggle context: [force-summary ☑] [api-architecture ☑]
3. Describe feature in chat
4. Go back and forth until scope is clear
5. Click "Capture Task" on the proposal card
6. Task appears in Capture column
7. Click ▶▶ on the card
8. Orchestrator queues: plan → code → audit
9. Terminal opens for planner (Haiku)
10. Planner finishes → terminal closes → new terminal opens for coder (Sonnet)
11. Coder finishes → auditor (Opus) opens in terminal
12. Auditor accepts (8+) → card moves to Completed → project-architecture.md updated
```

### Flow 2: Full Project Build (Overnight)

```
1. Chat: "build the review system project"
2. Orchestrator reads all tasks in project (8 tasks, all in plan stage)
3. Queues sequentially
4. You watch first task run, looks good, leave it
5. Returns to find 7/8 completed, 1 halted (audit returned twice)
6. Chat notification: "Task 'Email notifications' failed audit twice. Review needed."
7. You read the terminal output, understand the problem
8. Fix the task, resume queue
9. Final task runs → project-architecture.md merged into architecture.md
```

### Flow 3: Architecture First

```
1. Chat: "design the architecture for a review system"
2. Select [architecture.md ☑] [force-summary ☑]
3. Discuss at scale — data model, API shape, component structure
4. Orchestrator proposes: run architect agent on the project
5. [Capture Task] → creates architect task
6. Run it → roadmap + technical design produced
7. Chat: "split this into tasks"
8. [Capture Task] → creates splitter task
9. Run it → phase folders + task files created + [project]-architecture.md stub
10. Board populates with all tasks
```

---

## Context Injection Model

What gets assembled before each orchestrator API call:

```
System Prompt:
  + Orchestrator persona + instructions
  + Workspace snapshot (tasks by stage, projects, providers)

User Context (selected in context panel):
  + Force summary (if checked)
  + Selected architecture files (concatenated)
  + Selected skill excerpts (from skills-index.json matches)

Conversation:
  + Full conversation history
```

The orchestrator never holds state between sessions. Everything is assembled fresh from the filesystem on each call. Swap the provider config → swap the model → same context.

---

## Provider Analytics Log Format

Stored at `.kanban2code/_logs/provider-analytics.json`:

```json
{
  "runs": [
    {
      "run_id": "run-20260221-143052",
      "task_id": "abc123",
      "task_title": "Build review backend",
      "provider": "sonnet",
      "stage": "code",
      "subtask_count": 6,
      "audit_returns": 1,
      "result": "accepted",
      "tokens_approx": 42000
    }
  ]
}
```

The UI (future) can surface this as a provider performance table. For now, the raw log is enough to query manually.

---

## What Gets Built, In Order

| Phase | Goal |
|-------|------|
| 0 | Bootstrap — extension activates, build pipeline works |
| 1 | Port core services — scanner, frontmatter, stage-manager, types, tests (from `/home/cynicus/code/kanban2code-v1/`) |
| 2 | Port runner — cli adapters, runner-engine, output-parser (from `/home/cynicus/code/kanban2code-v1/`) |
| 3 | Workspace snapshot — JSON of tasks, projects, providers, skills |
| 4 | Skill auto-selector — detect framework, score skills by keyword |
| 5 | Orchestrator service — direct API (Anthropic/OpenAI), streaming |
| 6 | Task file generator — parse orchestrator proposal → write .md |
| 7 | Terminal executor — open named terminal, paste command, show it |
| 8 | Messaging protocol — typed host↔webview messages, no legacy types |
| 9 | Chat UI — sidebar chat, context panel, capture task, streaming |
| 10 | Board UI — kanban board in main area, card run buttons |
| 11 | Extension entry point — clean activation, command palette, watcher |
| 12 | Orchestrator queue — pipeline manager, 2-strike rule, provider log |
| 13 | E2E hardening — all flows tested, error states handled |
| 14 | Dogfood — use kanban2code to build kanban2code features |

---

## What Success Looks Like

You open VS Code. The board shows your 8 tasks across 3 stages. You open the chat, check `force-summary` and `api-architecture`, and say "the review endpoint is returning stale data." The orchestrator knows your stack, asks one clarifying question, and proposes a task. You click Capture Task, click ▶▶ on the card, and watch the planner, coder, and auditor each open their own terminal, do their work, and hand off to the next. You see the coder heading somewhere wrong, type a correction in the terminal, it adjusts. The auditor rates it 9/10, the card moves to Completed, and `review-system-architecture.md` now says what schema was built. The next task starts already knowing.

You didn't explain the project once.
