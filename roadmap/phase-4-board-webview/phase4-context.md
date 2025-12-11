# Phase 4: Board Webview - Implementation Context

## Overview

Phase 4 delivers a fully functional Kanban board webview that provides visual task workflow management. The board complements the sidebar built in Phase 3 by offering a card-based, drag-and-drop interface for task management. Phase 4 includes integration with the sidebar's filter state, task synchronization, and a comprehensive component testing layer.

**Status**: 🚧 PLANNED (ready to begin after Phase 3 completion)

**Dependencies**:
- ✅ Phase 0: Foundation (extension skeleton, webview infrastructure, workspace scaffolding)
- ✅ Phase 1: Filesystem (task loading, stage management, file watcher - partial)
- ✅ Phase 2: Context System (9-layer context, XML prompt builder, copy system)
- ✅ Phase 3: Sidebar UI (sidebar webview, task data wiring, filters, tree navigation)

**Key Deliverables**:
1. Board webview shell with two layout modes (columns and swimlanes)
2. Real task data wired to board columns
3. Drag-and-drop stage transitions
4. Filter state synchronization with sidebar
5. Task detail panel and quick actions
6. Swimlane view (project/phase grouping)
7. Comprehensive webview component testing

---

## Design System Reference

### Board Design Files

All board-specific designs are located in [`docs/design/`](../../docs/design/):

**Layouts**:
- [`docs/design/board.html`](../../docs/design/board.html) - **PRIMARY** Horizontal columns layout (stages: Inbox → Plan → Code → Audit → Completed)
- [`docs/design/board-swimlane.html`](../../docs/design/board-swimlane.html) - Swimlane layout (grouped by project/phase)
- [`docs/design/index.html`](../../docs/design/index.html) - Design system hub

**Component Designs**:
- [`docs/design/components/modals.html`](../../docs/design/components/modals.html) - Task detail modals, context menus
- [`docs/design/components/empty-states.html`](../../docs/design/components/empty-states.html) - Empty board state
- [`docs/design/forms/task.html`](../../docs/design/forms/task.html) - Task creation/edit form (reuse from Phase 3)
- [`docs/design/forms/quick-task.html`](../../docs/design/forms/quick-task.html) - Quick inline task creation

**Design System Styles** (imported in webview):
- [`docs/design/styles/variables.css`](../../docs/design/styles/variables.css) - CSS custom properties (immutable)
- [`docs/design/styles/board.css`](../../docs/design/styles/board.css) - **Board-specific styles** (columns, header, filters)
- [`docs/design/styles/card.css`](../../docs/design/styles/card.css) - **Task card styles** (dragging, hover, states)
- [`docs/design/styles/glassmorphic.css`](../../docs/design/styles/glassmorphic.css) - Glass effects
- [`docs/design/styles/components.css`](../../docs/design/styles/components.css) - Base component styles

### Design Principles (Immutable)

**Navy Night Gradient Theme**:
```css
Background: linear-gradient(180deg, #0d111c → #101524 → #121829)
Sidebar bg: #0c101b
Panel bg: #161b2b
Borders: #2a3147
```

**Stage Colors** (from sidebar, immutable):
```css
--stage-inbox: #3b82f6      /* Blue - new tasks */
--stage-plan: #5d6b85       /* Muted slate - planning */
--stage-code: #22c55e       /* Green - in development */
--stage-audit: #facc15      /* Yellow - review/testing */
--stage-completed: #5d6b85  /* Slate - done */
```

**Tag Colors** (semantic):
```css
--tag-bug: #ef4444          /* Red */
--tag-feature: #3b82f6      /* Blue */
--tag-mvp: #60a5fa          /* Light blue */
--tag-urgent: #facc15       /* Yellow */
--tag-idea: #22c55e         /* Green */
--tag-spike: #ef4444        /* Red */
```

**Spacing System** (immutable):
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 24px
```

---

## Architecture Context

### Sidebar Integration (Phase 3 Prerequisites)

**Sidebar Webview** ([`src/webview/SidebarProvider.ts`](../../src/webview/SidebarProvider.ts)):
- Sidebar is the persistent left panel in VS Code
- Handles task tree, filters, quick views, new task modal
- Maintains filter state that must be shared with board

**Board Webview** ([`src/webview/KanbanPanel.ts`](../../src/webview/KanbanPanel.ts)):
- Board is a separate webview in the editor area
- Receives filter state from sidebar via message protocol
- Displays tasks in columns or swimlanes
- Handles drag-and-drop, task creation, detail view

### Message Protocol (Extend from Phase 2-3)

**Key Message Types** ([`src/webview/messaging.ts`](../../src/webview/messaging.ts)):

```typescript
// Host → Webview messages
type MessageType =
  | 'InitState'           // Initial board load with tasks and filters
  | 'TaskUpdated'         // Task changed (via file watcher or sidebar)
  | 'FilterChanged'       // Filter state changed in sidebar
  | 'TaskSelected'        // Task selected in sidebar/board
  | 'BoardLayoutChanged'  // Layout mode toggled (columns ↔ swimlanes)
  | 'SyncLayout'          // Sync layout preference between sidebar and board

