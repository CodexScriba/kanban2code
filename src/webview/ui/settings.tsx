import './settings.css';
import type { SettingsSection } from '../../types/settings';
import {
  isHostToWebviewMessage,
  type OpenSettingsMessage,
  type ResetSectionMessage,
  type ResetToDefaultsMessage,
  type SaveSettingsMessage
} from '../messaging';

interface VscodeApi {
  postMessage(message: unknown): void;
}

interface SettingsPanelConfig {
  id: SettingsSection;
  label: string;
  description: string;
}

declare const acquireVsCodeApi: (() => VscodeApi) | undefined;

const PANEL_CONFIGS: SettingsPanelConfig[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Timezone, date format, and global UI behavior.'
  },
  {
    id: 'taskDefaults',
    label: 'Task Defaults',
    description: 'Default metadata and behavior for newly captured tasks.'
  },
  {
    id: 'pipelineDefaults',
    label: 'Pipeline Defaults',
    description: 'Template and stage defaults for task pipelines.'
  },
  {
    id: 'stageRuntimeMapping',
    label: 'Stage Runtime Mapping',
    description: 'Role/provider/model/profile mapping per pipeline stage.'
  },
  {
    id: 'providersAndModels',
    label: 'Providers & Models',
    description: 'Provider status, supported models, and profile aliases.'
  },
  {
    id: 'agentBehavior',
    label: 'Agent Behavior',
    description: 'Mode-level instructions and tool access configuration.'
  },
  {
    id: 'roles',
    label: 'Roles',
    description: 'Available role identifiers for assignment and routing.'
  },
  {
    id: 'queueAndExecution',
    label: 'Queue & Execution',
    description: 'Queue policy, parallelism, and runtime execution toggles.'
  },
  {
    id: 'projectOverrides',
    label: 'Project Overrides',
    description: 'Per-project override flags and scoped settings behavior.'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Channels, triggers, quiet hours, and digest frequency.'
  },
  {
    id: 'telemetryAndLogs',
    label: 'Telemetry & Logs',
    description: 'Usage logging, redaction, and retention policy values.'
  }
];

const app = document.getElementById('app');

if (!app) {
  throw new Error('Settings root element not found');
}

const renderNav = (): string =>
  PANEL_CONFIGS.map((panel, index) => {
    const activeClass = index === 0 ? ' is-active' : '';
    return `<button type="button" class="settings-nav-item${activeClass}" data-nav-id="${panel.id}">${panel.label}</button>`;
  }).join('');

const renderPanels = (): string =>
  PANEL_CONFIGS.map((panel, index) => {
    const activeClass = index === 0 ? ' is-active' : '';
    return `<section class="settings-panel${activeClass}" data-panel-id="${panel.id}">
      <header class="settings-panel-header">
        <h2>${panel.label}</h2>
        <p>${panel.description}</p>
      </header>
      <div class="settings-editor-block">
        <label for="json-${panel.id}">Section JSON</label>
        <textarea id="json-${panel.id}" class="settings-json" spellcheck="false"></textarea>
      </div>
      <footer class="settings-panel-actions">
        <button type="button" class="settings-btn settings-btn-primary" data-action="save" data-section="${panel.id}">Save Section</button>
        <button type="button" class="settings-btn settings-btn-outline" data-action="reset-section" data-section="${panel.id}">Reset Section</button>
        <button type="button" class="settings-btn settings-btn-ghost" data-action="reset-defaults">Reset All Defaults</button>
      </footer>
    </section>`;
  }).join('');

app.innerHTML = `
<div class="settings-shell">
  <aside class="settings-sidebar">
    <div class="settings-sidebar-header">
      <div class="settings-brand-mark">K2C</div>
      <div>
        <div class="settings-brand-title">Settings</div>
        <div class="settings-brand-subtitle">Kanban2Code</div>
      </div>
    </div>
    <nav class="settings-nav" aria-label="Settings sections">${renderNav()}</nav>
  </aside>
  <main class="settings-main">
    <header class="settings-main-header">
      <div>
        <h1>Settings Panel</h1>
        <p>One webview host with DOM panel switching and scoped save/reset actions.</p>
      </div>
      <div class="settings-scope" id="settingsScope">Scope: global</div>
    </header>
    <div class="settings-status" id="settingsStatus" role="status" aria-live="polite">Loading settings...</div>
    <div class="settings-panels">${renderPanels()}</div>
  </main>
</div>
`;

