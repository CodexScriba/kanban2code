---
stage: completed
tags: [feature, p1]
agent: coder
contexts: [skill-frontend-design]
---

# Search, filter, sort — board toolbar

## Goal

Add a toolbar to the board with search, priority filter, sort options, and project filter to help users find and organize tasks.

## Definition of Done

- [x] Search filters cards (case-insensitive partial match on title/tags/taskId) with 200ms debounce
- [x] Priority filter: All/Low/Medium/High (single-select, AND logic)
- [x] Sort: Newest first (default) / Oldest first, stable tiebreaker on taskId
- [x] Project filter: All projects + discovered project slugs (single-select, AND)
- [x] `Showing:` status line updates dynamically
- [x] Filter state persists for board session

## Files

- `src/webview/ui/board.tsx` - modify - wire filter/sort/search to task data
- `src/webview/ui/board.css` - modify - active filter styling

## Tests

- [x] Search matches title substring
- [x] Priority filter shows only matching cards
- [x] Sort reverses card order
- [x] Project filter shows only matching project tasks
- [x] Status line reflects current filters

## Audit Result

- Rating: 9.0/10
- Verdict: Pass
- Verified:
  - Priority filter dropdown includes `All/Low/Medium/High` and is wired (`src/webview/ui/board.tsx`).
  - Sort dropdown includes `Newest first/Oldest first` and is wired (`src/webview/ui/board.tsx`).
  - Project filter includes `All` and discovered project values from task snapshot (`src/webview/ui/board.tsx`).
  - Search input uses `setTimeout/clearTimeout` with `200ms` debounce (`src/webview/ui/board.tsx`).
  - Filters are applied with AND logic in `filterTasks` (`src/webview/ui/board.tsx`).
  - Status line renders `Showing X of Y tasks` (`src/webview/ui/board.tsx`).
  - Sorting uses `createdAt` and `taskId` as deterministic tiebreaker (`src/webview/ui/board.tsx`).
  - Test suite passes: `npm test` => 6 passed, 0 failed.

## Context

The board toolbar should be positioned above the columns and include:
- Search input: text field with 200ms debounce
- Priority dropdown: All, Low, Medium, High
- Sort dropdown: Newest first, Oldest first
- Project dropdown: All + dynamically discovered projects
- Status line: "Showing X of Y tasks"

Filter logic:
- All filters use AND logic (task must match all active filters)
- Search matches: title (partial, case-insensitive), tags (partial, case-insensitive), taskId (partial, case-insensitive)
- Priority filter: exact match on priority field
- Project filter: exact match on project field (or no project for inbox tasks)

Sort logic:
- Newest first: descending by createdAt (derived from filename timestamp)
- Oldest first: ascending by createdAt
- Stable tiebreaker: use taskId to ensure consistent ordering when timestamps are equal

Filter state should persist for the board session (not across VS Code restarts) to maintain user's view during active work.