// Webview → Host messages
  | 'CreateTask'          // User clicked "New Task"
  | 'MoveTask'            // Task drag-dropped to new stage
  | 'CopyContext'         // Copy task context to clipboard
  | 'OpenTaskDetail'      // Open task detail panel
  | 'DeleteTask'          // Delete task
  | 'ALERT';              // Placeholder utility
```

**Filter State Object**:
```typescript
interface FilterState {
  project?: string;           // 'all' | 'inbox' | project name
  stages: Stage[];            // ['inbox', 'plan', 'code', 'audit', 'completed']
  tags?: string[];            // Filter by tags
  search?: string;            // Search term
  quickView?: string;         // 'today' | 'in-progress' | 'bugs' | etc.
}
```

### Existing Services (DO NOT RECREATE)

**Task Management** ([`src/services/scanner.ts`](../../src/services/scanner.ts)):
```typescript
async function loadAllTasks(kanbanRoot: string): Promise<Task[]>
async function findTaskById(kanbanRoot: string, taskId: string): Promise<Task | undefined>
```

**File Operations** ([`src/services/frontmatter.ts`](../../src/services/frontmatter.ts)):
```typescript
async function parseTaskFile(filePath: string): Promise<Task>
function stringifyTaskFile(task: Task, originalContent?: string): string
```

**Stage Management** ([`src/services/stage-manager.ts`](../../src/services/stage-manager.ts)):
```typescript
async function updateTaskStage(taskId: string, newStage: Stage): Promise<void>
```

**Copy System** ([`src/services/copy.ts`](../../src/services/copy.ts)):
```typescript
async function buildCopyPayload(task: Task, mode: CopyMode = 'full_xml', root?: string): Promise<string>
```

**Task Interface** ([`src/types/task.ts`](../../src/types/task.ts)):
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
```

---

## Sidebar and Board Integration Strategy

### How Sidebar and Board Work Together

**Sidebar** (Phase 3):
- Task tree view organized by project/phase
- Filter controls (project dropdown, tag multi-select, stage chips)
- Quick views (preset filters)
- New task modal
- Right-click context menus
- Click task → opens markdown file

**Board** (Phase 4):
- Kanban columns view (stages as columns)
- Swimlane view (projects as rows)
- Drag-and-drop between columns
- Search and filter synchronized with sidebar
- Click task → opens task detail panel or markdown file
- Persistent layout preference

### Message Flow Between Sidebar and Board

```
User filters in sidebar
    ↓
Sidebar sends "FilterChanged" message
    ↓
Host receives message, broadcasts to board
    ↓
Board receives "FilterChanged" message
    ↓
Board re-filters tasks and updates display

User drags task in board
    ↓
Board sends "MoveTask" message
    ↓
Host updates file and reloads tasks
    ↓
Host broadcasts "TaskUpdated" to sidebar
    ↓
Both sidebar and board update display
```

### Shared State Strategy

**Layout Preference** (localStorage in webview):
- User toggles layout in board (columns ↔ swimlanes)
- Preference persists across sessions
- Optional: Sync with sidebar via message if sidebar has layout toggle

**Filter State** (managed by host):
- Sidebar owns filter controls
- Board receives filter state updates via messages
- Board applies filters locally (client-side)
- Both sidebar and board maintain identical filter state

---

## Phase 4 Task Breakdown

### Task 4.0: Design Board Shell (UI Only)
**File**: [`task4.0_design-board-shell-ui-only.md`](task4.0_design-board-shell-ui-only.md)

**Goal**: Design and approve board layout before implementation.

**Scope**:
- Create `<BoardShell />` React component (presentational only)
- Implement both layout modes:
  - **Columns View**: Five vertical columns (Inbox, Plan, Code, Audit, Completed)
  - **Swimlane View**: Projects/phases as rows, stages as columns
- Top bar:
  - Search input
  - Project dropdown filter
  - Stage filter chips (inbox/plan/code/audit/completed)
  - Layout toggle buttons (columns ↔ swimlanes)
  - "New Task" button
- Static/fake task cards with dummy data
- Empty state when no tasks
- **NO** filesystem calls or real data yet

**Visual References**:
- [`docs/design/board.html`](../../docs/design/board.html) - Columns layout
- [`docs/design/board-swimlane.html`](../../docs/design/board-swimlane.html) - Swimlane layout

**Styling**:
- Use `.board-container` wrapper
- Use `.board-header` for top bar
- Use `.board-horizontal` for columns view (flex horizontal)
- Use `.board-swimlane` for swimlane view (vertical rows)
- Use `.column` or `.swimlane` for each section
- Use `.task-card` for task cards
- Import design system styles from `docs/design/styles/`

