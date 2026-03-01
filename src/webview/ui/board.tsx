import './board.css';
import {
  type CancelRunMessage,
  type CreateTaskMessage,
  type DeleteTaskMessage,
  isHostToWebviewMessage,
  type MoveTaskMessage,
  type OpenTaskEditorMessage,
  type QueueStageMessage,
  type ReorderTaskMessage,
  type RequestTaskSnapshotMessage,
  type RetryRunMessage,
  type RunState,
  type RunAllStagesMessage,
  type RunStageMessage,
  type TaskSnapshotItem
} from '../messaging';

type BoardColumnId = 'capture' | 'plan' | 'code' | 'audit' | 'completed';

interface VscodeApi {
  postMessage(message: unknown): void;
}

declare const acquireVsCodeApi: (() => VscodeApi) | undefined;

const app = document.getElementById('app');

if (!app) {
  throw new Error('Board root element not found');
}

app.innerHTML = `
<div class="board-area">
  <div class="openclaw-banner" id="openclawBanner">
    <div class="openclaw-banner-icon"></div>
    <span class="openclaw-banner-text">Connect to <strong>OpenClaw</strong> for shared boards, team sync, and CI hooks</span>
    <button class="openclaw-connect-btn" type="button">Connect</button>
    <button class="openclaw-dismiss" id="dismissBanner" type="button" title="Dismiss">×</button>
  </div>

  <div class="board-header-wrap">
    <div class="board-toolbar">
      <div class="toolbar-left">
        <span class="toolbar-brand">Kanban2Code</span>
        <div class="toolbar-div"></div>
        <button class="bc-scope" type="button">Filesystem snapshot <span class="bc-caret">▼</span></button>
      </div>

      <div class="toolbar-center">
        <div class="search-wrap">
          <span class="search-icon">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <circle cx="5.5" cy="5.5" r="4.2"/>
              <line x1="8.7" y1="8.7" x2="11.5" y2="11.5"/>
            </svg>
          </span>
          <input class="search-input" id="searchInput" type="text" placeholder="Search tasks, tags, ids…" autocomplete="off" />
          <button class="search-clear" type="button" id="searchClear" title="Clear search">×</button>
        </div>
      </div>

      <div class="toolbar-right">
        <select class="filter-select" id="priorityFilter" aria-label="Filter by priority">
          <option value="all">Priority: All</option>
          <option value="low">Priority: Low</option>
          <option value="medium">Priority: Medium</option>
          <option value="high">Priority: High</option>
        </select>
        <select class="filter-select" id="sortOrder" aria-label="Sort tasks">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <select class="filter-select" id="projectFilter" aria-label="Filter by project">
          <option value="all">Project: All</option>
        </select>
        <span class="queue-chip" id="queueChip">Queue: 0</span>
        <span class="model-badge">live snapshot</span>
        <div class="toolbar-div"></div>
        <button class="capture-header-btn" type="button">+ Capture</button>
      </div>
    </div>

    <div class="filter-summary" id="filterSummary">
      <span id="taskCountLabel">Showing 0 of 0 tasks</span>
    </div>
  </div>

  <div class="board-columns">
    <div class="column col-capture" data-column="capture">
      <div class="col-header">
        <div class="col-accent"></div>
        <div class="col-title-row">
          <span class="col-name">Capture</span>
          <span class="col-count" data-count>0</span>
          <button class="col-plus" type="button" title="Add task">+</button>
        </div>
      </div>
      <div class="col-cards" data-cards data-column="capture"></div>
    </div>

    <div class="column col-plan" data-column="plan">
      <div class="col-header">
        <div class="col-accent"></div>
        <div class="col-title-row">
          <span class="col-name">Plan</span>
          <span class="col-count" data-count>0</span>
          <button class="col-plus" type="button" title="Add task">+</button>
        </div>
      </div>
      <div class="col-cards" data-cards data-column="plan"></div>
    </div>

    <div class="column col-code" data-column="code">
      <div class="col-header">
        <div class="col-accent"></div>
        <div class="col-title-row">
          <span class="col-name">Code</span>
          <span class="col-count" data-count>0</span>
          <button class="col-plus" type="button" title="Add task">+</button>
        </div>
      </div>
      <div class="col-cards" data-cards data-column="code"></div>
    </div>

    <div class="column col-audit" data-column="audit">
      <div class="col-header">
        <div class="col-accent"></div>
        <div class="col-title-row">
          <span class="col-name">Audit</span>
          <span class="col-count" data-count>0</span>
          <button class="col-plus" type="button" title="Add task">+</button>
        </div>
      </div>
      <div class="col-cards" data-cards data-column="audit"></div>
    </div>

    <div class="column col-done" data-column="completed">
      <div class="col-header">
        <div class="col-accent"></div>
        <div class="col-title-row">
          <span class="col-name">Done</span>
          <span class="col-count" data-count>0</span>
          <button class="col-plus" type="button" title="Add task">+</button>
        </div>
      </div>
      <div class="col-cards" data-cards data-column="completed"></div>
    </div>
  </div>
</div>
<div class="capture-modal-overlay is-hidden" id="captureModal" aria-hidden="true">
  <div class="capture-modal-card" role="dialog" aria-modal="true" aria-labelledby="captureModalTitle" id="captureModalCard">
    <div class="capture-modal-header">
      <h2 id="captureModalTitle">Create Task</h2>
      <button class="capture-modal-close" id="captureCloseBtn" type="button" aria-label="Close capture modal">×</button>
    </div>
    <form class="capture-modal-form" id="captureForm">
      <p class="capture-stage-hint">Stage: <span id="captureStageLabel">Default (inbox)</span></p>

      <label class="capture-field">
        <span class="capture-field-label">Title</span>
        <input id="captureTitle" class="capture-input" type="text" maxlength="180" required />
      </label>

      <label class="capture-field">
        <span class="capture-field-label">Description</span>
        <textarea id="captureDescription" class="capture-input capture-textarea" rows="4"></textarea>
      </label>

      <div class="capture-grid">
        <label class="capture-field">
          <span class="capture-field-label">Priority</span>
          <select id="capturePriority" class="capture-input">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label class="capture-field">
          <span class="capture-field-label">Role</span>
          <select id="captureRole" class="capture-input">
            <option value="">None</option>
            <option value="planner">planner</option>
            <option value="coder">coder</option>
            <option value="auditor">auditor</option>
          </select>
        </label>

        <label class="capture-field capture-project-field">
          <span class="capture-field-label">Project</span>
          <select id="captureProject" class="capture-input">
            <option value="all">All projects</option>
            <option value="inbox">Inbox</option>
          </select>
        </label>
      </div>

      <div class="capture-field">
        <span class="capture-field-label">Tags</span>
        <div class="capture-tags-row">
          <input id="captureTagInput" class="capture-input" type="text" placeholder="Add a tag and press Enter" />
          <button id="captureAddTagBtn" class="capture-tag-add" type="button">Add</button>
        </div>
        <div class="capture-tags-list" id="captureTagsList"></div>
      </div>

      <p class="capture-validation is-hidden" id="captureValidation" role="alert">Title is required.</p>

      <div class="capture-actions">
        <button class="capture-action-btn secondary" id="captureCancelBtn" type="button">Cancel</button>
        <button class="capture-action-btn primary" id="captureSubmitBtn" type="submit">Create Task</button>
      </div>
    </form>
  </div>
</div>
`;

