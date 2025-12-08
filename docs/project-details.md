# Kanban2Code Project Details

## Problem Statement
Solo devs and small teams juggle roadmap files, TODOs, and AI prompts scattered across docs. Kanban2Code keeps everything inside the repo as markdown, but adds just enough structure (stages, tags, contexts) so humans and AI agents can stay in sync without bespoke tooling.

## Who It’s For
- Solo developers working with multiple AI agents.
- Small teams that want git-native tasks instead of cloud boards.
- Folks who copy prompts into models daily and need reliable context packaging.

## Success Criteria
- **Git-native**: All tasks, contexts, and prompts are plain text in the workspace.
- **Low friction**: New task capture is faster than switching apps; common flows are keyboard-first.
- **Context you can trust**: Copy-with-context always includes the right layers (global, project, phase, stage, custom).
- **Predictable tags**: Taxonomy-backed filters make it easy to find “MVP bugs in UI” without ad-hoc conventions.
- **Safe edits**: Commands fail gracefully with clear errors and log details to the output channel.

## Current Scope (v1)
- Inbox/project/phase hierarchy with markdown tasks.
- Stage-aware board and sidebar with drag/drop and filters.
- Copy-with-context (task-only, context-only, full XML).
- Archive commands for tasks, completed-in-project, and whole projects.
- Keyboard shortcuts for board, sidebar focus, copy context, and marking implementation done.
- Taxonomy-backed tagging and filters.

## Out of Scope (Post-v1 Candidates)
- Time tracking and burndown views.
- Batch operations across projects.
- Task dependencies/blocked-by relationships.
- Import/export to other task systems.
- Opinionated agent presets and project templates beyond the basics.
