# Phase 3: Sidebar UI - Implementation Context

## Overview

Phase 3 delivers a fully functional sidebar webview that serves as the command center for Kanban2Code. This phase builds on the foundation (Phase 0) and filesystem/context infrastructure (Phases 1-2) to provide users with a visual interface for task management, project navigation, and quick actions.

**Status**: 🚧 PLANNED (ready to begin after Phase 2 completion)

**Dependencies**:
- ✅ Phase 0: Foundation (extension skeleton, webview infrastructure, workspace scaffolding)
- ✅ Phase 1: Filesystem (task loading, stage management, file watcher - partial)
- ✅ Phase 2: Context System (9-layer context, XML prompt builder, copy system)

**Key Deliverables**:
1. Sidebar webview shell with approved visual design
2. Functional sidebar wired to task data
3. Filters and quick views system
4. Project/phase tree navigation
5. New task modal with full configuration
6. Context menus for task actions
7. Keyboard navigation and accessibility

---

## Design System Reference

### Location
All visual designs are located in [`docs/design/`](/home/cynic/workspace/kanban2code/docs/design):
- [`docs/design/sidebar.html`](../../docs/design/sidebar.html) - **PRIMARY REFERENCE** for sidebar UI
- [`docs/design/index.html`](../../docs/design/index.html) - Design system hub
- [`docs/design/components/modals.html`](../../docs/design/components/modals.html) - Modal patterns
- [`docs/design/components/empty-states.html`](../../docs/design/components/empty-states.html) - Empty state patterns
- [`docs/design/forms/task.html`](../../docs/design/forms/task.html) - Task creation form
- [`docs/design/forms/quick-task.html`](../../docs/design/forms/quick-task.html) - Quick task form
- [`docs/design/forms/agent.html`](../../docs/design/forms/agent.html) - Agent creation form
- [`docs/design/forms/context.html`](../../docs/design/forms/context.html) - Context creation form

### Design System Files (Styles)
- [`docs/design/styles/variables.css`](../../docs/design/styles/variables.css) - **CSS custom properties** (colors, spacing, typography)
- [`docs/design/styles/glassmorphic.css`](../../docs/design/styles/glassmorphic.css) - Glass effects and visual treatments
- [`docs/design/styles/components.css`](../../docs/design/styles/components.css) - Base component styles (buttons, inputs, tags)
- [`docs/design/styles/sidebar.css`](../../docs/design/styles/sidebar.css) - **Sidebar-specific styles**
- [`docs/design/styles/board.css`](../../docs/design/styles/board.css) - Board styles (Phase 4)
- [`docs/design/styles/card.css`](../../docs/design/styles/card.css) - Task card styles

### Design Principles

**Navy Night Gradient Theme**:
- Background: Linear gradient from `#0d111c` → `#101524` → `#121829`
- Sidebar background: `#0c101b`
- Panel background: `#161b2b`
- Borders: `#2a3147`

**Glassmorphic Effects**:
- Uses `backdrop-filter: blur()` for depth
- Subtle gradients with transparency
- Layered shadows for elevation
- **NOTE**: May need fallbacks for older VS Code versions

**Stage Colors** (immutable):
```css
--stage-inbox: #3b82f6      /* Blue */
--stage-plan: #5d6b85       /* Muted slate */
--stage-code: #22c55e       /* Green */
--stage-audit: #facc15      /* Yellow */
--stage-completed: #5d6b85  /* Slate */
```

