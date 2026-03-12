import './styles.css';
import { isHostToWebviewMessage, type RunState, type TaskSnapshotItem } from '../messaging';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Sidebar root element not found');
}

root.innerHTML = `
  <div class="sidebar">
    <div class="header">
      <div class="header-meta">
        <div class="header-brand">Kanban2Code</div>
        <div class="runner-indicator idle" id="runnerIndicator">Runner idle</div>
      </div>
      <div class="header-actions">
        <button class="btn-capture" id="captureBtn" type="button">
          <span>+</span>
          <span>Capture</span>
        </button>
        <button class="btn-kanban" id="viewKanbanBtn" type="button">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M1 2h4v12H1V2zm5 0h4v8H6V2zm5 0h4v10h-4V2z"/>
          </svg>
          <span>Kanban</span>
        </button>
        <button class="btn-icon" id="openSettingsBtn" title="Settings" type="button" aria-label="Settings">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M9.1 0L9.9 1.7L11.9 1.3L12.3 3.3L14.3 3.7L13.9 5.7L15.6 6.5L14.6 8.3L16 9.7L14.3 10.9L14.9 12.8L13 13.4L12.8 15.4L11 14.8L9.7 16L8.5 14.3L6.6 14.9L6 13L4 12.8L4.6 11L3 10.3L4 8.5L2.7 7.1L4.4 6.3L3.8 4.4L5.7 3.8L5.9 1.8L7.7 2.4L9.1 0ZM8 5C6.3 5 5 6.3 5 8C5 9.7 6.3 11 8 11C9.7 11 11 9.7 11 8C11 6.3 9.7 5 8 5Z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="chat-view" id="chatView">
      <div class="workspace-bar">
        <div class="stage-pill">
          <span class="stage-dot capture"></span>
          <span>cap · 3</span>
        </div>
        <div class="stage-pill">
          <span class="stage-dot plan"></span>
          <span>plan · 1</span>
        </div>
        <div class="stage-pill">
          <span class="stage-dot code"></span>
          <span>code · 1</span>
        </div>
        <div class="stage-pill">
          <span class="stage-dot audit"></span>
          <span>audit · 1</span>
        </div>
        <div class="stage-pill">
          <span class="stage-dot done"></span>
          <span>done · 3</span>
        </div>
      </div>

      <div class="chat-history" id="chatHistory"></div>
    </div>

    <div class="kanban-view" id="kanbanView">
      <div class="kanban-board">
        <div class="kanban-column">
          <div class="kanban-col-header">
            <div class="kanban-col-title">
              <span class="stage-dot capture"></span>
              <span>Capture</span>
            </div>
            <span class="kanban-col-count">3</span>
          </div>
          <div class="kanban-col-cards">
            <div class="kanban-card">
              <div class="kanban-card-title">Notification Delivery Pipeline</div>
              <div class="kanban-card-meta">
                <span class="kanban-card-tag">feature</span>
                <span class="kanban-card-tag">api</span>
                <span class="kanban-card-agent">architect</span>
              </div>
            </div>
            <div class="kanban-card">
              <div class="kanban-card-title">User avatar upload &amp; cropping</div>
              <div class="kanban-card-meta">
                <span class="kanban-card-tag">feature</span>
                <span class="kanban-card-agent">coder</span>
              </div>
            </div>
            <div class="kanban-card">
              <div class="kanban-card-title">Rate limiter for public API</div>
              <div class="kanban-card-meta">
                <span class="kanban-card-tag">infra</span>
                <span class="kanban-card-agent">architect</span>
              </div>
            </div>
          </div>
        </div>

        <div class="kanban-column">
          <div class="kanban-col-header">
            <div class="kanban-col-title">
              <span class="stage-dot plan"></span>
              <span>Plan</span>
            </div>
            <span class="kanban-col-count">1</span>
          </div>
          <div class="kanban-col-cards">
            <div class="kanban-card">
              <div class="kanban-card-title">Multi-tenant workspace isolation</div>
              <div class="kanban-card-meta">
                <span class="kanban-card-tag">architecture</span>
                <span class="kanban-card-agent">planner</span>
              </div>
            </div>
          </div>
        </div>

        <div class="kanban-column">
          <div class="kanban-col-header">
            <div class="kanban-col-title">
              <span class="stage-dot code"></span>
              <span>Code</span>
            </div>
            <span class="kanban-col-count">1</span>
          </div>
          <div class="kanban-col-cards">
            <div class="kanban-card">
              <div class="kanban-card-title">Stripe subscription billing flow</div>
              <div class="kanban-card-meta">
                <span class="kanban-card-tag">feature</span>
                <span class="kanban-card-tag">billing</span>
                <span class="kanban-card-agent">coder</span>
              </div>
            </div>
          </div>
        </div>

        <div class="kanban-column">
          <div class="kanban-col-header">
            <div class="kanban-col-title">
              <span class="stage-dot audit"></span>
              <span>Audit</span>
            </div>
            <span class="kanban-col-count">1</span>
          </div>
          <div class="kanban-col-cards">
            <div class="kanban-card">
              <div class="kanban-card-title">OAuth2 PKCE login + session mgmt</div>
              <div class="kanban-card-meta">
                <span class="kanban-card-tag">security</span>
                <span class="kanban-card-agent">auditor</span>
              </div>
            </div>
          </div>
        </div>

        <div class="kanban-column">
          <div class="kanban-col-header">
            <div class="kanban-col-title">
              <span class="stage-dot done"></span>
              <span>Done</span>
            </div>
            <span class="kanban-col-count">3</span>
          </div>
          <div class="kanban-col-cards">
            <div class="kanban-card">
              <div class="kanban-card-title">Project setup &amp; CI pipeline</div>
              <div class="kanban-card-meta">
                <span class="kanban-card-tag">infra</span>
                <span class="kanban-card-agent">coder</span>
              </div>
            </div>
            <div class="kanban-card">
              <div class="kanban-card-title">DB schema &amp; Drizzle migrations</div>
              <div class="kanban-card-meta">
                <span class="kanban-card-tag">backend</span>
                <span class="kanban-card-agent">coder</span>
              </div>
            </div>
            <div class="kanban-card">
              <div class="kanban-card-title">Design system tokens + components</div>
              <div class="kanban-card-meta">
                <span class="kanban-card-tag">ui</span>
                <span class="kanban-card-agent">coder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div id="footerControls" class="footer-controls">
        <div class="footer-section" data-section="context">
          <div class="section-header">
            <span>Context</span>
            <span class="count-badge">2</span>
          </div>
          <div class="section-content">
            <div class="chips-container">
              <div class="chip">
                <span>architecture.md</span>
                <button class="chip-remove" type="button" aria-label="Remove context">×</button>
              </div>
              <div class="chip">
                <span>force-summary.md</span>
                <button class="chip-remove" type="button" aria-label="Remove context">×</button>
              </div>
              <div class="dropdown-container">
                <button class="btn-add" type="button" data-toggle-dropdown="contextDropdown">
                  <span>+</span>
                  <span>Add</span>
                </button>
                <div class="dropdown-menu" id="contextDropdown">
                  <button class="dropdown-item" type="button" data-add-context="review-system-arch.md">
                    <span>review-system-arch.md</span>
                    <span class="token-count">~2.1k</span>
                  </button>
                  <button class="dropdown-item" type="button" data-add-context="api-contracts.md">
                    <span>api-contracts.md</span>
                    <span class="token-count">~890</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-section" data-section="skills">
          <div class="section-header">
            <span>Skills</span>
            <span class="count-badge">2</span>
          </div>
          <div class="section-content">
            <div class="chips-container">
              <div class="chip auto">
                <span>nextjs-core</span>
                <span class="chip-auto-badge">auto</span>
                <button class="chip-remove" type="button" aria-label="Remove skill">×</button>
              </div>
              <div class="chip auto">
                <span>drizzle-orm</span>
                <span class="chip-auto-badge">auto</span>
                <button class="chip-remove" type="button" aria-label="Remove skill">×</button>
              </div>
              <div class="dropdown-container">
                <button class="btn-add" type="button" data-toggle-dropdown="skillsDropdown">
                  <span>+</span>
                  <span>Add</span>
                </button>
                <div class="dropdown-menu" id="skillsDropdown">
                  <button class="dropdown-item" type="button" data-add-skill="server-actions">
                    <span>server-actions</span>
                  </button>
                  <button class="dropdown-item" type="button" data-add-skill="react-query">
                    <span>react-query</span>
                  </button>
                  <button class="dropdown-item" type="button" data-add-skill="stripe">
                    <span>stripe</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-section" data-section="provider">
          <div class="section-header">
            <span>Provider & Task</span>
          </div>
          <div class="section-content">
            <div class="provider-row">
              <select class="provider-select" id="providerSelect" title="LLM Provider">
                <option value="alibaba" selected>alibaba · glm-5</option>
              </select>
              <select class="provider-select" id="taskPicker" title="Task Scope">
                <option value="">No task selected (general chat)</option>
              </select>
            </div>
            <div class="task-picker-notice" id="taskPickerNotice" aria-live="polite"></div>
          </div>
        </div>
      </div>

      <div class="footer-section">
        <div class="compose-actions">
          <button type="button" class="btn-toggle-controls" id="toggleControlsBtn">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 7V9H2V7H14ZM14 3V5H2V3H14ZM14 11V13H2V11H14Z"/>
            </svg>
            <span>Controls</span>
          </button>
        </div>
        <div class="compose-row">
          <textarea class="compose-textarea" id="composeInput" placeholder="Message orchestrator..." rows="1"></textarea>
          <button type="button" class="btn-send" id="sendBtn" title="Send message" aria-label="Send message">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M0.5 0.5L15.5 8L0.5 15.5L2 8L0.5 0.5ZM3 7L2 3L11 8L2 13L3 9H8V7H3Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
`;

