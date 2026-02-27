# Architecture

Primary architecture reference: `docs/architecture.md`

## Accepted Task Updates

- date: 2026-02-27
  - task: `task10.1-extension-entry-point-command-registration`
  - files-updated:
    - `src/extension.ts` (minimal activation flow now discovers Kanban root, registers sidebar provider, and wires command dependencies/state hooks)
    - `src/commands/index.ts` (registers `createWorkspace`, `runTask`, `newTask`, and `openSettings` commands with workspace/kanban edge-case handling)
    - `package.json` (contributes the four command palette commands and activation events)
    - `src/webview/messaging.ts` (includes `FocusChatInput` protocol envelope/payload support used by command-triggered chat focus)
    - `tests/webview/messaging.test.ts` (covers protocol round-trip/validation including `FocusChatInput`)
    - `tests/commands.test.ts` (covers four-command registration plus create/run/new/settings command behavior)
    - `.kanban2code/projects/roadmap/task10.1-extension-entry-point-command-registration.md` (auditor review and stage transition)
  - new-files-created: none
  - notes:
    - Extension entry point is now command-first and delegates command behavior to `src/commands/index.ts` to keep activation logic small and maintainable.
    - Sidebar refresh behavior remains event-driven through `TaskWatcher` inside `SidebarProvider`, preserving `WorkspaceUpdated` broadcasts.

- date: 2026-02-27
  - task: `task9.1-chat-board-webview-ui`
  - files-updated:
    - `src/webview/SidebarProvider.ts` (host-side webview message orchestration for chat, generate, save, run, and workspace refresh broadcasting)
    - `src/webview/ui/App.tsx` (split-shell chat + board composition, envelope handling, and task editor lifecycle wiring)
    - `src/webview/ui/main.tsx` (mounts unified App with VS Code API singleton)
    - `tests/webview/chat.test.tsx` (adds proposal-parse failure feedback assertion)
    - `tests/webview/task-editor-panel.test.tsx` (adds dirty-close confirmation coverage)
  - new-files-created:
    - `src/webview/run-task.ts`
    - `src/webview/ui/components/Chat.tsx`
    - `src/webview/ui/components/ChatMessage.tsx`
    - `src/webview/ui/components/TaskProposalCard.tsx`
    - `src/webview/ui/components/WorkspaceBar.tsx`
    - `src/webview/ui/components/ChatInput.tsx`
    - `src/webview/ui/components/BoardPanel.tsx`
    - `src/webview/ui/components/BoardToolbar.tsx`
    - `src/webview/ui/components/Column.tsx`
    - `src/webview/ui/components/TaskCard.tsx`
    - `src/webview/ui/components/TaskEditorPanel.tsx`
    - `src/webview/ui/components/EmptyState.tsx`
    - `src/webview/ui/components/Icons.tsx`
    - `src/webview/ui/hooks/useChat.ts`
    - `src/webview/ui/hooks/useTaskEditor.ts`
    - `tests/webview/app.test.ts`
    - `tests/webview/run-task.test.ts`
  - notes:
    - Added the unified V2 sidebar UX: live chat stream, task proposal generation, always-visible kanban board, and inline task editor backed by shared workspace snapshot state.
    - Added explicit run-mode branching (`current stage` vs `all remaining stages`) through `RunTask` payload handling and test coverage.
    - Established UI-side validation/error surfacing for invalid message envelopes and unparseable task proposals.

- date: 2026-02-26
  - task: `task13.4-fix-build-node-builtin-bundling`
  - files-updated:
    - `src/services/context.ts` (moved `Agent`/`ContextFile`/`SkillFile` definitions to shared types and re-exported for compatibility)
    - `src/services/provider-service.ts` (moved `ProviderConfigFile` definition to shared types and re-exported for compatibility)
    - `src/types/snapshot.ts` (now imports workspace entity types from `src/types/workspace-entities.ts`)
    - `src/webview/messaging.ts` (now imports workspace entity types from `src/types/workspace-entities.ts`)
    - `src/webview/ui/App.tsx` (now imports `ProviderConfigFile` from shared types)
    - `src/webview/ui/components/Chat.tsx` (now imports `ProviderConfigFile` from shared types)
    - `src/webview/ui/components/ChatInput.tsx` (now imports `ProviderConfigFile` from shared types)
  - new-files-created:
    - `src/types/workspace-entities.ts`
  - notes:
    - Removed webview type dependency on Node-bound service modules to prevent Node builtin module leakage into browser bundle graphs.

- date: 2026-02-26
  - task: `task13.2-restore-validation-scripts`
  - files-updated:
    - `package.json` (restored/confirmed `test:e2e` and `typecheck` script contracts)
  - new-files-created: none
  - notes:
    - Validation workflow commands execute as documented (`bun run test:e2e`, `bun run typecheck`).

- date: 2026-02-26
  - task: `task12.1-e2e-integration-and-hardening`
  - new-files-created:
    - `src/shared/task-proposal-parser.ts`
    - `tests/e2e/chat-flow.test.ts`
    - `tests/e2e/terminal-executor.test.ts`
    - `tests/integration/skill-selector.test.ts`
    - `tests/integration/workspace-snapshot.test.ts`
  - notes:
    - Added full E2E/integration hardening coverage across chat lifecycle, terminal execution seams, skill selection robustness, and workspace snapshot fault handling.