**Deliverable**: Approved visual design before Task 4.1 begins.

---

### Task 4.1: Implement Board Layout and Data Flow
**File**: [`task4.1_implement-board-layout-and-data-flow.md`](task4.1_implement-board-layout-and-data-flow.md)

**Goal**: Wire approved board shell to real task data and message protocol.

**Key Files to Modify**:
- [`src/webview/KanbanPanel.ts`](../../src/webview/KanbanPanel.ts) - Board webview provider (ALREADY EXISTS)
- [`src/webview/ui/App.tsx`](../../src/webview/ui/App.tsx:1) - Detect context (sidebar vs board) and render correct UI
- [`src/webview/messaging.ts`](../../src/webview/messaging.ts:1) - Extend message types if needed

**New Components to Create**:
```
src/webview/ui/
├── components/
│   ├── Board.tsx                    # Main board container
│   ├── BoardHeader.tsx              # Top bar with search, filters, layout toggle
│   ├── BoardFilters.tsx             # Filter controls
│   ├── BoardSearch.tsx              # Search input
│   ├── LayoutToggle.tsx             # Columns ↔ Swimlanes toggle
│   ├── BoardHorizontal.tsx          # Columns view container
│   ├── BoardSwimlane.tsx            # Swimlane view container
│   ├── Column.tsx                   # Single stage column
│   ├── Swimlane.tsx                 # Single project/phase swimlane
│   ├── TaskCard.tsx                 # Task card component
│   └── TaskDetailPanel.tsx          # Task detail view
├── hooks/
│   ├── useBoardData.ts              # Task data management
│   ├── useFilters.ts                # Filter state (shared with sidebar)
│   └── useBoardLayout.ts            # Layout preference (columns/swimlanes)
└── styles/
    └── board.css                    # Import design system + overrides
```

**Wiring Requirements**:

1. **Detect Context** (sidebar vs board):
   - Check `webview.options.retainContextWhenHidden` or message from host
   - Render `<Sidebar />` or `<Board />` accordingly
   - **Strategy**: Add `context` field to InitState message:
     ```typescript
     webview.postMessage(createEnvelope('InitState', {
       context: 'sidebar' | 'board',  // NEW
       tasks: allTasks,
       workspaceRoot: workspaceRoot,
       filterState?: { ... }          // NEW: Send current filters to board
     }));
     ```

2. **Load Task Data**:
   - Receive tasks from InitState message
   - Group tasks by stage (for columns view)
   - Group tasks by project/phase, then stage (for swimlane view)
   - Apply filters to both views

3. **Handle Filter State**:
   - Board receives "FilterChanged" message from host when sidebar filters change
   - Apply filters client-side in real-time
   - Show filtered task counts in column/swimlane headers

4. **Layout Persistence**:
   - Store layout preference in localStorage: `kanban2code.boardLayout`
   - Default: 'columns'
   - Read on mount, apply, update when user toggles

5. **Message Handlers**:
   ```typescript
   // Host → Webview
   case 'InitState':
     setTasks(payload.tasks);
     setFilterState(payload.filterState);
     setContext(payload.context);
     loadLayoutPreference();
     break;

   case 'FilterChanged':
     setFilterState(payload.filters);
     // Board updates display automatically
     break;

   case 'TaskUpdated':
     // Update single task in state
     replaceTasks(payload.task);
     break;
   ```

6. **Task Grouping Logic**:
   ```typescript
   // Columns view: Group by stage
   const columnsByStage = tasks
     .filter(applyFilters)
     .reduce((acc, task) => {
       if (!acc[task.stage]) acc[task.stage] = [];
       acc[task.stage].push(task);
       return acc;
     }, {});

   // Swimlane view: Group by project/phase, then stage
   const swimlanesByProject = tasks
     .filter(applyFilters)
     .reduce((acc, task) => {
       const key = `${task.project || 'inbox'}/${task.phase || ''}`;
       if (!acc[key]) acc[key] = { project: task.project || 'inbox', phase: task.phase, tasks: [] };
       acc[key].tasks.push(task);
       return acc;
     }, {});
   ```

**State Management**:
- Use React hooks (useState, useEffect) with custom hooks
- Custom hooks to manage:
  - Task data and filtering
  - Filter state (synced from sidebar)
  - Layout preference (columns/swimlanes)
- **Future**: Zustand store (Phase 4.5+)

---

### Task 4.2: Implement TaskCard Component
**File**: [`task4.2_implement-taskcard-component.md`](task4.2_implement-taskcard-component.md)

**Goal**: Create reusable task card component with all interactions.

**New Component**:
```typescript
// src/webview/ui/components/TaskCard.tsx
interface TaskCardProps {
  task: Task;
  onCardClick?: (task: Task) => void;
  onOpen?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onMoreClick?: (task: Task, event: React.MouseEvent) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}
```