**Spacing System** (immutable):
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 24px
```

**Typography**:
```css
--font-size-xs: 11px
--font-size-sm: 12px
--font-size-md: 13px
--font-size-lg: 14px
--font-size-xl: 16px
```

---

## Architecture Context

### Existing Infrastructure (DO NOT RECREATE)

**Webview System** ([`src/webview/`](/home/cynic/workspace/kanban2code/src/webview)):
- [`SidebarProvider.ts`](../../src/webview/SidebarProvider.ts:1) - VS Code sidebar webview provider (ALREADY EXISTS)
- [`KanbanPanel.ts`](../../src/webview/KanbanPanel.ts:1) - Board webview provider (for Phase 4)
- [`messaging.ts`](../../src/webview/messaging.ts:1) - Message protocol (versioned envelope system)
- [`ui/App.tsx`](../../src/webview/ui/App.tsx:1) - Placeholder React component (REPLACE IN THIS PHASE)
- [`ui/main.tsx`](../../src/webview/ui/main.tsx:1) - React entry point

**Message Protocol** ([`src/webview/messaging.ts`](../../src/webview/messaging.ts:24)):
```typescript
interface MessageEnvelope<T> {
  version: 1;
  type: MessageType;
  payload: T;
}

// Host → Webview
type MessageType =
  | 'TaskUpdated'      // Task data changed
  | 'TaskSelected'     // User selected task
  | 'FilterChanged'    // Filter state updated
  | 'InitState'        // Initial state on load

// Webview → Host
  | 'CreateTask'       // User wants to create task
  | 'MoveTask'         // User moved task
  | 'CopyContext'      // Copy task context to clipboard
  | 'ALERT';           // Placeholder utility
```

**Task Loading** ([`src/services/scanner.ts`](../../src/services/scanner.ts:139)):
```typescript
async function loadAllTasks(kanbanRoot: string): Promise<Task[]>
async function findTaskById(kanbanRoot: string, taskId: string): Promise<Task | undefined>
```

**Task Interface** ([`src/types/task.ts`](../../src/types/task.ts:3)):
```typescript
interface Task {
  id: string;           // File basename without .md
  filePath: string;     // Absolute path
  title: string;        // From # heading or filename
  stage: Stage;         // One of STAGES
  project?: string;     // Inferred from path (NOT in frontmatter)
  phase?: string;       // Inferred from path (NOT in frontmatter)
  agent?: string;       // Agent assignment
  parent?: string;      // Parent task ID
  tags?: string[];      // Array of tags
  contexts?: string[];  // Custom context references
  order?: number;       // Display order
  created?: string;     // ISO date string
  content: string;      // Markdown body
}

