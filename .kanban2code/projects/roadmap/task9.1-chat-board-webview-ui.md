---
stage: plan
tags: [feature, p1]
agent: planner
contexts: []
---

# Chat + Board Webview UI

## Goal
The sidebar chat, main board, and task editor surface all render from the same live workspace state. User can chat, capture tasks, edit task files, and run tasks directly from board cards.

## Definition of Done
- [ ] Extension Development Host shows chat + board together. Typing a message sends SendMessage. Streamed tokens appear in assistant bubbles. "Generate .md" creates a task and board updates immediately. Clicking a card title or edit control opens TaskEditorPanel, metadata/body edits save to .md, and board state refreshes from watcher events.

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
- [ ] tests/webview/chat.test.tsx
- [ ] tests/webview/task-proposal-card.test.tsx
- [ ] tests/webview/workspace-bar.test.tsx
- [ ] tests/webview/board-panel.test.tsx
- [ ] tests/webview/task-editor-panel.test.tsx
- [ ] tests/webview/task-card.test.tsx