**Card Structure** (from design):
```
┌─────────────────────────────────┐
│ [Title]              [···]       │  ← card-header
│                       [o] [x] [>]│     (hover shows actions)
├─────────────────────────────────┤
│ auth-system / phase-1           │  ← card-breadcrumb
├─────────────────────────────────┤
│ [bug] [urgent] [mvp]            │  ← card-tags
├─────────────────────────────────┤
│ 3 days ago • assigned to alex   │  ← card-footer
└─────────────────────────────────┘
```

**Card Features**:
1. **Display**:
   - Task title as clickable link
   - Project/phase breadcrumb (if not inbox)
   - Tags as colored badges
   - Footer with created date and assignee (if available)
   - Hover effect: slight lift, shadow

2. **Actions** (on hover):
   - Open file icon → Open markdown in editor
   - Delete icon → Delete task (with confirmation)
   - More icon → Context menu

3. **Drag-and-Drop**:
   - `draggable={true}` for browser drag
   - `onDragStart`: Store task data in `e.dataTransfer`
   - `onDragEnd`: Clear visual feedback
   - Dragging state: opacity, transform, shadow

4. **Styling**:
   - Use `.task-card` base class
   - Use `.task-card.dragging` for drag state
   - Use `.card-header`, `.card-breadcrumb`, `.card-tags`, `.card-footer` for sections
   - Use `.card-tag.{tagname}` for tag styling
   - Import from `docs/design/styles/card.css`

5. **Accessibility**:
   - `role="button"` for card
   - `aria-label` for actions
   - Keyboard support: Enter/Space to open, Delete to delete

---

### Task 4.3: Implement Drag-and-Drop Stage Changes
**File**: [`task4.3_implement-drag-and-drop-stage-changes.md`](task4.3_implement-drag-and-drop-stage-changes.md)

**Goal**: Enable dragging tasks between stages.

**Drag-and-Drop Implementation**:

1. **Source** (TaskCard):
   ```typescript
   const handleDragStart = (e: React.DragEvent) => {
     e.dataTransfer.effectAllowed = 'move';
     e.dataTransfer.setData('application/task', JSON.stringify(task));
     setDragging(true);
   };
   ```

2. **Drop Target** (Column or Swimlane):
   ```typescript
   const handleDragOver = (e: React.DragEvent) => {
     e.preventDefault();
     e.dataTransfer.dropEffect = 'move';
     setDropActive(true);  // Visual feedback
   };

   const handleDrop = async (e: React.DragEvent, targetStage: Stage) => {
     e.preventDefault();
     const taskData = JSON.parse(e.dataTransfer.getData('application/task'));

     // Check if transition is allowed
     if (!isTransitionAllowed(taskData.stage, targetStage)) {
       showError('Cannot move to this stage');
       return;
     }

     // Send move request to host
     vscode.postMessage(createMessage('MoveTask', {
       taskId: taskData.id,
       newStage: targetStage,
     }));
   };
   ```

3. **Host Handler** ([`src/services/stage-manager.ts`](../../src/services/stage-manager.ts)):
   ```typescript
   // In SidebarProvider/KanbanPanel message handler
   case 'MoveTask':
     await updateTaskStage(payload.taskId, payload.newStage);
     const updatedTask = await findTaskById(workspaceRoot, payload.taskId);

     // Broadcast update to all webviews
     webview.postMessage(createEnvelope('TaskUpdated', { task: updatedTask }));
     break;
   ```

4. **Visual Feedback**:
   - Column hover: Background highlight `.column.drop-active`
   - Card being dragged: `.task-card.dragging`
   - Cursor: `copy` or `not-allowed` based on `isTransitionAllowed()`

5. **Stage Transition Rules** ([`src/core/rules.ts`](../../src/core/rules.ts)):
   - Forward-only: inbox → plan → code → audit → completed
   - Use `isTransitionAllowed(from, to)` before moving
   - Show error toast if transition not allowed

6. **Optimistic Updates** (optional):
   - Update UI immediately when drag ends
   - Revert on server error
   - Or wait for "TaskUpdated" message to confirm

---

### Task 4.4: Sync Filters and Search Between Sidebar and Board
**File**: [`task4.4_sync-filters-and-search-between-sidebar-and-board.md`](task4.4_sync-filters-and-search-between-sidebar-and-board.md)

**Goal**: Ensure sidebar and board always show same filtered tasks.

**Filter State Management**:

1. **Sidebar** (Phase 3 - already implemented):
   - Has filter controls: project dropdown, tag multi-select, stage chips, search
   - Updates its own display when filters change
   - Sends "FilterChanged" message to host on change