const textarea = root.querySelector<HTMLTextAreaElement>('#composeInput');
const sendBtn = root.querySelector<HTMLButtonElement>('#sendBtn');
const captureBtn = root.querySelector<HTMLButtonElement>('#captureBtn');
const kanbanBtn = root.querySelector<HTMLButtonElement>('#viewKanbanBtn');
const settingsBtn = root.querySelector<HTMLButtonElement>('#openSettingsBtn');
const chatView = root.querySelector<HTMLElement>('#chatView');
const kanbanView = root.querySelector<HTMLElement>('#kanbanView');
const chatHistory = root.querySelector<HTMLElement>('#chatHistory');
const providerSelect = root.querySelector<HTMLSelectElement>('#providerSelect');
const taskPicker = root.querySelector<HTMLSelectElement>('#taskPicker');
const taskPickerNotice = root.querySelector<HTMLElement>('#taskPickerNotice');
const runnerIndicator = root.querySelector<HTMLElement>('#runnerIndicator');
const toggleControlsBtn = root.querySelector<HTMLButtonElement>('#toggleControlsBtn');
const footerControls = root.querySelector<HTMLElement>('#footerControls');

if (
  !textarea ||
  !sendBtn ||
  !captureBtn ||
  !kanbanBtn ||
  !settingsBtn ||
  !chatView ||
  !kanbanView ||
  !chatHistory ||
  !providerSelect ||
  !taskPicker ||
  !taskPickerNotice ||
  !runnerIndicator ||
  !toggleControlsBtn ||
  !footerControls
) {
  throw new Error('Sidebar UI is missing required elements');
}

