"use strict";
(() => {
  // src/webview/ui/board.tsx
  var app = document.getElementById("app");
  if (app) {
    let filterCards = function() {
      if (!searchInput) return;
      const q = searchInput.value.toLowerCase().trim();
      document.querySelectorAll(".card").forEach((card) => {
        if (!q) {
          card.classList.remove("no-match");
          return;
        }
        const text = card.innerText.toLowerCase();
        card.classList.toggle("no-match", !text.includes(q));
      });
      document.querySelectorAll(".column").forEach((col) => {
        const total = col.querySelectorAll(".card").length;
        const visible = col.querySelectorAll(".card:not(.no-match)").length;
        const badge = col.querySelector(".col-count");
        if (badge) badge.textContent = q ? visible + "/" + total : String(total);
      });
    }, openCopyDD = function(e) {
      if (!copyDd) return;
      e.stopPropagation();
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const ddW = 210;
      let x = rect.right - ddW;
      let y = rect.bottom + 4;
      if (x < 6) x = 6;
      if (y + 120 > window.innerHeight) y = rect.top - 120;
      copyDd.style.left = x + "px";
      copyDd.style.top = y + "px";
      const wasOpen = copyDd.classList.contains("open");
      closeAll();
      if (!wasOpen) copyDd.classList.add("open");
    }, copyDefault = function() {
      showToast("Full context XML copied to clipboard");
    }, copyAct = function(type) {
      if (copyDd) copyDd.classList.remove("open");
      const msgs = {
        prompt: "Prompt copied to clipboard",
        xml: "Full context XML copied to clipboard",
        both: "Prompt + XML copied to clipboard"
      };
      showToast(msgs[type] || "Copied");
    }, openMenu = function(e) {
      if (!ctxMenu) return;
      e.preventDefault();
      e.stopPropagation();
      const x = Math.min(e.clientX, window.innerWidth - 200);
      const y = Math.min(e.clientY, window.innerHeight - 190);
      ctxMenu.style.left = x + "px";
      ctxMenu.style.top = y + "px";
      const wasOpen = ctxMenu.classList.contains("open");
      closeAll();
      if (!wasOpen) ctxMenu.classList.add("open");
    }, menuAct = function(action) {
      closeAll();
      const msgs = {
        open: "Opening task file in editor\u2026",
        run: "Opening terminal executor\u2026",
        "run-all": "Queuing pipeline\u2026",
        move: "Move to stage \u2014 coming soon",
        edit: "Opening task editor\u2026",
        copy: "Context copied to clipboard",
        delete: "Task deleted"
      };
      showToast(msgs[action] || action);
    }, closeAll = function() {
      if (ctxMenu) ctxMenu.classList.remove("open");
      if (copyDd) copyDd.classList.remove("open");
    }, updateFilterSummary = function() {
      if (!priorityFilter || !sortFilter || !filterSummary) return;
      const p = priorityFilter.options[priorityFilter.selectedIndex].text;
      const s = sortFilter.options[sortFilter.selectedIndex].text;
      const v = document.querySelector(".view-toggle .active");
      const vLabel = v ? v.dataset.view === "all" ? "All tasks" : "My tasks" : "All tasks";
      filterSummary.innerHTML = `Showing: <span>${p}</span> <span class="sep">\xB7</span> <span>${s}</span> <span class="sep">\xB7</span> <span>${vLabel}</span>`;
    }, showToast = function(msg) {
      const el = document.getElementById("toast");
      if (!el) return;
      el.textContent = msg;
      el.classList.add("show");
      clearTimeout(tt);
      tt = setTimeout(() => el.classList.remove("show"), 2e3);
    };
    filterCards2 = filterCards, openCopyDD2 = openCopyDD, copyDefault2 = copyDefault, copyAct2 = copyAct, openMenu2 = openMenu, menuAct2 = menuAct, closeAll2 = closeAll, updateFilterSummary2 = updateFilterSummary, showToast2 = showToast;
    app.innerHTML = `
<div class="board-area">
    <div class="openclaw-banner" id="openclawBanner">
      <div class="openclaw-banner-icon"></div>
      <span class="openclaw-banner-text">Connect to <strong>OpenClaw</strong> for shared boards, team sync, and CI hooks</span>
      <button class="openclaw-connect-btn" type="button" onclick="showToast('Opening OpenClaw connection flow\u2026')">Connect</button>
      <button class="openclaw-dismiss" type="button" title="Dismiss" onclick="document.getElementById('openclawBanner').style.display='none'">\xD7</button>
    </div>
    <div class="board-header-wrap">
      <div class="board-toolbar">
        <div class="toolbar-left">
          <span class="toolbar-brand">Kanban2Code</span>
          <div class="toolbar-div"></div>
          <button class="bc-scope" type="button" id="projectBtn">review-system <span class="bc-caret">\u25BC</span></button>
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
          <select class="filter-select" title="Priority" aria-label="Priority filter" id="priorityFilter">
            <option value="all">All priority</option>
            <option value="high">High</option>
            <option value="med">Medium</option>
            <option value="low">Low</option>
          </select>
          <select class="filter-select" title="Sort" aria-label="Sort by" id="sortFilter">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <div class="view-toggle">
            <button type="button" class="active" data-view="all">All</button>
            <button type="button" data-view="mine">Mine</button>
          </div>
          <span class="model-badge">sonnet-4.6</span>
          <div class="toolbar-div"></div>
          <button class="capture-header-btn" type="button">+ Capture</button>
        </div>
      </div>
      <div class="filter-summary" id="filterSummary">
        Showing: <span>All priority</span> <span class="sep">\xB7</span> <span>Newest first</span> <span class="sep">\xB7</span> <span>All tasks</span>
      </div>
    </div>

    <div class="board-columns">
      <div class="column col-capture">
        <div class="col-header">
          <div class="col-accent"></div>
          <div class="col-title-row">
            <span class="col-name">Capture</span>
            <span class="col-count">3</span>
            <button class="col-plus" type="button" title="Add task">+</button>
          </div>
        </div>
        <div class="col-cards">
          <div class="card" oncontextmenu="openMenu(event)">
            <div class="card-top">
              <div class="card-top-actions">
                <button class="edit-btn" type="button" title="Edit task" onclick="showToast('Opening task editor\u2026')">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z"/></svg>
                </button>
                <button class="delete-btn" type="button" title="Delete task" onclick="showToast('Are you sure? (prototype)')">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3h9M4 3V2h4v1M2.5 3l.8 7.5h5.4l.8-7.5"/></svg>
                </button>
                <button class="card-kebab" type="button" title="Card options" onclick="openMenu(event)">\u22EE</button>
              </div>
            </div>
            <div class="card-title" onclick="showToast('Opening task file\u2026')"><span class="priority-dot high" title="High priority"></span>Review System \u2014 Notification Delivery Pipeline</div>
            <div class="card-desc">Async email + mobile push on review submit. Queue-based, retry logic, failure logging, and poison-job handling.</div>
            <div class="card-chips">
              <span class="agent-chip">architect</span>
              <span class="tag-chip">feature</span>
              <span class="tag-chip">p1</span>
            </div>
            <div class="card-actions">
              <div class="actions-run">
                <button class="run-one" type="button" title="Run Plan stage" onclick="showToast('Opening terminal executor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5l7 4.5-7 4.5z"/></svg></button>
                <button class="run-all" type="button" title="Run full pipeline" onclick="showToast('Queuing full pipeline\u2026')"><svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><path d="M1 0.5l5 5.5-5 5.5z"/><path d="M7 0.5l5 5.5-5 5.5z"/></svg></button>
                <button class="run-queue" type="button" title="Add to queue" onclick="showToast('Added to queue')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3h8M2 6h8M2 9h8"/></svg></button>
              </div>
            </div>
          </div>

          <div class="card" oncontextmenu="openMenu(event)">
            <div class="card-top">
              <div class="card-top-actions">
                <button class="edit-btn" type="button" title="Edit task" onclick="showToast('Opening task editor\u2026')">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z"/></svg>
                </button>
                <button class="delete-btn" type="button" title="Delete task" onclick="showToast('Are you sure? (prototype)')">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3h9M4 3V2h4v1M2.5 3l.8 7.5h5.4l.8-7.5"/></svg>
                </button>
                <button class="card-kebab" type="button" title="Card options" onclick="openMenu(event)">\u22EE</button>
              </div>
            </div>
            <div class="card-title" onclick="showToast('Opening task file\u2026')"><span class="priority-dot med" title="Medium priority"></span>Bulk CSV export for admin analytics</div>
            <div class="card-desc">Export filtered task and project data to CSV from the admin dashboard with strict access scope.</div>
            <div class="card-chips">
              <span class="agent-chip">sonnet</span>
              <span class="tag-chip">enhancement</span>
            </div>
            <div class="card-actions">
              <div class="actions-run">
                <button class="run-one" type="button" title="Run stage" onclick="showToast('Opening terminal executor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5l7 4.5-7 4.5z"/></svg></button>
                <button class="run-all" type="button" title="Run all stages" onclick="showToast('Queuing full pipeline\u2026')"><svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><path d="M1 0.5l5 5.5-5 5.5z"/><path d="M7 0.5l5 5.5-5 5.5z"/></svg></button>
                <button class="run-queue" type="button" title="Add to queue" onclick="showToast('Added to queue')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3h8M2 6h8M2 9h8"/></svg></button>
              </div>
            </div>
          </div>

          <div class="card" oncontextmenu="openMenu(event)">
            <div class="card-top">
              <div class="card-top-actions">
                <button class="edit-btn" type="button" title="Edit task" onclick="showToast('Opening task editor\u2026')">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z"/></svg>
                </button>
                <button class="delete-btn" type="button" title="Delete task" onclick="showToast('Are you sure? (prototype)')">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3h9M4 3V2h4v1M2.5 3l.8 7.5h5.4l.8-7.5"/></svg>
                </button>
                <button class="card-kebab" type="button" title="Card options" onclick="openMenu(event)">\u22EE</button>
              </div>
            </div>
            <div class="card-title" onclick="showToast('Opening task file\u2026')"><span class="priority-dot low" title="Low priority"></span>Remove deprecated v1 auth endpoints</div>
            <div class="card-desc">Clean up legacy /auth/v1/* routes. Update docs and remove stale tests.</div>
            <div class="card-chips">
              <span class="agent-chip">haiku</span>
              <span class="tag-chip">cleanup</span>
              <span class="tag-chip">tech-debt</span>
            </div>
            <div class="card-actions">
              <div class="actions-run">
                <button class="run-one" type="button" title="Run stage" onclick="showToast('Opening terminal executor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5l7 4.5-7 4.5z"/></svg></button>
                <button class="run-all" type="button" title="Run all stages" onclick="showToast('Queuing full pipeline\u2026')"><svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><path d="M1 0.5l5 5.5-5 5.5z"/><path d="M7 0.5l5 5.5-5 5.5z"/></svg></button>
                <button class="run-queue" type="button" title="Add to queue" onclick="showToast('Added to queue')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3h8M2 6h8M2 9h8"/></svg></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column col-plan">
        <div class="col-header">
          <div class="col-accent"></div>
          <div class="col-title-row">
            <span class="col-name">Plan</span>
            <span class="col-count">2</span>
            <button class="col-plus" type="button" title="Add task">+</button>
          </div>
        </div>
        <div class="col-cards">
          <div class="card" oncontextmenu="openMenu(event)">
            <div class="card-top">
              <div class="card-top-actions">
                <button class="edit-btn" type="button" title="Edit task" onclick="showToast('Opening task editor\u2026')">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z"/></svg>
                </button>
                <button class="delete-btn" type="button" title="Delete task" onclick="showToast('Are you sure? (prototype)')">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3h9M4 3V2h4v1M2.5 3l.8 7.5h5.4l.8-7.5"/></svg>
                </button>
                <button class="card-kebab" type="button" title="Card options" onclick="openMenu(event)">\u22EE</button>
              </div>
            </div>
            <div class="card-title" onclick="showToast('Opening task file\u2026')"><span class="priority-dot high" title="High priority"></span>Review System \u2014 Backend API</div>
            <div class="card-desc">Build review schema, database migrations, and REST endpoints for the core review system.</div>
            <div class="card-chips">
              <span class="agent-chip">architect</span>
              <span class="tag-chip">api</span>
              <span class="tag-chip">feature</span>
            </div>
            <div class="card-actions">
              <div class="actions-run">
                <button class="run-one" type="button" title="Run stage" onclick="showToast('Opening terminal executor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5l7 4.5-7 4.5z"/></svg></button>
                <button class="run-all" type="button" title="Run all stages" onclick="showToast('Queuing Code \u2192 Audit \u2192 Done\u2026')"><svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><path d="M1 0.5l5 5.5-5 5.5z"/><path d="M7 0.5l5 5.5-5 5.5z"/></svg></button>
                <button class="run-queue" type="button" title="Add to queue" onclick="showToast('Added to queue')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3h8M2 6h8M2 9h8"/></svg></button>
              </div>
            </div>
          </div>

          <div class="card" oncontextmenu="openMenu(event)">
            <div class="card-top">
              <div class="card-top-actions">
                <button class="edit-btn" type="button" title="Edit task" onclick="showToast('Opening task editor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z"/></svg></button>
                <button class="delete-btn" type="button" title="Delete task" onclick="showToast('Are you sure? (prototype)')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3h9M4 3V2h4v1M2.5 3l.8 7.5h5.4l.8-7.5"/></svg></button>
                <button class="card-kebab" type="button" title="Card options" onclick="openMenu(event)">\u22EE</button>
              </div>
            </div>
            <div class="card-title" onclick="showToast('Opening task file\u2026')"><span class="priority-dot med" title="Medium priority"></span>Dashboard metrics caching layer</div>
            <div class="card-desc">Redis-backed cache for dashboard queries. 5-minute TTL, invalidate on write operations.</div>
            <div class="card-chips">
              <span class="agent-chip">sonnet</span>
              <span class="tag-chip">performance</span>
              <span class="tag-chip">p2</span>
            </div>
            <div class="card-actions">
              <div class="actions-run">
                <button class="run-one" type="button" title="Run stage" onclick="showToast('Opening terminal executor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5l7 4.5-7 4.5z"/></svg></button>
                <button class="run-all" type="button" title="Run all stages" onclick="showToast('Queuing Code \u2192 Audit \u2192 Done\u2026')"><svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><path d="M1 0.5l5 5.5-5 5.5z"/><path d="M7 0.5l5 5.5-5 5.5z"/></svg></button>
                <button class="run-queue" type="button" title="Add to queue" onclick="showToast('Added to queue')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3h8M2 6h8M2 9h8"/></svg></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column col-code">
        <div class="col-header">
          <div class="col-accent"></div>
          <div class="col-title-row">
            <span class="col-name">Code</span>
            <span class="col-count">2</span>
            <button class="col-plus" type="button" title="Add task">+</button>
          </div>
        </div>
        <div class="col-cards">
          <div class="card running" oncontextmenu="openMenu(event)">
            <div class="card-top">
              <span class="running-badge"><span class="running-dot"></span>RUNNING</span>
              <div class="card-top-actions">
                <button class="edit-btn" type="button" title="Edit task" onclick="showToast('Opening task editor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z"/></svg></button>
                <button class="delete-btn" type="button" title="Delete task" onclick="showToast('Are you sure? (prototype)')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3h9M4 3V2h4v1M2.5 3l.8 7.5h5.4l.8-7.5"/></svg></button>
                <button class="card-kebab" type="button" title="Card options" onclick="openMenu(event)">\u22EE</button>
              </div>
            </div>
            <div class="card-title" onclick="showToast('Opening task file\u2026')"><span class="priority-dot high" title="High priority"></span>Auth: JWT refresh token rotation</div>
            <div class="card-desc">Secure refresh token rotation, revoke on reuse, 7-day expiry, stored in httpOnly cookie.</div>
            <div class="card-chips">
              <span class="agent-chip">sonnet</span>
              <span class="tag-chip">security</span>
              <span class="tag-chip">p1</span>
            </div>
            <div class="card-actions">
              <div class="actions-run">
                <button class="run-stop" type="button" title="Stop run" onclick="showToast('Focusing terminal\u2026')"><svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="1" y="1" width="8" height="8" rx="1"/></svg></button>
              </div>
            </div>
          </div>

          <div class="card" oncontextmenu="openMenu(event)">
            <div class="card-top">
              <div class="card-top-actions">
                <button class="edit-btn" type="button" title="Edit task" onclick="showToast('Opening task editor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z"/></svg></button>
                <button class="delete-btn" type="button" title="Delete task" onclick="showToast('Are you sure? (prototype)')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3h9M4 3V2h4v1M2.5 3l.8 7.5h5.4l.8-7.5"/></svg></button>
                <button class="card-kebab" type="button" title="Card options" onclick="openMenu(event)">\u22EE</button>
              </div>
            </div>
            <div class="card-title" onclick="showToast('Opening task file\u2026')"><span class="priority-dot high" title="High priority"></span>API rate limiting middleware</div>
            <div class="card-desc">Per-IP and per-user limits on public endpoints with 429 responses and retry metadata.</div>
            <div class="card-chips">
              <span class="agent-chip">sonnet</span>
              <span class="tag-chip">security</span>
              <span class="tag-chip">api</span>
            </div>
            <div class="card-actions">
              <div class="actions-run">
                <button class="run-one" type="button" title="Run stage" onclick="showToast('Opening terminal executor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5l7 4.5-7 4.5z"/></svg></button>
                <button class="run-all" type="button" title="Run all stages" onclick="showToast('Queuing Audit \u2192 Done\u2026')"><svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><path d="M1 0.5l5 5.5-5 5.5z"/><path d="M7 0.5l5 5.5-5 5.5z"/></svg></button>
                <button class="run-queue" type="button" title="Add to queue" onclick="showToast('Added to queue')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3h8M2 6h8M2 9h8"/></svg></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column col-audit">
        <div class="col-header">
          <div class="col-accent"></div>
          <div class="col-title-row">
            <span class="col-name">Audit</span>
            <span class="col-count">1</span>
            <button class="col-plus" type="button" title="Add task">+</button>
          </div>
        </div>
        <div class="col-cards">
          <div class="card" oncontextmenu="openMenu(event)">
            <div class="card-top">
              <span class="audit-return">! 1 return</span>
              <div class="card-top-actions">
                <button class="edit-btn" type="button" title="Edit task" onclick="showToast('Opening task editor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z"/></svg></button>
                <button class="delete-btn" type="button" title="Delete task" onclick="showToast('Are you sure? (prototype)')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3h9M4 3V2h4v1M2.5 3l.8 7.5h5.4l.8-7.5"/></svg></button>
                <button class="card-kebab" type="button" title="Card options" onclick="openMenu(event)">\u22EE</button>
              </div>
            </div>
            <div class="card-title" onclick="showToast('Opening task file\u2026')"><span class="priority-dot high" title="High priority"></span>Email notification delivery pipeline</div>
            <div class="card-desc">Returned once. Error handling coverage incomplete per auditor, revised and re-queued.</div>
            <div class="card-chips">
              <span class="agent-chip">opus</span>
              <span class="tag-chip">feature</span>
              <span class="tag-chip">api</span>
            </div>
            <div class="card-actions">
              <div class="actions-run">
                <button class="run-one" type="button" title="Run stage" onclick="showToast('Opening terminal executor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5l7 4.5-7 4.5z"/></svg></button>
                <button class="run-all" type="button" title="Run all stages" onclick="showToast('Queuing Audit \u2192 Done\u2026')"><svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><path d="M1 0.5l5 5.5-5 5.5z"/><path d="M7 0.5l5 5.5-5 5.5z"/></svg></button>
                <button class="run-queue" type="button" title="Add to queue" onclick="showToast('Added to queue')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3h8M2 6h8M2 9h8"/></svg></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column col-done">
        <div class="col-header">
          <div class="col-accent"></div>
          <div class="col-title-row">
            <span class="col-name">Done</span>
            <span class="col-count">3</span>
          </div>
        </div>
        <div class="col-cards">
          <div class="card done" oncontextmenu="openMenu(event)">
            <div class="card-top">
              <span class="done-mark">\u2713</span>
              <span class="done-agent">sonnet</span>
              <div class="card-top-actions">
                <button class="edit-btn" type="button" title="Edit task" onclick="showToast('Opening task editor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z"/></svg></button>
                <button class="delete-btn" type="button" title="Delete task" onclick="showToast('Are you sure? (prototype)')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3h9M4 3V2h4v1M2.5 3l.8 7.5h5.4l.8-7.5"/></svg></button>
                <button class="card-kebab" type="button" title="Card options" onclick="openMenu(event)">\u22EE</button>
              </div>
            </div>
            <div class="card-title" onclick="showToast('Opening task file\u2026')">User profile CRUD endpoints</div>
            <div class="card-chips"><span class="tag-chip">api</span><span class="tag-chip">feature</span></div>
            <div class="card-actions">
              <div class="actions-run"></div>
            </div>
          </div>

          <div class="card done" oncontextmenu="openMenu(event)">
            <div class="card-top">
              <span class="done-mark">\u2713</span>
              <span class="done-agent">opus</span>
              <div class="card-top-actions">
                <button class="edit-btn" type="button" title="Edit task" onclick="showToast('Opening task editor\u2026')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z"/></svg></button>
                <button class="delete-btn" type="button" title="Delete task" onclick="showToast('Are you sure? (prototype)')"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3h9M4 3V2h4v1M2.5 3l.8 7.5h5.4l.8-7.5"/></svg></button>
                <button class="card-kebab" type="button" title="Card options" onclick="openMenu(event)">\u22EE</button>
              </div>
            </div>
            <div class="card-title" onclick="showToast('Opening task file\u2026')">Admin: role-based access control</div>
            <div class="card-chips"><span class="tag-chip">security</span><span class="tag-chip">admin</span></div>
            <div class="card-actions">
              <div class="actions-run"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="copy-dd" id="copyDd">
    <div class="copy-dd-title">Copy options</div>
    <div class="copy-dd-item" onclick="copyAct('prompt')">Copy Prompt</div>
    <div class="copy-dd-item is-default" onclick="copyAct('xml')">Copy Full Context XML <span class="default-badge">default</span></div>
    <div class="copy-dd-item" onclick="copyAct('both')">Copy Prompt + XML</div>
  </div>

  <div class="ctx-menu" id="ctxMenu">
    <div class="cm-section">
      <div class="cm-item" onclick="menuAct('open')">Open task file</div>
      <div class="cm-item" onclick="menuAct('run')">Run current stage</div>
      <div class="cm-item" onclick="menuAct('run-all')">Run full pipeline</div>
    </div>
    <div class="cm-section">
      <div class="cm-item" onclick="menuAct('move')">Move to stage\u2026</div>
      <div class="cm-item" onclick="menuAct('edit')">Edit task</div>
      <div class="cm-item" onclick="menuAct('copy')">Copy context</div>
      <div class="cm-item" onclick="menuAct('copy-xml')">Copy XML</div>
    </div>
    <div class="cm-section">
      <div class="cm-item danger" onclick="menuAct('delete')">Delete task</div>
    </div>
  </div>

  <div class="toast" id="toast"></div>
`;
    const searchInput = document.getElementById("searchInput");
    const searchClear = document.getElementById("searchClear");
    searchInput?.addEventListener("input", () => filterCards());
    searchClear?.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
        filterCards();
        searchInput.focus();
      }
    });
    window.filterCards = filterCards;
    const copyDd = document.getElementById("copyDd");
    window.openCopyDD = openCopyDD;
    window.copyDefault = copyDefault;
    window.copyAct = copyAct;
    const ctxMenu = document.getElementById("ctxMenu");
    window.openMenu = openMenu;
    window.menuAct = menuAct;
    window.closeAll = closeAll;
    document.addEventListener("click", closeAll);
    const priorityFilter = document.getElementById("priorityFilter");
    const sortFilter = document.getElementById("sortFilter");
    const filterSummary = document.getElementById("filterSummary");
    window.updateFilterSummary = updateFilterSummary;
    priorityFilter?.addEventListener("change", () => {
      updateFilterSummary();
      showToast("Priority: " + priorityFilter.options[priorityFilter.selectedIndex].text);
    });
    sortFilter?.addEventListener("change", () => {
      updateFilterSummary();
      showToast("Sort: " + sortFilter.options[sortFilter.selectedIndex].text);
    });
    document.querySelectorAll(".view-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".view-toggle button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        updateFilterSummary();
        showToast("View: " + (btn.dataset.view === "all" ? "All tasks" : "My tasks"));
      });
    });
    document.querySelector(".capture-header-btn")?.addEventListener("click", () => {
      showToast("Use the chat sidebar to capture a task");
    });
    document.querySelectorAll(".col-plus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        showToast("Use the chat sidebar to capture a task");
      });
    });
    document.getElementById("projectBtn")?.addEventListener("click", () => {
      showToast("Project switcher \u2014 coming soon");
    });
    const ta = document.querySelector(".compose-ta");
    ta?.addEventListener("input", () => {
      if (!ta) return;
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    });
    ta?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        showToast("Message sent to orchestrator");
        if (ta) {
          ta.value = "";
          ta.style.height = "auto";
        }
      }
    });
    document.querySelector(".send-btn")?.addEventListener("click", () => {
      showToast("Message sent to orchestrator");
      if (ta) {
        ta.value = "";
        ta.style.height = "auto";
      }
    });
    (function fixButtons() {
      document.querySelectorAll("button:not([type])").forEach((b) => b.setAttribute("type", "button"));
      document.querySelectorAll(".edit-btn:not([title])").forEach((b) => b.setAttribute("title", "Edit task"));
      document.querySelectorAll(".delete-btn:not([title])").forEach((b) => b.setAttribute("title", "Delete task"));
      document.querySelectorAll(".copy-arrow:not([title])").forEach((b) => b.setAttribute("title", "More copy options"));
      document.querySelectorAll(".card-kebab:not([title])").forEach((b) => b.setAttribute("title", "Card options"));
    })();
    let tt;
    window.showToast = showToast;
  }
  var filterCards2;
  var openCopyDD2;
  var copyDefault2;
  var copyAct2;
  var openMenu2;
  var menuAct2;
  var closeAll2;
  var updateFilterSummary2;
  var showToast2;
})();
//# sourceMappingURL=board.js.map
