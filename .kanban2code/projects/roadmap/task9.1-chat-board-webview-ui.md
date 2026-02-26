---
stage: code
agent: coder
tags: [feature, p1]
contexts: [react-core-skills]
---

# Chat + Board Webview UI

## Goal
The sidebar chat, main board, and task editor surface all render from the same live workspace state. User can chat, capture tasks, edit task files, and run tasks directly from board cards.

## Definition of Done
- [x] Extension Development Host shows chat + board together. Typing a message sends SendMessage. Streamed tokens appear in assistant bubbles. "Generate .md" creates a task and board updates immediately. Clicking a card title or edit control opens TaskEditorPanel, metadata/body edits save to .md, and board state refreshes from watcher events.

## Files
- `src/webview/SidebarProvider.ts` - create - rewrite
- `src/webview/ui/App.tsx` - create - rewrite
- `src/webview/ui/components/Chat.tsx` - create
- `src/webview/ui/components/ChatMessage.tsx` - create
- `src/webview/ui/components/TaskProposalCard.tsx` - create
- `src/webview/ui/components/WorkspaceBar.tsx` - create
- `src/webview/ui/components/ChatInput.tsx` - create
- `src/webview/ui/components/BoardPanel.tsx` - create
- `src/webview/ui/components/BoardToolbar.tsx` - create
- `src/webview/ui/components/Column.tsx` - create
- `src/webview/ui/components/TaskCard.tsx` - create
- `src/webview/ui/components/TaskEditorPanel.tsx` - create
- `src/webview/ui/hooks/useTaskEditor.ts` - create
- `src/webview/ui/components/EmptyState.tsx` - create - port
- `src/webview/ui/hooks/useChat.ts` - create
- `src/webview/ui/components/Icons.tsx` - create - port

## Tests
- [x] tests/webview/chat.test.tsx
- [x] tests/webview/task-proposal-card.test.tsx
- [x] tests/webview/workspace-bar.test.tsx
- [x] tests/webview/board-panel.test.tsx
- [x] tests/webview/task-editor-panel.test.tsx
- [x] tests/webview/task-card.test.tsx

## Refined Prompt

Objective: Build a unified chat + board webview UI with sidebar chat, kanban board panel, and task editor, all rendering from shared workspace state via the V2 messaging protocol.

Implementation approach:
1. Port EmptyState.tsx and Icons.tsx from v1 with minimal updates (keep component signatures)
2. Create Icons.tsx with all icons needed for V2 UI (from v1 Icons.tsx, keep useful ones, add new as needed)
3. Create useChat.ts hook managing chat state: messages array, streaming state, send/cancel handlers
4. Create Chat.tsx component with conversation thread, ChatMessage.tsx for user/assistant bubbles
5. Create TaskProposalCard.tsx for displaying task proposals with "Generate .md" button
6. Create WorkspaceBar.tsx showing stage counts from workspace snapshot
7. Create ChatInput.tsx with auto-resizing textarea, provider selector dropdown
8. Create BoardPanel.tsx, Column.tsx, TaskCard.tsx with run buttons (▶, ▶▶) and edit handlers
9. Create TaskEditorPanel.tsx with metadata form, tabs for body/frontmatter, save/run controls
10. Create useTaskEditor.ts hook for editor local state (draft metadata, dirty state, save actions)
11. Create SidebarProvider.ts handling RequestState → InitState, orchestrator streaming, GenerateTask, RunTask, task-watcher events
12. Rewrite App.tsx as split-shell UI (chat sidebar + board panel) receiving InitState, rendering both surfaces
13. Update main.tsx to import App and pass vscode API
14. Create test files for each component verifying rendering and interaction

Key decisions:
- Port EmptyState.tsx from v1 as-is (same props interface: onCreateKanban callback)
- Port Icons.tsx from v1, keeping all existing icons, add new ones if needed for V2
- Message handling via src/webview/messaging.ts (already completed in task 8.1)
- SidebarProvider is the host-side message handler (not the UI component)
- Single vscodeApi.ts singleton already exists, no changes needed
- Board renders from WorkspaceSnapshot.tasks (inbox, plan, code, audit, completed arrays)
- TaskCard run buttons call terminal-executor.ts via RunTask message
- Streaming tokens append to last assistant message in Chat.tsx
- TaskEditorPanel opens as overlay/modal within the webview (not separate VS Code panel)