interface PersistedUiState {
  selectedTaskId: string | null;
  showControls: boolean;
}

interface VsCodeApi<State> {
  postMessage(message: unknown): void;
  setState(state: State): void;
  getState(): State | undefined;
}

declare function acquireVsCodeApi<State = unknown>(): VsCodeApi<State>;

const vscodeApi =
  typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi<PersistedUiState>() : null;

const savedState = vscodeApi?.getState();
let selectedTaskId: string | null = savedState?.selectedTaskId ?? null;
let showControls: boolean = savedState?.showControls ?? false;
let knownTasks: TaskSnapshotItem[] = [];
let activeDropdown: HTMLElement | null = null;
let noticeTimer: number | null = null;
let sidebarQueueCount = 0;
let sidebarActiveTaskId: string | null = null;
const sidebarRunStateByTaskId = new Map<string, RunState>();

const truncateLabel = (value: string, maxLength: number): string => {
  const safeChars = Array.from(value);
  if (safeChars.length <= maxLength) {
    return value;
  }

  return `${safeChars.slice(0, maxLength - 1).join('')}…`;
};

const updatePersistedState = (): void => {
  vscodeApi?.setState({ selectedTaskId, showControls });
};

const updateControlsVisibility = (): void => {
  if (showControls) {
    footerControls.classList.remove('hidden');
    toggleControlsBtn.classList.add('active');
  } else {
    footerControls.classList.add('hidden');
    toggleControlsBtn.classList.remove('active');
  }
};

const toggleControls = (): void => {
  showControls = !showControls;
  updateControlsVisibility();
  updatePersistedState();
};

const resolveTaskTitle = (taskIdentifier: string): string => {
  const task = knownTasks.find((entry) => entry.id === taskIdentifier || entry.taskId === taskIdentifier);
  return task?.title ?? taskIdentifier;
};

const setRunStateForTask = (taskIdentifier: string, state: RunState): void => {
  sidebarRunStateByTaskId.set(taskIdentifier, state);
  const task = knownTasks.find((entry) => entry.id === taskIdentifier || entry.taskId === taskIdentifier);
  if (!task) {
    return;
  }
  sidebarRunStateByTaskId.set(task.id, state);
  sidebarRunStateByTaskId.set(task.taskId, state);
};

