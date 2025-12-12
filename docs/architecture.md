# Kanban2Code Architecture Documentation

## Project Overview

Kanban2Code is a VS Code extension that brings Kanban board functionality directly into the editor, integrating AI agents and rich task context. The project aims to streamline task management for developers by providing a visual workflow system that seamlessly integrates with the coding environment.

Key features include:
- A Kanban board with five stages: Inbox, Plan, Code, Audit, and Completed
- Filesystem-based task management using markdown files with frontmatter
- AI agent integration for context-aware task handling
- A comprehensive sidebar interface for task navigation and management (Phase 3)
  - Hierarchical task tree with inbox/projects/phases organization
  - Multi-dimensional filtering (stage, project, tags, quick views)
  - Task creation modal with template support
  - Context menus for task operations
  - Full keyboard navigation and accessibility support
- Workspace scaffolding to set up the Kanban2Code folder structure
- Context system for building comprehensive XML prompts for AI agents (Phase 2)
- Copy-to-clipboard functionality for task context

The technology stack uses Bun as the runtime and package manager, TypeScript for type safety, React for webviews, and Vitest for testing. The extension follows a UI-first approach with comprehensive testing requirements at each phase of development.

## Directory Structure

```
phase-0-foundation/
├── .gitkeep                               # Placeholder file to ensure directory tracking in git
├── phase-0-audit.md                       # Audit file documenting the completion and status of Phase 0 tasks
├── task0.0_initialize-project-and-build-tooling.md    # Task specification for project initialization using Bun and build tooling setup
├── task0.1_create-vs-code-extension-skeleton.md      # Task specification for creating the basic VS Code extension structure
├── task0.2_implement-core-webview-infrastructure.md   # Task specification for implementing React webview infrastructure
├── task0.3_implement-kanban2code-workspace-scaffolder.md # Task specification for implementing workspace scaffolding functionality
├── task0.4_define-core-types-and-constants.md         # Task specification for defining shared types and constants
├── task0.5_implement-workspace-detection-and-validation.md # Task specification for workspace validation and detection
├── task0.6_define-extension-activation-and-lifecycle.md # Task specification for extension activation events and lifecycle
├── task0.7_initialize-project-and-build-tooling-superseded.md # Superseded task that points to task0.0
├── task0.8_phase-0-audit-and-sign-off.md               # Task specification for the final Phase 0 audit and sign-off
└── docs/
    └── architecture.md                    # This file containing project architecture documentation

phase-1-filesystem-and-tasks/
├── .gitkeep                               # Placeholder file to ensure directory tracking in git
├── phase-1-audit.md                       # Audit file documenting the completion and status of Phase 1 tasks
├── phase1-context.md                       # Context documentation for Phase 1
├── task1.1_implement-task-parsing-and-serialization.md    # Task specification for task parsing and serialization
├── task1.2_implement-recursive-task-loading.md      # Task specification for recursive task loading
├── task1.3_implement-stage-update-service.md   # Task specification for stage update service
├── task1.4_implement-archive-behavior-for-tasks-and-projects.md # Task specification for archive behavior
├── task1.5_implement-workspace-detection-and-validation-extended.md # Task specification for extended workspace validation
├── task1.6_implement-unit-tests-for-frontmatter-parsing.md         # Task specification for frontmatter parsing tests
├── task1.7_implement-integration-tests-for-task-loading.md         # Task specification for task loading integration tests
├── task1.8_implement-file-watcher-for-task-changes.md               # Task specification for file watcher implementation
├── task1.9_define-webview-architecture-and-messaging-protocol.md   # Task specification for webview architecture
└── task1.10_phase-1-audit-and-sign-off.md               # Task specification for the final Phase 1 audit and sign-off

phase-2-context-system/
├── .gitkeep                               # Placeholder file to ensure directory tracking in git
├── phase-2-audit.md                       # Audit file documenting the completion and status of Phase 2 tasks
├── phase2-context.md                       # Context documentation for Phase 2
├── task2.1_implement-context-file-loaders.md    # Task specification for context file loaders
├── task2.2_implement-xml-prompt-builder-9-layer-context.md      # Task specification for XML prompt builder
├── task2.3_implement-stage-template-resolution.md   # Task specification for stage template resolution
├── task2.4_implement-copy-modes-and-copy-payload-builder.md # Task specification for copy modes and payload builder
├── task2.5_integrate-copy-with-context-with-vs-code-clipboard.md # Task specification for clipboard integration
├── task2.6_implement-unit-tests-for-context-system.md         # Task specification for context system tests
└── task2.7_phase-2-audit-and-sign-off.md               # Task specification for the final Phase 2 audit and sign-off

phase-3-sidebar-ui/
├── .gitkeep                               # Placeholder file to ensure directory tracking in git
├── phase-3-audit.md                       # Audit file documenting the completion and status of Phase 3 tasks
├── phase3-context.md                       # Context documentation for Phase 3
├── task3.0_design-sidebar-shell-ui-only.md    # Task specification for sidebar shell design
├── task3.1_implement-kanban2code-sidebar-shell-wired.md      # Task specification for sidebar shell implementation
├── task3.2_implement-filters-and-quick-views-in-sidebar.md   # Task specification for filters and quick views
├── task3.3_implement-inbox-and-project-tree-in-sidebar.md # Task specification for inbox and project tree
├── task3.4_implement-new-task-modal.md         # Task specification for new task modal
├── task3.5_implement-sidebar-task-context-menus.md         # Task specification for task context menus
├── task3.6_implement-keyboard-navigation-for-sidebar-webview.md               # Task specification for keyboard navigation
└── task3.7_phase-3-audit-and-sign-off.md               # Task specification for the final Phase 3 audit and sign-off

src/
├── extension.ts                            # Main extension entry point handling activation and command registration
├── assets/
│   └── templates.ts                       # Template definitions for workspace scaffolding (agents, tasks, stages)
├── commands/
│   └── index.ts                           # Command registration and implementation for VS Code commands
├── core/
│   ├── constants.ts                       # Core constants including stage definitions and folder names
│   └── rules.ts                           # Business rules and validation logic
├── services/
│   ├── archive.ts                         # Service for archiving completed tasks and projects
│   ├── context.ts                         # Service for loading and managing context files
│   ├── copy.ts                            # Service for copying task context to clipboard
│   ├── frontmatter.ts                     # Service for parsing and serializing task frontmatter
│   ├── prompt-builder.ts                  # Service for building XML prompts with 9-layer context
│   ├── scaffolder.ts                      # Service for scaffolding new Kanban2Code workspaces
│   ├── scanner.ts                         # Service for scanning and loading task files
│   ├── stage-manager.ts                   # Service for managing task stage transitions
│   ├── task-watcher.ts                    # Debounced filesystem watcher for task events (create/update/delete/move)
│   └── template.ts                        # Service for loading task templates from filesystem
├── types/
│   ├── context.ts                         # Type definitions for context system
│   ├── copy.ts                            # Type definitions for copy functionality
│   ├── gray-matter.d.ts                   # Type definitions for gray-matter library
│   └── task.ts                            # Core type definitions for tasks and stages
├── utils/
│   └── text.ts                            # Text processing utilities
├── webview/
│   ├── KanbanPanel.ts                     # Webview panel implementation for the Kanban board
│   ├── messaging.ts                       # Message passing between extension and webviews
│   ├── SidebarProvider.ts                 # VS Code sidebar webview provider
│   ├── ui/
│   │   ├── App.tsx                        # Main React component for webviews
│   │   ├── main.tsx                       # Entry point for React webview application
│   │   ├── components/                    # React components for the sidebar UI (Phase 3)
│   │   │   ├── ContextMenu.tsx            # Reusable context menu component
│   │   │   ├── EmptyState.tsx             # Empty state display component
│   │   │   ├── FilterBar.tsx              # Project/tag filters with collapsible UI
│   │   │   ├── Icons.tsx                  # Icon components for the UI
│   │   │   ├── index.ts                   # Export barrel for components
│   │   │   ├── KeyboardHelp.tsx           # Keyboard shortcuts overlay
│   │   │   ├── LocationPicker.tsx         # Inbox/Project location selector for new tasks
│   │   │   ├── MoveModal.tsx              # Task relocation modal
│   │   │   ├── QuickFilters.tsx          # Stage filter chips
│   │   │   ├── QuickViews.tsx             # Preset filter buttons
│   │   │   ├── Sidebar.tsx                # Main sidebar container component
│   │   │   ├── SidebarActions.tsx         # Action buttons section
│   │   │   ├── SidebarToolbar.tsx         # Top toolbar with title
│   │   │   ├── TaskContextMenu.tsx        # Task-specific context menu
│   │   │   ├── TaskItem.tsx               # Individual task item component
│   │   │   ├── TaskModal.tsx              # Task creation modal
│   │   │   ├── TaskTree.tsx               # Tree container with ARIA tree role
│   │   │   ├── TemplatePicker.tsx         # Template dropdown for new tasks
│   │   │   ├── TreeNode.tsx               # Project/phase tree node component
│   │   │   └── TreeSection.tsx            # Inbox/Projects tree sections
│   │   ├── hooks/                         # React hooks for state management (Phase 3)
│   │   │   ├── useFilters.ts              # Hook for filter state management
│   │   │   ├── useKeyboard.ts             # Hook for keyboard navigation
│   │   │   └── useTaskData.ts             # Hook for task data management
│   │   └── styles/
│   │       └── main.css                   # CSS styles for webview components
└── workspace/
    ├── state.ts                           # Workspace state management
    └── validation.ts                      # Workspace validation and detection logic

tests/
├── archive.test.ts                        # Unit tests for archive service
├── context-service.test.ts                # Unit tests for context system (Phase 2)
├── copy-service.test.ts                   # Unit tests for copy functionality (Phase 2)
├── frontmatter.test.ts                    # Unit tests for frontmatter parsing and serialization
├── prompt-builder.test.ts                 # Unit tests for XML prompt builder (Phase 2)
├── scaffolder.test.ts                     # Unit tests for workspace scaffolding
├── smoke.test.ts                          # Basic smoke tests for core functionality
├── stage-manager.test.ts                  # Unit tests for stage management service
├── state.test.ts                          # Unit tests for workspace state management
├── task-loading.test.ts                   # Integration tests for task loading from filesystem
├── task-watcher.test.ts                   # Unit tests for debounced watcher events and move detection
├── types.test.ts                          # Unit tests for type definitions and utilities
├── utils.test.ts                          # Unit tests for utility functions
├── validation.test.ts                     # Unit tests for workspace validation
└── webview.test.ts                        # Unit tests for webview components

webview/                                   # Build output directory for webview assets

.gitignore                                 # Git ignore configuration
.prettierrc                                # Prettier code formatting configuration
build.ts                                   # Build script configuration for esbuild
bun.lock                                   # Bun lockfile for dependency management
eslint.config.mjs                          # ESLint configuration for code linting
package.json                               # NPM package configuration with dependencies and scripts
README.md                                  # Project README with setup instructions
roadmap.md                                 # Comprehensive development roadmap with phase breakdown
tsconfig.json                              # TypeScript compiler configuration
.vscode/                                   # VS Code workspace configuration

## Phase 3 Sidebar UI Implementation

Phase 3 implemented a comprehensive sidebar interface with the following key features:

### Component Architecture
- **Main Container**: [`Sidebar.tsx`](src/webview/ui/components/Sidebar.tsx) provides the overall layout and state coordination
- **Navigation**: [`SidebarToolbar.tsx`](src/webview/ui/components/SidebarToolbar.tsx) and [`SidebarActions.tsx`](src/webview/ui/components/SidebarActions.tsx) handle top-level actions
- **Filtering System**: [`FilterBar.tsx`](src/webview/ui/components/FilterBar.tsx), [`QuickFilters.tsx`](src/webview/ui/components/QuickFilters.tsx), and [`QuickViews.tsx`](src/webview/ui/components/QuickViews.tsx) provide multi-dimensional filtering
- **Task Tree**: [`TaskTree.tsx`](src/webview/ui/components/TaskTree.tsx), [`TreeSection.tsx`](src/webview/ui/components/TreeSection.tsx), and [`TreeNode.tsx`](src/webview/ui/components/TreeNode.tsx) implement hierarchical task display
- **Task Management**: [`TaskItem.tsx`](src/webview/ui/components/TaskItem.tsx), [`TaskModal.tsx`](src/webview/ui/components/TaskModal.tsx), and [`MoveModal.tsx`](src/webview/ui/components/MoveModal.tsx) handle task operations
- **Context Menus**: [`ContextMenu.tsx`](src/webview/ui/components/ContextMenu.tsx) and [`TaskContextMenu.tsx`](src/webview/ui/components/TaskContextMenu.tsx) provide right-click actions
- **Accessibility**: Full ARIA support with keyboard navigation via [`KeyboardHelp.tsx`](src/webview/ui/components/KeyboardHelp.tsx)

### State Management Hooks
- [`useTaskData.ts`](src/webview/ui/hooks/useTaskData.ts): Manages task data loading and transformation
- [`useFilters.ts`](src/webview/ui/hooks/useFilters.ts): Handles filter state and logic
- [`useKeyboard.ts`](src/webview/ui/hooks/useKeyboard.ts): Implements keyboard navigation and shortcuts

### Key Features
- **Hierarchical Task Display**: Tasks organized by inbox/projects/phases with collapsible tree structure
- **Multi-dimensional Filtering**: Stage filters, project/tag filters, and preset quick views
- **Task Creation**: Modal-based task creation with template support and location selection
- **Context Actions**: Right-click menus for task operations (move, archive, copy context, etc.)
- **Keyboard Navigation**: Full keyboard accessibility with shortcuts for all major actions
- **Real-time Updates**: Live synchronization with filesystem changes through the messaging system

### Design System
- Navy Night Gradient theme with glassmorphic effects
- Consistent spacing and typography
- Responsive design that adapts to sidebar width constraints
- Visual feedback for all interactive states

## Webview Messaging Architecture

- Messages between host and webview use a versioned envelope: `{ version: 1, type, payload }`, defined in `src/webview/messaging.ts` and validated with zod.
- Supported types:
  - Host → Webview: `TaskUpdated`, `TaskSelected`, `FilterChanged`, `InitState`.
  - Webview → Host: `CreateTask`, `MoveTask`, `CopyContext`, and a simple `ALERT` utility used by the placeholder UI.
- Helper API: `createEnvelope`/`createMessage` build typed envelopes; `validateEnvelope` guards incoming data.
- The React UI (`src/webview/ui/App.tsx`) uses the messaging system to communicate with the host extension, with the sidebar providing rich task management capabilities.
