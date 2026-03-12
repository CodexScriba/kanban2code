---
stage: code
agent: coder
provider: sonnet
tags: [chat, provider, alibaba]
contexts: [architecture, ai-guide]
---

# Link Alibaba API to chat

## Goal

Wire the sidebar chat flow to the Alibaba provider so selecting `alibaba` in the UI sends real requests through the host instead of only returning a mock response.

## Definition of Done

- Selecting `alibaba` in the sidebar sends the chat request through a real Alibaba-backed host integration
- API key/config loading is documented and implemented in the expected settings source
- Success and error responses are surfaced clearly in the sidebar chat history
- The existing non-Alibaba providers continue to work as they do today
- Tests cover the Alibaba request path and missing-config behavior

## Notes

- The UI dropdown option already exists in `src/webview/ui/index.tsx`
- Current host behavior in `src/webview/SidebarProvider.ts` still returns a mock orchestrator response

## Refined Prompt
Objective: Wire the sidebar chat flow to the Alibaba API provider for real-time orchestrator responses.

Implementation approach:
1. Create `AlibabaService` in `src/services/alibaba-service.ts` to handle API communication.
2. Inject `AlibabaService` and `SettingsService` into `SidebarProvider`.
3. Update `SidebarProvider.handleWebviewMessage` to call `AlibabaService.sendMessage` when the provider is `alibaba`.
4. Ensure `AlibabaService` retrieves `endpoint` from `SettingsService` (stored under `providersAndModels.providers.alibaba`) and the `apiKey` from `process.env.ALIBABA_API_KEY` (loaded from the `.env` file).
5. Surface API errors (missing config, request failure) back to the sidebar chat via `OrchestratorResponse`.
6. Add comprehensive tests for the new service and integration in `src/services/alibaba-service.test.ts`.

Key decisions:
- `AlibabaService` will use the native `fetch` API (available in Node 20/VS Code 1.90+).
- The API key will be retrieved from environment variables for security, while other non-sensitive configuration will remain in `settings.json`.
- The chat context (selected task) should be passed to the Alibaba API to provide scoped responses if a task is selected.

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
