---
stage: completed
agent: auditor
tags: [feature, p1]
contexts: []
---

# MiniMax Adapter + Provider Expansion

## Goal
MiniMax works as an execution provider. Kimi K2 confirmed working end-to-end.

## Definition of Done
- [ ] A task runs end-to-end via MiniMax in the terminal. Kimi K2 runs end-to-end via terminal. (Not verified in this environment)

## Files
- `src/runner/adapters/minimax-adapter.ts` - create
- `src/assets/providers.ts` - update (auto-generated via build.ts)
- `.kanban2code/_providers/minimax.md` - create
- `src/runner/adapter-factory.ts` - update
- `src/orchestrator/openai-client.ts` - update

## Refined Prompt

Objective: Add MiniMax as a supported CLI provider with Kimi K2 model support.

Implementation approach:
1. Create `.kanban2code/_providers/minimax.md` with Kimi K2 model configuration
2. Create `src/runner/adapters/minimax-adapter.ts` implementing CliAdapter interface
3. Update `src/runner/adapter-factory.ts` to register the minimax case
4. Update `src/orchestrator/openai-client.ts` to support MiniMax API endpoint (similar to OpenAI-compatible APIs)
5. Run `bun run build.ts` to regenerate `src/assets/providers.ts`

Key decisions:
- Adapter pattern: Follow KimiAdapter structure since Kimi K2 runs via MiniMax. Use flag-based prompt style with `-p` flag.
- Provider config: Set `cli: minimax`, `provider: minimax`, `prompt_style: flag` following existing conventions.
- API endpoint: MiniMax uses OpenAI-compatible API at `https://api.minimax.chat/v1/chat/completions` per standard MiniMax documentation.
- Model identifier: Use `kimi-k2-5` or similar Kimi K2 model identifier as specified by MiniMax.

Edge cases:
- MiniMax API may return different error formats than OpenAI; handle gracefully in openai-client.ts.
- Adapter should handle empty stdout and non-zero exit codes consistently with other adapters.
- If MiniMax CLI uses different flag conventions than kimi, the adapter needs adjustment.

## Context

### File Tree (scoped)
```
src/
├── runner/
│   ├── adapter-factory.ts           <- modify
│   ├── cli-adapter.ts               <- read-only reference
│   └── adapters/
│       ├── claude-adapter.ts        <- read-only reference
│       ├── codex-adapter.ts         <- read-only reference
│       ├── kilo-adapter.ts          <- read-only reference
│       ├── kimi-adapter.ts          <- read-only reference (pattern to follow)
│       └── minimax-adapter.ts       <- create
├── orchestrator/
│   └── openai-client.ts             <- modify
├── assets/
│   └── providers.ts                 <- auto-generated
└── types/
    └── provider.ts                  <- read-only reference

.kanban2code/
└── _providers/
    ├── kimi.md                      <- read-only reference
    └── minimax.md                   <- create
```

### Architecture Excerpts
From `src/runner/cli-adapter.ts`:
- CliAdapter interface requires `buildCommand()` and `parseResponse()` methods
- CliResponse includes: success, result, error?, sessionId?, cost?, turns?
- CliCommandResult includes: command, args, stdin?

From `src/types/provider.ts`:
- ProviderConfig fields: cli, model, subcommand?, unattended_flags[], output_flags[], prompt_style, safety?, provider?, config_overrides?
- PromptStyle: 'flag' | 'positional' | 'stdin'

### Skill Excerpts
No specific skill guidance needed beyond general conventions.

### Code Excerpts

`src/runner/cli-adapter.ts:46-76` - CliAdapter interface:
```typescript
export interface CliAdapter {
  buildCommand(
    config: ProviderConfig,
    prompt: string,
    options?: CliAdapterOptions,
  ): CliCommandResult;
  parseResponse(stdout: string, exitCode: number): CliResponse;
}
```

`src/runner/adapters/kimi-adapter.ts:15-48` - buildCommand pattern to follow:
```typescript
export class KimiAdapter implements CliAdapter {
  buildCommand(
    config: ProviderConfig,
    prompt: string,
    options?: CliAdapterOptions,
  ): CliCommandResult {
    const args: string[] = [];
    if (config.subcommand) args.push(config.subcommand);
    for (const flag of config.unattended_flags) args.push(flag);
    args.push('--model', config.model);
    args.push('-p', prompt);  // Flag-based prompt
    for (const flag of config.output_flags) args.push(flag);
    // ... safety options
    return { command: config.cli, args };
  }
```