2. **Host** (Extension):
   ```typescript
   // In SidebarProvider or central message handler
   onDidReceiveMessage(async (message) => {
     if (message.type === 'FilterChanged') {
       // Broadcast to all webviews
       kanbanPanel?.webview.postMessage(createEnvelope('FilterChanged', {
         filters: message.payload.filters,
       }));
     }
   });
   ```

3. **Board** (Phase 4):
   ```typescript
   // Receive filter updates from sidebar
   onMessage.addListener((envelope) => {
     if (envelope.type === 'FilterChanged') {
       setFilterState(envelope.payload.filters);
       // Re-render with filtered tasks (automatic due to React deps)
     }
   });

   // Apply filters to tasks
   const filteredTasks = tasks.filter(task => {
     // Project filter
     if (filters.project && filters.project !== 'all') {
       if (filters.project === 'inbox' && task.project) return false;
       if (filters.project !== 'inbox' && task.project !== filters.project) return false;
     }

     // Stage filter
     if (!filters.stages.includes(task.stage)) return false;

     // Tag filter
     if (filters.tags?.length > 0) {
       if (!task.tags?.some(tag => filters.tags.includes(tag))) return false;
     }

     // Search filter
     if (filters.search) {
       const searchTerm = filters.search.toLowerCase();
       if (!task.title.toLowerCase().includes(searchTerm) &&
           !task.content.toLowerCase().includes(searchTerm)) {
         return false;
       }
     }

     return true;
   });
   ```

4. **Search Implementation**:
   - Sidebar search → filters sidebar task list
   - Sends "FilterChanged" with search term
   - Board receives and filters its display
   - Search is case-insensitive, matches title and content

5. **State Consistency**:
   - Filter state is the source of truth (managed by host)
   - Both sidebar and board receive same filter state
   - Both apply filters identically
   - Local filtering is fast (no server roundtrips)

---

### Task 4.5: Implement Add Follow-up in Inbox From Board
**File**: [`task4.5_implement-add-follow-up-in-inbox-from-board.md`](task4.5_implement-add-follow-up-in-inbox-from-board.md)

**Goal**: Enable quick follow-up task creation from board, with parent task reference.

**Implementation**:

1. **UI**: Add "+" button on task cards or in column header
   - Click → Show quick task creation modal
   - Modal has minimal fields (title, parent task reference)
   - Uses same modal as Phase 3 new task modal

2. **Task Creation**:
   ```typescript
   // From quick modal or context menu
   vscode.postMessage(createMessage('CreateTask', {
     title: 'New follow-up task',
     stage: 'inbox',
     location: 'inbox',
     parent: parentTaskId,  // Reference to current task
     template?: null,
   }));
   ```

3. **Host Handler**:
   - Create new file in `.kanban2code/inbox/`
   - Use Phase 3 task creation logic from [`src/services/scanner.ts`](../../src/services/scanner.ts)
   - Set `parent` field in frontmatter
   - Return new task to webview

4. **Display in Sidebar**:
   - Phase 3 sidebar tree shows parent-child relationships
   - Parent task can be expanded to show child tasks (optional enhancement)

---

### Task 4.6: Implement Webview Component Tests (Board + Sidebar)
**File**: [`task4.6_implement-webview-component-tests-board-sidebar.md`](task4.6_implement-webview-component-tests-board-sidebar.md)

**Goal**: Add automated tests for webview components (React Testing Library + Vitest).

**Test Setup**:
```
tests/webview/
├── components/
│   ├── Sidebar.test.tsx
│   ├── TaskItem.test.tsx
│   ├── TaskTree.test.tsx
│   ├── Board.test.tsx
│   ├── TaskCard.test.tsx
│   ├── Column.test.tsx
│   └── Swimlane.test.tsx
├── hooks/
│   ├── useTaskData.test.ts
│   ├── useFilters.test.ts
│   └── useBoardLayout.test.ts
└── integration/
    ├── sidebar-board-sync.test.tsx
    └── task-creation-flow.test.tsx
```

**Test Coverage Areas**:

1. **Component Rendering**:
   - Sidebar renders with task list
   - Board renders columns correctly
   - Task cards display all fields
   - Empty states show when appropriate

2. **Filter Logic**:
   - Filtering by project works
   - Filtering by stage works
   - Filtering by tags works
   - Search filters work
   - Multiple filters combine (AND logic)

3. **Drag-and-Drop**:
   - Drag initiates correctly
   - Drop on valid target succeeds
   - Drop on invalid target rejected
   - Invalid transitions blocked

4. **Message Protocol**:
   - InitState message received and applied
   - FilterChanged message updates display
   - TaskUpdated message refreshes task
   - MoveTask message sent correctly

5. **Sidebar-Board Integration**:
   - Filter change in sidebar syncs to board
   - Task update in board syncs to sidebar
   - Layout preference persists
   - Task creation creates in correct location

