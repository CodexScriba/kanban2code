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
  var isQueueItem = (value) => {
    return isObject(value) && typeof value.taskId === "string" && isQueueScope(value.scope) && isRunState(value.state) && typeof value.enqueuedAt === "number" && Number.isFinite(value.enqueuedAt);
  };
  var isTaskSnapshotItem = (task) => {
    return isObject(task) && typeof task.id === "string" && typeof task.taskId === "string" && typeof task.title === "string" && (task.description === void 0 || typeof task.description === "string") && isTaskStage(task.stage) && isStringArray(task.tags) && typeof task.createdAt === "number" && Number.isFinite(task.createdAt) && (task.priority === void 0 || isPriority(task.priority)) && (task.role === void 0 || typeof task.role === "string") && (task.project === void 0 || typeof task.project === "string");
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
        <span class="model-badge">live snapshot</span>
        <div class="toolbar-div"></div>
        <button class="capture-header-btn" type="button">+ Capture</button>
      </div>
    </div>

    <div class="filter-summary" id="filterSummary">
      Showing: <span id="taskCountLabel">0 tasks</span> <span class="sep">\xB7</span> <span>Live updates enabled</span>
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
  var vscode = typeof acquireVsCodeApi === "function" ? acquireVsCodeApi() : null;
  var searchInput = document.getElementById("searchInput");
  var searchClear = document.getElementById("searchClear");
  var taskCountLabel = document.getElementById("taskCountLabel");
  var columnIds = ["capture", "plan", "code", "audit", "completed"];
  var allTasks = [];
  var activeSearch = "";
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
  var createCardMarkup = (task) => {
    const priorityClass = toPriorityClass(task.priority);
    const priorityLabel = task.priority ?? "unset";
    const roleChip = task.role ? `<span class="agent-chip">${escapeHtml(task.role)}</span>` : "";
    const projectChip = task.project ? `<span class="project-chip">${escapeHtml(task.project)}</span>` : "";
    const tagChips = task.tags.map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join("");
    return `
    <article class="card${toBoardColumn(task.stage) === "completed" ? " done" : ""}">
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
  var createEmptyMarkup = () => {
    return `<div class="empty-state">No tasks in this stage</div>`;
  };
  var filterTasks = (tasks, search) => {
    const query = search.trim().toLowerCase();
    if (query.length === 0) {
      return tasks;
    }
    return tasks.filter((task) => {
      const haystack = [
        task.title,
        task.taskId,
        task.description ?? "",
        task.role ?? "",
        task.project ?? "",
        ...task.tags
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  };
  var renderBoard = () => {
    const visibleTasks = filterTasks(allTasks, activeSearch);
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
      }
    }
    if (taskCountLabel) {
      taskCountLabel.textContent = activeSearch ? `${visibleTasks.length} matching tasks` : `${visibleTasks.length} tasks`;
    }
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
  window.addEventListener("message", (event) => {
    if (!isHostToWebviewMessage(event.data)) {
      return;
    }
    if (event.data.type !== "TaskSnapshot") {
      return;
    }
    allTasks = event.data.payload.tasks;
    renderBoard();
  });
  searchInput?.addEventListener("input", () => {
    activeSearch = searchInput.value;
    renderBoard();
  });
  searchClear?.addEventListener("click", () => {
    if (!searchInput) {
      return;
    }
    searchInput.value = "";
    activeSearch = "";
    renderBoard();
    searchInput.focus();
  });
  document.querySelectorAll(".capture-header-btn, .col-plus").forEach((button) => {
    button.addEventListener("click", () => {
      requestTaskSnapshot();
    });
  });
  document.getElementById("dismissBanner")?.addEventListener("click", () => {
    const banner = document.getElementById("openclawBanner");
    if (banner) {
      banner.style.display = "none";
    }
  });
  renderBoard();
  requestTaskSnapshot();
})();
//# sourceMappingURL=board.js.map
