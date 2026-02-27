const fs = require('fs');
let tsx = fs.readFileSync('src/webview/ui/board.tsx', 'utf-8');

tsx = tsx.replace('const searchInput = document.getElementById(\'searchInput\');', 'const searchInput = document.getElementById(\'searchInput\') as HTMLInputElement | null;');
tsx = tsx.replace('const searchClear = document.getElementById(\'searchClear\');', 'const searchClear = document.getElementById(\'searchClear\') as HTMLButtonElement | null;');
tsx = tsx.replace('const copyDd = document.getElementById(\'copyDd\');', 'const copyDd = document.getElementById(\'copyDd\') as HTMLElement | null;');
tsx = tsx.replace('const ctxMenu = document.getElementById(\'ctxMenu\');', 'const ctxMenu = document.getElementById(\'ctxMenu\') as HTMLElement | null;');
tsx = tsx.replace('const priorityFilter = document.getElementById(\'priorityFilter\');', 'const priorityFilter = document.getElementById(\'priorityFilter\') as HTMLSelectElement | null;');
tsx = tsx.replace('const sortFilter = document.getElementById(\'sortFilter\');', 'const sortFilter = document.getElementById(\'sortFilter\') as HTMLSelectElement | null;');
tsx = tsx.replace('const filterSummary = document.getElementById(\'filterSummary\');', 'const filterSummary = document.getElementById(\'filterSummary\') as HTMLElement | null;');
tsx = tsx.replace('const ta = document.querySelector(\'.compose-ta\');', 'const ta = document.querySelector(\'.compose-ta\') as HTMLTextAreaElement | null;');

tsx = tsx.replace(/function filterCards\(\)/g, 'function filterCards(): void');
tsx = tsx.replace(/function openCopyDD\(e\)/g, 'function openCopyDD(e: any): void');
tsx = tsx.replace(/function copyDefault\(\)/g, 'function copyDefault(): void');
tsx = tsx.replace(/function copyAct\(type\)/g, 'function copyAct(type: string): void');
tsx = tsx.replace(/function openMenu\(e\)/g, 'function openMenu(e: any): void');
tsx = tsx.replace(/function menuAct\(action\)/g, 'function menuAct(action: string): void');
tsx = tsx.replace(/function closeAll\(\)/g, 'function closeAll(): void');
tsx = tsx.replace(/function updateFilterSummary\(\)/g, 'function updateFilterSummary(): void');
tsx = tsx.replace(/function showToast\(msg\)/g, 'function showToast(msg: string): void');

tsx = tsx.replace('let tt;', 'let tt: any;');

const parts = tsx.split('const searchInput =');
let scriptPart = 'const searchInput =' + parts[1];