**Test Examples**:
```typescript
// Sidebar filters task list
test('sidebar filters tasks by stage', () => {
  const tasks = [
    { id: '1', stage: 'inbox', title: 'Task 1' },
    { id: '2', stage: 'plan', title: 'Task 2' },
  ];
  const { getByText, queryByText } = render(
    <Sidebar tasks={tasks} filters={{ stages: ['inbox'] }} />
  );

  expect(getByText('Task 1')).toBeInTheDocument();
  expect(queryByText('Task 2')).not.toBeInTheDocument();
});

// Drag-and-drop works
test('dragging task between columns updates stage', async () => {
  const handleMoveTask = jest.fn();
  const { getByText } = render(
    <Board tasks={mockTasks} onMoveTask={handleMoveTask} />
  );

  const card = getByText('Fix auth token refresh');
  fireEvent.dragStart(card);
  fireEvent.drop(screen.getByText('Code'));

  expect(handleMoveTask).toHaveBeenCalledWith({
    taskId: 'task-1',
    newStage: 'code',
  });
});
```

---

### Task 4.7: Phase 4 Audit and Sign-Off
**File**: [`task4.7_phase-4-audit-and-sign-off.md`](task4.7_phase-4-audit-and-sign-off.md)

**Goal**: Confirm board webview meets requirements and is ready for Phase 5.

**Audit Document**: Create `phase-4-board-webview/phase-4-audit.md`

**Checklist**:
- ✅ Task 4.0: Board shell design approved
- ✅ Task 4.1: Board wired to task data
- ✅ Task 4.2: TaskCard component functional
- ✅ Task 4.3: Drag-and-drop stage changes work
- ✅ Task 4.4: Filters synced between sidebar and board
- ✅ Task 4.5: Quick follow-up task creation works
- ✅ Task 4.6: Webview component tests passing

**UX Validation**:
- [ ] Board renders in VS Code editor area
- [ ] All tasks appear in columns/swimlanes
- [ ] Columns show correct task counts
- [ ] Filter changes in sidebar update board display
- [ ] Drag-and-drop between columns works
- [ ] Invalid stage transitions blocked
- [ ] Search filters work on both sidebar and board
- [ ] Quick task creation works
- [ ] Task detail panel opens on click
- [ ] Layout preference persists (columns ↔ swimlanes)
- [ ] No visual glitches or layout issues
- [ ] Empty states show when appropriate

**Technical Validation**:
- [ ] All component tests passing (React Testing Library + Vitest)
- [ ] No TypeScript errors
- [ ] No runtime errors in browser console
- [ ] No console errors in VS Code output
- [ ] Performance acceptable (< 200ms for layout with 500 tasks)
- [ ] Memory usage stable (no leaks)
- [ ] Accessibility standards met (ARIA, keyboard nav)

**Integration Validation**:
- [ ] Sidebar and board stay in sync
- [ ] File watcher updates both views
- [ ] Message protocol handles all interactions
- [ ] Task creation/deletion works from both sidebar and board
- [ ] Archive operations work from both views

**Documentation**:
- [ ] Update README with board usage
- [ ] Document keyboard shortcuts
- [ ] Document drag-and-drop behavior
- [ ] Document layout modes (columns/swimlanes)

**Sign-Off**: Mark as "Checked" before starting Phase 5.

---

## Critical Implementation Notes

### DO NOT Duplicate Existing Code

**These files ALREADY EXIST** (do not recreate):
- [`src/webview/SidebarProvider.ts`](../../src/webview/SidebarProvider.ts) - Sidebar provider
- [`src/webview/KanbanPanel.ts`](../../src/webview/KanbanPanel.ts) - Board provider
- [`src/webview/messaging.ts`](../../src/webview/messaging.ts) - Message protocol
- [`src/services/scanner.ts`](../../src/services/scanner.ts) - Task loading
- [`src/services/stage-manager.ts`](../../src/services/stage-manager.ts) - Stage transitions
- [`src/services/copy.ts`](../../src/services/copy.ts) - Copy to clipboard
- [`src/core/constants.ts`](../../src/core/constants.ts) - STAGES and folder names
- [`src/core/rules.ts`](../../src/core/rules.ts) - Transition rules

**USE these existing implementations** - do not rewrite them.

### Webview Context Detection Strategy

Since you have TWO webviews (sidebar and board), they need to know which one they are:

**Option 1**: Pass context in InitState message
```typescript
// Host: SidebarProvider.ts
sidebarPanel.webview.postMessage(createEnvelope('InitState', {
  context: 'sidebar',
  tasks: allTasks,
  workspaceRoot: workspaceRoot,
}));

// Host: KanbanPanel.ts
kanbanPanel.webview.postMessage(createEnvelope('InitState', {
  context: 'board',
  tasks: allTasks,
  workspaceRoot: workspaceRoot,
  filterState: currentFilters,
}));
```

**Option 2**: Use different webview options
```typescript
// SidebarProvider has retainContextWhenHidden = true
// KanbanPanel has retainContextWhenHidden = false (default)
// In App.tsx, detect which it is
```

