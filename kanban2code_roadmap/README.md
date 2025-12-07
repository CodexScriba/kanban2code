# Kanban2Code Roadmap

This directory contains the complete roadmap for the Kanban2Code project, organized by phases. Each phase contains specific tasks that need to be completed.

## Project Structure

```
kanban2code_roadmap/
├── phase-0-foundation/           # Foundation & Bootstrapping
├── phase-1-filesystem-and-tasks/ # Filesystem Model, Task Loading & Stage/Archive
├── phase-2-context-system/       # Context System & XML Prompt Assembly
├── phase-3-sidebar-ui/           # Sidebar UI (Control Tower)
├── phase-4-board-webview/        # Board Webview (Kanban)
├── phase-5-polish-and-docs/      # Polish, Shortcuts, Dogfooding & Docs
└── roadmap.md                    # Top-level roadmap overview
```

## How to Use

Each task is a markdown file with frontmatter containing:
- `stage`: Current stage (plan, code, etc.)
- `title`: Task title
- `tags`: Relevant tags
- `created`: Creation date

Tasks can be moved between stages as work progresses.

## Technology Stack

This project uses **Bun** as the package manager and runtime instead of npm. All build processes, dependency management, and scripts should use Bun commands.

## Phases Overview

1. **Phase 0 - Foundation & Bootstrapping**: Set up the basic VS Code extension structure
2. **Phase 1 - Filesystem and Tasks**: Implement task parsing, loading, and management
3. **Phase 2 - Context System**: Build the XML prompt assembly system
4. **Phase 3 - Sidebar UI**: Create the control tower sidebar interface
5. **Phase 4 - Board Webview**: Implement the Kanban board view
6. **Phase 5 - Polish and Docs**: Final polish, shortcuts, and documentation

For detailed information about each phase and task, see the respective phase folders.