const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;
const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
const searchClear = document.getElementById('searchClear') as HTMLButtonElement | null;
const priorityFilter = document.getElementById('priorityFilter') as HTMLSelectElement | null;
const sortOrderSelect = document.getElementById('sortOrder') as HTMLSelectElement | null;
const projectFilter = document.getElementById('projectFilter') as HTMLSelectElement | null;
const taskCountLabel = document.getElementById('taskCountLabel');
const queueChip = document.getElementById('queueChip');
const captureModal = document.getElementById('captureModal') as HTMLDivElement | null;
const captureForm = document.getElementById('captureForm') as HTMLFormElement | null;
const captureStageLabel = document.getElementById('captureStageLabel') as HTMLSpanElement | null;
const captureTitleInput = document.getElementById('captureTitle') as HTMLInputElement | null;
const captureDescriptionInput = document.getElementById('captureDescription') as HTMLTextAreaElement | null;
const capturePrioritySelect = document.getElementById('capturePriority') as HTMLSelectElement | null;
const captureRoleSelect = document.getElementById('captureRole') as HTMLSelectElement | null;
const captureProjectSelect = document.getElementById('captureProject') as HTMLSelectElement | null;
const captureTagInput = document.getElementById('captureTagInput') as HTMLInputElement | null;
const captureAddTagBtn = document.getElementById('captureAddTagBtn') as HTMLButtonElement | null;
const captureTagsList = document.getElementById('captureTagsList');
const captureValidation = document.getElementById('captureValidation');
const captureCloseBtn = document.getElementById('captureCloseBtn') as HTMLButtonElement | null;
const captureCancelBtn = document.getElementById('captureCancelBtn') as HTMLButtonElement | null;
const captureSubmitBtn = document.getElementById('captureSubmitBtn') as HTMLButtonElement | null;

const columnIds: BoardColumnId[] = ['capture', 'plan', 'code', 'audit', 'completed'];
type PriorityFilterValue = 'all' | 'low' | 'medium' | 'high';
type SortOrder = 'newest' | 'oldest';
type CapturePriority = 'low' | 'medium' | 'high';
type CaptureRole = '' | 'planner' | 'coder' | 'auditor';
type CaptureProjectValue = 'all' | 'inbox' | string;
interface DragState {
  taskId: string;
  sourceStage: BoardColumnId;
  sourceIndex: number;
}

let allTasks: TaskSnapshotItem[] = [];
let activeSearch = '';
let activePriority: PriorityFilterValue = 'all';
let activeSortOrder: SortOrder = 'newest';
let activeProject = 'all';
let searchDebounceTimeout: number | undefined;
let activeDragState: DragState | null = null;
let activeDropContainer: HTMLElement | null = null;
let capturePrefilledStage: BoardColumnId | null = null;
let captureModalOpen = false;
let captureSaving = false;
let captureTags: string[] = [];
let confirmDestructiveActions = true;
let contextMenuTaskId: string | null = null;
let queuedTaskCount = 0;
let activeTaskId: string | null = null;
const runStateByTaskId = new Map<string, RunState>();

const contextMenu = document.createElement('div');
contextMenu.className = 'ctx-menu';
contextMenu.id = 'cardContextMenu';
contextMenu.setAttribute('aria-hidden', 'true');
document.body.appendChild(contextMenu);

const CAPTURE_PROJECT_ALL = 'all';
const CAPTURE_PROJECT_INBOX = 'inbox';

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const toBoardColumn = (stage: TaskSnapshotItem['stage']): BoardColumnId => {
  switch (stage) {
    case 'plan':
    case 'code':
    case 'audit':
    case 'completed':
      return stage;
    case 'capture':
    case 'inbox':
    case 'unknown':
    default:
      return 'capture';
  }
};

