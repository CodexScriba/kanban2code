---
stage: code
agent: auditor
provider: codex
tags:
  - chat
  - provider
  - alibaba
contexts: []
skills: []
---

# Link Alibaba API to chat

## Goal

Wire the sidebar chat flow to the Alibaba provider so selecting `alibaba` in the UI sends real requests through the host instead of only returning a mock response.

## Definition of Done

- [x] Selecting `alibaba` in the sidebar sends the chat request through a real Alibaba-backed host integration
- [x] API key/config loading is documented and implemented in the expected settings source
- [x] Success and error responses are surfaced clearly in the sidebar chat history
- [x] The existing non-Alibaba providers continue to work as they do today
- [x] Tests cover the Alibaba request path and missing-config behavior

## Notes

- The UI dropdown option already exists in `src/webview/ui/index.tsx`
- Current host behavior in `src/webview/SidebarProvider.ts` still returns a mock orchestrator response

## Refined Prompt
Objective: Wire the sidebar chat flow to the Alibaba API provider for real-time orchestrator responses using the Alibaba Coding Plan subscription.

Implementation approach:
1. **Stage 0: Smoke Test**: Create `src/services/smoke_test_alibaba.ts` to verify the `ALIBABA_API_KEY` from `.env` works with the DashScope endpoint (`https://coding-intl.dashscope.aliyuncs.com/v1`).
2. Create `AlibabaService` in `src/services/alibaba-service.ts` to handle API communication.
3. Inject `AlibabaService` and `SettingsService` into `SidebarProvider`.
4. Update `SidebarProvider.handleWebviewMessage` to call `AlibabaService.sendMessage` when the provider is `alibaba`.
5. Ensure `AlibabaService` retrieves `endpoint` (e.g., `https://coding-intl.dashscope.aliyuncs.com/v1`) from `SettingsService` and the `apiKey` from `process.env.ALIBABA_API_KEY`.
6. Surface API errors (missing config, request failure) back to the sidebar chat via `OrchestratorResponse`.
7. Add comprehensive tests in `src/services/alibaba-service.test.ts`.

Key decisions:
- **API Protocol**: Use the OpenAI-compatible endpoint (`/v1/chat/completions`) for simplicity, as it supports a wide range of coding models like `qwen2.5-coder-32b-instruct`.
- **Security**: The API key must be retrieved from `process.env.ALIBABA_API_KEY`. Do not store it in `settings.json`.
- **Interactive Check**: Ensure the service identifies as an interactive tool to comply with Alibaba's terms for Coding Plans.

Findings:
- **Endpoint**: `https://coding-intl.dashscope.aliyuncs.com/v1` (OpenAI-compatible).
- **Restrictions**: The Coding Plan is strictly for **interactive** use in IDEs/CLIs. Automated or headless use may result in account suspension.
- **Models**: Supports `qwen-plus`, `qwen-max`, and specialized `coder` variants.

Edge cases:
- Missing API key or endpoint in settings.
- Network timeouts or API request failure.
- Large chat history or task bodies exceeding token limits.
- Selected task being deleted or moved while a request is in flight.

## Context

### File Tree (scoped)
```
src/
├── extension.ts                      # registers SidebarProvider
├── services/
│   ├── alibaba-service.ts            # <- create
│   ├── settings-service.ts           # <- read-only reference
│   ├── task-scanner.ts               # <- read-only reference
│   └── task-service.ts               # <- read-only reference
├── types/
│   ├── settings.ts                   # <- read-only reference
│   └── task.ts                       # <- read-only reference
└── webview/
    ├── SidebarProvider.ts            # <- modify
    ├── messaging.ts                  # <- read-only reference
    └── ui/
        └── index.tsx                 # <- read-only reference
```

### Architecture Excerpts
- "Sidebar: chat interface for planning, guidance, and task actions" (from `architecture.md`)
- "Extension host registers a WebviewViewProvider that serves a bundled React-ready webview" (from `architecture.md`)
- "The current sidebar shell includes a compact chat layout... and a provider selector that now includes alibaba." (from `architecture.md`)

### Skill Excerpts
No specific skill guidance needed beyond general conventions.