type Stage = 'inbox' | 'plan' | 'code' | 'audit' | 'completed';
```

**Constants** ([`src/core/constants.ts`](../../src/core/constants.ts:3)):
```typescript
export const STAGES: Stage[] = ['inbox', 'plan', 'code', 'audit', 'completed'];
export const KANBAN_FOLDER = '.kanban2code';
export const INBOX_FOLDER = 'inbox';
export const PROJECTS_FOLDER = 'projects';
export const ARCHIVE_FOLDER = '_archive';
export const AGENTS_FOLDER = '_agents';
export const TEMPLATES_FOLDER = '_templates';
```

**File Watcher** ([`src/services/task-watcher.ts`](../../src/services/task-watcher.ts:1)):
- Debounced filesystem watcher for task events
- **STATUS**: Implemented but not wired to extension host (Phase 1 gap)
- **ACTION**: Wire this up in Task 3.1 when connecting sidebar to task data

**Context System** (Phase 2):
- [`src/services/context.ts`](../../src/services/context.ts:1) - 9-layer context loading
- [`src/services/prompt-builder.ts`](../../src/services/prompt-builder.ts:1) - XML prompt assembly
- [`src/services/copy.ts`](../../src/services/copy.ts:1) - Clipboard integration with 3 copy modes

---

## Phase 3 Task Breakdown

### Task 3.0: Design Sidebar Shell (UI Only) ✅ DESIGN APPROVED
**File**: [`task3.0_design-sidebar-shell-ui-only.md`](task3.0_design-sidebar-shell-ui-only.md)

**Goal**: Design and approve visual sidebar shell before implementation.

**Reference Design**: [`docs/design/sidebar.html`](../../docs/design/sidebar.html)

**Scope**:
- Create `<SidebarShell />` React component (presentational only)
- Title bar: "Kanban2Code"
- Three main action buttons:
  - "Create Kanban" → scaffolds workspace
  - "View Kanban" → opens board webview
  - "Settings" → opens settings view
- Placeholder task list (dummy data)
- Empty state UI when no kanban exists
- **NO** filesystem calls or real data yet

**Visual Requirements**:
- Use glassmorphic `.glass-panel` class
- Toolbar with `.sidebar-toolbar` class
- Action buttons with `.action-btn.glass-button` class
- Empty state with `.sidebar-empty` class
- Follow spacing from `variables.css`

**Deliverable**: Approved visual design before Task 3.1 begins.

---

### Task 3.1: Implement Sidebar Shell (Wired)
**File**: [`task3.1_implement-kanban2code-sidebar-shell-wired.md`](task3.1_implement-kanban2code-sidebar-shell-wired.md)

**Goal**: Wire approved shell to real task data and commands.

**Key Files to Modify**:
- [`src/webview/ui/App.tsx`](../../src/webview/ui/App.tsx:1) - Replace placeholder with `<Sidebar />` component
- [`src/webview/SidebarProvider.ts`](../../src/webview/SidebarProvider.ts:1) - Wire message handlers
- [`src/commands/index.ts`](../../src/commands/index.ts:1) - Register new commands

**New Components to Create**:
- `src/webview/ui/components/Sidebar.tsx` - Main sidebar container
- `src/webview/ui/components/SidebarToolbar.tsx` - Top toolbar with title and settings
- `src/webview/ui/components/SidebarActions.tsx` - Action buttons section
- `src/webview/ui/components/EmptyState.tsx` - Empty board state

**Wiring Requirements**:
1. **Register custom view**: `kanban2code.sidebar` in [`package.json`](../../package.json:1)
2. **Wire top nav buttons**:
   - "Create Kanban" → `kanban2code.scaffoldWorkspace` (already exists)
   - "View Kanban" → `kanban2code.openBoard` (create new command)
   - "Settings" → `kanban2code.openSettings` (create new command)
3. **Load task data**: Call `loadAllTasks()` from [`scanner.ts`](../../src/services/scanner.ts:139)
4. **Wire file watcher**: Connect [`task-watcher.ts`](../../src/services/task-watcher.ts:1) to refresh sidebar on file changes
5. **Handle InitState message**: Send initial task data to webview on load

**State Management**:
- Use React hooks (useState, useEffect) for now
- Future: Zustand store (Phase 4.5)

---

### Task 3.2: Implement Filters and Quick Views
**File**: [`task3.2_implement-filters-and-quick-views-in-sidebar.md`](task3.2_implement-filters-and-quick-views-in-sidebar.md)

**Goal**: Enable filtering tasks by project, tags, and stage.

**New Components**:
- `src/webview/ui/components/QuickFilters.tsx` - Stage filter chips
- `src/webview/ui/components/FilterBar.tsx` - Project dropdown, tag multi-select
- `src/webview/ui/components/QuickViews.tsx` - Preset view buttons

**Filter Types**:
1. **Project Filter**: Dropdown with "All", "Inbox only", or specific projects
2. **Tag Filter**: Multi-select chips (e.g., "bug", "urgent", "mvp")
3. **Stage Toggles**: Chips for each stage (inbox/plan/code/audit/completed)

**Quick Views** (preset filters):
- "Today's Focus" - tasks with today's date or priority
- "All In Development" - tasks in `code` stage
- "Bugs" - tasks with `bug` tag
- "Ideas & Roadmaps" - tasks with `idea` or `roadmap` tags

**Visual Reference**: [`docs/design/sidebar.html`](../../docs/design/sidebar.html:143-164) (quick filters section)

**State Sharing**:
- Filter state should be serializable
- Will be shared with board webview in Phase 4.4
- Store in workspace state or message protocol

**Styling**:
- Use `.quick-filters` container
- Use `.filter-chip` for chips (`.active` state when selected)
- Use `.dot` for stage color indicators

---

### Task 3.3: Implement Inbox and Project Tree
**File**: [`task3.3_implement-inbox-and-project-tree-in-sidebar.md`](task3.3_implement-inbox-and-project-tree-in-sidebar.md)

**Goal**: Render hierarchical tree of Inbox → Projects → Phases → Tasks.

**New Components**:
- `src/webview/ui/components/TaskTree.tsx` - Main tree container
- `src/webview/ui/components/TreeSection.tsx` - Inbox or Projects section
- `src/webview/ui/components/TreeNode.tsx` - Expandable project/phase node
- `src/webview/ui/components/TaskItem.tsx` - Individual task item

**Tree Structure**:
```
Inbox (section)
  ├─ Task 1 (inbox)
  ├─ Task 2 (inbox)
  └─ Task 3 (inbox)