const toPriorityClass = (priority?: TaskSnapshotItem['priority']): 'high' | 'med' | 'low' | 'none' => {
  if (priority === 'high') {
    return 'high';
  }

  if (priority === 'medium') {
    return 'med';
  }

  if (priority === 'low') {
    return 'low';
  }

  return 'none';
};

const getDescription = (task: TaskSnapshotItem): string => {
  const description = task.description?.trim();
  if (description && description.length > 0) {
    return description;
  }

  return `Task ID: ${task.taskId}`;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseConfirmDestructiveActions = (settings: Record<string, unknown>): boolean => {
  const general = settings.general;
  if (!isRecord(general)) {
    return true;
  }

  return typeof general.confirmDestructiveActions === 'boolean'
    ? general.confirmDestructiveActions
    : true;
};

const getContextMoveStages = (currentStage: BoardColumnId): BoardColumnId[] => {
  return columnIds.filter((stage) => stage !== currentStage);
};

const moveMenuLabel = (stage: BoardColumnId): string => {
  return stage === 'completed' ? 'Done' : stage.charAt(0).toUpperCase() + stage.slice(1);
};

const runStateLabel: Record<RunState, string> = {
  queued: 'Queued',
  running: 'Running',
  success: 'Success',
  failed: 'Failed',
  cancelled: 'Cancelled'
};

const getRunStateForTask = (task: TaskSnapshotItem): RunState | null => {
  return runStateByTaskId.get(task.id) ?? runStateByTaskId.get(task.taskId) ?? null;
};

const getTaskIdentifier = (taskIdentifier: string): string => {
  const task = allTasks.find((entry) => entry.id === taskIdentifier || entry.taskId === taskIdentifier);
  return task?.id ?? taskIdentifier;
};

const setTaskRunState = (taskIdentifier: string, state: RunState): void => {
  const resolvedId = getTaskIdentifier(taskIdentifier);
  runStateByTaskId.set(resolvedId, state);

  const task = allTasks.find((entry) => entry.id === resolvedId || entry.taskId === taskIdentifier);
  if (task) {
    runStateByTaskId.set(task.id, state);
    runStateByTaskId.set(task.taskId, state);
  }
};

const syncRunStateMapToTasks = (): void => {
  for (const task of allTasks) {
    const known = runStateByTaskId.get(task.id) ?? runStateByTaskId.get(task.taskId);
    if (!known) {
      continue;
    }

    runStateByTaskId.set(task.id, known);
    runStateByTaskId.set(task.taskId, known);
  }
};

const updateQueueChip = (): void => {
  if (!queueChip) {
    return;
  }

  queueChip.textContent = `Queue: ${queuedTaskCount}`;
  queueChip.classList.toggle('active', queuedTaskCount > 0 || Boolean(activeTaskId));
};

const closeContextMenu = (): void => {
  contextMenu.classList.remove('open');
  contextMenu.setAttribute('aria-hidden', 'true');
  contextMenuTaskId = null;
};

const positionContextMenu = (x: number, y: number): void => {
  const { width, height } = contextMenu.getBoundingClientRect();
  const padding = 8;
  const maxLeft = Math.max(padding, window.innerWidth - width - padding);
  const maxTop = Math.max(padding, window.innerHeight - height - padding);
  const left = Math.min(Math.max(padding, x), maxLeft);
  const top = Math.min(Math.max(padding, y), maxTop);

  contextMenu.style.left = `${left}px`;
  contextMenu.style.top = `${top}px`;
};

const openContextMenu = (taskId: string, x: number, y: number): void => {
  const task = getTaskById(taskId);
  if (!task) {
    closeContextMenu();
    return;
  }

  const boardStage = toBoardColumn(task.stage);
  const moveItems = getContextMoveStages(boardStage)
    .map((stage) => {
      const label = moveMenuLabel(stage);
      return `<button class="cm-item" type="button" data-context-action="move" data-stage="${stage}">${label}</button>`;
    })
    .join('');
  const runState = getRunStateForTask(task);
  const canCancel = runState === 'queued' || runState === 'running';
  const canRetry = runState === 'failed';
  const cancelItem = canCancel
    ? `<button class="cm-item" type="button" data-context-action="cancel">Cancel</button>`
    : '';
  const retryItem = canRetry
    ? `<button class="cm-item" type="button" data-context-action="retry">Retry</button>`
    : '';

  contextMenuTaskId = taskId;
  contextMenu.innerHTML = `
    <div class="cm-section">
      <button class="cm-item" type="button" data-context-action="open">Open</button>
      <button class="cm-item" type="button" data-context-action="run">Run</button>
      <button class="cm-item" type="button" data-context-action="run-all">Run all</button>
      <button class="cm-item" type="button" data-context-action="queue">Queue</button>
      ${cancelItem}
      ${retryItem}
    </div>
    <div class="cm-section">
      <div class="cm-item cm-item-submenu">
        <span>Move</span>
        <span class="cm-chevron">›</span>
        <div class="cm-submenu">
          ${moveItems}
        </div>
      </div>
      <button class="cm-item" type="button" data-context-action="edit">Edit</button>
      <button class="cm-item" type="button" data-context-action="copy">Copy</button>
      <button class="cm-item danger" type="button" data-context-action="delete">Delete</button>
    </div>
  `;

  contextMenu.classList.add('open');
  contextMenu.setAttribute('aria-hidden', 'false');
  positionContextMenu(x, y);
};

const createCardMarkup = (task: TaskSnapshotItem): string => {
  const priorityClass = toPriorityClass(task.priority);
  const priorityLabel = task.priority ?? 'unset';
  const runState = getRunStateForTask(task);
  const roleChip = task.role
    ? `<span class="agent-chip">${escapeHtml(task.role)}</span>`
    : '';
  const projectChip = task.project
    ? `<span class="project-chip">${escapeHtml(task.project)}</span>`
    : '';
  const runBadge = runState
    ? `<span class="run-state-badge run-state-${runState}" title="Run state: ${escapeHtml(runStateLabel[runState])}">${escapeHtml(runStateLabel[runState])}</span>`
    : '';
  const tagChips = task.tags
    .map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`)
    .join('');
  const cardStateClass = runState ? ` run-state-${runState}` : '';

  return `
    <article class="card${toBoardColumn(task.stage) === 'completed' ? ' done' : ''}${cardStateClass}" draggable="true" data-task-id="${escapeHtml(task.id)}">
      <div class="card-actions">
        <button class="card-action-btn edit-btn" type="button" data-card-action="edit" title="Edit task" aria-label="Edit task">
          ✎
        </button>
        <button class="card-action-btn delete-btn" type="button" data-card-action="delete" title="Delete task" aria-label="Delete task">
          🗑
        </button>
        <button class="card-action-btn menu-btn" type="button" data-card-action="menu" title="More actions" aria-label="More actions">
          ⋯
        </button>
      </div>
      <div class="card-title">
        <span class="priority-dot ${priorityClass}" title="${escapeHtml(priorityLabel)} priority"></span>
        <span>${escapeHtml(task.title)}</span>
      </div>
      <p class="card-desc">${escapeHtml(getDescription(task))}</p>
      <div class="card-chips">
        ${runBadge}
        ${roleChip}
        ${projectChip}
        ${tagChips}
      </div>
    </article>
  `;
};

const createEmptyMarkup = (): string => {
  return `<div class="empty-state">No tasks in this stage</div>`;
};

const normalizeProject = (project?: string): string => {
  return project?.trim() ?? '';
};

const applyFilterSelectState = (selectEl: HTMLSelectElement | null, isActive: boolean): void => {
  if (!selectEl) {
    return;
  }

  selectEl.classList.toggle('active', isActive);
};

const getDiscoveredProjects = (tasks: TaskSnapshotItem[]): string[] => {
  const projectSet = new Set<string>();

  for (const task of tasks) {
    const project = normalizeProject(task.project);
    if (project) {
      projectSet.add(project);
    }
  }

  return Array.from(projectSet).sort((a, b) => a.localeCompare(b));
};

const toStageLabel = (stage: BoardColumnId): string => {
  if (stage === 'completed') {
    return 'Done';
  }

  return stage.charAt(0).toUpperCase() + stage.slice(1);
};

const isBoardColumnId = (value: string | undefined): value is BoardColumnId => {
  return value === 'capture' || value === 'plan' || value === 'code' || value === 'audit' || value === 'completed';
};

const setCaptureValidation = (message?: string): void => {
  if (!captureValidation) {
    return;
  }

  if (!message) {
    captureValidation.textContent = '';
    captureValidation.classList.add('is-hidden');
    return;
  }

  captureValidation.textContent = message;
  captureValidation.classList.remove('is-hidden');
};

const normalizeTag = (tag: string): string => tag.trim().replace(/\s+/g, '-');

const renderCaptureTags = (): void => {
  if (!captureTagsList) {
    return;
  }

  captureTagsList.innerHTML = captureTags
    .map((tag) => `
      <button class="capture-tag-chip" type="button" data-tag="${escapeHtml(tag)}">
        <span>${escapeHtml(tag)}</span>
        <span class="capture-tag-remove" aria-hidden="true">×</span>
      </button>
    `)
    .join('');
};

const addCaptureTag = (rawTag: string): void => {
  const tag = normalizeTag(rawTag);
  if (!tag) {
    return;
  }

  const normalized = tag.toLowerCase();
  if (captureTags.some((entry) => entry.toLowerCase() === normalized)) {
    return;
  }

  captureTags = [...captureTags, tag];
  renderCaptureTags();
};

const removeCaptureTag = (tag: string): void => {
  captureTags = captureTags.filter((entry) => entry !== tag);
  renderCaptureTags();
};

const syncCaptureProjectOptions = (tasks: TaskSnapshotItem[]): void => {
  if (!captureProjectSelect) {
    return;
  }

  const selected = captureProjectSelect.value as CaptureProjectValue;
  const discoveredProjects = getDiscoveredProjects(tasks).filter(
    (project) => project.toLowerCase() !== CAPTURE_PROJECT_INBOX
  );
  const options = [
    `<option value="${CAPTURE_PROJECT_ALL}">All projects</option>`,
    `<option value="${CAPTURE_PROJECT_INBOX}">Inbox</option>`,
    ...discoveredProjects.map((project) => {
      const escaped = escapeHtml(project);
      return `<option value="${escaped}">${escaped}</option>`;
    })
  ];

  captureProjectSelect.innerHTML = options.join('');
  if (
    selected === CAPTURE_PROJECT_ALL ||
    selected === CAPTURE_PROJECT_INBOX ||
    discoveredProjects.includes(selected)
  ) {
    captureProjectSelect.value = selected;
  } else {
    captureProjectSelect.value = CAPTURE_PROJECT_ALL;
  }
};

const resetCaptureForm = (): void => {
  if (captureForm) {
    captureForm.reset();
  }

  if (capturePrioritySelect) {
    capturePrioritySelect.value = 'medium';
  }

  if (captureRoleSelect) {
    captureRoleSelect.value = '';
  }

  if (captureProjectSelect) {
    captureProjectSelect.value = CAPTURE_PROJECT_ALL;
  }

  captureTags = [];
  renderCaptureTags();
  setCaptureValidation();
  captureSaving = false;
  if (captureSubmitBtn) {
    captureSubmitBtn.disabled = false;
    captureSubmitBtn.textContent = 'Create Task';
  }
};

const openCaptureModal = (prefilledStage: BoardColumnId | null): void => {
  if (!captureModal) {
    return;
  }

  capturePrefilledStage = prefilledStage;
  resetCaptureForm();
  if (captureStageLabel) {
    captureStageLabel.textContent = capturePrefilledStage
      ? toStageLabel(capturePrefilledStage)
      : 'Default (inbox)';
  }

  captureModal.classList.remove('is-hidden');
  captureModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('capture-modal-open');
  captureModalOpen = true;
  window.setTimeout(() => {
    captureTitleInput?.focus();
  }, 0);
};

const closeCaptureModal = (): void => {
  if (!captureModal) {
    return;
  }

  captureModal.classList.add('is-hidden');
  captureModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('capture-modal-open');
  capturePrefilledStage = null;
  captureModalOpen = false;
  setCaptureValidation();
};

const submitCaptureTask = (): void => {
  if (!captureTitleInput || !captureDescriptionInput || !capturePrioritySelect || !captureRoleSelect || !captureProjectSelect) {
    return;
  }

  if (captureSaving) {
    return;
  }

  const title = captureTitleInput.value.trim();
  if (!title) {
    setCaptureValidation('Title is required.');
    captureTitleInput.focus();
    return;
  }

  setCaptureValidation();
  captureSaving = true;
  if (captureSubmitBtn) {
    captureSubmitBtn.disabled = true;
    captureSubmitBtn.textContent = 'Creating...';
  }

  const description = captureDescriptionInput.value.trim();
  const roleValue = captureRoleSelect.value as CaptureRole;
  const projectValue = captureProjectSelect.value as CaptureProjectValue;

  const message: CreateTaskMessage = {
    type: 'CreateTask',
    payload: {
      title,
      body: description.length > 0 ? description : undefined,
      stage: capturePrefilledStage ?? undefined,
      priority: capturePrioritySelect.value as CapturePriority,
      role: roleValue || undefined,
      project:
        projectValue === CAPTURE_PROJECT_ALL
          ? undefined
          : projectValue === CAPTURE_PROJECT_INBOX
            ? 'Inbox'
            : projectValue,
      tags: captureTags
    }
  };

  vscode?.postMessage(message);
  closeCaptureModal();
};

const syncProjectFilterOptions = (tasks: TaskSnapshotItem[]): void => {
  if (!projectFilter) {
    return;
  }

  const projects = getDiscoveredProjects(tasks);
  const existing = new Set(projects);

  if (activeProject !== 'all' && !existing.has(activeProject)) {
    activeProject = 'all';
  }

  projectFilter.innerHTML = ['<option value="all">Project: All</option>', ...projects.map((project) => {
    const escaped = escapeHtml(project);
    return `<option value="${escaped}">${escaped}</option>`;
  })].join('');
  projectFilter.value = activeProject;
  applyFilterSelectState(projectFilter, activeProject !== 'all');
};

const filterTasks = (
  tasks: TaskSnapshotItem[],
  search: string,
  priority: PriorityFilterValue,
  project: string
): TaskSnapshotItem[] => {
  const query = search.trim().toLowerCase();

  return tasks.filter((task) => {
    if (query.length > 0) {
      const titleMatch = task.title.toLowerCase().includes(query);
      const taskIdMatch = task.taskId.toLowerCase().includes(query);
      const tagMatch = task.tags.some((tag) => tag.toLowerCase().includes(query));

      if (!titleMatch && !taskIdMatch && !tagMatch) {
        return false;
      }
    }

    if (priority !== 'all' && task.priority !== priority) {
      return false;
    }

    if (project !== 'all' && normalizeProject(task.project) !== project) {
      return false;
    }

    return true;
  });
};

const sortTasks = (tasks: TaskSnapshotItem[], order: SortOrder): TaskSnapshotItem[] => {
  return [...tasks].sort((a, b) => {
    const leftOrder = typeof a.order === 'number' && Number.isFinite(a.order) ? a.order : Number.NaN;
    const rightOrder = typeof b.order === 'number' && Number.isFinite(b.order) ? b.order : Number.NaN;
    const leftHasOrder = Number.isFinite(leftOrder);
    const rightHasOrder = Number.isFinite(rightOrder);

    if (leftHasOrder && rightHasOrder && leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    if (leftHasOrder !== rightHasOrder) {
      return leftHasOrder ? -1 : 1;
    }

    if (a.createdAt !== b.createdAt) {
      return order === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
    }

    return a.taskId.localeCompare(b.taskId);
  });
};

const renderBoard = (): void => {
  closeContextMenu();

  const visibleTasks = sortTasks(
    filterTasks(allTasks, activeSearch, activePriority, activeProject),
    activeSortOrder
  );
  const grouped = new Map<BoardColumnId, TaskSnapshotItem[]>();

  for (const columnId of columnIds) {
    grouped.set(columnId, []);
  }

  for (const task of visibleTasks) {
    grouped.get(toBoardColumn(task.stage))?.push(task);
  }

  for (const columnId of columnIds) {
    const column = document.querySelector(`.column[data-column="${columnId}"]`) as HTMLElement | null;
    if (!column) {
      continue;
    }

    const countEl = column.querySelector('[data-count]') as HTMLElement | null;
    const cardsEl = column.querySelector('[data-cards]') as HTMLElement | null;
    const tasks = grouped.get(columnId) ?? [];

    if (countEl) {
      countEl.textContent = String(tasks.length);
    }

    if (cardsEl) {
      cardsEl.innerHTML = tasks.length > 0 ? tasks.map((task) => createCardMarkup(task)).join('') : createEmptyMarkup();
      cardsEl.setAttribute('data-column', columnId);
    }
  }

  if (taskCountLabel) {
    taskCountLabel.textContent = `Showing ${visibleTasks.length} of ${allTasks.length} tasks`;
  }
};

const getTaskById = (taskId: string): TaskSnapshotItem | undefined => {
  return allTasks.find((task) => task.id === taskId);
};

const getCardElements = (container: HTMLElement): HTMLElement[] => {
  return Array.from(container.querySelectorAll<HTMLElement>('.card[data-task-id]'));
};

const getDropIndex = (container: HTMLElement, pointerY: number): number => {
  const cards = getCardElements(container).filter((card) => !card.classList.contains('dragging'));
  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];
    const rect = card.getBoundingClientRect();
    if (pointerY < rect.top + rect.height / 2) {
      return index;
    }
  }

  return cards.length;
};

const clearDropTargetIndicators = (): void => {
  document.querySelectorAll<HTMLElement>('.card.drop-target').forEach((card) => {
    card.classList.remove('drop-target');
  });
};

const updateDropTargetIndicators = (container: HTMLElement, dropIndex: number): void => {
  clearDropTargetIndicators();
  const cards = getCardElements(container).filter((card) => !card.classList.contains('dragging'));
  const dropTargetCard = cards[dropIndex];
  if (dropTargetCard) {
    dropTargetCard.classList.add('drop-target');
  }
};

const clearDragVisualState = (): void => {
  document.querySelectorAll<HTMLElement>('.card.dragging').forEach((card) => {
    card.classList.remove('dragging');
  });
  clearDropTargetIndicators();
  activeDropContainer?.classList.remove('drop-target');
  activeDropContainer = null;
  document.body.classList.remove('board-dragging');
};

const getTaskOrderValue = (task: TaskSnapshotItem, fallbackIndex: number): number => {
  if (typeof task.order === 'number' && Number.isFinite(task.order)) {
    return task.order;
  }

  return fallbackIndex * 1000;
};

const calculateNewOrder = (targetTaskIds: string[], dropIndex: number): number => {
  const previousTaskId = dropIndex > 0 ? targetTaskIds[dropIndex - 1] : undefined;
  const nextTaskId = dropIndex < targetTaskIds.length ? targetTaskIds[dropIndex] : undefined;

  const previousTask = previousTaskId ? getTaskById(previousTaskId) : undefined;
  const nextTask = nextTaskId ? getTaskById(nextTaskId) : undefined;

  if (previousTask && nextTask) {
    const previousOrder = getTaskOrderValue(previousTask, dropIndex - 1);
    const nextOrder = getTaskOrderValue(nextTask, dropIndex);
    return (previousOrder + nextOrder) / 2;
  }

  if (previousTask) {
    return getTaskOrderValue(previousTask, dropIndex - 1) + 1000;
  }

  if (nextTask) {
    return getTaskOrderValue(nextTask, dropIndex) - 1000;
  }

  return 0;
};

const getColumnForCard = (card: HTMLElement): BoardColumnId | null => {
  const column = card.closest<HTMLElement>('.column[data-column]');
  const columnId = column?.dataset.column;

  if (
    columnId === 'capture' ||
    columnId === 'plan' ||
    columnId === 'code' ||
    columnId === 'audit' ||
    columnId === 'completed'
  ) {
    return columnId;
  }

  return null;
};

const getTaskIdFromTransfer = (event: DragEvent): string | undefined => {
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return undefined;
  }

  const raw = dataTransfer.getData('application/json');
  if (!raw) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DragState>;
    return typeof parsed.taskId === 'string' ? parsed.taskId : undefined;
  } catch {
    return undefined;
  }
};

const setupDragAndDrop = (): void => {
  app.addEventListener('dragstart', (event) => {
    const card = (event.target as HTMLElement | null)?.closest<HTMLElement>('.card[data-task-id]');
    if (!card || !event.dataTransfer) {
      return;
    }

    const taskId = card.dataset.taskId;
    const sourceStage = getColumnForCard(card);
    const sourceContainer = card.closest<HTMLElement>('.col-cards');
    if (!taskId || !sourceStage || !sourceContainer) {
      return;
    }

    const cards = getCardElements(sourceContainer);
    const sourceIndex = cards.findIndex((entry) => entry.dataset.taskId === taskId);
    if (sourceIndex < 0) {
      return;
    }

    activeDragState = { taskId, sourceStage, sourceIndex };
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify(activeDragState));
    event.dataTransfer.setData('text/plain', taskId);

    card.classList.add('dragging');
    document.body.classList.add('board-dragging');
  });

  app.addEventListener('dragover', (event) => {
    if (!activeDragState) {
      return;
    }

    const container = (event.target as HTMLElement | null)?.closest<HTMLElement>('.col-cards[data-column]');
    if (!container) {
      return;
    }

    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';

    if (activeDropContainer && activeDropContainer !== container) {
      activeDropContainer.classList.remove('drop-target');
    }

    activeDropContainer = container;
    activeDropContainer.classList.add('drop-target');
    updateDropTargetIndicators(container, getDropIndex(container, event.clientY));
  });

  app.addEventListener('dragleave', (event) => {
    const container = (event.target as HTMLElement | null)?.closest<HTMLElement>('.col-cards[data-column]');
    if (!container || activeDropContainer !== container) {
      return;
    }

    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && container.contains(nextTarget)) {
      return;
    }

    container.classList.remove('drop-target');
    clearDropTargetIndicators();
    activeDropContainer = null;
  });

  app.addEventListener('drop', (event) => {
    const container = (event.target as HTMLElement | null)?.closest<HTMLElement>('.col-cards[data-column]');
    const dropState = activeDragState;
    const dragTaskId = getTaskIdFromTransfer(event) ?? dropState?.taskId;
    const targetStage = container?.dataset.column as BoardColumnId | undefined;
    if (!container || !dropState || !dragTaskId || !targetStage) {
      clearDragVisualState();
      activeDragState = null;
      return;
    }

    event.preventDefault();

    const dropIndex = getDropIndex(container, event.clientY);
    if (dropState.sourceStage === targetStage && dropState.sourceIndex === dropIndex) {
      clearDragVisualState();
      activeDragState = null;
      return;
    }

    const targetTaskIds = getCardElements(container)
      .map((card) => card.dataset.taskId)
      .filter((taskId): taskId is string => typeof taskId === 'string' && taskId !== dragTaskId);
    const newOrder = calculateNewOrder(targetTaskIds, dropIndex);

    const movedTask = getTaskById(dragTaskId);
    if (movedTask) {
      movedTask.stage = targetStage === 'capture' ? 'capture' : targetStage;
      movedTask.order = newOrder;
    }

    if (vscode) {
      if (dropState.sourceStage === targetStage) {
        const message: ReorderTaskMessage = {
          type: 'ReorderTask',
          payload: {
            taskId: dragTaskId,
            newOrder
          }
        };
        vscode.postMessage(message);
      } else {
        const message: MoveTaskMessage = {
          type: 'MoveTask',
          payload: {
            taskId: dragTaskId,
            targetStage,
            order: newOrder
          }
        };
        vscode.postMessage(message);
      }
    }

    renderBoard();
    clearDragVisualState();
    activeDragState = null;
  });

  app.addEventListener('dragend', () => {
    clearDragVisualState();
    activeDragState = null;
  });
};

const requestTaskSnapshot = (): void => {
  if (!vscode) {
    return;
  }

  const message: RequestTaskSnapshotMessage = {
    type: 'RequestTaskSnapshot'
  };

  vscode.postMessage(message);
};

const postOpenTaskEditor = (taskId: string): void => {
  if (!vscode) {
    return;
  }

  const message: OpenTaskEditorMessage = {
    type: 'OpenTaskEditor',
    payload: { taskId }
  };
  vscode.postMessage(message);
};

const postDeleteTask = (taskId: string): void => {
  if (!vscode) {
    return;
  }

  const message: DeleteTaskMessage = {
    type: 'DeleteTask',
    payload: { taskId }
  };
  vscode.postMessage(message);
};

const postRunStage = (taskId: string): void => {
  if (!vscode) {
    return;
  }

  const message: RunStageMessage = {
    type: 'RunStage',
    payload: { taskId }
  };
  vscode.postMessage(message);
};

const postRunAllStages = (taskId: string): void => {
  if (!vscode) {
    return;
  }

  const message: RunAllStagesMessage = {
    type: 'RunAllStages',
    payload: { taskId }
  };
  vscode.postMessage(message);
};

const postQueueStage = (taskId: string): void => {
  if (!vscode) {
    return;
  }

  const message: QueueStageMessage = {
    type: 'QueueStage',
    payload: { taskId }
  };
  vscode.postMessage(message);
};

const postCancelRun = (taskId: string): void => {
  if (!vscode) {
    return;
  }

  const message: CancelRunMessage = {
    type: 'CancelRun',
    payload: { taskId }
  };
  vscode.postMessage(message);
};

const postRetryRun = (taskId: string): void => {
  if (!vscode) {
    return;
  }

  const message: RetryRunMessage = {
    type: 'RetryRun',
    payload: { taskId }
  };
  vscode.postMessage(message);
};

const copyTaskToClipboard = async (taskId: string): Promise<void> => {
  const task = getTaskById(taskId);
  if (!task) {
    return;
  }

  const summary = `${task.title}\n${task.taskId}`;
  try {
    await navigator.clipboard.writeText(summary);
  } catch {
    // Ignore clipboard errors in restricted browser contexts.
  }
};

const requestDeleteTask = (taskId: string): void => {
  const task = getTaskById(taskId);
  if (!task) {
    return;
  }

  if (confirmDestructiveActions) {
    const shouldDelete = window.confirm(`Delete task "${task.title}"?`);
    if (!shouldDelete) {
      return;
    }
  }

  postDeleteTask(taskId);
};

window.addEventListener('message', (event: MessageEvent<unknown>) => {
  if (!isHostToWebviewMessage(event.data)) {
    return;
  }

  if (event.data.type === 'RunnerStateChanged') {
    setTaskRunState(event.data.payload.taskId, event.data.payload.state);
    renderBoard();
    return;
  }

  if (event.data.type === 'QueueSnapshot') {
    activeTaskId = event.data.payload.activeTaskId;
    queuedTaskCount = event.data.payload.totalQueued;
    updateQueueChip();

    for (const item of event.data.payload.items) {
      setTaskRunState(item.taskId, item.state);
    }
    renderBoard();
    return;
  }

  if (event.data.type === 'SettingsLoaded') {
    confirmDestructiveActions = parseConfirmDestructiveActions(event.data.payload.settings);
    return;
  }

  if (event.data.type !== 'TaskSnapshot') {
    return;
  }

  allTasks = event.data.payload.tasks;
  syncRunStateMapToTasks();
  syncProjectFilterOptions(allTasks);
  syncCaptureProjectOptions(allTasks);
  renderBoard();
});

app.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;
  if (!target) {
    return;
  }

  const actionButton = target.closest<HTMLElement>('[data-card-action]');
  if (!actionButton) {
    if (!target.closest('#cardContextMenu')) {
      closeContextMenu();
    }
    return;
  }

  const card = actionButton.closest<HTMLElement>('.card[data-task-id]');
  const taskId = card?.dataset.taskId;
  const action = actionButton.dataset.cardAction;
  if (!taskId || !action) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (action === 'edit') {
    postOpenTaskEditor(taskId);
    closeContextMenu();
    return;
  }

  if (action === 'delete') {
    requestDeleteTask(taskId);
    closeContextMenu();
    return;
  }

  if (action === 'menu') {
    const rect = actionButton.getBoundingClientRect();
    openContextMenu(taskId, rect.right, rect.bottom + 6);
  }
});

app.addEventListener('contextmenu', (event) => {
  const card = (event.target as HTMLElement | null)?.closest<HTMLElement>('.card[data-task-id]');
  const taskId = card?.dataset.taskId;
  if (!card || !taskId) {
    return;
  }

  event.preventDefault();
  openContextMenu(taskId, event.clientX, event.clientY);
});

contextMenu.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-context-action]');
  const action = target?.dataset.contextAction;
  const taskId = contextMenuTaskId;
  if (!action || !taskId) {
    return;
  }

  if (action === 'open' || action === 'edit') {
    postOpenTaskEditor(taskId);
    closeContextMenu();
    return;
  }

  if (action === 'run') {
    postRunStage(taskId);
    closeContextMenu();
    return;
  }

  if (action === 'run-all') {
    postRunAllStages(taskId);
    closeContextMenu();
    return;
  }

  if (action === 'queue') {
    postQueueStage(taskId);
    closeContextMenu();
    return;
  }

  if (action === 'cancel') {
    postCancelRun(taskId);
    closeContextMenu();
    return;
  }

  if (action === 'retry') {
    postRetryRun(taskId);
    closeContextMenu();
    return;
  }

  if (action === 'move') {
    const targetStage = target.dataset.stage as BoardColumnId | undefined;
    if (!targetStage) {
      return;
    }

    const message: MoveTaskMessage = {
      type: 'MoveTask',
      payload: {
        taskId,
        targetStage
      }
    };
    vscode?.postMessage(message);
    closeContextMenu();
    return;
  }

  if (action === 'copy') {
    void copyTaskToClipboard(taskId);
    closeContextMenu();
    return;
  }

  if (action === 'delete') {
    requestDeleteTask(taskId);
    closeContextMenu();
  }
});

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;
  if (!target) {
    closeContextMenu();
    return;
  }

  if (target.closest('#cardContextMenu')) {
    return;
  }

  if (target.closest('[data-card-action="menu"]')) {
    return;
  }

  closeContextMenu();
});

window.addEventListener('resize', closeContextMenu);

searchInput?.addEventListener('input', () => {
  const nextValue = searchInput.value;
  window.clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = window.setTimeout(() => {
    activeSearch = nextValue;
    renderBoard();
  }, 200);
});

searchClear?.addEventListener('click', () => {
  if (!searchInput) {
    return;
  }

  window.clearTimeout(searchDebounceTimeout);
  searchInput.value = '';
  activeSearch = '';
  renderBoard();
  searchInput.focus();
});

priorityFilter?.addEventListener('change', () => {
  const nextPriority = priorityFilter.value as PriorityFilterValue;
  activePriority = nextPriority;
  applyFilterSelectState(priorityFilter, activePriority !== 'all');
  renderBoard();
});

sortOrderSelect?.addEventListener('change', () => {
  const nextSortOrder = sortOrderSelect.value as SortOrder;
  activeSortOrder = nextSortOrder;
  applyFilterSelectState(sortOrderSelect, activeSortOrder !== 'newest');
  renderBoard();
});

projectFilter?.addEventListener('change', () => {
  activeProject = projectFilter.value;
  applyFilterSelectState(projectFilter, activeProject !== 'all');
  renderBoard();
});

document.querySelector('.capture-header-btn')?.addEventListener('click', () => {
  openCaptureModal(null);
});

document.querySelectorAll('.col-plus').forEach((button) => {
  button.addEventListener('click', () => {
    const column = (button as HTMLElement).closest<HTMLElement>('.column[data-column]');
    const stage = column?.dataset.column;
    openCaptureModal(isBoardColumnId(stage) ? stage : null);
  });
});

captureCloseBtn?.addEventListener('click', closeCaptureModal);
captureCancelBtn?.addEventListener('click', closeCaptureModal);

captureModal?.addEventListener('click', (event) => {
  if (event.target === captureModal) {
    closeCaptureModal();
  }
});

captureForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  submitCaptureTask();
});

captureTitleInput?.addEventListener('input', () => {
  if (captureTitleInput.value.trim().length > 0) {
    setCaptureValidation();
  }
});

captureAddTagBtn?.addEventListener('click', () => {
  if (!captureTagInput) {
    return;
  }

  addCaptureTag(captureTagInput.value);
  captureTagInput.value = '';
  captureTagInput.focus();
});

captureTagInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    addCaptureTag(captureTagInput.value);
    captureTagInput.value = '';
  }
});

captureTagsList?.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>('.capture-tag-chip[data-tag]');
  const tag = button?.dataset.tag;
  if (!tag) {
    return;
  }

  removeCaptureTag(tag);
});

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  if (captureModalOpen) {
    closeCaptureModal();
  }

  if (contextMenuTaskId) {
    closeContextMenu();
  }
});

document.getElementById('dismissBanner')?.addEventListener('click', () => {
  const banner = document.getElementById('openclawBanner');
  if (banner) {
    banner.style.display = 'none';
  }
});

setupDragAndDrop();
renderBoard();
updateQueueChip();
requestTaskSnapshot();
