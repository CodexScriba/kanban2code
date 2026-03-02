"use strict";
(() => {
  // src/webview/messaging.ts
  var TASK_STAGES = ["inbox", "capture", "plan", "code", "audit", "completed", "unknown"];
  var PRIORITIES = ["low", "medium", "high"];
  var RUN_STATES = ["queued", "running", "success", "failed", "cancelled"];
  var QUEUE_SCOPES = ["stage", "all"];
  var isObject = (value) => typeof value === "object" && value !== null;
  var isStringArray = (value) => Array.isArray(value) && value.every((entry) => typeof entry === "string");
  var isTaskStage = (value) => typeof value === "string" && TASK_STAGES.includes(value);
  var isPriority = (value) => typeof value === "string" && PRIORITIES.includes(value);
  var isRunState = (value) => typeof value === "string" && RUN_STATES.includes(value);
  var isQueueScope = (value) => typeof value === "string" && QUEUE_SCOPES.includes(value);
  var VALIDATION_FOCUS_FIELDS = [
    "title",
    "location",
    "phase",
    "stage",
    "role",
    "provider",
    "model",
    "profile",
    "contexts",
    "skills",
    "pipeline"
  ];
  var isValidationFocusField = (value) => typeof value === "string" && VALIDATION_FOCUS_FIELDS.includes(value);
  var isValidationFocusTarget = (value) => isObject(value) && isValidationFocusField(value.field) && (!("stage" in value) || value.stage === void 0 || typeof value.stage === "string");
  var isQueueItem = (value) => {
    return isObject(value) && typeof value.taskId === "string" && isQueueScope(value.scope) && isRunState(value.state) && typeof value.enqueuedAt === "number" && Number.isFinite(value.enqueuedAt);
  };
  var isTaskSnapshotItem = (task) => {
    return isObject(task) && typeof task.id === "string" && typeof task.taskId === "string" && typeof task.title === "string" && (task.description === void 0 || typeof task.description === "string") && isTaskStage(task.stage) && (task.order === void 0 || typeof task.order === "number" && Number.isFinite(task.order)) && isStringArray(task.tags) && typeof task.createdAt === "number" && Number.isFinite(task.createdAt) && (task.priority === void 0 || isPriority(task.priority)) && (task.role === void 0 || typeof task.role === "string") && (task.project === void 0 || typeof task.project === "string");
  };
  var isTaskFrontmatter = (value) => {
    return isObject(value) && isTaskStage(value.stage) && (value.order === void 0 || typeof value.order === "number" && Number.isFinite(value.order)) && (value.title === void 0 || typeof value.title === "string") && (value.role === void 0 || typeof value.role === "string") && (value.agent === void 0 || typeof value.agent === "string") && (value.provider === void 0 || typeof value.provider === "string") && (value.model === void 0 || typeof value.model === "string") && (value.profile === void 0 || typeof value.profile === "string") && (value.priority === void 0 || isPriority(value.priority)) && isStringArray(value.tags) && isStringArray(value.contexts) && isStringArray(value.skills) && (value.project === void 0 || typeof value.project === "string") && (value.phase === void 0 || typeof value.phase === "string");
  };
  var isTask = (value) => {
    return isObject(value) && isTaskFrontmatter(value.frontmatter) && typeof value.body === "string";
  };
  var isHostToWebviewMessage = (value) => {
    if (!isObject(value) || typeof value.type !== "string") {
      return false;
    }
    if (value.type === "TaskSnapshot") {
      return isObject(value.payload) && Array.isArray(value.payload.tasks) && value.payload.tasks.every(isTaskSnapshotItem);
    }
    if (value.type === "TaskUpdated" || value.type === "TaskDeleted") {
      return isObject(value.payload) && typeof value.payload.taskId === "string";
    }
    if (value.type === "SettingsLoaded") {
      return isObject(value.payload) && isObject(value.payload.settings) && (!("projectSlug" in value.payload) || value.payload.projectSlug === void 0 || typeof value.payload.projectSlug === "string");
    }
    if (value.type === "TaskSelectionReset" || value.type === "OrchestratorResponse") {
      if (!isObject(value.payload)) {
        return false;
      }
      if (value.type === "TaskSelectionReset") {
        return typeof value.payload.reason === "string";
      }
      return typeof value.payload.message === "string";
    }
    if (value.type === "RunnerStateChanged") {
      return isObject(value.payload) && typeof value.payload.taskId === "string" && isRunState(value.payload.state) && typeof value.payload.timestamp === "number" && Number.isFinite(value.payload.timestamp);
    }
    if (value.type === "QueueSnapshot") {
      return isObject(value.payload) && Array.isArray(value.payload.items) && value.payload.items.every(isQueueItem) && (value.payload.activeTaskId === null || typeof value.payload.activeTaskId === "string") && typeof value.payload.totalQueued === "number" && Number.isFinite(value.payload.totalQueued);
    }
    if (value.type === "LoadTaskEditor") {
      return isObject(value.payload) && typeof value.payload.taskPath === "string" && typeof value.payload.taskId === "string" && isTask(value.payload.task) && (!("focusTargets" in value.payload) || value.payload.focusTargets === void 0 || Array.isArray(value.payload.focusTargets) && value.payload.focusTargets.every(isValidationFocusTarget));
    }
    if (value.type === "FocusTaskEditor") {
      return isObject(value.payload) && Array.isArray(value.payload.focusTargets) && value.payload.focusTargets.every(isValidationFocusTarget);
    }
    return false;
  };

  // src/webview/ui/board.tsx
  var app = document.getElementById("app");
  if (!app) {
    throw new Error("Board root element not found");
  }
  app.innerHTML = `
<div class="board-area">
  <div class="openclaw-banner" id="openclawBanner">
    <div class="openclaw-banner-icon"></div>
    <span class="openclaw-banner-text">Connect to <strong>OpenClaw</strong> for shared boards, team sync, and CI hooks</span>
    <button class="openclaw-connect-btn" type="button">Connect</button>
    <button class="openclaw-dismiss" id="dismissBanner" type="button" title="Dismiss">\xD7</button>
  </div>

  <div class="board-header-wrap">
    <div class="board-toolbar">
      <div class="toolbar-left">
        <span class="toolbar-brand">Kanban2Code</span>
        <div class="toolbar-div"></div>
        <button class="bc-scope" type="button">Filesystem snapshot <span class="bc-caret">\u25BC</span></button>
      </div>

      <div class="toolbar-center">
        <div class="search-wrap">
          <span class="search-icon">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <circle cx="5.5" cy="5.5" r="4.2"/>
              <line x1="8.7" y1="8.7" x2="11.5" y2="11.5"/>
            </svg>
          </span>
          <input class="search-input" id="searchInput" type="text" placeholder="Search tasks, tags, ids\u2026" autocomplete="off" />
          <button class="search-clear" type="button" id="searchClear" title="Clear search">\xD7</button>
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
      <button class="capture-modal-close" id="captureCloseBtn" type="button" aria-label="Close capture modal">\xD7</button>
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
  var vscode = typeof acquireVsCodeApi === "function" ? acquireVsCodeApi() : null;
  var searchInput = document.getElementById("searchInput");
  var searchClear = document.getElementById("searchClear");
  var priorityFilter = document.getElementById("priorityFilter");
  var sortOrderSelect = document.getElementById("sortOrder");
  var projectFilter = document.getElementById("projectFilter");
  var taskCountLabel = document.getElementById("taskCountLabel");
  var queueChip = document.getElementById("queueChip");
  var captureModal = document.getElementById("captureModal");
  var captureForm = document.getElementById("captureForm");
  var captureStageLabel = document.getElementById("captureStageLabel");
  var captureTitleInput = document.getElementById("captureTitle");
  var captureDescriptionInput = document.getElementById("captureDescription");
  var capturePrioritySelect = document.getElementById("capturePriority");
  var captureRoleSelect = document.getElementById("captureRole");
  var captureProjectSelect = document.getElementById("captureProject");
  var captureTagInput = document.getElementById("captureTagInput");
  var captureAddTagBtn = document.getElementById("captureAddTagBtn");
  var captureTagsList = document.getElementById("captureTagsList");
  var captureValidation = document.getElementById("captureValidation");
  var captureCloseBtn = document.getElementById("captureCloseBtn");
  var captureCancelBtn = document.getElementById("captureCancelBtn");
  var captureSubmitBtn = document.getElementById("captureSubmitBtn");
  var columnIds = ["capture", "plan", "code", "audit", "completed"];
  var allTasks = [];
  var activeSearch = "";
  var activePriority = "all";
  var activeSortOrder = "newest";
  var activeProject = "all";
  var searchDebounceTimeout;
  var activeDragState = null;
  var activeDropContainer = null;
  var capturePrefilledStage = null;
  var captureModalOpen = false;
  var captureSaving = false;
  var captureTags = [];
  var confirmDestructiveActions = true;
  var contextMenuTaskId = null;
  var queuedTaskCount = 0;
  var activeTaskId = null;
  var runStateByTaskId = /* @__PURE__ */ new Map();
  var contextMenu = document.createElement("div");
  contextMenu.className = "ctx-menu";
  contextMenu.id = "cardContextMenu";
  contextMenu.setAttribute("aria-hidden", "true");
  document.body.appendChild(contextMenu);
  var CAPTURE_PROJECT_ALL = "all";
  var CAPTURE_PROJECT_INBOX = "inbox";
  var escapeHtml = (value) => {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  var toBoardColumn = (stage) => {
    switch (stage) {
      case "plan":
      case "code":
      case "audit":
      case "completed":
        return stage;
      case "capture":
      case "inbox":
      case "unknown":
      default:
        return "capture";
    }
  };
  var toPriorityClass = (priority) => {
    if (priority === "high") {
      return "high";
    }
    if (priority === "medium") {
      return "med";
    }
    if (priority === "low") {
      return "low";
    }
    return "none";
  };
  var getDescription = (task) => {
    const description = task.description?.trim();
    if (description && description.length > 0) {
      return description;
    }
    return `Task ID: ${task.taskId}`;
  };
  var isRecord = (value) => typeof value === "object" && value !== null;
  var parseConfirmDestructiveActions = (settings) => {
    const general = settings.general;
    if (!isRecord(general)) {
      return true;
    }
    return typeof general.confirmDestructiveActions === "boolean" ? general.confirmDestructiveActions : true;
  };
  var getContextMoveStages = (currentStage) => {
    return columnIds.filter((stage) => stage !== currentStage);
  };
  var moveMenuLabel = (stage) => {
    return stage === "completed" ? "Done" : stage.charAt(0).toUpperCase() + stage.slice(1);
  };
  var runStateLabel = {
    queued: "Queued",
    running: "Running",
    success: "Success",
    failed: "Failed",
    cancelled: "Cancelled"
  };
  var getRunStateForTask = (task) => {
    return runStateByTaskId.get(task.id) ?? runStateByTaskId.get(task.taskId) ?? null;
  };
  var getTaskIdentifier = (taskIdentifier) => {
    const task = allTasks.find((entry) => entry.id === taskIdentifier || entry.taskId === taskIdentifier);
    return task?.id ?? taskIdentifier;
  };
  var setTaskRunState = (taskIdentifier, state) => {
    const resolvedId = getTaskIdentifier(taskIdentifier);
    runStateByTaskId.set(resolvedId, state);
    const task = allTasks.find((entry) => entry.id === resolvedId || entry.taskId === taskIdentifier);
    if (task) {
      runStateByTaskId.set(task.id, state);
      runStateByTaskId.set(task.taskId, state);
    }
  };
  var syncRunStateMapToTasks = () => {
    for (const task of allTasks) {
      const known = runStateByTaskId.get(task.id) ?? runStateByTaskId.get(task.taskId);
      if (!known) {
        continue;
      }
      runStateByTaskId.set(task.id, known);
      runStateByTaskId.set(task.taskId, known);
    }
  };
  var updateQueueChip = () => {
    if (!queueChip) {
      return;
    }
    queueChip.textContent = `Queue: ${queuedTaskCount}`;
    queueChip.classList.toggle("active", queuedTaskCount > 0 || Boolean(activeTaskId));
  };
  var closeContextMenu = () => {
    contextMenu.classList.remove("open");
    contextMenu.setAttribute("aria-hidden", "true");
    contextMenuTaskId = null;
  };
  var positionContextMenu = (x, y) => {
    const { width, height } = contextMenu.getBoundingClientRect();
    const padding = 8;
    const maxLeft = Math.max(padding, window.innerWidth - width - padding);
    const maxTop = Math.max(padding, window.innerHeight - height - padding);
    const left = Math.min(Math.max(padding, x), maxLeft);
    const top = Math.min(Math.max(padding, y), maxTop);
    contextMenu.style.left = `${left}px`;
    contextMenu.style.top = `${top}px`;
  };
  var openContextMenu = (taskId, x, y) => {
    const task = getTaskById(taskId);
    if (!task) {
      closeContextMenu();
      return;
    }
    const boardStage = toBoardColumn(task.stage);
    const moveItems = getContextMoveStages(boardStage).map((stage) => {
      const label = moveMenuLabel(stage);
      return `<button class="cm-item" type="button" data-context-action="move" data-stage="${stage}">${label}</button>`;
    }).join("");
    const runState = getRunStateForTask(task);
    const canCancel = runState === "queued" || runState === "running";
    const canRetry = runState === "failed";
    const cancelItem = canCancel ? `<button class="cm-item" type="button" data-context-action="cancel">Cancel</button>` : "";
    const retryItem = canRetry ? `<button class="cm-item" type="button" data-context-action="retry">Retry</button>` : "";
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
        <span class="cm-chevron">\u203A</span>
        <div class="cm-submenu">
          ${moveItems}
        </div>
      </div>
      <button class="cm-item" type="button" data-context-action="edit">Edit</button>
      <button class="cm-item" type="button" data-context-action="copy">Copy</button>
      <button class="cm-item danger" type="button" data-context-action="delete">Delete</button>
    </div>
  `;
    contextMenu.classList.add("open");
    contextMenu.setAttribute("aria-hidden", "false");
    positionContextMenu(x, y);
  };
  var createCardMarkup = (task) => {
    const priorityClass = toPriorityClass(task.priority);
    const priorityLabel = task.priority ?? "unset";
    const runState = getRunStateForTask(task);
    const roleChip = task.role ? `<span class="agent-chip">${escapeHtml(task.role)}</span>` : "";
    const projectChip = task.project ? `<span class="project-chip">${escapeHtml(task.project)}</span>` : "";
    const runBadge = runState ? `<span class="run-state-badge run-state-${runState}" title="Run state: ${escapeHtml(runStateLabel[runState])}">${escapeHtml(runStateLabel[runState])}</span>` : "";
    const tagChips = task.tags.map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join("");
    const cardStateClass = runState ? ` run-state-${runState}` : "";
    return `
    <article class="card${toBoardColumn(task.stage) === "completed" ? " done" : ""}${cardStateClass}" draggable="true" data-task-id="${escapeHtml(task.id)}">
      <div class="card-actions">
        <button class="card-action-btn edit-btn" type="button" data-card-action="edit" title="Edit task" aria-label="Edit task">
          \u270E
        </button>
        <button class="card-action-btn delete-btn" type="button" data-card-action="delete" title="Delete task" aria-label="Delete task">
          \u{1F5D1}
        </button>
        <button class="card-action-btn menu-btn" type="button" data-card-action="menu" title="More actions" aria-label="More actions">
          \u22EF
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
  var createEmptyMarkup = () => {
    return `<div class="empty-state">No tasks in this stage</div>`;
  };
  var normalizeProject = (project) => {
    return project?.trim() ?? "";
  };
  var applyFilterSelectState = (selectEl, isActive) => {
    if (!selectEl) {
      return;
    }
    selectEl.classList.toggle("active", isActive);
  };
  var getDiscoveredProjects = (tasks) => {
    const projectSet = /* @__PURE__ */ new Set();
    for (const task of tasks) {
      const project = normalizeProject(task.project);
      if (project) {
        projectSet.add(project);
      }
    }
    return Array.from(projectSet).sort((a, b) => a.localeCompare(b));
  };
  var toStageLabel = (stage) => {
    if (stage === "completed") {
      return "Done";
    }
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };
  var isBoardColumnId = (value) => {
    return value === "capture" || value === "plan" || value === "code" || value === "audit" || value === "completed";
  };
  var setCaptureValidation = (message) => {
    if (!captureValidation) {
      return;
    }
    if (!message) {
      captureValidation.textContent = "";
      captureValidation.classList.add("is-hidden");
      return;
    }
    captureValidation.textContent = message;
    captureValidation.classList.remove("is-hidden");
  };
  var normalizeTag = (tag) => tag.trim().replace(/\s+/g, "-");
  var renderCaptureTags = () => {
    if (!captureTagsList) {
      return;
    }
    captureTagsList.innerHTML = captureTags.map((tag) => `
      <button class="capture-tag-chip" type="button" data-tag="${escapeHtml(tag)}">
        <span>${escapeHtml(tag)}</span>
        <span class="capture-tag-remove" aria-hidden="true">\xD7</span>
      </button>
    `).join("");
  };
  var addCaptureTag = (rawTag) => {
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
  var removeCaptureTag = (tag) => {
    captureTags = captureTags.filter((entry) => entry !== tag);
    renderCaptureTags();
  };
  var syncCaptureProjectOptions = (tasks) => {
    if (!captureProjectSelect) {
      return;
    }
    const selected = captureProjectSelect.value;
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
    captureProjectSelect.innerHTML = options.join("");
    if (selected === CAPTURE_PROJECT_ALL || selected === CAPTURE_PROJECT_INBOX || discoveredProjects.includes(selected)) {
      captureProjectSelect.value = selected;
    } else {
      captureProjectSelect.value = CAPTURE_PROJECT_ALL;
    }
  };
  var resetCaptureForm = () => {
    if (captureForm) {
      captureForm.reset();
    }
    if (capturePrioritySelect) {
      capturePrioritySelect.value = "medium";
    }
    if (captureRoleSelect) {
      captureRoleSelect.value = "";
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
      captureSubmitBtn.textContent = "Create Task";
    }
  };
  var openCaptureModal = (prefilledStage) => {
    if (!captureModal) {
      return;
    }
    capturePrefilledStage = prefilledStage;
    resetCaptureForm();
    if (captureStageLabel) {
      captureStageLabel.textContent = capturePrefilledStage ? toStageLabel(capturePrefilledStage) : "Default (inbox)";
    }
    captureModal.classList.remove("is-hidden");
    captureModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("capture-modal-open");
    captureModalOpen = true;
    window.setTimeout(() => {
      captureTitleInput?.focus();
    }, 0);
  };
  var closeCaptureModal = () => {
    if (!captureModal) {
      return;
    }
    captureModal.classList.add("is-hidden");
    captureModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("capture-modal-open");
    capturePrefilledStage = null;
    captureModalOpen = false;
    setCaptureValidation();
  };
  var submitCaptureTask = () => {
    if (!captureTitleInput || !captureDescriptionInput || !capturePrioritySelect || !captureRoleSelect || !captureProjectSelect) {
      return;
    }
    if (captureSaving) {
      return;
    }
    const title = captureTitleInput.value.trim();
    if (!title) {
      setCaptureValidation("Title is required.");
      captureTitleInput.focus();
      return;
    }
    setCaptureValidation();
    captureSaving = true;
    if (captureSubmitBtn) {
      captureSubmitBtn.disabled = true;
      captureSubmitBtn.textContent = "Creating...";
    }
    const description = captureDescriptionInput.value.trim();
    const roleValue = captureRoleSelect.value;
    const projectValue = captureProjectSelect.value;
    const message = {
      type: "CreateTask",
      payload: {
        title,
        body: description.length > 0 ? description : void 0,
        stage: capturePrefilledStage ?? void 0,
        priority: capturePrioritySelect.value,
        role: roleValue || void 0,
        project: projectValue === CAPTURE_PROJECT_ALL ? void 0 : projectValue === CAPTURE_PROJECT_INBOX ? "Inbox" : projectValue,
        tags: captureTags
      }
    };
    vscode?.postMessage(message);
    closeCaptureModal();
  };
  var syncProjectFilterOptions = (tasks) => {
    if (!projectFilter) {
      return;
    }
    const projects = getDiscoveredProjects(tasks);
    const existing = new Set(projects);
    if (activeProject !== "all" && !existing.has(activeProject)) {
      activeProject = "all";
    }
    projectFilter.innerHTML = ['<option value="all">Project: All</option>', ...projects.map((project) => {
      const escaped = escapeHtml(project);
      return `<option value="${escaped}">${escaped}</option>`;
    })].join("");
    projectFilter.value = activeProject;
    applyFilterSelectState(projectFilter, activeProject !== "all");
  };
  var filterTasks = (tasks, search, priority, project) => {
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
      if (priority !== "all" && task.priority !== priority) {
        return false;
      }
      if (project !== "all" && normalizeProject(task.project) !== project) {
        return false;
      }
      return true;
    });
  };
  var sortTasks = (tasks, order) => {
    return [...tasks].sort((a, b) => {
      const leftOrder = typeof a.order === "number" && Number.isFinite(a.order) ? a.order : Number.NaN;
      const rightOrder = typeof b.order === "number" && Number.isFinite(b.order) ? b.order : Number.NaN;
      const leftHasOrder = Number.isFinite(leftOrder);
      const rightHasOrder = Number.isFinite(rightOrder);
      if (leftHasOrder && rightHasOrder && leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }
      if (leftHasOrder !== rightHasOrder) {
        return leftHasOrder ? -1 : 1;
      }
      if (a.createdAt !== b.createdAt) {
        return order === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
      }
      return a.taskId.localeCompare(b.taskId);
    });
  };
  var renderBoard = () => {
    closeContextMenu();
    const visibleTasks = sortTasks(
      filterTasks(allTasks, activeSearch, activePriority, activeProject),
      activeSortOrder
    );
    const grouped = /* @__PURE__ */ new Map();
    for (const columnId of columnIds) {
      grouped.set(columnId, []);
    }
    for (const task of visibleTasks) {
      grouped.get(toBoardColumn(task.stage))?.push(task);
    }
    for (const columnId of columnIds) {
      const column = document.querySelector(`.column[data-column="${columnId}"]`);
      if (!column) {
        continue;
      }
      const countEl = column.querySelector("[data-count]");
      const cardsEl = column.querySelector("[data-cards]");
      const tasks = grouped.get(columnId) ?? [];
      if (countEl) {
        countEl.textContent = String(tasks.length);
      }
      if (cardsEl) {
        cardsEl.innerHTML = tasks.length > 0 ? tasks.map((task) => createCardMarkup(task)).join("") : createEmptyMarkup();
        cardsEl.setAttribute("data-column", columnId);
      }
    }
    if (taskCountLabel) {
      taskCountLabel.textContent = `Showing ${visibleTasks.length} of ${allTasks.length} tasks`;
    }
  };
  var getTaskById = (taskId) => {
    return allTasks.find((task) => task.id === taskId);
  };
  var getCardElements = (container) => {
    return Array.from(container.querySelectorAll(".card[data-task-id]"));
  };
  var getDropIndex = (container, pointerY) => {
    const cards = getCardElements(container).filter((card) => !card.classList.contains("dragging"));
    for (let index = 0; index < cards.length; index += 1) {
      const card = cards[index];
      const rect = card.getBoundingClientRect();
      if (pointerY < rect.top + rect.height / 2) {
        return index;
      }
    }
    return cards.length;
  };
  var clearDropTargetIndicators = () => {
    document.querySelectorAll(".card.drop-target").forEach((card) => {
      card.classList.remove("drop-target");
    });
  };
  var updateDropTargetIndicators = (container, dropIndex) => {
    clearDropTargetIndicators();
    const cards = getCardElements(container).filter((card) => !card.classList.contains("dragging"));
    const dropTargetCard = cards[dropIndex];
    if (dropTargetCard) {
      dropTargetCard.classList.add("drop-target");
    }
  };
  var clearDragVisualState = () => {
    document.querySelectorAll(".card.dragging").forEach((card) => {
      card.classList.remove("dragging");
    });
    clearDropTargetIndicators();
    activeDropContainer?.classList.remove("drop-target");
    activeDropContainer = null;
    document.body.classList.remove("board-dragging");
  };
  var getTaskOrderValue = (task, fallbackIndex) => {
    if (typeof task.order === "number" && Number.isFinite(task.order)) {
      return task.order;
    }
    return fallbackIndex * 1e3;
  };
  var calculateNewOrder = (targetTaskIds, dropIndex) => {
    const previousTaskId = dropIndex > 0 ? targetTaskIds[dropIndex - 1] : void 0;
    const nextTaskId = dropIndex < targetTaskIds.length ? targetTaskIds[dropIndex] : void 0;
    const previousTask = previousTaskId ? getTaskById(previousTaskId) : void 0;
    const nextTask = nextTaskId ? getTaskById(nextTaskId) : void 0;
    if (previousTask && nextTask) {
      const previousOrder = getTaskOrderValue(previousTask, dropIndex - 1);
      const nextOrder = getTaskOrderValue(nextTask, dropIndex);
      return (previousOrder + nextOrder) / 2;
    }
    if (previousTask) {
      return getTaskOrderValue(previousTask, dropIndex - 1) + 1e3;
    }
    if (nextTask) {
      return getTaskOrderValue(nextTask, dropIndex) - 1e3;
    }
    return 0;
  };
  var getColumnForCard = (card) => {
    const column = card.closest(".column[data-column]");
    const columnId = column?.dataset.column;
    if (columnId === "capture" || columnId === "plan" || columnId === "code" || columnId === "audit" || columnId === "completed") {
      return columnId;
    }
    return null;
  };
  var getTaskIdFromTransfer = (event) => {
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) {
      return void 0;
    }
    const raw = dataTransfer.getData("application/json");
    if (!raw) {
      return void 0;
    }
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed.taskId === "string" ? parsed.taskId : void 0;
    } catch {
      return void 0;
    }
  };
  var setupDragAndDrop = () => {
    app.addEventListener("dragstart", (event) => {
      const card = event.target?.closest(".card[data-task-id]");
      if (!card || !event.dataTransfer) {
        return;
      }
      const taskId = card.dataset.taskId;
      const sourceStage = getColumnForCard(card);
      const sourceContainer = card.closest(".col-cards");
      if (!taskId || !sourceStage || !sourceContainer) {
        return;
      }
      const cards = getCardElements(sourceContainer);
      const sourceIndex = cards.findIndex((entry) => entry.dataset.taskId === taskId);
      if (sourceIndex < 0) {
        return;
      }
      activeDragState = { taskId, sourceStage, sourceIndex };
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("application/json", JSON.stringify(activeDragState));
      event.dataTransfer.setData("text/plain", taskId);
      card.classList.add("dragging");
      document.body.classList.add("board-dragging");
    });
    app.addEventListener("dragover", (event) => {
      if (!activeDragState) {
        return;
      }
      const container = event.target?.closest(".col-cards[data-column]");
      if (!container) {
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      if (activeDropContainer && activeDropContainer !== container) {
        activeDropContainer.classList.remove("drop-target");
      }
      activeDropContainer = container;
      activeDropContainer.classList.add("drop-target");
      updateDropTargetIndicators(container, getDropIndex(container, event.clientY));
    });
    app.addEventListener("dragleave", (event) => {
      const container = event.target?.closest(".col-cards[data-column]");
      if (!container || activeDropContainer !== container) {
        return;
      }
      const nextTarget = event.relatedTarget;
      if (nextTarget && container.contains(nextTarget)) {
        return;
      }
      container.classList.remove("drop-target");
      clearDropTargetIndicators();
      activeDropContainer = null;
    });
    app.addEventListener("drop", (event) => {
      const container = event.target?.closest(".col-cards[data-column]");
      const dropState = activeDragState;
      const dragTaskId = getTaskIdFromTransfer(event) ?? dropState?.taskId;
      const targetStage = container?.dataset.column;
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
      const targetTaskIds = getCardElements(container).map((card) => card.dataset.taskId).filter((taskId) => typeof taskId === "string" && taskId !== dragTaskId);
      const newOrder = calculateNewOrder(targetTaskIds, dropIndex);
      const movedTask = getTaskById(dragTaskId);
      if (movedTask) {
        movedTask.stage = targetStage === "capture" ? "capture" : targetStage;
        movedTask.order = newOrder;
      }
      if (vscode) {
        if (dropState.sourceStage === targetStage) {
          const message = {
            type: "ReorderTask",
            payload: {
              taskId: dragTaskId,
              newOrder
            }
          };
          vscode.postMessage(message);
        } else {
          const message = {
            type: "MoveTask",
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
    app.addEventListener("dragend", () => {
      clearDragVisualState();
      activeDragState = null;
    });
  };
  var requestTaskSnapshot = () => {
    if (!vscode) {
      return;
    }
    const message = {
      type: "RequestTaskSnapshot"
    };
    vscode.postMessage(message);
  };
  var postOpenTaskEditor = (taskId) => {
    if (!vscode) {
      return;
    }
    const message = {
      type: "OpenTaskEditor",
      payload: { taskId }
    };
    vscode.postMessage(message);
  };
  var postDeleteTask = (taskId) => {
    if (!vscode) {
      return;
    }
    const message = {
      type: "DeleteTask",
      payload: { taskId }
    };
    vscode.postMessage(message);
  };
  var postRunStage = (taskId) => {
    if (!vscode) {
      return;
    }
    const message = {
      type: "RunStage",
      payload: { taskId }
    };
    vscode.postMessage(message);
  };
  var postRunAllStages = (taskId) => {
    if (!vscode) {
      return;
    }
    const message = {
      type: "RunAllStages",
      payload: { taskId }
    };
    vscode.postMessage(message);
  };
  var postQueueStage = (taskId) => {
    if (!vscode) {
      return;
    }
    const message = {
      type: "QueueStage",
      payload: { taskId }
    };
    vscode.postMessage(message);
  };
  var postCancelRun = (taskId) => {
    if (!vscode) {
      return;
    }
    const message = {
      type: "CancelRun",
      payload: { taskId }
    };
    vscode.postMessage(message);
  };
  var postRetryRun = (taskId) => {
    if (!vscode) {
      return;
    }
    const message = {
      type: "RetryRun",
      payload: { taskId }
    };
    vscode.postMessage(message);
  };
  var copyTaskToClipboard = async (taskId) => {
    const task = getTaskById(taskId);
    if (!task) {
      return;
    }
    const summary = `${task.title}
${task.taskId}`;
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
    }
  };
  var requestDeleteTask = (taskId) => {
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
  window.addEventListener("message", (event) => {
    if (!isHostToWebviewMessage(event.data)) {
      return;
    }
    if (event.data.type === "RunnerStateChanged") {
      setTaskRunState(event.data.payload.taskId, event.data.payload.state);
      renderBoard();
      return;
    }
    if (event.data.type === "QueueSnapshot") {
      activeTaskId = event.data.payload.activeTaskId;
      queuedTaskCount = event.data.payload.totalQueued;
      updateQueueChip();
      for (const item of event.data.payload.items) {
        setTaskRunState(item.taskId, item.state);
      }
      renderBoard();
      return;
    }
    if (event.data.type === "SettingsLoaded") {
      confirmDestructiveActions = parseConfirmDestructiveActions(event.data.payload.settings);
      return;
    }
    if (event.data.type !== "TaskSnapshot") {
      return;
    }
    allTasks = event.data.payload.tasks;
    syncRunStateMapToTasks();
    syncProjectFilterOptions(allTasks);
    syncCaptureProjectOptions(allTasks);
    renderBoard();
  });
  app.addEventListener("click", (event) => {
    const target = event.target;
    if (!target) {
      return;
    }
    const actionButton = target.closest("[data-card-action]");
    if (!actionButton) {
      if (!target.closest("#cardContextMenu")) {
        closeContextMenu();
      }
      return;
    }
    const card = actionButton.closest(".card[data-task-id]");
    const taskId = card?.dataset.taskId;
    const action = actionButton.dataset.cardAction;
    if (!taskId || !action) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (action === "edit") {
      postOpenTaskEditor(taskId);
      closeContextMenu();
      return;
    }
    if (action === "delete") {
      requestDeleteTask(taskId);
      closeContextMenu();
      return;
    }
    if (action === "menu") {
      const rect = actionButton.getBoundingClientRect();
      openContextMenu(taskId, rect.right, rect.bottom + 6);
    }
  });
  app.addEventListener("contextmenu", (event) => {
    const card = event.target?.closest(".card[data-task-id]");
    const taskId = card?.dataset.taskId;
    if (!card || !taskId) {
      return;
    }
    event.preventDefault();
    openContextMenu(taskId, event.clientX, event.clientY);
  });
  contextMenu.addEventListener("click", (event) => {
    const target = event.target?.closest("[data-context-action]");
    const action = target?.dataset.contextAction;
    const taskId = contextMenuTaskId;
    if (!action || !taskId) {
      return;
    }
    if (action === "open" || action === "edit") {
      postOpenTaskEditor(taskId);
      closeContextMenu();
      return;
    }
    if (action === "run") {
      postRunStage(taskId);
      closeContextMenu();
      return;
    }
    if (action === "run-all") {
      postRunAllStages(taskId);
      closeContextMenu();
      return;
    }
    if (action === "queue") {
      postQueueStage(taskId);
      closeContextMenu();
      return;
    }
    if (action === "cancel") {
      postCancelRun(taskId);
      closeContextMenu();
      return;
    }
    if (action === "retry") {
      postRetryRun(taskId);
      closeContextMenu();
      return;
    }
    if (action === "move") {
      const targetStage = target.dataset.stage;
      if (!targetStage) {
        return;
      }
      const message = {
        type: "MoveTask",
        payload: {
          taskId,
          targetStage
        }
      };
      vscode?.postMessage(message);
      closeContextMenu();
      return;
    }
    if (action === "copy") {
      void copyTaskToClipboard(taskId);
      closeContextMenu();
      return;
    }
    if (action === "delete") {
      requestDeleteTask(taskId);
      closeContextMenu();
    }
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!target) {
      closeContextMenu();
      return;
    }
    if (target.closest("#cardContextMenu")) {
      return;
    }
    if (target.closest('[data-card-action="menu"]')) {
      return;
    }
    closeContextMenu();
  });
  window.addEventListener("resize", closeContextMenu);
  searchInput?.addEventListener("input", () => {
    const nextValue = searchInput.value;
    window.clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = window.setTimeout(() => {
      activeSearch = nextValue;
      renderBoard();
    }, 200);
  });
  searchClear?.addEventListener("click", () => {
    if (!searchInput) {
      return;
    }
    window.clearTimeout(searchDebounceTimeout);
    searchInput.value = "";
    activeSearch = "";
    renderBoard();
    searchInput.focus();
  });
  priorityFilter?.addEventListener("change", () => {
    const nextPriority = priorityFilter.value;
    activePriority = nextPriority;
    applyFilterSelectState(priorityFilter, activePriority !== "all");
    renderBoard();
  });
  sortOrderSelect?.addEventListener("change", () => {
    const nextSortOrder = sortOrderSelect.value;
    activeSortOrder = nextSortOrder;
    applyFilterSelectState(sortOrderSelect, activeSortOrder !== "newest");
    renderBoard();
  });
  projectFilter?.addEventListener("change", () => {
    activeProject = projectFilter.value;
    applyFilterSelectState(projectFilter, activeProject !== "all");
    renderBoard();
  });
  document.querySelector(".capture-header-btn")?.addEventListener("click", () => {
    openCaptureModal(null);
  });
  document.querySelectorAll(".col-plus").forEach((button) => {
    button.addEventListener("click", () => {
      const column = button.closest(".column[data-column]");
      const stage = column?.dataset.column;
      openCaptureModal(isBoardColumnId(stage) ? stage : null);
    });
  });
  captureCloseBtn?.addEventListener("click", closeCaptureModal);
  captureCancelBtn?.addEventListener("click", closeCaptureModal);
  captureModal?.addEventListener("click", (event) => {
    if (event.target === captureModal) {
      closeCaptureModal();
    }
  });
  captureForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    submitCaptureTask();
  });
  captureTitleInput?.addEventListener("input", () => {
    if (captureTitleInput.value.trim().length > 0) {
      setCaptureValidation();
    }
  });
  captureAddTagBtn?.addEventListener("click", () => {
    if (!captureTagInput) {
      return;
    }
    addCaptureTag(captureTagInput.value);
    captureTagInput.value = "";
    captureTagInput.focus();
  });
  captureTagInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addCaptureTag(captureTagInput.value);
      captureTagInput.value = "";
    }
  });
  captureTagsList?.addEventListener("click", (event) => {
    const button = event.target.closest(".capture-tag-chip[data-tag]");
    const tag = button?.dataset.tag;
    if (!tag) {
      return;
    }
    removeCaptureTag(tag);
  });
  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }
    if (captureModalOpen) {
      closeCaptureModal();
    }
    if (contextMenuTaskId) {
      closeContextMenu();
    }
  });
  document.getElementById("dismissBanner")?.addEventListener("click", () => {
    const banner = document.getElementById("openclawBanner");
    if (banner) {
      banner.style.display = "none";
    }
  });
  setupDragAndDrop();
  renderBoard();
  updateQueueChip();
  requestTaskSnapshot();
})();
//# sourceMappingURL=board.js.map
