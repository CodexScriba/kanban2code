---
stage: completed
agent: auditor
tags: [feature, p1]
contexts: []
---

# Orchestrator Service

## Goal
A stateless function that takes conversation + context -> calls configured provider API -> returns response. No CLI, no spawning. Direct HTTP.

## Definition of Done
- [x] `sendMessage()` with a mocked Anthropic client streams tokens correctly. System prompt contains workspace task list and skill summaries.

## Files
- `src/orchestrator/orchestrator.ts` - create - sendMessage(opts: OrchestratorCallOptions): AsyncIterable<string>
- `src/orchestrator/anthropic-client.ts` - create - Anthropic SDK wrapper, streaming
- `src/orchestrator/openai-client.ts` - create - OpenAI SDK wrapper, streaming
- `src/orchestrator/system-prompt-builder.ts` - create - buildOrchestratorSystemPrompt
- `src/types/orchestrator.ts` - create - OrchestratorCallOptions, ChatMessage

## Tests
- [x] tests/orchestrator.test.ts - unit test with mocked SDK responses

## Refined Prompt

Objective: Create a streaming orchestrator service that calls LLM APIs (Anthropic, OpenAI) directly via HTTP and yields tokens as they arrive.

Implementation approach:
1. Define `OrchestratorCallOptions` and `ChatMessage` types in `src/types/orchestrator.ts` with: messages array, provider config reference, optional system prompt, optional temperature/maxTokens
2. Define provider-specific client interfaces in orchestrator files - each client exposes `streamMessages(config, messages): AsyncIterable<string>`
3. Implement `anthropic-client.ts` using fetch with Anthropic's streaming API (text/event-stream format), yielding content_block_delta events
4. Implement `openai-client.ts` using fetch with OpenAI's streaming API (application/json stream), yielding choices[0].delta.content
5. Implement `system-prompt-builder.ts` that takes a workspace snapshot and builds a system prompt containing: task list summary, available skills summary, agent instructions if specified
6. Implement `orchestrator.ts` `sendMessage()` that: resolves provider config, selects appropriate client (anthropic vs openai based on provider.cli), streams tokens via AsyncIterable
7. Create unit tests mocking fetch responses to verify streaming behavior and correct system prompt assembly

Key decisions:
- Use native fetch (Node 18+) for HTTP - no additional dependencies beyond what's in package.json
- Streaming via AsyncIterable<string> lets consumers yield tokens as they arrive
- Provider detection based on `provider` field in config or CLI command name (claude/claude-cli = anthropic, openai/gpt = openai)
- System prompt includes workspace snapshot for context awareness per task requirements
- Error handling: yield `[ERROR: message]` format for API errors so caller can handle gracefully

Edge cases:
- API key missing or invalid: throw clear error at call time
- Stream interrupted mid-response: consumer handles by stopping iteration
- Empty response from API: yield nothing (empty AsyncIterable)
- Unknown provider: throw descriptive error listing supported providers
- Rate limiting: propagate HTTP 429 as error with retry-after hint if available

Questions: None

## Context

### File Tree (scoped)
```
src/
├── types/
│   ├── orchestrator.ts       # <- create - OrchestratorCallOptions, ChatMessage
│   ├── provider.ts           # <- read-only reference
│   ├── snapshot.ts           # <- read-only reference
│   └── skill.ts              # <- read-only reference
├── orchestrator/             # <- create (new directory)
│   ├── orchestrator.ts       # <- create - sendMessage(), main entry
│   ├── anthropic-client.ts   # <- create - Anthropic streaming client
│   ├── openai-client.ts      # <- create - OpenAI streaming client
│   └── system-prompt-builder.ts # <- create - builds system prompt from snapshot
└── tests/
    └── orchestrator.test.ts  # <- create - unit tests with mocked fetch
```