Edge cases:
- Empty workspace snapshot: render EmptyState component
- No active provider: disable chat input, show "Configure provider" prompt
- Streaming in progress: show cancel button, disable send
- Task proposal parsing fails: show error in chat bubble
- Task file already exists during generate: append number suffix (handled by task-generator.ts)
- Rapid file changes: task-watcher debounce prevents snapshot rebuild storm
- Message validation fails: log to console, don't crash UI
- Provider selector change mid-stream: applies to next message only
- Task editor dirty state: warn before closing if unsaved changes

## Context

### File Tree (scoped)
```
src/
├── webview/
│   ├── messaging.ts              # <- read-only reference - V2 protocol
│   ├── SidebarProvider.ts        # <- create - host message handler
│   └── ui/
│       ├── main.tsx              # <- modify - mount App
│       ├── vscodeApi.ts          # <- read-only reference - singleton
│       ├── App.tsx               # <- create - split-shell UI
│       ├── components/
│       │   ├── Chat.tsx          # <- create
│       │   ├── ChatMessage.tsx   # <- create
│       │   ├── TaskProposalCard.tsx  # <- create
│       │   ├── WorkspaceBar.tsx  # <- create
│       │   ├── ChatInput.tsx     # <- create
│       │   ├── BoardPanel.tsx    # <- create
│       │   ├── BoardToolbar.tsx  # <- create
│       │   ├── Column.tsx        # <- create
│       │   ├── TaskCard.tsx      # <- create
│       │   ├── TaskEditorPanel.tsx   # <- create
│       │   ├── EmptyState.tsx    # <- create - port from v1
│       │   └── Icons.tsx         # <- create - port from v1
│       └── hooks/
│           ├── useChat.ts        # <- create
│           └── useTaskEditor.ts  # <- create
├── types/
│   ├── task.ts                   # <- read-only reference - Task, Stage
│   ├── task-proposal.ts          # <- read-only reference - TaskProposal
│   ├── snapshot.ts               # <- read-only reference - WorkspaceSnapshot
│   └── orchestrator.ts           # <- read-only reference - ChatMessage
├── services/
│   ├── terminal-executor.ts      # <- read-only reference - executeTaskInTerminal
│   ├── task-generator.ts         # <- read-only reference - generateTaskFile
│   └── task-watcher.ts           # <- read-only reference - TaskWatcher events
└── tests/
    └── webview/
        ├── chat.test.tsx         # <- create
        ├── task-proposal-card.test.tsx   # <- create
        ├── workspace-bar.test.tsx        # <- create
        ├── board-panel.test.tsx          # <- create
        ├── task-editor-panel.test.tsx    # <- create
        └── task-card.test.tsx            # <- create
```

### Architecture Excerpts
Source: `kanban2codev2.md:509-571` - Phase 9 Chat + Board Webview UI spec:
```
Component breakdown:
SidebarProvider.ts (host)
  └── App.tsx
        ├── Chat.tsx              ← conversation + context controls
        │     ├── WorkspaceBar.tsx       ← stage counts
        │     ├── ChatHistory.tsx        ← scrollable message list
        │     │     └── ChatMessage.tsx  ← user/assistant bubbles + proposal parsing
        │     │           └── TaskProposalCard.tsx
        │     └── ChatInput.tsx          ← textarea + send + provider selector
        ├── BoardPanel.tsx        ← always-visible kanban board
        │     ├── BoardToolbar.tsx
        │     ├── Column.tsx
        │     └── TaskCard.tsx    ← title, tags, run buttons, open editor
        ├── TaskEditorPanel.tsx   ← task editing shell
        │     ├── metadata form   ← title, location, stage, agent, provider, tags
        │     ├── context/skills picks   ← toggle selected context files + skills
        │     ├── editor tabs     ← task body, frontmatter, run notes
        │     └── execution rail  ← pipeline state + provider analytics + terminals
        └── EmptyState.tsx        ← when no kanban workspace found

Host → Webview messages:
- InitState — kanban root exists, workspace snapshot, active orchestrator provider
- StreamChunk — token from orchestrator streaming response
- MessageComplete — orchestrator response finished
- TaskGenerated — task file was written, path + title
- WorkspaceUpdated — filesystem changed, new snapshot
- Error — something failed, message

Webview → Host messages:
- RequestState — webview mounted, send InitState (handshake from v1)
- SendMessage — user sent chat message, text
- GenerateTask — user clicked "Generate .md", confirmed proposal
- RunTask — user clicked "Run", task file path
- CancelStream — user cancelled in-progress orchestrator response
```