Projects (section)
  ├─ auth-system (project node)
  │   ├─ phase-1-setup (phase node)
  │   │   ├─ Task A (plan)
  │   │   └─ Task B (code)
  │   └─ phase-2-oauth (phase node)
  │       └─ Task C (audit)
  └─ navbar-redesign (project node)
      ├─ Task D (plan)
      └─ Task E (inbox)
```

**Data Transformation**:
- Group tasks by `task.project` and `task.phase`
- Inbox tasks: `!task.project`
- Direct project tasks: `task.project && !task.phase`
- Phase tasks: `task.project && task.phase`

**Visual Requirements**:
- Use `.tree-node` for project/phase nodes
- Use `.task-item` for tasks
- Use `.stage-indicator` dot for task stage color
- Show task counts in `.node-count` badges
- Chevron icon rotates 90° when expanded (`.expanded` class)
- Use `--depth` CSS variable for indentation: `padding-left: calc(var(--spacing-md) + var(--depth) * 16px)`

**Interactions**:
- Click project/phase node → toggle expand/collapse
- Click task → open markdown file in editor
- Right-click task → context menu (Task 3.5)

**Reference**: [`docs/design/sidebar.html`](../../docs/design/sidebar.html:166-270) (file tree section)

---

### Task 3.4: Implement New Task Modal
**File**: [`task3.4_implement-new-task-modal.md`](task3.4_implement-new-task-modal.md)

**Goal**: Provide rich task creation flow accessible from sidebar and board.

**New Components**:
- `src/webview/ui/components/TaskModal.tsx` - Main modal container
- `src/webview/ui/components/TaskForm.tsx` - Form fields
- `src/webview/ui/components/LocationPicker.tsx` - Inbox or Project+Phase selector
- `src/webview/ui/components/TemplatePicker.tsx` - Template dropdown

**Form Fields**:
```typescript
interface TaskFormData {
  location: 'inbox' | { project: string; phase?: string };
  title: string;              // REQUIRED
  stage: Stage;               // Default: 'inbox'
  agent?: string;             // Dropdown from _agents/*.md
  tags?: string[];            // Free-text chips
  template?: string;          // From _templates/tasks/*.md
  content?: string;           // Optional initial content
}
```

**Template System**:
- Read templates from `.kanban2code/_templates/tasks/`
- Templates: `bug.md`, `feature.md`, `spike.md`, etc.
- Apply template frontmatter + body on creation
- User can override fields after template selection

**File Creation Logic**:
1. Generate filename: `{timestamp}-{slug(title)}.md`
2. Determine target folder:
   - Inbox: `.kanban2code/inbox/{filename}.md`
   - Project: `.kanban2code/projects/{project}/{filename}.md`
   - Phase: `.kanban2code/projects/{project}/{phase}/{filename}.md`
3. Apply template or default frontmatter
4. Write file using VS Code workspace API
5. Reload tasks in sidebar
6. Optionally open new file in editor

**Visual Reference**: [`docs/design/forms/task.html`](../../docs/design/forms/task.html)

**Styling**:
- Use `.glass-modal` for modal container
- Use `.glass-overlay` for backdrop
- Use `.modal-header`, `.modal-body`, `.modal-footer` structure
- Use `.form-group`, `.form-label`, `.form-input` from components.css

**Keyboard Shortcuts**:
- `Escape` → Close modal
- `Cmd/Ctrl+Enter` → Submit form

---

### Task 3.5: Implement Sidebar Task Context Menus
**File**: [`task3.5_implement-sidebar-task-context-menus.md`](task3.5_implement-sidebar-task-context-menus.md)

**Goal**: Enable task actions via right-click context menu.

**New Components**:
- `src/webview/ui/components/ContextMenu.tsx` - Reusable context menu
- `src/webview/ui/components/TaskContextMenu.tsx` - Task-specific menu items

**Menu Items**:
```typescript
interface ContextMenuItem {
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  divider?: boolean;
  submenu?: ContextMenuItem[];
}
```

**Task Context Menu**:
1. **Copy XML (Full Context)** - Copy task with full 9-layer context (use [`copy.ts`](../../src/services/copy.ts:1))
2. **Copy Task Only** - Copy task metadata and content only
3. **Copy Context Only** - Copy 9-layer context without task
4. **---** (divider)
5. **Change Stage ▸** (submenu):
   - inbox → plan
   - plan → code
   - code → audit
   - audit → completed
   - (respect [`rules.ts`](../../src/core/rules.ts:1) forward-only transitions)
6. **Mark Implementation Done** - Shortcut for code → audit
7. **---** (divider)
8. **Move to Project/Phase…** - Open move modal
9. **Archive** - Only if `stage === 'completed'` (use [`archive.ts`](../../src/services/archive.ts:1))
10. **Delete task** - Show confirmation dialog

**Integration with Copy System**:
- Use [`src/services/copy.ts`](../../src/services/copy.ts:1) for all copy operations
- `buildCopyPayload(task, mode, root)` where mode is:
  - `'full_xml'` - Full context
  - `'task_only'` - Task metadata + content
  - `'context_only'` - 9-layer context

**Visual Reference**: [`docs/design/components/modals.html`](../../docs/design/components/modals.html) (context menu section)

**Positioning**:
- Show menu at mouse cursor position
- Ensure menu stays within viewport bounds
- Close menu on outside click or `Escape`

---

### Task 3.6: Implement Keyboard Navigation
**File**: [`task3.6_implement-keyboard-navigation-for-sidebar-webview.md`](task3.6_implement-keyboard-navigation-for-sidebar-webview.md)

**Goal**: Enable full keyboard navigation and accessibility.

**Keyboard Shortcuts**:
```typescript
interface KeyboardShortcuts {
  // Navigation
  'ArrowUp': 'Focus previous task',
  'ArrowDown': 'Focus next task',
  'ArrowLeft': 'Collapse node or go to parent',
  'ArrowRight': 'Expand node or go to child',
  'Tab': 'Move to next section',
  'Shift+Tab': 'Move to previous section',

