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
      return isObject(value.payload) && typeof value.payload.taskPath === "string" && typeof value.payload.taskId === "string" && isTask(value.payload.task);
    }
    return false;
  };

  // src/webview/ui/index.tsx
  var root = document.getElementById("app");
  if (!root) {
    throw new Error("Sidebar root element not found");
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
          <span>cap \xB7 3</span>
        </div>
        <div class="stage-pill">
          <span class="stage-dot plan"></span>
          <span>plan \xB7 1</span>
        </div>
        <div class="stage-pill">
          <span class="stage-dot code"></span>
          <span>code \xB7 1</span>
        </div>
        <div class="stage-pill">
          <span class="stage-dot audit"></span>
          <span>audit \xB7 1</span>
        </div>
        <div class="stage-pill">
          <span class="stage-dot done"></span>
          <span>done \xB7 3</span>
        </div>
      </div>

      <div class="chat-history" id="chatHistory">
        <div class="message user">
          <div class="message-author">You</div>
          <div class="message-content">wants to build notifications \u2014 email on review submit, mobile push for iOS/Android</div>
        </div>

        <div class="message assistant">
          <div class="message-author">Orchestrator</div>
          <div class="message-content">Should we include retry logic and failure logging for the notification system? Also, do you want this to be async or would you prefer real-time websockets?</div>
        </div>

        <div class="message user">
          <div class="message-author">You</div>
          <div class="message-content">yes, retries and logs, keep async, no websockets</div>
        </div>

        <div class="message assistant">
          <div class="message-author">Orchestrator</div>
          <div class="message-content">Here's a task scoped to your pipeline:</div>
        </div>

        <div class="task-proposal">
          <div class="task-header">
            <div class="task-label">Task Proposal</div>
            <div class="task-stage-pill">
              <span class="stage-dot capture"></span>
              <span>Capture</span>
            </div>
          </div>

          <div class="task-title">Review System \u2014 Notification Delivery Pipeline</div>

          <div class="task-row">
            <div class="task-row-label">Agent</div>
            <div class="task-row-value">architect</div>
          </div>

          <div class="task-row">
            <div class="task-row-label">Skills</div>
            <div class="task-row-value">
              <span class="task-tag">nextjs-core</span>
              <span class="task-tag">drizzle-orm</span>
              <span class="task-tag">server-actions</span>
            </div>
          </div>

          <div class="task-row">
            <div class="task-row-label">Tags</div>
            <div class="task-row-value">
              <span class="task-tag">feature</span>
              <span class="task-tag">api</span>
            </div>
          </div>

          <div class="task-actions">
            <button class="btn-secondary" type="button">Edit</button>
            <button class="btn-primary" type="button">Capture Task</button>
          </div>
        </div>
      </div>
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
      <div class="footer-section" data-section="context">
        <div class="section-header">
          <span>Context</span>
          <span class="count-badge">2</span>
        </div>
        <div class="chips-container">
          <div class="chip">
            <span>architecture.md</span>
            <button class="chip-remove" type="button" aria-label="Remove context">\xD7</button>
          </div>
          <div class="chip">
            <span>force-summary.md</span>
            <button class="chip-remove" type="button" aria-label="Remove context">\xD7</button>
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

      <div class="footer-section" data-section="skills">
        <div class="section-header">
          <span>Skills</span>
          <span class="count-badge">2</span>
        </div>
        <div class="chips-container">
          <div class="chip auto">
            <span>nextjs-core</span>
            <span class="chip-auto-badge">auto</span>
            <button class="chip-remove" type="button" aria-label="Remove skill">\xD7</button>
          </div>
          <div class="chip auto">
            <span>drizzle-orm</span>
            <span class="chip-auto-badge">auto</span>
            <button class="chip-remove" type="button" aria-label="Remove skill">\xD7</button>
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

      <div class="footer-section">
        <div class="provider-row">
          <select class="provider-select" id="providerSelect" title="LLM Provider">
            <option selected>claude sonnet-4.6</option>
            <option>claude haiku-4.5</option>
            <option>claude opus-4.6</option>
            <option>kimi k2</option>
          </select>
          <select class="provider-select" id="taskPicker" title="Task Scope">
            <option value="">No task selected (general chat)</option>
          </select>
        </div>
        <div class="task-picker-notice" id="taskPickerNotice" aria-live="polite"></div>
      </div>

      <div class="footer-section">
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
  var textarea = root.querySelector("#composeInput");
  var sendBtn = root.querySelector("#sendBtn");
  var captureBtn = root.querySelector("#captureBtn");
  var kanbanBtn = root.querySelector("#viewKanbanBtn");
  var settingsBtn = root.querySelector("#openSettingsBtn");
  var chatView = root.querySelector("#chatView");
  var kanbanView = root.querySelector("#kanbanView");
  var chatHistory = root.querySelector("#chatHistory");
  var providerSelect = root.querySelector("#providerSelect");
  var taskPicker = root.querySelector("#taskPicker");
  var taskPickerNotice = root.querySelector("#taskPickerNotice");
  var runnerIndicator = root.querySelector("#runnerIndicator");
  if (!textarea || !sendBtn || !captureBtn || !kanbanBtn || !settingsBtn || !chatView || !kanbanView || !chatHistory || !providerSelect || !taskPicker || !taskPickerNotice || !runnerIndicator) {
    throw new Error("Sidebar UI is missing required elements");
  }
  var vscodeApi = typeof acquireVsCodeApi === "function" ? acquireVsCodeApi() : null;
  var savedState = vscodeApi?.getState();
  var selectedTaskId = savedState?.selectedTaskId ?? null;
  var knownTasks = [];
  var activeDropdown = null;
  var noticeTimer = null;
  var sidebarQueueCount = 0;
  var sidebarActiveTaskId = null;
  var sidebarRunStateByTaskId = /* @__PURE__ */ new Map();
  var truncateLabel = (value, maxLength) => {
    const safeChars = Array.from(value);
    if (safeChars.length <= maxLength) {
      return value;
    }
    return `${safeChars.slice(0, maxLength - 1).join("")}\u2026`;
  };
  var updatePersistedState = () => {
    vscodeApi?.setState({ selectedTaskId });
  };
  var resolveTaskTitle = (taskIdentifier) => {
    const task = knownTasks.find((entry) => entry.id === taskIdentifier || entry.taskId === taskIdentifier);
    return task?.title ?? taskIdentifier;
  };
  var setRunStateForTask = (taskIdentifier, state) => {
    sidebarRunStateByTaskId.set(taskIdentifier, state);
    const task = knownTasks.find((entry) => entry.id === taskIdentifier || entry.taskId === taskIdentifier);
    if (!task) {
      return;
    }
    sidebarRunStateByTaskId.set(task.id, state);
    sidebarRunStateByTaskId.set(task.taskId, state);
  };
  var renderRunnerIndicator = () => {
    if (!runnerIndicator) {
      return;
    }
    runnerIndicator.classList.remove("idle", "running", "queued");
    if (sidebarActiveTaskId) {
      const label = truncateLabel(resolveTaskTitle(sidebarActiveTaskId), 24);
      runnerIndicator.textContent = `Running ${label}`;
      runnerIndicator.classList.add("running");
      return;
    }
    if (sidebarQueueCount > 0) {
      runnerIndicator.textContent = `Queue ${sidebarQueueCount}`;
      runnerIndicator.classList.add("queued");
      return;
    }
    runnerIndicator.textContent = "Runner idle";
    runnerIndicator.classList.add("idle");
  };
  var showTaskNotice = (message) => {
    taskPickerNotice.textContent = message;
    taskPickerNotice.classList.add("visible");
    if (noticeTimer !== null) {
      window.clearTimeout(noticeTimer);
    }
    noticeTimer = window.setTimeout(() => {
      taskPickerNotice.classList.remove("visible");
    }, 3e3);
  };
  var renderTaskOptions = (tasks) => {
    const placeholderValue = "";
    const previousValue = selectedTaskId ?? placeholderValue;
    taskPicker.innerHTML = "";
    const placeholderOption = document.createElement("option");
    placeholderOption.value = placeholderValue;
    placeholderOption.textContent = "No task selected (general chat)";
    taskPicker.append(placeholderOption);
    tasks.forEach((task) => {
      const option = document.createElement("option");
      option.value = task.id;
      option.textContent = `${task.stage} \u2022 ${truncateLabel(task.title, 56)}`;
      taskPicker.append(option);
    });
    const stillExists = previousValue === placeholderValue || tasks.some((task) => task.id === previousValue);
    if (!stillExists) {
      selectedTaskId = null;
      updatePersistedState();
      showTaskNotice("Previously selected task is missing. Scope reset to general chat.");
    }
    taskPicker.value = stillExists ? previousValue : placeholderValue;
  };
  var requestTaskSnapshot = () => {
    vscodeApi?.postMessage({ type: "RequestTaskSnapshot" });
  };
  var closeActiveDropdown = () => {
    if (activeDropdown) {
      activeDropdown.classList.remove("active");
      activeDropdown = null;
    }
  };
  var setBadgeCount = (section, nextCount) => {
    const badge = section.querySelector(".count-badge");
    if (badge) {
      badge.textContent = String(Math.max(0, nextCount));
    }
  };
  var getBadgeCount = (section) => {
    const badge = section.querySelector(".count-badge");
    return Number.parseInt(badge?.textContent ?? "0", 10) || 0;
  };
  var createChip = (label, isAuto = false) => {
    const chip = document.createElement("div");
    chip.className = isAuto ? "chip auto" : "chip";
    const title = document.createElement("span");
    title.textContent = label;
    chip.append(title);
    if (isAuto) {
      const autoBadge = document.createElement("span");
      autoBadge.className = "chip-auto-badge";
      autoBadge.textContent = "auto";
      chip.append(autoBadge);
    }
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "chip-remove";
    removeBtn.textContent = "\xD7";
    removeBtn.setAttribute("aria-label", `Remove ${label}`);
    chip.append(removeBtn);
    return chip;
  };
  var appendUserMessage = (message) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message user";
    const author = document.createElement("div");
    author.className = "message-author";
    author.textContent = "You";
    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = message;
    messageDiv.append(author, content);
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  };
  var sendMessage = () => {
    const message = textarea.value.trim();
    if (!message) {
      return;
    }
    appendUserMessage(message);
    vscodeApi?.postMessage({
      type: "SendChatMessage",
      payload: {
        message,
        provider: providerSelect.value,
        selectedTaskId: selectedTaskId ?? void 0
      }
    });
    textarea.value = "";
    textarea.style.height = "auto";
  };
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  });
  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
  sendBtn.addEventListener("click", sendMessage);
  captureBtn.addEventListener("click", () => textarea.focus());
  taskPicker.addEventListener("change", () => {
    selectedTaskId = taskPicker.value || null;
    updatePersistedState();
  });
  kanbanBtn.addEventListener("click", () => {
    vscodeApi?.postMessage({ type: "ShowKanbanBoard" });
  });
  settingsBtn.addEventListener("click", () => {
    vscodeApi?.postMessage({ type: "OpenSettings" });
  });
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const removeBtn = target.closest(".chip-remove");
    if (removeBtn) {
      const chip = removeBtn.closest(".chip");
      const section = removeBtn.closest(".footer-section");
      if (chip && section) {
        chip.remove();
        setBadgeCount(section, getBadgeCount(section) - 1);
      }
      return;
    }
    const toggleBtn = target.closest("[data-toggle-dropdown]");
    if (toggleBtn) {
      const dropdownId = toggleBtn.dataset.toggleDropdown;
      const dropdown = dropdownId ? root.querySelector(`#${dropdownId}`) : null;
      if (!dropdown) {
        return;
      }
      if (activeDropdown && activeDropdown !== dropdown) {
        activeDropdown.classList.remove("active");
      }
      dropdown.classList.toggle("active");
      activeDropdown = dropdown.classList.contains("active") ? dropdown : null;
      return;
    }
    const addContextItem = target.closest("[data-add-context]");
    if (addContextItem) {
      const section = root.querySelector('[data-section="context"]');
      const container = section?.querySelector(".chips-container");
      const dropdownContainer = container?.querySelector(".dropdown-container");
      const name = addContextItem.dataset.addContext;
      if (section && container && dropdownContainer && name) {
        container.insertBefore(createChip(name), dropdownContainer);
        setBadgeCount(section, getBadgeCount(section) + 1);
        addContextItem.remove();
        closeActiveDropdown();
      }
      return;
    }
    const addSkillItem = target.closest("[data-add-skill]");
    if (addSkillItem) {
      const section = root.querySelector('[data-section="skills"]');
      const container = section?.querySelector(".chips-container");
      const dropdownContainer = container?.querySelector(".dropdown-container");
      const name = addSkillItem.dataset.addSkill;
      if (section && container && dropdownContainer && name) {
        container.insertBefore(createChip(name), dropdownContainer);
        setBadgeCount(section, getBadgeCount(section) + 1);
        addSkillItem.remove();
        closeActiveDropdown();
      }
    }
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && !target.closest(".dropdown-container")) {
      closeActiveDropdown();
    }
  });
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (!isHostToWebviewMessage(message)) {
      return;
    }
    if (message.type === "TaskSnapshot") {
      knownTasks = message.payload.tasks;
      renderTaskOptions(knownTasks);
      renderRunnerIndicator();
      return;
    }
    if (message.type === "RunnerStateChanged") {
      setRunStateForTask(message.payload.taskId, message.payload.state);
      if (message.payload.state === "running") {
        sidebarActiveTaskId = message.payload.taskId;
      } else if (sidebarActiveTaskId === message.payload.taskId && message.payload.state !== "queued") {
        sidebarActiveTaskId = null;
      }
      renderRunnerIndicator();
      return;
    }
    if (message.type === "QueueSnapshot") {
      sidebarQueueCount = message.payload.totalQueued;
      sidebarActiveTaskId = message.payload.activeTaskId;
      for (const item of message.payload.items) {
        setRunStateForTask(item.taskId, item.state);
      }
      renderRunnerIndicator();
      return;
    }
    if (message.type === "TaskSelectionReset") {
      selectedTaskId = null;
      taskPicker.value = "";
      updatePersistedState();
      showTaskNotice(message.payload.reason);
      return;
    }
    if (message.type !== "OrchestratorResponse") {
      return;
    }
    const assistantMessage = document.createElement("div");
    assistantMessage.className = "message assistant";
    const author = document.createElement("div");
    author.className = "message-author";
    author.textContent = "Orchestrator";
    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = message.payload.message;
    assistantMessage.append(author, content);
    chatHistory.appendChild(assistantMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  });
  requestTaskSnapshot();
  renderRunnerIndicator();
  chatHistory.scrollTop = chatHistory.scrollHeight;
})();
//# sourceMappingURL=webview.js.map