**Recommended**: Use Option 1 (clearer intent).

### Message Protocol Usage

**Host → Board** (KanbanPanel.ts):
```typescript
// Initial load
kanbanPanel.webview.postMessage(createEnvelope('InitState', {
  context: 'board',
  tasks: allTasks,
  filterState: getFilterState(),
}));

// When sidebar filters change
kanbanPanel.webview.postMessage(createEnvelope('FilterChanged', {
  filters: newFilterState,
}));

// When task file changes (from watcher)
kanbanPanel.webview.postMessage(createEnvelope('TaskUpdated', {
  task: updatedTask,
}));
```

**Board → Host** (KanbanPanel message handler):
```typescript
case 'MoveTask':
  await updateTaskStage(payload.taskId, payload.newStage);
  const task = await findTaskById(workspaceRoot, payload.taskId);
  kanbanPanel.webview.postMessage(createEnvelope('TaskUpdated', { task }));
  sidebarPanel.webview.postMessage(createEnvelope('TaskUpdated', { task }));
  break;

case 'CreateTask':
  const newTask = await createTaskFile(...);
  kanbanPanel.webview.postMessage(createEnvelope('TaskUpdated', { task: newTask }));
  sidebarPanel.webview.postMessage(createEnvelope('TaskUpdated', { task: newTask }));
  break;
```

### React Component Structure (Board)

**Recommended folder structure**:
```
src/webview/ui/
├── App.tsx                          # Entry point - detects sidebar vs board
├── main.tsx                         # React root (keep as-is)
├── components/
│   ├── Sidebar.tsx                  # Main sidebar container (Phase 3)
│   ├── Board.tsx                    # Main board container (Phase 4)
│   ├── BoardHeader.tsx              # Top bar
│   ├── BoardFilters.tsx             # Filter controls
│   ├── BoardHorizontal.tsx          # Columns view
│   ├── BoardSwimlane.tsx            # Swimlane view
│   ├── Column.tsx                   # Stage column
│   ├── Swimlane.tsx                 # Project/phase swimlane
│   ├── TaskCard.tsx                 # Task card
│   ├── TaskDetailPanel.tsx          # Task detail view
│   ├── TaskModal.tsx                # Create/edit modal (reuse Phase 3)
│   └── ContextMenu.tsx              # Context menu (reuse Phase 3)
├── hooks/
│   ├── useTaskData.ts               # Task data management
│   ├── useFilters.ts                # Filter state (shared)
│   ├── useBoardLayout.ts            # Layout preference
│   └── useMessaging.ts              # Message protocol wiring
└── styles/
    └── main.css                     # Import design system + overrides
```

**App.tsx Context Detection**:
```typescript
export const App: React.FC = () => {
  const [context, setContext] = useState<'sidebar' | 'board'>('sidebar');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const envelope = event.data as MessageEnvelope;
      if (envelope.type === 'InitState') {
        setContext(envelope.payload.context || 'sidebar');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return context === 'sidebar' ? <Sidebar /> : <Board />;
};
```

### Import Design System Styles

**In `src/webview/ui/styles/main.css`** (board):
```css
/* Import design system from docs/design */
@import url('../../../docs/design/styles/variables.css');
@import url('../../../docs/design/styles/glassmorphic.css');
@import url('../../../docs/design/styles/components.css');
@import url('../../../docs/design/styles/board.css');
@import url('../../../docs/design/styles/card.css');

/* Any component-specific overrides here */
```

### Drag-and-Drop Implementation Notes

**Browser Drag-and-Drop API** (recommended for webview):
- Uses `onDragStart`, `onDragOver`, `onDrop` events
- No external library needed
- Works in VS Code webview

**Alternative: React Beautiful DND**:
- More polished experience
- More complex setup
- Consider for Phase 5 polish if needed

### File Paths and Conventions

**Absolute paths required**:
- All file operations use absolute paths
- Get from webview: `window.initialData.workspaceRoot`
- Use `path.join()` for safe path construction

**Immutable folder structure**:
```
.kanban2code/
├── inbox/                   # DO NOT CHANGE
├── projects/                # DO NOT CHANGE
│   └── {project}/
│       └── {phase}/
├── _agents/                 # DO NOT CHANGE
├── _templates/              # DO NOT CHANGE
└── _archive/                # DO NOT CHANGE
```

---

## Testing Strategy

### Manual Testing (Phase 4)

**For each task**:
1. Test in actual VS Code environment
2. Verify UI matches design system
3. Test with empty workspace
4. Test with populated workspace (multiple projects/tasks)
5. Test edge cases (long names, special characters, many tasks)
6. Test interaction between sidebar and board

**Regression Testing**:
- Ensure Phase 0/1/2/3 functionality still works
- Sidebar still renders and filters
- Task loading works
- Context copy still works
- Archive operations work