  // Actions
  'Enter': 'Open focused task',
  'Space': 'Toggle node expand/collapse',
  'n': 'New task (quick create)',
  'Shift+n': 'New task (detailed modal)',
  'f': 'Focus filter bar',
  '/': 'Focus search',
  'Escape': 'Clear focus/close modal',

  // Context menu
  'Shift+F10': 'Open context menu for focused task',
  'ContextMenu': 'Open context menu',

  // Help
  '?': 'Show keyboard shortcuts overlay',
}
```

**Accessibility Requirements**:
1. **ARIA attributes**:
   - `role="tree"` for tree container
   - `role="treeitem"` for nodes/tasks
   - `aria-expanded` for expandable nodes
   - `aria-level` for tree depth
   - `aria-setsize` and `aria-posinset` for position
2. **Focus management**:
   - Visual focus indicator (use `--vscode-focusBorder`)
   - Focus trap in modals
   - Restore focus after modal close
3. **Screen reader support**:
   - Announce task counts
   - Announce filter changes
   - Announce task creation/deletion

**Help Overlay**:
- Press `?` to show keyboard shortcuts
- Modal with categorized shortcuts
- Use `.glass-modal` styling

**Testing**:
- Tab through all interactive elements
- Navigate tree with arrow keys
- Operate all actions with keyboard only

---

### Task 3.7: Phase 3 Audit and Sign-Off
**File**: [`task3.7_phase-3-audit-and-sign-off.md`](task3.7_phase-3-audit-and-sign-off.md)

**Goal**: Confirm sidebar UI meets requirements and is ready for Phase 4.

**Audit Document**: Create `phase-3-sidebar-ui/phase-3-audit.md`

**Checklist**:
- ✅ Task 3.0: Sidebar shell design approved
- ✅ Task 3.1: Sidebar wired to task data
- ✅ Task 3.2: Filters and quick views functional
- ✅ Task 3.3: Project tree renders correctly
- ✅ Task 3.4: New task modal working
- ✅ Task 3.5: Context menus functional
- ✅ Task 3.6: Keyboard navigation complete

**UX Validation**:
- [ ] UI matches approved design system
- [ ] All interactions feel responsive
- [ ] Filters update task list correctly
- [ ] Task creation writes files to correct location
- [ ] Context menu actions work (copy, move, archive, delete)
- [ ] Keyboard shortcuts work
- [ ] No known UX issues

**Technical Validation**:
- [ ] File watcher refreshes sidebar on external changes
- [ ] Message protocol handles all interactions
- [ ] No TypeScript errors
- [ ] No runtime errors in console
- [ ] Performance is acceptable (< 100ms to load 1000 tasks)

**Documentation**:
- [ ] Add JSDoc comments to all components
- [ ] Update README with sidebar usage
- [ ] Document keyboard shortcuts in help overlay

**Sign-Off**: Mark as "Checked" before starting Phase 4.

---

## Critical Implementation Notes

### DO NOT Duplicate Existing Code

**These files ALREADY EXIST** (do not recreate):
- [`src/webview/SidebarProvider.ts`](../../src/webview/SidebarProvider.ts:1) - Sidebar webview provider
- [`src/webview/messaging.ts`](../../src/webview/messaging.ts:1) - Message protocol
- [`src/services/scanner.ts`](../../src/services/scanner.ts:1) - Task loading
- [`src/services/frontmatter.ts`](../../src/services/frontmatter.ts:1) - Task parsing
- [`src/services/copy.ts`](../../src/services/copy.ts:1) - Copy to clipboard
- [`src/services/archive.ts`](../../src/services/archive.ts:1) - Archive tasks
- [`src/core/constants.ts`](../../src/core/constants.ts:1) - STAGES and folder names
- [`src/core/rules.ts`](../../src/core/rules.ts:1) - Stage transition rules

**USE these existing implementations** - do not rewrite them.

### File Paths and Conventions

**Absolute paths required**:
- All file operations use absolute paths (from `workspaceRoot`)
- Task `filePath` is absolute
- Use `path.join(workspaceRoot, KANBAN_FOLDER, ...)` for safe path construction

**Immutable folder structure**:
```
.kanban2code/
├── inbox/                   # DO NOT CHANGE
├── projects/                # DO NOT CHANGE
│   └── {project}/
│       └── {phase}/
├── _agents/                 # DO NOT CHANGE
├── _templates/              # DO NOT CHANGE
│   ├── stages/
│   └── tasks/
└── _archive/                # DO NOT CHANGE
```

### Message Protocol Usage

**Sending messages to webview** (from extension host):
```typescript
import { createEnvelope } from './messaging';