### Architecture Excerpts
Source: `src/types/provider.ts:1-36` - ProviderConfig type with CLI config fields:
```typescript
export const ProviderConfigSchema = z.object({
  cli: z.string(),
  model: z.string(),
  subcommand: z.string().optional(),
  unattended_flags: z.array(z.string()),
  output_flags: z.array(z.string()),
  prompt_style: PromptStyleSchema,
  safety: ProviderSafetySchema,
  provider: z.string().optional(),
  config_overrides: z.record(z.string(), z.unknown()).optional(),
});
export type ProviderConfig = z.infer<typeof ProviderConfigSchema>;
```

Source: `src/types/snapshot.ts:1-31` - WorkspaceSnapshot structure for context:
```typescript
export interface WorkspaceSnapshot {
  config: Kanban2CodeConfig;
  tasks: WorkspaceSnapshotTasks;  // stage-grouped tasks
  agents: Agent[];
  contexts: ContextFile[];
  skills: SkillFile[];
  providers: ProviderConfigFile[];
  metadata: WorkspaceSnapshotMetadata;
}
```

Source: `src/types/skill.ts:1-22` - SelectedSkill and skill index types:
```typescript
export interface SelectedSkill {
  id: string;
  name: string;
  path: string;
  content: string;
  priority?: SkillPriority;
  reason: string;
}
```

Source: `src/services/workspace-snapshot.ts:40-83` - buildWorkspaceSnapshot function:
```typescript
export async function buildWorkspaceSnapshot(kanbanRoot: string): Promise<WorkspaceSnapshot> {
  const [tasks, agents, contexts, skills, providers] = await Promise.all([
    loadAllTasks(kanbanRoot),
    listAvailableAgents(kanbanRoot),
    listAvailableContexts(kanbanRoot),
    listAvailableSkills(kanbanRoot),
    listAvailableProviders(kanbanRoot),
  ]);
  // ... returns WorkspaceSnapshot
}
```

Source: `src/services/skill-selector.ts:180-242` - selectSkills function signature:
```typescript
export async function selectSkills(
  kanbanRoot: string,
  conversationText: string,
  maxSkills = DEFAULT_MAX_SKILLS,
): Promise<SelectedSkill[]>
```

### Skill Excerpts
No specific skill guidance needed beyond general conventions.

### Code Excerpts

`src/types/task.ts:1-20` - Task type reference:
```typescript
export interface Task {
  id: string;
  filePath: string;
  title: string;
  stage: Stage;
  project?: string;
  phase?: string;
  agent?: string;
  provider?: string;
  content: string;
}
```

`src/services/prompt-builder.ts:135-162` - Prompt building patterns:
```typescript
export async function buildXMLPrompt(task: Task, root: string): Promise<string> {
  const contextSection = await buildContextSection(task, root);
  const taskSection = buildTaskSection(task);
  return `<system>${contextSection}${taskSection}</system>`;
}
```

`src/services/provider-service.ts` (implied) - Provider loading pattern:
```typescript
// Follow similar pattern to listAvailableProviders() for loading provider configs
// Provider files are in _providers/ folder with YAML frontmatter
```

### Dependency Graph

Files that will import orchestrator:
- `src/services/task-generator.ts` (task 6.1) - will call sendMessage() for task generation
- Future: Webview message handlers for chat interface

Files that orchestrator imports from:
- `src/types/provider.ts` - ProviderConfig type
- `src/types/snapshot.ts` - WorkspaceSnapshot type
- `src/types/skill.ts` - SelectedSkill type
- `src/services/workspace-snapshot.ts` - buildWorkspaceSnapshot()
- `src/services/skill-selector.ts` - selectSkills() (optional, for skill auto-selection)

### Patterns to Follow
- Use native fetch() for HTTP calls (Node 18+ built-in)
- Use AsyncIterable<string> for streaming responses
- Use Zod schemas for type validation where appropriate
- No barrel exports - import directly from source files
- Follow test pattern from `tests/skill-selector.test.ts`: temp dir, beforeEach/afterEach cleanup
- Use vitest for testing: `import { expect, test, describe, vi, beforeEach } from 'vitest'`
- Mock fetch in tests using vi.fn() global mock pattern

