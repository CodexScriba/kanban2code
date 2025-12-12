# Kanban2Code

A VS Code extension for AI-assisted task management using a file-based kanban system.

## Installation

```bash
bun install
bun run compile
```

Press F5 in VS Code to launch the extension in development mode.

## Features

### Sidebar

The Kanban2Code sidebar provides quick access to your tasks:

- **Task Tree**: View tasks organized by Inbox and Project/Phase hierarchy
- **Quick Views**: Preset filters for Today's Focus, Development, Bugs, and Ideas
- **Stage Filters**: Toggle visibility by stage (Inbox, Plan, Code, Audit)
- **Project/Tag Filters**: Filter tasks by project or tags
- **Task Creation**: Create new tasks via modal with location, stage, tags, and template selection
- **Context Menu**: Right-click tasks for copy, stage change, move, archive, or delete actions
- **Move Modal**: Relocate tasks between Inbox and Project/Phase locations

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate between tasks |
| `←` / `→` | Collapse / Expand tree nodes |
| `Enter` | Open focused task |
| `Space` | Toggle expand/collapse |
| `n` | New task (quick) |
| `Shift+N` | New task (modal) |
| `f` | Focus filter bar |
| `?` | Show keyboard shortcuts |
| `Shift+F10` | Open context menu |
| `Escape` | Close modal/menu |

### Task Stages

Tasks move through these stages:
1. **Inbox** - New/unplanned tasks
2. **Plan** - Tasks being planned
3. **Code** - Active development
4. **Audit** - Code review/testing
5. **Completed** - Done (can be archived)

### Context Menu Actions

Right-click a task to:
- Copy XML (Full Context) - Copy task with all context for AI
- Copy Task Only - Copy just the task content
- Copy Context Only - Copy related context files
- Change Stage - Move to a different stage
- Move to Project/Phase - Relocate the task file
- Archive - Move completed tasks to archive
- Delete - Remove the task

## Development

```bash
bun run compile    # Build extension + webview
bun run watch      # Watch mode
bun run tsc:check  # Type checking
```

## Project Structure

```
.kanban2code/
├── inbox/              # Inbox tasks
├── projects/           # Project folders with phases
├── _agents/            # AI agent configurations
├── _templates/
│   ├── tasks/          # Task templates
│   └── stages/         # Stage-specific templates
├── _archive/           # Archived tasks
├── architecture.md     # Project architecture context
├── project-details.md  # Project details context
└── how-it-works.md     # Usage documentation
```
