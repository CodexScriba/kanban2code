---
stage: completed
agent: auditor
tags: [feature, p1]
contexts: [skill-frontend-design]
---

# Drag and drop — column reorder + cross-column move

## Goal

Implement HTML5 drag and drop for cards, allowing reordering within columns and moving cards between columns (stage changes).

## Definition of Done

- [x] Cards draggable within column (reorder)
- [x] Cards draggable across columns (stage change)
- [x] No transition restrictions (free movement per spec)
- [x] On drop: immediately persist new stage + order to filesystem
- [x] Visual feedback during drag (ghost card, drop zone highlight)
- [x] Deterministic ordering preserved after drop

## Files

- `src/webview/ui/board.tsx` - modify - add HTML5 drag/drop handlers
- `src/webview/ui/board.css` - modify - drag ghost + drop zone styles
- `src/webview/KanbanPanel.ts` - modify - handle `MoveTask`/`ReorderTask` messages

## Tests

- [x] Dragging card to different column updates stage in file
- [x] Reordering within column persists order
- [x] Multiple rapid drags don't corrupt state

## Audit Result

- Rating: 8.9/10
- Verdict: Pass
- Verified:
  - Cards are draggable (`draggable="true"`) and drag lifecycle handlers are implemented (`dragstart`, `dragover`, `dragleave`, `drop`, `dragend`) in `src/webview/ui/board.tsx`.
  - Same-column drops post `ReorderTask` with computed `newOrder`; cross-column drops post `MoveTask` with `targetStage` + `order` in `src/webview/ui/board.tsx`.
  - No transition gate exists in drop logic; any card can move to any board column (`capture`, `plan`, `code`, `audit`, `completed`).
  - Host message handling persists updates via `taskService.updateTask(...)` and refreshes snapshot in `src/webview/KanbanPanel.ts`.
  - Filesystem persistence is immediate because `TaskService.updateTask` writes frontmatter directly with `writeFile` in `src/services/task-service.ts`.
  - Visual drag feedback exists via `.card.dragging`, `.col-cards.drop-target`, `.card.drop-target`, and `body.board-dragging` in `src/webview/ui/board.css`.
  - Test run passes (`npm test`): 33 test cases detected in `src/services/*.test.ts`, all passing via 6 test files, 0 failures.

## Context

Drag and drop should use HTML5 Drag and Drop API with the following events:
- `dragstart`: set drag data, add visual feedback
- `dragover`: allow drop, show drop zone highlight
- `dragleave`: remove drop zone highlight
- `drop`: handle the drop, persist changes
- `dragend`: cleanup visual feedback

Drag data should include:
- taskId: string
- sourceStage: string
- sourceIndex: number

Drop handling:
- Cross-column drop: update task stage in frontmatter, post `MoveTask` message
- Same-column drop: update task order, post `ReorderTask` message
- Both operations should persist immediately to filesystem

Visual feedback:
- Ghost card: semi-transparent version of the card being dragged
- Drop zone highlight: highlight the column or position where card will be dropped
- Active drag state: reduce opacity of other cards to focus on drop target

No transition restrictions: users can freely move cards between any stages (inbox, plan, code, audit, completed) per the spec.

Deterministic ordering: after drop, the order should be preserved and consistent with the visual arrangement.

## UI Design References

- Base sidebar palette/layout: `docs/design/sidebar-codex-blue.html`
- Kanban board reference: `docs/design/kanbanboard-codex.html`
- Task editor reference: `docs/design/taskeditor-codex.html`
- Settings reference (single-file): `docs/design/settings-gemini.html`

Use these references for spacing, hierarchy, control styles, and panel composition.
If spec behavior and design mock conflict, follow `functionality.md` behavior and keep visual style from `docs/design/*`.
- Primary target for this task: `docs/design/kanbanboard-codex.html`

## Refined Prompt

Objective: Implement HTML5 drag-and-drop for kanban cards allowing reorder within columns and cross-column stage changes with immediate filesystem persistence.

Implementation approach:
1. Add drag/drop attributes and handlers to card elements in board.tsx
   - Make `.card` elements draggable with `draggable="true"`
   - Add `dragstart` handler to set drag data (taskId, sourceStage, sourceIndex)
   - Store drag data in `dataTransfer` using `application/json` MIME type
   - Add visual feedback classes to dragged card (opacity reduction, scale transform)