### Test Patterns
Mock fetch for streaming responses:
```typescript
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock streaming response
mockFetch.mockResolvedValue({
  ok: true,
  body: {
    [Symbol.asyncIterator]: async function* () {
      yield encoder.encode('data: {"type":"content_block_delta",...}\n\n');
    }
  }
});
```

Test structure:
```typescript
const TEST_DIR = path.join(os.tmpdir(), 'orchestrator-test-' + Date.now());

beforeEach(async () => {
  await fs.mkdir(TEST_DIR, { recursive: true });
  // Set up mock provider config, tasks, skills
});

afterEach(async () => {
  await fs.rm(TEST_DIR, { recursive: true, force: true });
});
```

### Gotchas
- Anthropic streaming uses text/event-stream format with `data: {...}` lines
- OpenAI streaming uses application/json with newline-delimited JSON
- API keys should be passed via config, never hardcoded
- AsyncIterable requires proper error handling in for-await loops
- Workspace snapshot can be large - consider truncating in system prompt if needed
- Provider config `cli` field might be "claude", "anthropic", "openai", etc. - normalize for detection

### Scope Boundaries

**This task (5.1) focuses on:**
- Direct HTTP API calls to LLM providers (Anthropic, OpenAI)
- Streaming responses via AsyncIterable
- System prompt building with workspace context
- Mock-based unit testing

**Out of scope (handled by other tasks):**
- Task 3.1 (completed): Workspace snapshot service - provides buildWorkspaceSnapshot()
- Task 4.1 (completed): Skill auto-selector - provides selectSkills() if needed
- Task 6.1 (pending): Task file generator - will consume sendMessage(), don't implement here
- Don't implement CLI adapters (task 4.x completed those) - this is API-only
- Don't implement UI/webview integration - that's task 9.1
- Don't implement actual API keys or credentials - use config injection

The orchestrator is a pure service that takes messages + config and streams tokens. Other tasks will handle workspace integration and UI.

## Audit
src/types/orchestrator.ts
src/orchestrator/system-prompt-builder.ts
src/orchestrator/anthropic-client.ts
src/orchestrator/openai-client.ts
src/orchestrator/orchestrator.ts
tests/orchestrator.test.ts

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
The implementation meets the defined goal and DoD: `sendMessage()` streams Anthropic tokens and includes workspace task/skill summaries in the system prompt. The code is clean and modular, with one important coverage gap around OpenAI-path streaming and a few resilience nits.

### Findings

#### Blockers
- [ ] None.

#### High Priority
- [ ] None.

#### Medium Priority
- [ ] Missing OpenAI-path test coverage: `sendMessage()` has an OpenAI branch and a dedicated parser, but no unit tests currently verify OpenAI stream parsing and token yield behavior - `tests/orchestrator.test.ts:111`

#### Low Priority / Nits
- [ ] Partial-line SSE handling could miss multi-line event payloads in some provider edge cases (current parser is line-oriented only) - `src/orchestrator/anthropic-client.ts:33`
- [ ] `maxTokens` is optional in OpenAI requests and can be omitted entirely; explicit undefined in payload is harmless but noisy in request construction - `src/orchestrator/openai-client.ts:76`

### Test Assessment
- Coverage: Adequate for current DoD
- Missing tests:
  - OpenAI stream success path tokenization
  - OpenAI API error path formatting via `sendMessage()`
  - Missing API key and unknown provider behavior assertions

### What's Good
- Clear separation of concerns: provider clients, prompt builder, and orchestrator routing are well-factored.
- Error normalization to `[ERROR: ...]` in orchestrator keeps consumer handling straightforward.
- Prompt builder includes task/skill context with sensible truncation controls.

### Recommendations
- Add 2-3 focused tests for OpenAI streaming and orchestrator error-handling edge cases to strengthen confidence before broader integration (task 6.1+).