### Code Excerpts
`src/webview/SidebarProvider.ts:117-133`: Current mock response logic.
```typescript
    const scopeLabel = selectedTask
      ? `${selectedTask.stage} • ${selectedTask.title}`
      : 'general chat';
    const responseMessage: OrchestratorResponseMessage = {
      type: 'OrchestratorResponse',
      payload: {
        message: `Context received (${scopeLabel}) via provider ${rawMessage.payload.provider}.`
      }
    };
    void this.webviewView.webview.postMessage(responseMessage);
```

`src/types/settings.ts:8-13`: Provider configuration type.
```typescript
export interface ProviderConfig {
  enabled: boolean;
  models: string[];
  endpoint?: string;
  apiKey?: string;
}
```

### Dependency Graph
- `SidebarProvider.ts` imports from `src/services/task-scanner.ts`, `src/services/queue-service.ts`, `src/types/task.ts`, `src/webview/messaging.ts`.
- `SidebarProvider.ts` will now import from `src/services/alibaba-service.ts` and `src/services/settings-service.ts`.

### Patterns to Follow
- Dependency injection for services.
- Asynchronous message handling in `SidebarProvider`.
- Typed messaging between host and webview.
- Use `node --test` for service tests.

### Gotchas
- Ensure the API key is NEVER logged or committed.
- Handle potential `undefined` states for `selectedTaskId`.

### Scope Boundaries
This task is focused on the Alibaba API integration for the chat. It should not modify the Kanban board logic or other providers like `claude` or `kimi` unless necessary for the general chat flow.

## Audit

.kanban2code/how-it-works.md
src/extension.ts
src/services/alibaba-service.ts
src/services/alibaba-service.test.ts
src/services/sidebar-chat-router.ts
src/services/sidebar-chat-router.test.ts
src/services/settings-service.ts
src/services/smoke_test_alibaba.ts
src/webview/SidebarProvider.ts

---

## Review

**Rating: 7/10**

**Verdict: NEEDS WORK**

### Summary
The Alibaba chat path is wired into the host cleanly and the new service tests pass, but the integration is still configured around stale default model names for the Coding Plan OpenAI-compatible endpoint. In its current form, a default setup is likely to fail until the user manually overrides the Alibaba model settings.

### Findings

#### Blockers
- [ ] Stale Coding Plan model defaults: the fallback/default Alibaba models are `qwen-plus`, `qwen-max`, and `qwen2.5-coder-32b-instruct`, but the current Coding Plan OpenAI-compatible docs use newer `qwen3-*` models for this endpoint. That means the new "real request" path can fail out of the box even when the endpoint and `ALIBABA_API_KEY` are configured correctly. - `src/services/alibaba-service.ts:38`, `src/services/alibaba-service.ts:172`, `src/services/settings-service.ts:73`, `src/services/alibaba-service.test.ts:52`

#### High Priority
- [ ] Setup is only partially documented: the repo now implements `.env` loading and endpoint defaults, but there is no durable project documentation that tells a teammate where to set `ALIBABA_API_KEY` or how to override the Alibaba endpoint/model outside of runtime error text and the smoke test script. - `src/services/smoke_test_alibaba.ts:20`

#### Medium Priority
- [ ] None.

#### Low Priority / Nits
- [ ] None.

### Test Assessment
- Coverage: Needs improvement
- Missing tests: verification against current Coding Plan-compatible model defaults; a `SidebarProvider` routing test that asserts `provider === 'alibaba'` calls `AlibabaService` and returns service errors to chat history

### What&apos;s Good
- The host now makes a real Alibaba-backed request, preserves the existing mock behavior for non-Alibaba providers, and returns configuration/request failures back to the sidebar chat instead of silently swallowing them.

### Recommendations
- Update the default Alibaba model list and fallback model to the current Coding Plan-compatible values, add a short setup note for `ALIBABA_API_KEY` plus endpoint/model overrides, and add one host-level routing test around the sidebar message flow.

alibaba api key requieres some research, I'd like to access the GLM-5 through my coding plan, remove all other llm providers from the extension since they're not configured either please. and make sure through a smoke test athat the api is wokring correctly 