Source: `kanban2codev2.md:1037-1067` - Board UI Card Design:
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

▶ — run current stage, advance one step
▶▶ — run all remaining stages to completed
Click card title → opens task editor
```

Source: `kanban2codev2.md:1068-1076` - Task Editor UI:
```
Opens from card title click or edit action.
Includes metadata editing for title, location, stage, priority, agent, provider, tags, contexts, skills.
Includes tabbed editing surface for task body markdown, frontmatter, and run notes.
Includes stage execution controls matching board language.
Save action writes frontmatter + markdown body and triggers watcher-driven board refresh.
```

### Skill Excerpts
Source: `_context/skills/react-core-skills.md` - React Patterns:
- Use functional components with hooks
- Keep components focused (single responsibility)
- Use TypeScript interfaces for props
- Prefer controlled inputs for forms
- Use React.Context for shared state when props drilling exceeds 2 levels

No other specific skill guidance needed beyond general React/TypeScript conventions.

### Code Excerpts
`src/webview/messaging.ts:229-248` - createEnvelope/validateEnvelope:
```typescript
export function createEnvelope<TType extends MessageType>(
  type: TType,
  payload: MessagePayloadMap[TType],
): MessageEnvelope<TType> {
  return { version: MESSAGE_VERSION, type, payload };
}