const renderRunnerIndicator = (): void => {
  if (!runnerIndicator) {
    return;
  }

  runnerIndicator.classList.remove('idle', 'running', 'queued');

  if (sidebarActiveTaskId) {
    const label = truncateLabel(resolveTaskTitle(sidebarActiveTaskId), 24);
    runnerIndicator.textContent = `Running ${label}`;
    runnerIndicator.classList.add('running');
    return;
  }

  if (sidebarQueueCount > 0) {
    runnerIndicator.textContent = `Queue ${sidebarQueueCount}`;
    runnerIndicator.classList.add('queued');
    return;
  }

  runnerIndicator.textContent = 'Runner idle';
  runnerIndicator.classList.add('idle');
};

const showTaskNotice = (message: string): void => {
  taskPickerNotice.textContent = message;
  taskPickerNotice.classList.add('visible');

  if (noticeTimer !== null) {
    window.clearTimeout(noticeTimer);
  }

  noticeTimer = window.setTimeout(() => {
    taskPickerNotice.classList.remove('visible');
  }, 3000);
};

const renderTaskOptions = (tasks: TaskSnapshotItem[]): void => {
  const placeholderValue = '';
  const previousValue = selectedTaskId ?? placeholderValue;

  taskPicker.innerHTML = '';

  const placeholderOption = document.createElement('option');
  placeholderOption.value = placeholderValue;
  placeholderOption.textContent = 'No task selected (general chat)';
  taskPicker.append(placeholderOption);

  tasks.forEach((task) => {
    const option = document.createElement('option');
    option.value = task.id;
    option.textContent = `${task.stage} • ${truncateLabel(task.title, 56)}`;
    taskPicker.append(option);
  });

  const stillExists =
    previousValue === placeholderValue ||
    tasks.some((task) => task.id === previousValue);

  if (!stillExists) {
    selectedTaskId = null;
    updatePersistedState();
    showTaskNotice('Previously selected task is missing. Scope reset to general chat.');
  }

  taskPicker.value = stillExists ? previousValue : placeholderValue;
};

const requestTaskSnapshot = (): void => {
  vscodeApi?.postMessage({ type: 'RequestTaskSnapshot' });
};

const closeActiveDropdown = (): void => {
  if (activeDropdown) {
    activeDropdown.classList.remove('active');
    activeDropdown = null;
  }
};

const setBadgeCount = (section: HTMLElement, nextCount: number): void => {
  const badge = section.querySelector<HTMLElement>('.count-badge');
  if (badge) {
    badge.textContent = String(Math.max(0, nextCount));
  }
};

const getBadgeCount = (section: HTMLElement): number => {
  const badge = section.querySelector<HTMLElement>('.count-badge');
  return Number.parseInt(badge?.textContent ?? '0', 10) || 0;
};

const createChip = (label: string, isAuto = false): HTMLElement => {
  const chip = document.createElement('div');
  chip.className = isAuto ? 'chip auto' : 'chip';

  const title = document.createElement('span');
  title.textContent = label;
  chip.append(title);

  if (isAuto) {
    const autoBadge = document.createElement('span');
    autoBadge.className = 'chip-auto-badge';
    autoBadge.textContent = 'auto';
    chip.append(autoBadge);
  }

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'chip-remove';
  removeBtn.textContent = '×';
  removeBtn.setAttribute('aria-label', `Remove ${label}`);
  chip.append(removeBtn);

  return chip;
};

const appendUserMessage = (message: string): void => {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user';

  const author = document.createElement('div');
  author.className = 'message-author';
  author.textContent = 'You';

  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = message;

  messageDiv.append(author, content);
  chatHistory.appendChild(messageDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;
};

const sendMessage = (): void => {
  const message = textarea.value.trim();
  if (!message) {
    return;
  }

  appendUserMessage(message);
  vscodeApi?.postMessage({
    type: 'SendChatMessage',
    payload: {
      message,
      provider: providerSelect.value,
      selectedTaskId: selectedTaskId ?? undefined
    }
  });
  textarea.value = '';
  textarea.style.height = 'auto';
};

textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
});

textarea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);
toggleControlsBtn.addEventListener('click', toggleControls);
captureBtn.addEventListener('click', () => textarea.focus());
taskPicker.addEventListener('change', () => {
  selectedTaskId = taskPicker.value || null;
  updatePersistedState();
});

