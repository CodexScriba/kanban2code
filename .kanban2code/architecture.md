# Architecture

Primary architecture reference: `docs/architecture.md`

## Accepted Task Updates

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
