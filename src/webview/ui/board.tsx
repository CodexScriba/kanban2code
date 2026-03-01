import './board.css';
import {
  isHostToWebviewMessage,
  type RequestTaskSnapshotMessage,
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
        <span class="model-badge">live snapshot</span>
        <div class="toolbar-div"></div>
        <button class="capture-header-btn" type="button">+ Capture</button>
      </div>
    </div>

    <div class="filter-summary" id="filterSummary">
      Showing: <span id="taskCountLabel">0 tasks</span> <span class="sep">·</span> <span>Live updates enabled</span>
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
      <div class="col-cards" data-cards></div>
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
      <div class="col-cards" data-cards></div>
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
      <div class="col-cards" data-cards></div>
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
      <div class="col-cards" data-cards></div>
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
      <div class="col-cards" data-cards></div>
    </div>
  </div>
</div>
`;

const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;
const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
const searchClear = document.getElementById('searchClear') as HTMLButtonElement | null;
const taskCountLabel = document.getElementById('taskCountLabel');

const columnIds: BoardColumnId[] = ['capture', 'plan', 'code', 'audit', 'completed'];
let allTasks: TaskSnapshotItem[] = [];
let activeSearch = '';

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
    <article class="card${toBoardColumn(task.stage) === 'completed' ? ' done' : ''}">
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

const createEmptyMarkup = (): string => {
  return `<div class="empty-state">No tasks in this stage</div>`;
};

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

const renderBoard = (): void => {
  const visibleTasks = filterTasks(allTasks, activeSearch);
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
    }
  }

  if (taskCountLabel) {
    taskCountLabel.textContent = activeSearch
      ? `${visibleTasks.length} matching tasks`
      : `${visibleTasks.length} tasks`;
  }
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

window.addEventListener('message', (event: MessageEvent<unknown>) => {
  if (!isHostToWebviewMessage(event.data)) {
    return;
  }

  if (event.data.type !== 'TaskSnapshot') {
    return;
  }

  allTasks = event.data.payload.tasks;
  renderBoard();
});

searchInput?.addEventListener('input', () => {
  activeSearch = searchInput.value;
  renderBoard();
});

searchClear?.addEventListener('click', () => {
  if (!searchInput) {
    return;
  }

  searchInput.value = '';
  activeSearch = '';
  renderBoard();
  searchInput.focus();
});

document.querySelectorAll('.capture-header-btn, .col-plus').forEach((button) => {
  button.addEventListener('click', () => {
    requestTaskSnapshot();
  });
});

document.getElementById('dismissBanner')?.addEventListener('click', () => {
  const banner = document.getElementById('openclawBanner');
  if (banner) {
    banner.style.display = 'none';
  }
});

renderBoard();
requestTaskSnapshot();
