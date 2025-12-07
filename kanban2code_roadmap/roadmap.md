# Kanban2Code Development Roadmap

This roadmap outlines the complete development plan for Kanban2Code, organized into phases with specific tasks.

## Overview

Kanban2Code is a VS Code extension that brings Kanban board functionality to your development workflow, with a focus on integrating with AI agents and providing rich context for task management.

## Technology Stack

This project uses **Bun** as the package manager and runtime instead of npm. All build processes, dependency management, and scripts should use Bun commands.

## Phase Structure

Each phase contains multiple tasks that can be worked on independently. Tasks are organized by folder and include frontmatter with stage, tags, and metadata.

## Phases

### Phase 0 - Foundation & Bootstrapping
*Location: [`phase-0-foundation/`](./phase-0-foundation/)*

This phase establishes the basic infrastructure for the VS Code extension.

**Key Tasks:**
- Create VS Code extension skeleton
- Implement workspace detection and validation
- Implement .kanban2code workspace scaffolder
- Define core types and constants

### Phase 1 - Filesystem and Tasks
*Location: [`phase-1-filesystem-and-tasks/`](./phase-1-filesystem-and-tasks/)*

This phase implements the core filesystem-based task management system.

**Key Tasks:**
- Implement task parsing and serialization
- Implement recursive task loading
- Implement stage update service
- Implement archive behavior for tasks and projects
- Implement workspace detection and validation
- Implement file watcher for task changes
- Implement unit tests for frontmatter parsing
- Implement integration tests for task loading

### Phase 2 - Context System
*Location: [`phase-2-context-system/`](./phase-2-context-system/)*

This phase builds the XML prompt assembly system for AI agent integration.

**Key Tasks:**
- Implement context file loaders
- Implement XML prompt builder (9-layer context)
- Implement stage template resolution
- Implement copy modes and copy payload builder
- Integrate copy-with-context with VS Code clipboard

### Phase 3 - Sidebar UI
*Location: [`phase-3-sidebar-ui/`](./phase-3-sidebar-ui/)*

This phase creates the control tower sidebar interface.

**Key Tasks:**
- Implement Kanban2Code sidebar shell
- Implement filters and quick views in sidebar
- Implement Inbox and project tree in sidebar
- Implement New Task modal
- Implement sidebar task context menus

### Phase 4 - Board Webview
*Location: [`phase-4-board-webview/`](./phase-4-board-webview/)*

This phase implements the Kanban board view.

**Key Tasks:**
- Implement Board layout and data flow
- Implement TaskCard component
- Implement drag-and-drop stage changes
- Sync filters and search between sidebar and board
- Implement Add Follow-up in Inbox from board
- Implement webview component tests

### Phase 5 - Polish and Docs
*Location: [`phase-5-polish-and-docs/`](./phase-5-polish-and-docs/)*

This phase focuses on final polish, shortcuts, and documentation.

**Key Tasks:**
- Implement keyboard shortcuts and command palette entries
- Improve error handling and logging
- Dogfood Kanban2Code on the Kanban2Code project
- Polish how-it-works and project documentation
- Validate MVP feature checklist and define post-v1 backlog

## Task Management

Each task file includes:
- **Stage**: Current development stage (plan, code, etc.)
- **Tags**: Relevant tags for categorization
- **Title**: Clear task description
- **Goal**: High-level objective
- **Scope**: Detailed implementation requirements
- **Notes**: Additional context or constraints

## Development Workflow

1. Start with Phase 0 to establish the foundation
2. Work through phases sequentially, but individual tasks within a phase can be parallelized
3. Move tasks from `plan` to `code` stage as work begins
4. Update task status as work progresses
5. Use the Kanban2Code extension itself to manage these tasks (dogfooding)

## Post-MVP

After completing all phases, consider creating a `projects/kanban2code-post-v1/` project for future enhancements like:
- Project templates
- Agent presets
- Batch operations
- Task dependencies
- Time tracking
- Exports
- Migration tools for other task management systems

---

*This roadmap is a living document. As development progresses, new tasks may be discovered and existing ones refined.*