export function validateEnvelope<TType extends MessageType = MessageType>(
  data: unknown,
): MessageEnvelope<TType> {
  const result = EnvelopeSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid message envelope: ${result.error.message}`);
  }
  return result.data as MessageEnvelope<TType>;
}
```
Why: SidebarProvider uses createEnvelope to send messages to webview; UI uses validateEnvelope for incoming.

`src/types/orchestrator.ts:5-10` - ChatMessage type:
```typescript
export type ChatMessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}
```
Why: useChat.ts and ChatMessage.tsx use this type for message rendering.

`src/types/task.ts:1-20` - Task type:
```typescript
export type Stage = 'inbox' | 'plan' | 'code' | 'audit' | 'completed';

export interface Task {
  id: string;
  filePath: string;
  title: string;
  stage: Stage;
  project?: string;
  phase?: string;
  agent?: string;
  provider?: string;
  parent?: string;
  tags?: string[];
  contexts?: string[];
  skills?: string[];
  order?: number;
  created?: string;
  attempts?: number;
  content: string;
}
```
Why: TaskCard.tsx receives Task objects; TaskEditorPanel.tsx edits Task fields.

`src/types/snapshot.ts:6-31` - WorkspaceSnapshot:
```typescript
export interface WorkspaceSnapshotTasks {
  inbox: Task[];
  plan: Task[];
  code: Task[];
  audit: Task[];
  completed: Task[];
}

export interface WorkspaceSnapshot {
  config: Kanban2CodeConfig;
  tasks: WorkspaceSnapshotTasks;
  agents: Agent[];
  contexts: ContextFile[];
  skills: SkillFile[];
  providers: ProviderConfigFile[];
  metadata: WorkspaceSnapshotMetadata;
}
```
Why: App.tsx receives this via InitState; BoardPanel.tsx renders columns from tasks object.

`src/services/terminal-executor.ts:32-40` - executeTaskInTerminal signature:
```typescript
export async function executeTaskInTerminal(
  kanbanRoot: string,
  taskId: string,
  workspaceRoot: string,
): Promise<void>
```
Why: SidebarProvider calls this when receiving RunTask message; needs kanbanRoot from workspace state.

### Dependency Graph
Files importing from messaging.ts:
- `src/webview/SidebarProvider.ts` (this task) - sends/receives all message types
- `src/webview/ui/App.tsx` (this task) - receives InitState, WorkspaceUpdated
- `src/webview/ui/hooks/useChat.ts` (this task) - sends SendMessage, CancelStream
- `src/webview/ui/components/TaskProposalCard.tsx` (this task) - sends GenerateTask
- `src/webview/ui/components/TaskCard.tsx` (this task) - sends RunTask

Files SidebarProvider.ts imports from:
- `src/webview/messaging.ts` - all message types and envelope functions
- `src/types/snapshot.ts` - WorkspaceSnapshot
- `src/services/workspace-snapshot.ts` - buildWorkspaceSnapshot (for refreshes)
- `src/services/terminal-executor.ts` - executeTaskInTerminal
- `src/services/task-generator.ts` - generateTaskFile
- `src/services/task-watcher.ts` - TaskWatcher events
- `src/orchestrator/orchestrator.ts` - sendMessage (streaming)

### Patterns to Follow
- React functional components with explicit return types
- Props interfaces named {ComponentName}Props
- Hooks co-located with components that use them
- Message sending via vscode.postMessage({ type, payload }) envelope
- Incoming messages validated with validateEnvelope before handling
- Zod schema validation for all payloads (from messaging.ts)
- VS Code CSS variables for theming (--vscode-*)
- Stage colors: inbox=neutral, plan=blue, code=amber, audit=purple, completed=green
- Icons from Icons.tsx (ported from v1)

## Audit
src/webview/messaging.ts
src/webview/ui/hooks/useChat.ts
src/webview/ui/App.tsx
src/webview/SidebarProvider.ts
tests/webview/messaging.test.ts

### Test Patterns
Source: `tests/webview/messaging.test.ts` - vitest pattern:
```typescript
import { describe, expect, test } from 'vitest';
import { createEnvelope, validateEnvelope } from '../../src/webview/messaging';

describe('component', () => {
  test('renders with snapshot', () => {
    // Render component with test data
    // Assert DOM structure
  });
});
```

Component test patterns from vitest + react:
- Use `render` from testing-library/react
- Mock vscode API: `global.acquireVsCodeApi = () => ({ postMessage: vi.fn() })`
- Test user interactions with `fireEvent` or `userEvent`
- Assert message sent via mocked postMessage

Test coverage needed:
- Chat.tsx: renders messages, streaming state shows indicator
- TaskProposalCard.tsx: click Generate sends correct message
- WorkspaceBar.tsx: displays correct counts from snapshot
- BoardPanel.tsx: renders columns for each stage
- TaskCard.tsx: click title opens editor, click run sends RunTask
- TaskEditorPanel.tsx: save sends message with updated metadata

### Gotchas
- acquireVsCodeApi can only be called once - use existing vscodeApi.ts singleton

---

## Review

**Rating: 7/10**

**Verdict: NEEDS WORK**

### Summary
Core chat+board rendering and message flow are in place, but a few behavior gaps conflict with the task prompt/edge-case expectations and should be fixed before acceptance.

### Findings

#### Blockers
- [ ] `RunTask` fast-forward behavior is not implemented: the `allRemaining` flag is ignored, so `▶` and `▶▶` currently do the same thing - `src/webview/SidebarProvider.ts:96`

#### High Priority
- [ ] Unsaved-change protection is bypassed via `Cancel`: dirty-state confirmation exists on `Close`, but `Cancel` closes immediately and can drop edits - `src/webview/ui/components/TaskEditorPanel.tsx:100`

#### Medium Priority
- [ ] Task proposal parse failures are silently ignored rather than surfaced in-chat as specified in edge cases - `src/webview/ui/components/ChatMessage.tsx:12`
- [ ] Invalid incoming message envelopes are swallowed without logging, but edge-case guidance calls for logging validation failures - `src/webview/ui/App.tsx:78`

#### Low Priority / Nits
- [ ] Frontmatter preview uses original task metadata rather than draft edits, so preview can be stale while editing - `src/webview/ui/components/TaskEditorPanel.tsx:16`

### Test Assessment
- Coverage: Needs improvement
- Missing tests:
  - Distinct behavior for `RunTask` with `allRemaining: true` vs `false`
  - Dirty-close behavior for both `Close` and `Cancel` paths in `TaskEditorPanel`
  - Parse-failure/error surfacing path in `ChatMessage`
  - Message-validation failure logging path in `App`

### What's Good
- V2 envelope validation and typed payloads are well-defined and covered; core webview tests pass (`bun run test tests/webview`, 7 files / 17 tests).

### Recommendations
- Implement `allRemaining` handling end-to-end in the host execution path and add interaction tests that assert different effects for `▶` and `▶▶`.