2. Add drop zone handling to column containers
   - Add `dragover` handler to `.col-cards` containers to allow drop (preventDefault)
   - Add `dragleave` handler to remove highlight when drag leaves
   - Add `drop` handler to process the drop and calculate new position
   - Add CSS highlight class `.drop-target` for visual feedback on columns
3. Implement drop logic with position calculation
   - Calculate drop index based on mouse Y position relative to cards
   - Cross-column drop: send `MoveTask` message with taskId, targetStage, new order
   - Same-column reorder: send `ReorderTask` message with taskId, new order
   - Use `getBoundingClientRect` to determine insertion point between cards
4. Update KanbanPanel.ts to handle MoveTask and ReorderTask messages
   - Add message handlers for `MoveTask` and `ReorderTask` types
   - Call TaskService to update task stage/order in filesystem
   - Trigger board refresh after successful save
5. Add CSS for drag states and drop zones in board.css
   - `.dragging` class: reduce opacity to 0.6, add box-shadow for lift effect
   - `.drop-target` class: add border highlight, subtle background change
   - `.drag-over-card` class: show insertion indicator between cards
   - Use CSS transitions for smooth state changes

Key decisions:
- HTML5 Drag and Drop API: Native browser support, no external library needed
- Calculated drop position: Use mouse Y vs card rects for precise insertion point
- Immediate persistence: Post message to host on every drop, no batching
- No restrictions: Allow free movement between all columns per v1 spec
- Visual priority: Ghost card effect via CSS transforms and opacity

Edge cases:
- Drag ends outside any column: Cancel operation, no state change
- Rapid successive drags: Each drop posts message, host serializes filesystem writes
- Same position drop: No-op, don't post message if index unchanged
- Empty column drop: Card becomes first (index 0) in target column
- Filtered view drag: DnD should work on visible cards only, preserve hidden card order

## Context

### File Tree (scoped)
```
src/
├── webview/
│   ├── KanbanPanel.ts              # <- modify - handle MoveTask/ReorderTask
│   ├── messaging.ts                # <- read-only reference - message types
│   └── ui/
│       ├── board.tsx               # <- modify - DnD handlers + visual states
│       └── board.css               # <- modify - drag ghost + drop zone styles
├── services/
│   └── task-service.ts             # <- read-only reference - update methods
└── types/
    └── task.ts                     # <- read-only reference - TaskStage types
```

### Architecture Excerpts
From `gemini-architecture.md` (Section 3.6 Drag & Drop):
- "Required for high-volume planning"
- "Reorder within column + move across columns"
- "v1 has **no transition restrictions** (free movement, including to/from done)"
- "Persist status/order immediately and deterministically"

From `gemini-architecture.md` (Technical Architecture - Data Flow):
- Extension Host owns file system operations
- Webview UI owns rendering only
- Strict communication via typed messages through `messaging.ts`

### Skill Excerpts
From `.kanban2code/_context/skills/skill-frontend-design.md`:
- Motion: CSS-only first with @keyframes and transitions
- Use CSS custom properties for color values
- Layout: Keep presentational logic in UI

From `.kanban2code/_context/skills/skill-vscode.md`:
- Core layout must be class-based CSS (no inline layout sprawl)
- Message handlers must validate envelope/type before acting
- Webview UI owns rendering only, never imports VS Code API

### Code Excerpts

`src/webview/messaging.ts:48-63` (MoveTaskMessage and ReorderTaskMessage types):
```typescript
export interface MoveTaskMessage {
  type: 'MoveTask';
  payload: {
    taskId: string;
    targetStage: TaskStage;
    order?: number;
  };
}

export interface ReorderTaskMessage {
  type: 'ReorderTask';
  payload: {
    taskId: string;
    newOrder: number;
  };
}
```