scriptPart = `
    const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
    const searchClear = document.getElementById('searchClear') as HTMLButtonElement | null;

    searchInput?.addEventListener('input', () => filterCards());

    searchClear?.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        filterCards();
        searchInput.focus();
      }
    });

    function filterCards(): void {
      if (!searchInput) return;
      const q = searchInput.value.toLowerCase().trim();
      document.querySelectorAll('.card').forEach(card => {
        if (!q) {
          card.classList.remove('no-match');
          return;
        }
        const text = (card as HTMLElement).innerText.toLowerCase();
        card.classList.toggle('no-match', !text.includes(q));
      });

      document.querySelectorAll('.column').forEach(col => {
        const total = col.querySelectorAll('.card').length;
        const visible = col.querySelectorAll('.card:not(.no-match)').length;
        const badge = col.querySelector('.col-count');
        if (badge) badge.textContent = q ? visible + '/' + total : String(total);
      });
    }
    (window as any).filterCards = filterCards;

    const copyDd = document.getElementById('copyDd') as HTMLElement | null;

    function openCopyDD(e: any): void {
      if (!copyDd) return;
      e.stopPropagation();
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const ddW = 210;
      let x = rect.right - ddW;
      let y = rect.bottom + 4;
      if (x < 6) x = 6;
      if (y + 120 > window.innerHeight) y = rect.top - 120;
      copyDd.style.left = x + 'px';
      copyDd.style.top = y + 'px';
      const wasOpen = copyDd.classList.contains('open');
      closeAll();
      if (!wasOpen) copyDd.classList.add('open');
    }
    (window as any).openCopyDD = openCopyDD;

    function copyDefault(): void { showToast('Full context XML copied to clipboard'); }
    (window as any).copyDefault = copyDefault;

    function copyAct(type: string): void {
      if (copyDd) copyDd.classList.remove('open');
      const msgs: Record<string, string> = {
        prompt: 'Prompt copied to clipboard',
        xml: 'Full context XML copied to clipboard',
        both: 'Prompt + XML copied to clipboard'
      };
      showToast(msgs[type] || 'Copied');
    }
    (window as any).copyAct = copyAct;

    const ctxMenu = document.getElementById('ctxMenu') as HTMLElement | null;

    function openMenu(e: any): void {
      if (!ctxMenu) return;
      e.preventDefault();
      e.stopPropagation();
      const x = Math.min(e.clientX, window.innerWidth - 200);
      const y = Math.min(e.clientY, window.innerHeight - 190);
      ctxMenu.style.left = x + 'px';
      ctxMenu.style.top = y + 'px';
      const wasOpen = ctxMenu.classList.contains('open');
      closeAll();
      if (!wasOpen) ctxMenu.classList.add('open');
    }
    (window as any).openMenu = openMenu;

    function menuAct(action: string): void {
      closeAll();
      const msgs: Record<string, string> = {
        open: 'Opening task file in editor…',
        run: 'Opening terminal executor…',
        'run-all': 'Queuing pipeline…',
        move: 'Move to stage — coming soon',
        edit: 'Opening task editor…',
        copy: 'Context copied to clipboard',
        delete: 'Task deleted'
      };
      showToast(msgs[action] || action);
    }
    (window as any).menuAct = menuAct;

    function closeAll(): void {
      if (ctxMenu) ctxMenu.classList.remove('open');
      if (copyDd) copyDd.classList.remove('open');
    }
    (window as any).closeAll = closeAll;

    document.addEventListener('click', closeAll);

    const priorityFilter = document.getElementById('priorityFilter') as HTMLSelectElement | null;
    const sortFilter = document.getElementById('sortFilter') as HTMLSelectElement | null;
    const filterSummary = document.getElementById('filterSummary') as HTMLElement | null;

    function updateFilterSummary(): void {
      if (!priorityFilter || !sortFilter || !filterSummary) return;
      const p = priorityFilter.options[priorityFilter.selectedIndex].text;
      const s = sortFilter.options[sortFilter.selectedIndex].text;
      const v = document.querySelector('.view-toggle .active') as HTMLElement | null;
      const vLabel = v ? (v.dataset.view === 'all' ? 'All tasks' : 'My tasks') : 'All tasks';
      filterSummary.innerHTML = \`Showing: <span>\${p}</span> <span class="sep">·</span> <span>\${s}</span> <span class="sep">·</span> <span>\${vLabel}</span>\`;
    }
    (window as any).updateFilterSummary = updateFilterSummary;

    priorityFilter?.addEventListener('change', () => { updateFilterSummary(); showToast('Priority: ' + priorityFilter.options[priorityFilter.selectedIndex].text); });
    sortFilter?.addEventListener('change', () => { updateFilterSummary(); showToast('Sort: ' + sortFilter.options[sortFilter.selectedIndex].text); });

    document.querySelectorAll('.view-toggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateFilterSummary();
        showToast('View: ' + ((btn as HTMLElement).dataset.view === 'all' ? 'All tasks' : 'My tasks'));
      });
    });

    document.querySelector('.capture-header-btn')?.addEventListener('click', () => {
      showToast('Use the chat sidebar to capture a task');
    });

    document.querySelectorAll('.col-plus').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        showToast('Use the chat sidebar to capture a task');
      });
    });

    document.getElementById('projectBtn')?.addEventListener('click', () => {
      showToast('Project switcher — coming soon');
    });

    const ta = document.querySelector('.compose-ta') as HTMLTextAreaElement | null;
    ta?.addEventListener('input', () => {
      if (!ta) return;
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    });

    ta?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        showToast('Message sent to orchestrator');
        if (ta) {
          ta.value = '';
          ta.style.height = 'auto';
        }
      }
    });

    document.querySelector('.send-btn')?.addEventListener('click', () => {
      showToast('Message sent to orchestrator');
      if (ta) {
        ta.value = '';
        ta.style.height = 'auto';
      }
    });

    (function fixButtons() {
      document.querySelectorAll('button:not([type])').forEach(b => b.setAttribute('type', 'button'));
      document.querySelectorAll('.edit-btn:not([title])').forEach(b => b.setAttribute('title', 'Edit task'));
      document.querySelectorAll('.delete-btn:not([title])').forEach(b => b.setAttribute('title', 'Delete task'));
      document.querySelectorAll('.copy-arrow:not([title])').forEach(b => b.setAttribute('title', 'More copy options'));
      document.querySelectorAll('.card-kebab:not([title])').forEach(b => b.setAttribute('title', 'Card options'));
    })();

    let tt: any;
    function showToast(msg: string): void {
      const el = document.getElementById('toast');
      if (!el) return;
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(tt);
      tt = setTimeout(() => el.classList.remove('show'), 2000);
    }
    (window as any).showToast = showToast;
}
`;

fs.writeFileSync('src/webview/ui/board.tsx', parts[0] + scriptPart);
