# Phase 1 Context: Filesystem and Tasks

This document provides all necessary context for implementing Phase 1 of the Kanban2Code project. It includes project overview, architecture details, existing foundation, and specific requirements for the filesystem and task management system.

## Project Overview

Kanban2Code is a VS Code extension that brings Kanban board functionality directly into the editor, integrating AI agents and rich task context. The project uses a filesystem-based approach where tasks are stored as markdown files with frontmatter metadata.

### Key Features
- Kanban board with five stages: Inbox, Plan, Code, Audit, Completed
- Filesystem-based task management using markdown files with frontmatter
- AI agent integration for context-aware task handling
- Sidebar interface for task navigation and management
- Workspace scaffolding to set up the Kanban2Code folder structure
- Context system for building comprehensive XML prompts for AI agents
- Copy-to-clipboard functionality for task context

## Technology Stack

- **Runtime & package manager:** [Bun](https://bun.sh)
- **Language:** TypeScript
- **Bundler:** esbuild
- **UI:** React (webviews), Tailwind CSS + shadcn/ui
- **Testing:** Vitest (unit + component), React Testing Library, @vscode/test-electron (extension/e2e)

## Project Structure

Based on the architecture documentation, the project follows this structure:

```
src/
├── extension.ts                            # Main extension entry point
├── assets/
│   └── templates.ts                       # Template definitions
├── commands/
│   └── index.ts                           # Command registration
├── core/
│   ├── constants.ts                       # Core constants including STAGES
│   └── rules.ts                           # Business rules
├── services/
│   ├── archive.ts                         # Archive service
│   ├── frontmatter.ts                     # Frontmatter parsing
│   ├── scaffolder.ts                      # Workspace scaffolding
│   ├── scanner.ts                         # Task scanning
│   └── stage-manager.ts                   # Stage management
├── types/
│   ├── gray-matter.d.ts                   # Type definitions
│   └── task.ts                            # Core task types
├── utils/
│   └── text.ts                            # Text utilities
├── webview/
│   ├── KanbanPanel.ts                     # Webview panel
│   ├── messaging.ts                       # Message passing
│   ├── SidebarProvider.ts                 # Sidebar provider
│   └── ui/                                # React components
└── workspace/
    ├── state.ts                           # Workspace state
    └── validation.ts                      # Workspace validation
```

## Phase 0 Foundation Status

Phase 0 is complete and audited. Key foundation elements already implemented:

### Completed Infrastructure
- ✅ Bun-based project with TypeScript, esbuild, Vitest
- ✅ VS Code extension skeleton with command registration
- ✅ Basic webview infrastructure with React shell
- ✅ Workspace scaffolder that creates `.kanban2code` structure
- ✅ Core types and constants defined
- ✅ Workspace detection and validation
- ✅ Extension activation and lifecycle

### Existing Core Types

From `src/types/task.ts` (as defined in Phase 0):
```typescript
type Stage = 'inbox' | 'plan' | 'code' | 'audit' | 'completed';

interface Task {
  id: string;
  filePath: string;
  title: string;
  stage: Stage;
  project?: string;
  phase?: string;
  agent?: string;
  parent?: string;
  tags?: string[];
  contexts?: string[];
  order?: number;
  created?: string;
  content: string;
}
```

### Existing Constants

From `src/core/constants.ts` (as defined in Phase 0):
```typescript
export const STAGES = ['inbox', 'plan', 'code', 'audit', 'completed'] as const;

export const FOLDER_NAMES = {
  INBOX: 'inbox',
  PROJECTS: 'projects',
  ARCHIVE: '_archive',
  AGENTS: '_agents',
  TEMPLATES: '_templates',
  CONTEXT_FILES: '_context.md'
} as const;
```

### Existing Services

Phase 0 implemented these services that Phase 1 will extend:

1. **Scaffolder Service** (`src/services/scaffolder.ts`):
   - Creates `.kanban2code` folder structure
   - Generates seed files and templates
   - Already has unit tests

2. **Workspace Validation** (`src/workspace/validation.ts`):
   - `findKanbanRoot(workspaceRoot)` function
   - `isSafePath(path, root)` function
   - Already has unit tests

## Phase 1 Requirements

Phase 1 focuses on implementing the core filesystem-based task management system. The phase includes these main areas:

### 1. Task Parsing and Serialization (Task 1.1)
- Parse markdown files with frontmatter into Task objects
- Serialize Task objects back to markdown
- Use `gray-matter` library for frontmatter handling
- Preserve unknown frontmatter fields
- Handle invalid frontmatter gracefully

### 2. Recursive Task Loading (Task 1.2)
- Load all tasks from `.kanban2code` directory structure
- Infer project and phase from file paths
- Exclude `_context.md` files
- Handle missing folders gracefully
- Implement in `taskService.loadAllTasks(root)`

### 3. Stage Update Service (Task 1.3)
- Update task stages by modifying frontmatter
- Enforce allowed transitions between stages
- Implement transition guards
- Provide helper for UI integration

### 4. Archive Behavior (Task 1.4)
- Archive completed tasks and projects
- Move files to `_archive/` while preserving structure
- Implement guard conditions
- Add VS Code commands for archiving

### 5. Extended Workspace Validation (Task 1.5)
- Extend Phase 0 validation with status enums
- Provide helper guards for filesystem operations
- Return explicit status codes

### 6. Testing Requirements (Tasks 1.6-1.7)
- Unit tests for frontmatter parsing
- Integration tests for task loading
- Use Vitest framework
- Test edge cases and error conditions

### 7. File Watcher (Task 1.8)
- Implement `FileSystemWatcher` for `.kanban2code`
- Debounce rapid changes
- Emit events for UI updates
- Handle external edits

### 8. Webview Architecture (Task 1.9)
- Define message types for host ↔ webview communication
- Set up React state management with Zustand
- Create base component library
- Implement versioned message envelope

## Filesystem Structure

The `.kanban2code` workspace structure (created by Phase 0 scaffolder):

```
.kanban2code/
├── inbox/                    # Inbox tasks (*.md)
├── projects/                 # Project folders
│   ├── {project}/           # Project directory
│   │   ├── _context.md      # Project context
│   │   ├── {phase}/         # Phase directories (optional)
│   │   │   ├── _context.md  # Phase context
│   │   │   └── *.md         # Phase tasks
│   │   └── *.md             # Direct project tasks
├── _agents/                 # Agent definitions
│   ├── opus.md
│   ├── sonnet.md
│   └── codex.md
├── _templates/              # Template definitions
│   ├── stages/              # Stage templates
│   │   ├── inbox.md
│   │   ├── plan.md
│   │   ├── code.md
│   │   ├── audit.md
│   │   └── completed.md
│   └── tasks/               # Task templates
│       ├── bug.md
│       ├── feature.md
│       └── spike.md
├── _archive/                # Archived items
│   ├── inbox/
│   └── projects/
├── how-it-works.md          # Global documentation
├── architecture.md          # Architecture documentation
└── project-details.md       # Project-specific details
```

## Task File Format

Tasks are markdown files with frontmatter:

```markdown
---
stage: inbox
project: kanban2code
phase: phase-1
agent: codex
tags: [mvp, filesystem, testing]
parent: task-id
contexts: [global, project]
order: 1
created: 2024-01-01T00:00:00Z
---

# Task Title

Task description and content...
```

## Development Guidelines

### Testing Requirements
- Every non-trivial module must have unit tests
- Use Vitest for unit/component tests
- Tests run via `bun test`
- No feature is "Done" until tests exist and pass

### Code Quality
- Follow existing TypeScript patterns
- Use pure functions where possible
- Handle errors gracefully
- Preserve existing API contracts
- Add JSDoc comments for public APIs

### Filesystem Safety
- Always validate paths are within kanban root
- Use existing validation functions from Phase 0
- Handle missing files/folders gracefully
- Provide clear error messages

## Integration Points

### With Phase 0
- Extend existing services rather than replace
- Use existing types and constants
- Follow established patterns for commands and webviews
- Leverage existing test infrastructure

### For Phase 2
- Prepare for context system integration
- Ensure task data structure supports XML prompt building
- Design APIs that will work with context loaders

## Key Dependencies

From Phase 0, these dependencies are available:
- `gray-matter` for frontmatter parsing
- `vitest` for testing
- `zod` for runtime validation
- React and related UI libraries
- VS Code extension APIs

## Success Criteria

Phase 1 is complete when:
1. All tasks can be parsed and loaded from the filesystem
2. Task stages can be updated safely with proper validation
3. Archive functionality works for tasks and projects
4. File watcher keeps UI in sync with filesystem changes
5. All unit and integration tests pass
6. Webview messaging protocol is defined and tested
7. Phase 1 audit file is created and signed off

## Common Patterns

### Error Handling
```typescript
try {
  // Operation
} catch (error) {
  // Log error and provide user-friendly message
  throw new Error(`Operation failed: ${error.message}`);
}
```

### Path Validation
```typescript
import { isSafePath, findKanbanRoot } from '../workspace/validation';

const kanbanRoot = findKanbanRoot(workspaceRoot);
if (!kanbanRoot) {
  throw new Error('No .kanban2code workspace found');
}

if (!isSafePath(filePath, kanbanRoot)) {
  throw new Error('Path is outside workspace bounds');
}
```

### Testing Pattern
```typescript
import { describe, it, expect } from 'vitest';

describe('ServiceName', () => {
  it('should handle expected case', () => {
    // Test implementation
  });
  
  it('should handle error case', () => {
    // Error testing
  });
});
```

This context document provides all necessary information for implementing Phase 1 without needing to search the project for additional details.