`src/webview/ui/board.tsx:186-213` (createCardMarkup - add draggable attributes):
```typescript
const createCardMarkup = (task: TaskSnapshotItem): string => {
  const priorityClass = toPriorityClass(task.priority);
  const priorityLabel = task.priority ?? 'unset';
  const roleChip = task.role
    ? `<span class="agent-chip">${escapeHtml(task.role)}</span>`
    : '';
  const projectChip = task.project
    ? `<span class="project-chip">${escapeHtml(task.project)}</span>`
    : '';
  const tagChips = task.tags
    .map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`)
    .join('');

  return `
    <article class="card${toBoardColumn(task.stage) === 'completed' ? ' done' : ''}" draggable="true" data-task-id="${escapeHtml(task.taskId)}">
      <div class="card-title">
        <span class="priority-dot ${priorityClass}" title="${escapeHtml(priorityLabel)} priority"></span>
        <span>${escapeHtml(task.title)}</span>
      </div>
      <p class="card-desc">${escapeHtml(getDescription(task))}</p>
      <div class="card-chips">
        ${roleChip}
        ${projectChip}
        ${tagChips}
      </div>
    </article>
  `;
};
```

`src/webview/ui/board.tsx:629-640` (col-cards container - drop target):
```typescript
<div class="col-cards" data-cards data-column="${columnId}"></div>
```

`src/webview/KanbanPanel.ts:83-89` (current message handler):
```typescript
private async handleWebviewMessage(rawMessage: unknown): Promise<void> {
  if (!isWebviewToHostMessage(rawMessage) || rawMessage.type !== 'RequestTaskSnapshot') {
    return;
  }

  await this.postTaskSnapshot();
}
```

`src/webview/ui/board.tsx:657-660` (existing card cursor styles):
```css
.card { cursor: grab; }
.card:active { cursor: grabbing; }
```

### Dependency Graph

Files importing from modified files:
- `src/extension.ts` -> imports KanbanPanel (may need to pass TaskService)
- `src/webview/KanbanPanel.ts` -> imports messaging types, vscode
- `src/webview/ui/board.tsx` -> imports board.css (bundled)

Consumers not in task scope:
- SidebarProvider.ts (separate webview, separate bundle)
- TaskScanner (service layer, read-only data source)

### Patterns to Follow

1. HTML5 Drag and Drop Pattern:
   - Set `draggable="true"` on card elements
   - Use `dataTransfer.setData()` in dragstart with JSON payload
   - Call `event.preventDefault()` in dragover to allow drop
   - Use `dataTransfer.getData()` in drop handler

2. Position Calculation Pattern:
   ```typescript
   const afterElement = getDragAfterElement(container, event.clientY);
   const newIndex = afterElement ? 
     Array.from(container.children).indexOf(afterElement) : 
     container.children.length;
   ```

3. Message Bridge Pattern (existing):
   - Post to host via `vscode.postMessage()`
   - Validate with `isWebviewToHostMessage()`
   - Handle in KanbanPanel.ts with type switch

4. CSS State Classes Pattern:
   - Add/remove classes via DOM API (`classList.add('dragging')`)
   - Define visual states in CSS with transitions
   - Clean up in `dragend` handler

### Test Patterns

Tests should follow patterns from sibling tasks 3.1 and 3.2:
- Test drag data transfer (verify taskId, stage, index in payload)
- Test position calculation (verify correct index for drop location)
- Test message posting (verify MoveTask/ReorderTask sent to host)
- Test visual state classes (verify CSS classes applied/removed)

Test structure:
```typescript
describe('drag and drop', () => {
  it('should send MoveTask when dropping to different column', () => {
    // Simulate dragstart from capture column
    // Simulate drop on plan column
    // Verify vscode.postMessage called with MoveTask type
  });
  
  it('should send ReorderTask when reordering within column', () => {
    // Simulate dragstart from index 0
    // Simulate drop at index 2 in same column
    // Verify vscode.postMessage called with ReorderTask type
  });
});
```

### Gotchas

- Drag data transfer: Must use `dataTransfer.setData()` in dragstart, read in drop
- Column detection: Use `closest('[data-column]')` to find target column from drop event
- Index calculation: Account for filtered/hidden cards not in DOM
- Visual feedback: Apply `.dragging` class to dragged card, `.drop-target` to column
- Message validation: KanbanPanel must validate `MoveTask` and `ReorderTask` payloads
- Rapid operations: Host handles serialization, but UI should disable drag during pending
- CSS specificity: Drag states may need `!important` to override hover styles
- Accessibility: Consider keyboard alternatives (out of scope for v1, but note for future)

### Scope Boundaries

This task (3.3) is about DRAG AND DROP functionality.
Do NOT implement:
- Search/filter/sort logic (Task 3.2 handles this, just ensure DnD works with filtered views)
- Modal/creation flow (Task 3.4 handles this)
- Card actions/edit/delete (Task 3.5 handles this)
- Full viewport layout fixes (Task 3.6 handles this)

Focus only on:
1. HTML5 drag-and-drop API integration
2. Drag data transfer (taskId, stage, index)
3. Drop position calculation
4. MoveTask/ReorderTask message handling
5. Visual feedback (ghost card, drop zone highlight)
6. Immediate persistence to filesystem
