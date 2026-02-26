# Architecture

Primary architecture reference: `docs/architecture.md`

## Accepted Task Updates

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