### Automated Testing (Task 4.6)

**Unit Tests**:
- Component rendering (React Testing Library)
- Filter logic
- Task grouping logic
- Message protocol validation

**Integration Tests**:
- Task creation from board
- Drag-and-drop stage transitions
- Sidebar-board filter sync
- File watcher integration

**E2E Tests** (optional, Phase 5):
- Full workflows in VS Code

---

## Common Pitfalls to Avoid

1. **DO NOT store layout preference in Redux/Zustand yet** - Use localStorage only (Phase 5+ for state management)
2. **DO NOT hardcode colors** - Use CSS variables from `variables.css`
3. **DO NOT recreate drag-and-drop** - Use browser API or minimal library
4. **DO NOT forget to sync filter state** - Both sidebar and board must show same tasks
5. **DO NOT test only in browser** - VS Code webview has different constraints
6. **DO NOT ignore accessibility** - ARIA attributes, keyboard nav required
7. **DO NOT duplicate task grouping logic** - Create reusable helper functions
8. **DO NOT ignore empty states** - Always handle no workspace/no tasks
9. **DO NOT skip performance** - Lazy-load tasks for large workspaces
10. **DO NOT forget focus management** - Restore focus after modals/actions

---

## Success Criteria

Phase 4 is complete when:

- [ ] Board webview renders in VS Code editor area
- [ ] Board loads and displays all tasks from workspace
- [ ] Columns view groups tasks by stage correctly
- [ ] Swimlane view groups tasks by project/phase correctly
- [ ] Filters (project/tags/stage/search) work on board
- [ ] Filter changes in sidebar immediately update board
- [ ] Drag-and-drop between columns moves tasks
- [ ] Invalid stage transitions blocked with error message
- [ ] New task modal works from board (reuses Phase 3)
- [ ] Quick follow-up task creation works
- [ ] Task detail panel shows task information
- [ ] Layout preference (columns/swimlanes) persists
- [ ] Search filters work on both sidebar and board
- [ ] All component tests passing (React Testing Library)
- [ ] No TypeScript/runtime errors
- [ ] UI matches approved design system
- [ ] Accessibility requirements met (ARIA, keyboard, screen reader)
- [ ] Sidebar and board stay in sync
- [ ] Performance acceptable (< 200ms for 500 tasks)
- [ ] Phase 4 audit document completed and approved

---

## Next Phase Preview

**Phase 5: Polish and Production** will:
- Implement state management (Zustand store)
- Add comprehensive error handling
- Implement task detail panel with rich editor
- Add keyboard shortcut overlay
- Performance optimization (lazy loading, virtualization)
- Comprehensive E2E testing
- Documentation and help system
- Production build configuration

---

## File Reference Quick Links

### Core Implementation Files
- [`src/webview/KanbanPanel.ts`](../../src/webview/KanbanPanel.ts) - Board provider
- [`src/webview/SidebarProvider.ts`](../../src/webview/SidebarProvider.ts) - Sidebar provider
- [`src/webview/ui/App.tsx`](../../src/webview/ui/App.tsx) - Entry point
- [`src/webview/messaging.ts`](../../src/webview/messaging.ts) - Message protocol
- [`src/services/scanner.ts`](../../src/services/scanner.ts) - Task loading
- [`src/services/stage-manager.ts`](../../src/services/stage-manager.ts) - Stage transitions
- [`src/core/constants.ts`](../../src/core/constants.ts) - Constants
- [`src/core/rules.ts`](../../src/core/rules.ts) - Transition rules

### Design System Files
- [`docs/design/board.html`](../../docs/design/board.html) ⭐ PRIMARY - Columns layout
- [`docs/design/board-swimlane.html`](../../docs/design/board-swimlane.html) - Swimlane layout
- [`docs/design/styles/variables.css`](../../docs/design/styles/variables.css) - CSS variables
- [`docs/design/styles/board.css`](../../docs/design/styles/board.css) - Board styles
- [`docs/design/styles/card.css`](../../docs/design/styles/card.css) - Card styles
- [`docs/design/styles/glassmorphic.css`](../../docs/design/styles/glassmorphic.css) - Glass effects
- [`docs/design/styles/components.css`](../../docs/design/styles/components.css) - Base components

### Roadmap Context
- [`roadmap/roadmap_context.md`](../roadmap_context.md) - Master roadmap
- [`roadmap/phase-3-sidebar-ui/phase3-context.md`](../phase-3-sidebar-ui/phase3-context.md) - Sidebar context
- [`docs/architecture.md`](../../docs/architecture.md) - Architecture docs

---

**Last Updated**: 2025-12-11
**Phase Status**: Ready to begin Task 4.0 (design approval)
**Dependencies**: Phase 3 complete ✅
**Key Decisions**: Two-webview architecture (sidebar + board), client-side filtering with server-side message coordination, localStorage for layout preference