const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;
const navItems = Array.from(document.querySelectorAll<HTMLButtonElement>('.settings-nav-item'));
const panels = Array.from(document.querySelectorAll<HTMLElement>('.settings-panel'));
const statusEl = document.getElementById('settingsStatus');
const scopeEl = document.getElementById('settingsScope');
let activeSection: SettingsSection = PANEL_CONFIGS[0].id;
let currentProjectSlug: string | undefined;

if (!statusEl || !scopeEl || navItems.length !== PANEL_CONFIGS.length || panels.length !== PANEL_CONFIGS.length) {
  throw new Error('Settings UI failed to initialize required elements');
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const setStatus = (message: string, tone: 'info' | 'success' | 'error' = 'info'): void => {
  statusEl.textContent = message;
  statusEl.dataset.tone = tone;
};

const setScopeLabel = (): void => {
  scopeEl.textContent = currentProjectSlug
    ? `Scope: project (${currentProjectSlug})`
    : 'Scope: global';
};

const activateSection = (section: SettingsSection): void => {
  activeSection = section;

  navItems.forEach((item) => {
    item.classList.toggle('is-active', item.dataset.navId === section);
  });

  panels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.panelId === section);
  });
};

const getEditorForSection = (section: SettingsSection): HTMLTextAreaElement | null => {
  return document.getElementById(`json-${section}`) as HTMLTextAreaElement | null;
};

const parseEditorJson = (section: SettingsSection): Record<string, unknown> | null => {
  const editor = getEditorForSection(section);
  if (!editor) {
    setStatus(`Section editor missing: ${section}`, 'error');
    return null;
  }

  try {
    const parsed = JSON.parse(editor.value) as unknown;
    if (!isRecord(parsed)) {
      setStatus('Section JSON must be an object.', 'error');
      return null;
    }
    return parsed;
  } catch {
    setStatus('Invalid JSON in the active section editor.', 'error');
    return null;
  }
};

const renderSettings = (settings: Record<string, unknown>): void => {
  PANEL_CONFIGS.forEach((panel) => {
    const editor = getEditorForSection(panel.id);
    if (!editor) {
      return;
    }

    const sectionValue = settings[panel.id];
    const safeValue = isRecord(sectionValue) || Array.isArray(sectionValue) ? sectionValue : {};
    editor.value = JSON.stringify(safeValue, null, 2);
  });
};

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    const section = item.dataset.navId as SettingsSection | undefined;
    if (!section) {
      return;
    }
    activateSection(section);
  });
});

app.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const actionButton = target.closest<HTMLButtonElement>('[data-action]');
  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.action;
  const section = (actionButton.dataset.section as SettingsSection | undefined) ?? activeSection;

  if (action === 'save') {
    const sectionValue = parseEditorJson(section);
    if (!sectionValue) {
      return;
    }

    const message: SaveSettingsMessage = {
      type: 'SaveSettings',
      payload: {
        settings: {
          [section]: sectionValue
        },
        projectSlug: currentProjectSlug
      }
    };
    vscode?.postMessage(message);
    setStatus(`Saving ${section}...`, 'info');
    return;
  }

  if (action === 'reset-section') {
    const message: ResetSectionMessage = {
      type: 'ResetSection',
      payload: {
        section,
        projectSlug: currentProjectSlug
      }
    };
    vscode?.postMessage(message);
    setStatus(`Resetting ${section}...`, 'info');
    return;
  }

  if (action === 'reset-defaults') {
    const message: ResetToDefaultsMessage = {
      type: 'ResetToDefaults',
      payload: {
        projectSlug: currentProjectSlug
      }
    };
    vscode?.postMessage(message);
    setStatus('Resetting all settings to defaults...', 'info');
  }
});

window.addEventListener('message', (event: MessageEvent<unknown>) => {
  if (!isHostToWebviewMessage(event.data)) {
    return;
  }

  if (event.data.type !== 'SettingsLoaded') {
    return;
  }

  currentProjectSlug = event.data.payload.projectSlug;
  setScopeLabel();
  renderSettings(event.data.payload.settings);
  setStatus(`Loaded settings for ${currentProjectSlug ? `project ${currentProjectSlug}` : 'global scope'}.`, 'success');
});

const openSettingsMessage: OpenSettingsMessage = {
  type: 'OpenSettings'
};
vscode?.postMessage(openSettingsMessage);
setScopeLabel();
activateSection(activeSection);
