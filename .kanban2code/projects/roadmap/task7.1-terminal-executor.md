---
stage: plan
tags: [feature, p1]
agent: planner
contexts: []
---

# Terminal Executor

## Goal
One command opens a VS Code terminal, pastes the correct CLI invocation for a given task, and stays visible so the user watches and intervenes.

## Definition of Done
- [ ] Triggering executeTaskInTerminal() in Extension Development Host opens a named terminal with the correct claude --prompt "..." command pasted in.

## Files
- `src/services/terminal-executor.ts` - create - executeTaskInTerminal

## Tests
- [ ] tests/terminal-executor.test.ts - mock vscode.window.createTerminal, verify sendText called with correct command