The status line should update dynamically to show "Showing X of Y tasks" where X is the filtered count and Y is the total count.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/kanbanboard-codex.html`

## Refined Prompt

Objective: Implement search, priority filter, sort, and project filter functionality for the kanban board toolbar with real-time filtering and dynamic status updates.

Implementation approach:
1. Extend the existing filter state management in board.tsx
   - Add state variables for priorityFilter, sortOrder, projectFilter alongside existing activeSearch
   - Use Set to track discovered project slugs from allTasks
   - Add 200ms debounce for search input using setTimeout/clearTimeout pattern
2. Enhance the filterTasks function to apply all filters with AND logic
   - Search: case-insensitive partial match on title, tags, taskId
   - Priority: exact match when not 'all', handle undefined priority as 'none'
   - Project: exact match on project field, include 'inbox' for tasks without project
   - Chain filters: search -> priority -> project
3. Add sorting logic after filtering
   - Newest first: sort by createdAt descending, taskId ascending tiebreaker
   - Oldest first: sort by createdAt ascending, taskId ascending tiebreaker
4. Add dropdown controls to the toolbar HTML structure
   - Priority select: All/Low/Medium/High (use existing .filter-select CSS class)
   - Sort select: Newest first/Oldest first
   - Project select: All + dynamically populated options from discovered projects
   - Add event listeners for change events
5. Update filter-summary status line
   - Show "Showing X of Y tasks" where X = filtered count, Y = total count
   - Update on every filter/sort change
6. Ensure filter state persists for board session
   - State lives in module-level variables (already implemented pattern)
   - No localStorage/sessionStorage needed (session-only requirement)

Key decisions:
- Debounce: 200ms balances responsiveness with performance
- AND logic: All active filters must match (intuitive for narrowing results)
- Sort after filter: Sorting operates on filtered subset, not all tasks
- Project discovery: Scan allTasks to build unique project list dynamically
- Inbox tasks: Tasks without a project field shown when "All" or "inbox" selected
- Tiebreaker: taskId provides stable ordering when timestamps equal

Edge cases:
- Empty search: Show all tasks (current behavior preserved)
- No projects discovered: Project dropdown shows only "All"
- All filters exclude all tasks: Show "No tasks match filters" in columns
- Rapid filter changes: Debounce prevents excessive re-renders
- Task with no priority: Treat as "none" - only show when priority is "All"
- Same createdAt timestamps: taskId tiebreaker ensures consistent sort

## Context

### File Tree (scoped)
```
src/
├── webview/
│   └── ui/
│       ├── board.tsx          # <- modify - add filter/sort state and logic
│       └── board.css          # <- modify - active filter styling
├── types/
│   └── task.ts                # <- read-only reference - TaskSnapshotItem, Priority
└── messaging.ts               # <- read-only reference - message types
```

### Architecture Excerpts
From `.kanban2code/architecture.md`:
- Webview UI owns rendering only, never imports VS Code API
- State management is module-level in board.tsx (existing pattern)
- All filtering/sorting happens client-side in the webview

From design reference `docs/design/kanbanboard-codex.html`:
- Toolbar contains: search input (center), priority dropdown, sort dropdown, project dropdown (right)
- Status line shows filter state summary: "Showing: <priority> · <sort> · <view>"
- CSS classes: .filter-select for dropdowns, .filter-summary for status line
- Dropdown styling: height 30px, border var(--border-md), hover border var(--border-strong)

### Skill Excerpts
From `.kanban2code/_context/skills/skill-frontend-design.md`:
- Use CSS custom properties for color values (already defined in board.css)
- Motion: CSS-only first with @keyframes and transitions
- Layout: Keep presentational logic in UI, maintain visual hierarchy
- No specific additional guidance beyond general conventions

### Code Excerpts

`src/webview/ui/board.tsx:130-140` (existing filter state):
```typescript
let allTasks: TaskSnapshotItem[] = [];
let activeSearch = '';
```

`src/webview/ui/board.tsx:219-240` (current filterTasks - needs extension):
```typescript
const filterTasks = (tasks: TaskSnapshotItem[], search: string): TaskSnapshotItem[] => {
  const query = search.trim().toLowerCase();
  if (query.length === 0) {
    return tasks;
  }
  return tasks.filter((task) => {
    const haystack = [
      task.title,
      task.taskId,
      task.description ?? '',
      task.role ?? '',
      task.project ?? '',
      ...task.tags
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(query);
  });
};
```

`src/webview/ui/board.tsx:59-62` (existing filter summary element):
```typescript
<div class="filter-summary" id="filterSummary">
  Showing: <span id="taskCountLabel">0 tasks</span> <span class="sep">·</span> <span>Live updates enabled</span>
</div>
```

`src/types/task.ts:1-4` (Priority type):
```typescript
export type TaskStage = 'inbox' | 'capture' | 'plan' | 'code' | 'audit' | 'completed' | 'unknown';
export type Priority = 'low' | 'medium' | 'high';
```

`src/types/task.ts:26-37` (TaskSnapshotItem structure):
```typescript
export interface TaskSnapshotItem {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  stage: TaskStage;
  priority?: Priority;
  role?: string;
  project?: string;
  tags: string[];
  createdAt: number;
}
```

`src/webview/ui/board.css:403-418` (existing .filter-select styles):
```css
.filter-select {
  height: 30px;
  padding: 0 22px 0 8px;
  border-radius: 4px;
  border: 1px solid var(--border-md);
  background: transparent url("data:image/svg+xml,...") no-repeat right 7px center;
  color: var(--text-muted);
  font: 500 11px/1 Inter, sans-serif;
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: border-color 0.12s, color 0.12s;
}
.filter-select:hover { border-color: var(--border-strong); color: var(--text); }
.filter-select option { background: #121b2d; }
```

### Dependency Graph

Files importing from modified files:
- None directly (board.tsx is the webview entry bundle)
- KanbanPanel.ts loads board.tsx as webview content (bundled)

Consumers not in task scope:
- SidebarProvider.ts (separate webview, separate bundle)
- TaskScanner (service layer, data source only)

### Patterns to Follow

1. State Management Pattern (existing in board.tsx):
   - Module-level variables for persistent state
   - renderBoard() reads state and updates DOM
   - Event listeners update state then call renderBoard()

2. Debounce Pattern:
   ```typescript
   let searchTimeout: number | undefined;
   searchInput?.addEventListener('input', () => {
     clearTimeout(searchTimeout);
     searchTimeout = window.setTimeout(() => {
       activeSearch = searchInput.value;
       renderBoard();
     }, 200);
   });
   ```

3. Filter Composition Pattern:
   - Apply filters in sequence: search -> priority -> project
   - Each filter receives previous filter's output
   - Final result is sorted then rendered

4. CSS Dropdown Styling:
   - Use existing .filter-select class for consistent styling
   - Dark background options via `option { background: #121b2d; }`

### Test Patterns

Tests should follow patterns from sibling task 3.1:
- Test filter logic in isolation (pass mock tasks, assert filtered result)
- Test sort logic with identical timestamps (verify taskId tiebreaker)
- Test AND logic: setup tasks with multiple properties, verify only matches pass
- Status line tests: verify "X of Y" format updates correctly

Test structure:
```typescript
describe('board filters', () => {
  it('should filter by search query on title', () => {
    const tasks = [{ title: 'Test task', /* ... */ }];
    const result = applyFilters(tasks, { search: 'test' });
    expect(result).toHaveLength(1);
  });
  
  it('should use AND logic for multiple filters', () => {
    // Setup task matching search but not priority
    // Verify excluded from results
  });
});
```

### Gotchas

- Debounce cleanup: Always clearTimeout before setting new one to avoid stale renders
- Project discovery: Must recompute when allTasks changes (TaskSnapshot event)
- Empty project: Tasks with undefined project field should appear in "All" or "inbox"
- Sort stability: JavaScript's sort() is not stable in all engines - implement explicit tiebreaker
- Case sensitivity: Always lowercase both search query and target strings
- CSS specificity: Active filter states may need .filter-select.active or similar modifier
- Status line: Update AFTER filtering/sorting complete to show accurate counts

### Scope Boundaries

This task (3.2) is about FILTERING/SORTING existing task data.
Do NOT implement:
- Data binding to TaskScanner (Task 3.1 completed this)
- Drag and drop (Task 3.3 handles this)
- Modal/creation flow (Task 3.4 handles this)
- Card actions/edit/delete (Task 3.5 handles this)
- Full viewport layout fixes (Task 3.6 handles this)

Focus only on:
1. Search with debounce
2. Priority filter (All/Low/Medium/High)
3. Sort (Newest/Oldest first)
4. Project filter (All + discovered)
5. Status line updates
6. Filter state persistence (session-only)