kanbanBtn.addEventListener('click', () => {
  vscodeApi?.postMessage({ type: 'ShowKanbanBoard' });
});

settingsBtn.addEventListener('click', () => {
  vscodeApi?.postMessage({ type: 'OpenSettings' });
});

root.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const removeBtn = target.closest<HTMLButtonElement>('.chip-remove');
  if (removeBtn) {
    const chip = removeBtn.closest<HTMLElement>('.chip');
    const section = removeBtn.closest<HTMLElement>('.footer-section');
    if (chip && section) {
      chip.remove();
      setBadgeCount(section, getBadgeCount(section) - 1);
    }
    return;
  }

  const toggleBtn = target.closest<HTMLButtonElement>('[data-toggle-dropdown]');
  if (toggleBtn) {
    const dropdownId = toggleBtn.dataset.toggleDropdown;
    const dropdown = dropdownId ? root.querySelector<HTMLElement>(`#${dropdownId}`) : null;

    if (!dropdown) {
      return;
    }

    if (activeDropdown && activeDropdown !== dropdown) {
      activeDropdown.classList.remove('active');
    }

    dropdown.classList.toggle('active');
    activeDropdown = dropdown.classList.contains('active') ? dropdown : null;
    return;
  }

  const addContextItem = target.closest<HTMLButtonElement>('[data-add-context]');
  if (addContextItem) {
    const section = root.querySelector<HTMLElement>('[data-section="context"]');
    const container = section?.querySelector<HTMLElement>('.chips-container');
    const dropdownContainer = container?.querySelector<HTMLElement>('.dropdown-container');
    const name = addContextItem.dataset.addContext;

    if (section && container && dropdownContainer && name) {
      container.insertBefore(createChip(name), dropdownContainer);
      setBadgeCount(section, getBadgeCount(section) + 1);
      addContextItem.remove();
      closeActiveDropdown();
    }

    return;
  }

  const addSkillItem = target.closest<HTMLButtonElement>('[data-add-skill]');
  if (addSkillItem) {
    const section = root.querySelector<HTMLElement>('[data-section="skills"]');
    const container = section?.querySelector<HTMLElement>('.chips-container');
    const dropdownContainer = container?.querySelector<HTMLElement>('.dropdown-container');
    const name = addSkillItem.dataset.addSkill;

    if (section && container && dropdownContainer && name) {
      container.insertBefore(createChip(name), dropdownContainer);
      setBadgeCount(section, getBadgeCount(section) + 1);
      addSkillItem.remove();
      closeActiveDropdown();
    }
  }
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && !target.closest('.dropdown-container')) {
    closeActiveDropdown();
  }
});

window.addEventListener('message', (event: MessageEvent<unknown>) => {
  const message = event.data;
  if (!isHostToWebviewMessage(message)) {
    return;
  }

  if (message.type === 'TaskSnapshot') {
    knownTasks = message.payload.tasks;
    renderTaskOptions(knownTasks);
    renderRunnerIndicator();
    return;
  }

  if (message.type === 'RunnerStateChanged') {
    setRunStateForTask(message.payload.taskId, message.payload.state);
    if (message.payload.state === 'running') {
      sidebarActiveTaskId = message.payload.taskId;
    } else if (sidebarActiveTaskId === message.payload.taskId && message.payload.state !== 'queued') {
      sidebarActiveTaskId = null;
    }
    renderRunnerIndicator();
    return;
  }

  if (message.type === 'QueueSnapshot') {
    sidebarQueueCount = message.payload.totalQueued;
    sidebarActiveTaskId = message.payload.activeTaskId;
    for (const item of message.payload.items) {
      setRunStateForTask(item.taskId, item.state);
    }
    renderRunnerIndicator();
    return;
  }

  if (message.type === 'TaskSelectionReset') {
    selectedTaskId = null;
    taskPicker.value = '';
    updatePersistedState();
    showTaskNotice(message.payload.reason);
    return;
  }

  if (message.type !== 'OrchestratorResponse') {
    return;
  }

  const assistantMessage = document.createElement('div');
  assistantMessage.className = 'message assistant';

  const author = document.createElement('div');
  author.className = 'message-author';
  author.textContent = 'Orchestrator';

  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = message.payload.message;

  assistantMessage.append(author, content);
  chatHistory.appendChild(assistantMessage);
  chatHistory.scrollTop = chatHistory.scrollHeight;
});

requestTaskSnapshot();
renderRunnerIndicator();
updateControlsVisibility();
chatHistory.scrollTop = chatHistory.scrollHeight;