// Send initial state
webview.postMessage(createEnvelope('InitState', {
  tasks: allTasks,
  workspaceRoot: workspaceRoot,
}));

// Send task update
webview.postMessage(createEnvelope('TaskUpdated', {
  task: updatedTask,
}));
```

**Receiving messages from webview** (in extension host):
```typescript
webview.onDidReceiveMessage(async (envelope) => {
  const { type, payload } = validateEnvelope(envelope);

  switch (type) {
    case 'CreateTask':
      // Handle task creation
      break;
    case 'MoveTask':
      // Handle task move
      break;
    case 'CopyContext':
      // Handle copy to clipboard
      break;
  }
});
```

**Posting messages from React** (webview):
```typescript
import { createMessage } from './messaging';

// Create task
vscode.postMessage(createMessage('CreateTask', {
  title: 'New task',
  location: 'inbox',
  stage: 'inbox',
}));
```

### React Component Structure

**Recommended folder structure**:
```
src/webview/ui/
├── App.tsx                          # Main entry (replace placeholder)
├── main.tsx                         # React root (keep as-is)
├── components/
│   ├── Sidebar.tsx                  # Main sidebar container
│   ├── SidebarToolbar.tsx           # Top toolbar
│   ├── SidebarActions.tsx           # Action buttons
│   ├── QuickFilters.tsx             # Stage filter chips
│   ├── FilterBar.tsx                # Project/tag filters
│   ├── TaskTree.tsx                 # Tree container
│   ├── TreeSection.tsx              # Inbox or Projects section
│   ├── TreeNode.tsx                 # Project/phase node
│   ├── TaskItem.tsx                 # Individual task
│   ├── TaskModal.tsx                # Create/edit task modal
│   ├── ContextMenu.tsx              # Generic context menu
│   ├── EmptyState.tsx               # Empty board state
│   └── KeyboardHelp.tsx             # Keyboard shortcuts overlay
├── hooks/
│   ├── useTaskData.ts               # Task data management
│   ├── useFilters.ts                # Filter state management
│   └── useKeyboard.ts               # Keyboard navigation
└── styles/
    └── main.css                     # Import design system styles
