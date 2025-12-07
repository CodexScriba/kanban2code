---
stage: plan
title: Implement file watcher for task changes
tags:
  - mvp
  - filesystem
  - watcher
  - events
created: 2025-12-07T00:00:00Z
---

# Implement File Watcher for Task Changes

## Goal
Keep UI in sync with filesystem changes and enable real-time updates.

## Scope
- Implement FileSystemWatcher for `.kanban2code`:
  - Watch for file creation, modification, deletion
  - Watch for file moves and renames
- Debounce rapid changes (300ms) to avoid excessive updates:
  - Batch multiple rapid changes into single update
  - Reset debounce timer on each change
- Emit events for:
  - Task created (new .md file)
  - Task updated (existing .md file modified)
  - Task deleted ( .md file removed)
  - Task moved (file renamed between folders)
- Handle external edits:
  - User edits in VS Code editor
  - Git operations (checkout, merge, rebase)
- Integrate with task loading service to refresh data

## Notes
File watching is critical for responsive UI; must handle edge cases like rapid saves and external tool modifications.