`src/runner/adapter-factory.ts:1-23` - Factory to update:
```typescript
import { KimiAdapter } from './adapters/kimi-adapter';
// ... other imports

export function getAdapterForCli(cli: string): CliAdapter {
  switch (cli.toLowerCase()) {
    case 'claude': return new ClaudeAdapter();
    case 'codex': return new CodexAdapter();
    case 'kimi': return new KimiAdapter();
    case 'kilo': return new KiloAdapter();
    // Add: case 'minimax': return new MinimaxAdapter();
    default: throw new Error(`Unsupported CLI adapter: ${cli}`);
  }
}
```

`.kanban2code/_providers/kimi.md` - Provider config pattern:
```yaml
---
cli: kimi
model: kimi-k2-thinking-turbo
unattended_flags:
  - '--print'
output_flags:
  - '--quiet'
prompt_style: flag
provider: moonshot
---
```

`src/orchestrator/openai-client.ts:65-91` - Stream function to extend for MiniMax:
```typescript
export async function* streamOpenAIMessages(options: OpenAIStreamOptions): AsyncIterable<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${options.apiKey}`,
    },
    // ... body
  });
  // ... error handling and streaming
}
```

### Dependency Graph
Files importing from modified files:
- `src/runner/adapter-factory.ts` is imported by:
  - `src/runner/runner-engine.ts` (consumer - verify compatibility)
  - `tests/runner-engine.test.ts` (test mock)

- `src/orchestrator/openai-client.ts` is imported by:
  - `src/orchestrator/` (check for consumers)

### Patterns to Follow
1. Adapter naming: `{Provider}Adapter` class in `src/runner/adapters/{provider}-adapter.ts`
2. CLI flag style: Follow the pattern established by similar providers (kimi uses `-p` flag for prompts)
3. Error handling: Return structured CliResponse with success=false and error message on failures
4. Provider config: YAML frontmatter with all required fields; omit optional fields if not needed
5. Factory registration: Add case in switch statement matching cli name to lowercase

### Test Patterns
No adapter-specific tests exist currently. The runner-engine.test.ts mocks `getAdapterForCli` entirely. Manual testing via terminal execution is the primary validation method per the Definition of Done.

### Gotchas
- providers.ts is auto-generated: Do not edit directly; run `bun run build.ts` after adding provider markdown file
- MiniMax API uses OpenAI-compatible format but different base URL; may need base URL parameter in openai-client.ts
- Ensure adapter handles both JSON and plain text output gracefully (check kimi-adapter for simple parseResponse pattern)
- The openai-client.ts currently hardcodes OpenAI endpoint; MiniMax support requires either:
  a) Adding a new streamMiniMaxMessages function, or
  b) Making the base URL configurable in streamOpenAIMessages

### Scope Boundaries
This task focuses only on MiniMax provider support. No sibling tasks in this phase. Do not modify other adapters or provider configs.

## Audit
.kanban2code/_providers/minimax.md
src/runner/adapters/minimax-adapter.ts
src/runner/adapter-factory.ts
src/orchestrator/openai-client.ts
src/orchestrator/orchestrator.ts
src/assets/providers.ts
tests/minimax-adapter.test.ts
tests/orchestrator.test.ts

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
MiniMax provider support is integrated across provider config, CLI adapter resolution, and OpenAI-compatible orchestration routing. Unit coverage is strong for the added adapter and routing behavior, with one remaining validation gap for real terminal end-to-end execution in this environment.

### Findings

#### Blockers
- [ ] None.

#### High Priority
- [ ] None.

#### Medium Priority
- [ ] Definition-of-done runtime verification still pending: The required terminal end-to-end MiniMax/Kimi K2 execution is not verified in this audit environment. - `task11.1-minimax-adapter-provider-expansion.md:13`

#### Low Priority / Nits
- [ ] None.

### Test Assessment
- Coverage: Adequate
- Missing tests: No additional unit tests are required for this task scope; only environment-dependent terminal E2E verification remains.

### What's Good
- MiniMax adapter behavior, factory registration, provider bundling, and orchestrator endpoint routing are all covered by passing tests in `tests/minimax-adapter.test.ts` and `tests/orchestrator.test.ts`.

### Recommendations
- Run one manual terminal invocation with real MiniMax credentials to fully close the DoD verification note.