```

**Import design system styles** (in `src/webview/ui/styles/main.css`):
```css
/* Import design system from docs/design */
@import url('../../../docs/design/styles/variables.css');
@import url('../../../docs/design/styles/glassmorphic.css');
@import url('../../../docs/design/styles/components.css');
@import url('../../../docs/design/styles/sidebar.css');

/* Add any component-specific overrides here */
```

### VS Code API Usage

**Get workspace root**:
```typescript
import * as vscode from 'vscode';

const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
if (!workspaceRoot) {
  throw new Error('No workspace folder open');
}
```

**Write file**:
```typescript
import * as vscode from 'vscode';

const fileUri = vscode.Uri.file(absolutePath);
await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
```

**Open file in editor**:
```typescript
const doc = await vscode.workspace.openTextDocument(fileUri);
await vscode.window.showTextDocument(doc);
```

**Copy to clipboard**:
```typescript
await vscode.env.clipboard.writeText(content);
vscode.window.showInformationMessage('Copied to clipboard');
```

---

## Testing Strategy

### Manual Testing (Phase 3)

**For each task**:
1. Test in actual VS Code environment (not just browser)
2. Verify UI matches design system
3. Test with empty workspace (no kanban)
4. Test with populated workspace (multiple projects/tasks)
5. Test edge cases (long names, special characters, many tasks)

**Regression testing**:
- Ensure Phase 0/1/2 functionality still works
- Workspace scaffolding still creates correct structure
- Task loading still works
- Context copy still works

### Automated Testing (Phase 4.6)

**Unit tests** (to be added in Phase 4.6):
- Component rendering tests (React Testing Library)
- Filter logic tests
- Tree transformation tests
- Keyboard navigation tests

**Integration tests**:
- Task creation flow
- Context menu actions
- File watcher integration

---

## Common Pitfalls to Avoid

1. **DO NOT store `project` or `phase` in frontmatter** - these are inferred from file path
2. **DO NOT create new message types** without adding to `messaging.ts` enum
3. **DO NOT hardcode colors** - use CSS variables from `variables.css`
4. **DO NOT use absolute imports** for design system - use relative paths
5. **DO NOT recreate existing services** - import and use them
6. **DO NOT ignore stage transition rules** - use `isTransitionAllowed()` from `rules.ts`
7. **DO NOT skip empty state UI** - always handle no workspace/no tasks
8. **DO NOT forget focus management** - restore focus after modal close
9. **DO NOT skip ARIA attributes** - required for accessibility
10. **DO NOT test only in browser** - VS Code webview has different constraints

---

## Success Criteria

Phase 3 is complete when:

- [ ] Sidebar webview renders in VS Code sidebar
- [ ] Sidebar loads and displays all tasks from workspace
- [ ] Project tree correctly groups tasks by project/phase
- [ ] Filters (project/tags/stage) work correctly
- [ ] Quick views (Today's Focus, etc.) work
- [ ] New task modal creates files in correct locations
- [ ] Context menu shows correct actions for each task
- [ ] Copy to clipboard works (all 3 modes)
- [ ] Archive/delete tasks work
- [ ] Keyboard navigation works (all shortcuts)
- [ ] Help overlay shows on `?` key
- [ ] File watcher refreshes sidebar on external changes
- [ ] UI matches approved design system
- [ ] No TypeScript/runtime errors
- [ ] Accessibility requirements met (ARIA, focus, keyboard)
- [ ] Phase 3 audit document completed and approved

---

## Next Phase Preview

**Phase 4: Board Webview** will:
- Create Kanban board panel (horizontal columns or swimlanes)
- Implement drag-and-drop between stages
- Share filter state with sidebar
- Add board-specific views (swimlanes, grouping)
- Add task detail panel
- Complete comprehensive testing

The sidebar built in Phase 3 will serve as the persistent navigation/command center, while the board (Phase 4) provides the visual workflow view.

---

## File Reference Quick Links

### Core Implementation Files
- [`src/webview/SidebarProvider.ts`](../../src/webview/SidebarProvider.ts:1)
- [`src/webview/ui/App.tsx`](../../src/webview/ui/App.tsx:1)
- [`src/webview/messaging.ts`](../../src/webview/messaging.ts:1)
- [`src/services/scanner.ts`](../../src/services/scanner.ts:139)
- [`src/services/copy.ts`](../../src/services/copy.ts:1)
- [`src/services/archive.ts`](../../src/services/archive.ts:1)
- [`src/core/constants.ts`](../../src/core/constants.ts:3)
- [`src/core/rules.ts`](../../src/core/rules.ts:1)

### Design System Files
- [`docs/design/sidebar.html`](../../docs/design/sidebar.html) ⭐ PRIMARY REFERENCE
- [`docs/design/styles/variables.css`](../../docs/design/styles/variables.css)
- [`docs/design/styles/sidebar.css`](../../docs/design/styles/sidebar.css)
- [`docs/design/styles/components.css`](../../docs/design/styles/components.css)
- [`docs/design/styles/glassmorphic.css`](../../docs/design/styles/glassmorphic.css)
- [`docs/design/components/modals.html`](../../docs/design/components/modals.html)
- [`docs/design/forms/task.html`](../../docs/design/forms/task.html)

### Roadmap Context
- [`roadmap/roadmap_context.md`](../roadmap_context.md)
- [`docs/architecture.md`](../../docs/architecture.md)

---

**Last Updated**: 2025-12-11
**Phase Status**: Ready to begin Task 3.0 (design approval)
**Dependencies**: Phase 2 complete ✅
