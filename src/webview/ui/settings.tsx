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

const RUNTIME_STAGES = ['plan', 'architecture', 'code', 'audit'] as const;
const RUNTIME_ROLE_OPTIONS = ['planner', 'architect', 'coder', 'auditor'];
const RUNTIME_PROVIDER_OPTIONS = ['anthropic', 'openai', 'google', 'deepseek'];
const RUNTIME_MODEL_OPTIONS = ['claude-3-5-haiku', 'claude-3-5-sonnet', 'gpt-4o', 'gemini-1.5-pro', 'deepseek-coder'];
const RUNTIME_PROFILE_OPTIONS = ['planner-fast', 'architecture-default', 'code-default', 'audit-deep'];

const app = document.getElementById('app');

if (!app) {
  throw new Error('Settings root element not found');
}

const renderNav = (): string =>
  PANEL_CONFIGS.map((panel, index) => {
    const activeClass = index === 0 ? ' is-active' : '';
    return `<button type="button" class="settings-nav-item${activeClass}" data-nav-id="${panel.id}">${panel.label}</button>`;
  }).join('');

const renderSelectOptions = (options: string[]): string => options.map((option) => `<option value="${option}">${option}</option>`).join('');

const renderRuntimeRow = (stage: (typeof RUNTIME_STAGES)[number]): string => {
  const title = stage.charAt(0).toUpperCase() + stage.slice(1);
  return `<div class="settings-mapping-row">
    <div class="settings-mapping-stage">${title}</div>
    <select data-field="mapping.${stage}.role">${renderSelectOptions(RUNTIME_ROLE_OPTIONS)}</select>
    <select data-field="mapping.${stage}.provider">${renderSelectOptions(RUNTIME_PROVIDER_OPTIONS)}</select>
    <select data-field="mapping.${stage}.model">${renderSelectOptions(RUNTIME_MODEL_OPTIONS)}</select>
    <select data-field="mapping.${stage}.profile">${renderSelectOptions(RUNTIME_PROFILE_OPTIONS)}</select>
  </div>`;
};

const renderPanelContent = (section: SettingsSection): string => {
  switch (section) {
    case 'general':
      return `<div class="settings-card-grid">
        <article class="settings-card">
          <h3>Display</h3>
          <div class="settings-field">
            <label>Timezone</label>
            <input type="text" data-field="timezone" placeholder="UTC" />
          </div>
          <div class="settings-field">
            <label>Date/Time Format</label>
            <select data-field="dateFormat">
              ${renderSelectOptions(['YYYY-MM-DD HH:mm', 'DD/MM/YYYY HH:mm', 'MM/DD/YYYY hh:mm A'])}
            </select>
          </div>
        </article>
        <article class="settings-card">
          <h3>Behavior</h3>
          <div class="settings-field">
            <label>UI Density</label>
            <select data-field="uiDensity">
              ${renderSelectOptions(['comfortable', 'compact'])}
            </select>
          </div>
          <label class="settings-toggle">
            <input type="checkbox" data-field="confirmDestructiveActions" />
            <span>Confirm destructive actions</span>
          </label>
        </article>
      </div>`;

    case 'taskDefaults':
      return `<div class="settings-card-grid">
        <article class="settings-card">
          <h3>Creation Defaults</h3>
          <div class="settings-field">
            <label>Default Task Title Template</label>
            <input type="text" data-field="titleTemplate" placeholder="[{{phase}}] {{title}}" />
          </div>
          <div class="settings-field">
            <label>Smart Summary Behavior</label>
            <select data-field="smartSummaryBehavior">
              ${renderSelectOptions(['manual', 'ai-assist'])}
            </select>
          </div>
          <div class="settings-field">
            <label>Default Priority</label>
            <select data-field="priority">
              ${renderSelectOptions(['low', 'medium', 'high'])}
            </select>
          </div>
        </article>
        <article class="settings-card">
          <h3>Seed Lists</h3>
          <div class="settings-field">
            <label>Default Tags (comma or newline separated)</label>
            <textarea data-field="tags"></textarea>
          </div>
          <div class="settings-field">
            <label>Default Contexts (comma or newline separated)</label>
            <textarea data-field="contexts"></textarea>
          </div>
          <div class="settings-field">
            <label>Default Skills (comma or newline separated)</label>
            <textarea data-field="skills"></textarea>
          </div>
        </article>
      </div>`;

    case 'pipelineDefaults':
      return `<div class="settings-card-grid">
        <article class="settings-card">
          <h3>Template</h3>
          <div class="settings-field">
            <label>Default Pipeline Template</label>
            <select data-field="template">
              <option value="simple">simple: capture -> plan -> code -> audit</option>
              <option value="complex">complex: capture -> architecture -> split -> code -> audit</option>
            </select>
          </div>
          <div class="settings-field">
            <label>Default Current Stage on Create</label>
            <select data-field="createStage">
              ${renderSelectOptions(['capture', 'plan', 'architecture', 'split', 'code', 'audit', 'done'])}
            </select>
          </div>
        </article>
        <article class="settings-card">
          <h3>Validation</h3>
          <div class="settings-field">
            <label>Audit Bounce Cap</label>
            <input type="number" min="0" data-field="auditBounceCap" />
          </div>
        </article>
      </div>`;

    case 'stageRuntimeMapping':
      return `<article class="settings-card">
        <h3>Per-Stage Runtime Defaults</h3>
        <p class="settings-note">Fallback mapping used when task runtime fields are empty.</p>
        <div class="settings-mapping-header">
          <div>Stage</div>
          <div>Role</div>
          <div>Provider</div>
          <div>Model</div>
          <div>Profile</div>
        </div>
        ${RUNTIME_STAGES.map((stage) => renderRuntimeRow(stage)).join('')}
      </article>`;

    case 'providersAndModels':
      return `<div class="settings-card-grid">
        <article class="settings-card">
          <h3>Providers</h3>
          <p class="settings-note">Add/edit/disable providers and models with endpoint + API key configuration.</p>
          <div class="settings-field">
            <label>Providers Object (JSON)</label>
            <textarea data-field="providersRaw" class="settings-json-inline"></textarea>
          </div>
        </article>
        <article class="settings-card">
          <h3>Profiles</h3>
          <div class="settings-field">
            <label>Profile Aliases Object (JSON)</label>
            <textarea data-field="profilesRaw" class="settings-json-inline"></textarea>
          </div>
        </article>
      </div>`;

    case 'agentBehavior':
      return `<article class="settings-card">
        <h3>Modes</h3>
        <p class="settings-note">Mode setup includes API config selector, role, description, when-to-use guidance, instructions, global instructions, and tools.</p>
        <div class="settings-field">
          <label>Modes Array (JSON)</label>
          <textarea data-field="modesRaw" class="settings-json-inline"></textarea>
        </div>
      </article>`;

    case 'roles':
      return `<div class="settings-card-grid">
        <article class="settings-card">
          <h3>Role Registry</h3>
          <div class="settings-field">
            <label>Available Roles (one per line)</label>
            <textarea data-field="availableRoles"></textarea>
          </div>
        </article>
        <article class="settings-card">
          <h3>Role Visibility</h3>
          <p class="settings-note">Roles listed here are used for assignment and pipeline availability selectors.</p>
        </article>
      </div>`;

    case 'queueAndExecution':
      return `<div class="settings-card-grid">
        <article class="settings-card">
          <h3>Queue Policy</h3>
          <div class="settings-field">
            <label>Default Queue Mode</label>
            <select data-field="defaultMode">
              <option value="stage">stage</option>
              <option value="all stages">all stages</option>
            </select>
          </div>
          <div class="settings-field">
            <label>Scheduling Policy</label>
            <select data-field="schedulingPolicy">
              <option value="FIFO">FIFO</option>
            </select>
          </div>
          <div class="settings-field">
            <label>Max Parallel Runs</label>
            <input type="number" min="1" data-field="maxParallelRuns" />
          </div>
        </article>
        <article class="settings-card">
          <h3>Execution</h3>
          <label class="settings-toggle">
            <input type="checkbox" data-field="serializedPipeline" />
            <span>Serialized pipeline mode</span>
          </label>
          <label class="settings-toggle">
            <input type="checkbox" data-field="autoOpenTerminal" />
            <span>Auto-open terminal on run</span>
          </label>
          <label class="settings-toggle">
            <input type="checkbox" data-field="promptMissingFields" />
            <span>Prompt for missing runtime fields</span>
          </label>
          <label class="settings-toggle">
            <input type="checkbox" data-field="autoResumeOnSave" />
            <span>Auto-resume queued runs after save</span>
          </label>
        </article>
      </div>`;

    case 'projectOverrides':
      return `<article class="settings-card">
        <h3>Per-Project Override Layer</h3>
        <p class="settings-note"><strong>Precedence:</strong> project override &gt; global default.</p>
        <div class="settings-field">
          <label>Projects Object (JSON)</label>
          <textarea data-field="projectsRaw" class="settings-json-inline"></textarea>
        </div>
      </article>`;

    case 'notifications':
      return `<div class="settings-card-grid">
        <article class="settings-card">
          <h3>Channels & Triggers</h3>
          <label class="settings-toggle">
            <input type="checkbox" data-field="enabled" />
            <span>Master notifications toggle</span>
          </label>
          <div class="settings-field">
            <label>Channels</label>
            <div class="settings-check-grid">
              <label><input type="checkbox" data-field="channel.in-app" /> in-app</label>
              <label><input type="checkbox" data-field="channel.telegram" /> telegram</label>
              <label><input type="checkbox" data-field="channel.sound" /> sound</label>
            </div>
          </div>
          <div class="settings-field">
            <label>Status Triggers</label>
            <div class="settings-check-grid settings-check-grid-two">
              <label><input type="checkbox" data-field="trigger.queued" /> queued</label>
              <label><input type="checkbox" data-field="trigger.running" /> running</label>
              <label><input type="checkbox" data-field="trigger.success" /> success</label>
              <label><input type="checkbox" data-field="trigger.failed" /> failed</label>
              <label><input type="checkbox" data-field="trigger.cancelled" /> cancelled</label>
            </div>
          </div>
        </article>
        <article class="settings-card">
          <h3>Quiet Hours & Digest</h3>
          <label class="settings-toggle">
            <input type="checkbox" data-field="quietEnabled" />
            <span>Enable quiet hours</span>
          </label>
          <div class="settings-field-inline">
            <div class="settings-field">
              <label>Start (HH:mm)</label>
              <input type="text" data-field="quietStart" placeholder="22:00" />
            </div>
            <div class="settings-field">
              <label>End (HH:mm)</label>
              <input type="text" data-field="quietEnd" placeholder="08:00" />
            </div>
          </div>
          <div class="settings-field">
            <label>Quiet Hours Timezone</label>
            <input type="text" data-field="quietTimezone" placeholder="UTC" />
          </div>
          <div class="settings-field">
            <label>Digest Frequency</label>
            <select data-field="digestFrequency">
              ${renderSelectOptions(['off', 'hourly', 'daily'])}
            </select>
          </div>
        </article>
      </div>`;

    case 'telemetryAndLogs':
      return `<div class="settings-card-grid">
        <article class="settings-card">
          <h3>Logging & Privacy</h3>
          <label class="settings-toggle">
            <input type="checkbox" data-field="enabled" />
            <span>Run logging enabled</span>
          </label>
          <label class="settings-toggle">
            <input type="checkbox" data-field="redactSensitive" />
            <span>Redact sensitive fields in logs</span>
          </label>
          <div class="settings-field">
            <label>Retention Policy</label>
            <input type="text" data-field="retentionPolicy" placeholder="30 days" />
          </div>
        </article>
        <article class="settings-card">
          <h3>Provider-Run Telemetry Note</h3>
          <p class="settings-note">Captured fields: <code>timestamp, taskId, stage, role, provider, model, profile, status, duration, retries, error</code>.</p>
        </article>
      </div>`;

    default:
      return '';
  }
};

const renderPanels = (): string =>
  PANEL_CONFIGS.map((panel, index) => {
    const activeClass = index === 0 ? ' is-active' : '';
    return `<section class="settings-panel${activeClass}" data-panel-id="${panel.id}">
      <header class="settings-panel-header">
        <h2>${panel.label}</h2>
        <p>${panel.description}</p>
      </header>
      <div class="settings-panel-content">${renderPanelContent(panel.id)}</div>
      <details class="settings-advanced-json">
        <summary>Advanced: Section JSON</summary>
        <div class="settings-editor-block">
          <label for="json-${panel.id}">Section JSON</label>
          <textarea id="json-${panel.id}" class="settings-json" spellcheck="false"></textarea>
        </div>
      </details>
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

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];

const parseListField = (value: string): string[] =>
  value
    .split(/[,\n]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

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

const getPanelElement = (section: SettingsSection): HTMLElement | null => {
  return document.querySelector<HTMLElement>(`.settings-panel[data-panel-id="${section}"]`);
};

const getEditorForSection = (section: SettingsSection): HTMLTextAreaElement | null => {
  return document.getElementById(`json-${section}`) as HTMLTextAreaElement | null;
};

const getFieldControl = (
  section: SettingsSection,
  field: string
): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null => {
  const panel = getPanelElement(section);
  return panel?.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[data-field="${field}"]`) ?? null;
};

const readStringField = (section: SettingsSection, field: string, fallback = ''): string => {
  const control = getFieldControl(section, field);
  if (!control) {
    return fallback;
  }
  return control.value.trim();
};

const readNumberField = (section: SettingsSection, field: string, fallback = 0): number => {
  const control = getFieldControl(section, field);
  if (!control) {
    return fallback;
  }

  const parsed = Number.parseInt(control.value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readBooleanField = (section: SettingsSection, field: string, fallback = false): boolean => {
  const control = getFieldControl(section, field);
  if (!(control instanceof HTMLInputElement) || control.type !== 'checkbox') {
    return fallback;
  }
  return control.checked;
};

const readStringListField = (section: SettingsSection, field: string): string[] => {
  const control = getFieldControl(section, field);
  if (!control) {
    return [];
  }
  return parseListField(control.value);
};

const setTextField = (section: SettingsSection, field: string, value: string): void => {
  const control = getFieldControl(section, field);
  if (!control) {
    return;
  }
  control.value = value;
};

const setBooleanField = (section: SettingsSection, field: string, value: boolean): void => {
  const control = getFieldControl(section, field);
  if (!(control instanceof HTMLInputElement) || control.type !== 'checkbox') {
    return;
  }
  control.checked = value;
};

const setSelectValue = (section: SettingsSection, field: string, value: string): void => {
  const control = getFieldControl(section, field);
  if (!(control instanceof HTMLSelectElement)) {
    return;
  }

  const hasOption = Array.from(control.options).some((option) => option.value === value);
  if (!hasOption && value) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    control.append(option);
  }

  control.value = value;
};

const setListField = (section: SettingsSection, field: string, values: string[]): void => {
  const control = getFieldControl(section, field);
  if (!control) {
    return;
  }
  control.value = values.join('\n');
};

const parseInlineJsonObject = (section: SettingsSection, field: string, label: string): Record<string, unknown> | null => {
  const raw = readStringField(section, field, '{}');

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) {
      setStatus(`${label} must be a JSON object.`, 'error');
      return null;
    }
    return parsed;
  } catch {
    setStatus(`Invalid JSON in ${label}.`, 'error');
    return null;
  }
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

const parseSectionFromControls = (section: SettingsSection): Record<string, unknown> | null => {
  if (section === 'general') {
    return {
      timezone: readStringField(section, 'timezone', 'UTC'),
      dateFormat: readStringField(section, 'dateFormat', 'YYYY-MM-DD HH:mm'),
      uiDensity: readStringField(section, 'uiDensity', 'comfortable'),
      confirmDestructiveActions: readBooleanField(section, 'confirmDestructiveActions', true)
    };
  }

  if (section === 'taskDefaults') {
    return {
      titleTemplate: readStringField(section, 'titleTemplate', ''),
      smartSummaryBehavior: readStringField(section, 'smartSummaryBehavior', 'manual'),
      priority: readStringField(section, 'priority', 'medium'),
      tags: readStringListField(section, 'tags'),
      contexts: readStringListField(section, 'contexts'),
      skills: readStringListField(section, 'skills')
    };
  }

  if (section === 'pipelineDefaults') {
    return {
      template: readStringField(section, 'template', 'simple'),
      createStage: readStringField(section, 'createStage', 'capture'),
      auditBounceCap: Math.max(0, readNumberField(section, 'auditBounceCap', 2))
    };
  }

  if (section === 'stageRuntimeMapping') {
    const mapping: Record<string, Record<string, string>> = {};

    RUNTIME_STAGES.forEach((stage) => {
      mapping[stage] = {
        role: readStringField(section, `mapping.${stage}.role`, ''),
        provider: readStringField(section, `mapping.${stage}.provider`, ''),
        model: readStringField(section, `mapping.${stage}.model`, ''),
        profile: readStringField(section, `mapping.${stage}.profile`, '')
      };
    });

    return mapping;
  }

  if (section === 'providersAndModels') {
    const providers = parseInlineJsonObject(section, 'providersRaw', 'providers');
    if (!providers) {
      return null;
    }

    const profiles = parseInlineJsonObject(section, 'profilesRaw', 'profiles');
    if (!profiles) {
      return null;
    }

    return {
      providers,
      profiles
    };
  }

  if (section === 'agentBehavior') {
    const rawModes = readStringField(section, 'modesRaw', '[]');

    try {
      const parsed = JSON.parse(rawModes) as unknown;
      if (!Array.isArray(parsed)) {
        setStatus('Modes must be a JSON array.', 'error');
        return null;
      }

      return {
        modes: parsed
      };
    } catch {
      setStatus('Invalid JSON in modes array.', 'error');
      return null;
    }
  }

  if (section === 'roles') {
    return {
      available: readStringListField(section, 'availableRoles')
    };
  }

  if (section === 'queueAndExecution') {
    return {
      defaultMode: readStringField(section, 'defaultMode', 'stage'),
      schedulingPolicy: readStringField(section, 'schedulingPolicy', 'FIFO'),
      serializedPipeline: readBooleanField(section, 'serializedPipeline', true),
      maxParallelRuns: Math.max(1, readNumberField(section, 'maxParallelRuns', 1)),
      autoOpenTerminal: readBooleanField(section, 'autoOpenTerminal', true),
      promptMissingFields: readBooleanField(section, 'promptMissingFields', true),
      autoResumeOnSave: readBooleanField(section, 'autoResumeOnSave', false)
    };
  }

  if (section === 'projectOverrides') {
    const projects = parseInlineJsonObject(section, 'projectsRaw', 'projects');
    if (!projects) {
      return null;
    }

    return {
      projects
    };
  }

  if (section === 'notifications') {
    const channels = ['in-app', 'telegram', 'sound'].filter((channel) =>
      readBooleanField(section, `channel.${channel}`, channel === 'in-app')
    );
    const triggers = ['queued', 'running', 'success', 'failed', 'cancelled'].filter((trigger) =>
      readBooleanField(section, `trigger.${trigger}`, trigger !== 'cancelled')
    );

    return {
      enabled: readBooleanField(section, 'enabled', true),
      channels,
      triggers,
      quietHours: {
        enabled: readBooleanField(section, 'quietEnabled', false),
        start: readStringField(section, 'quietStart', '22:00'),
        end: readStringField(section, 'quietEnd', '08:00'),
        timezone: readStringField(section, 'quietTimezone', 'UTC')
      },
      digestFrequency: readStringField(section, 'digestFrequency', 'off')
    };
  }

  if (section === 'telemetryAndLogs') {
    return {
      enabled: readBooleanField(section, 'enabled', true),
      redactSensitive: readBooleanField(section, 'redactSensitive', true),
      retentionPolicy: readStringField(section, 'retentionPolicy', '30 days')
    };
  }

  return parseEditorJson(section);
};

const applySectionToControls = (section: SettingsSection, value: Record<string, unknown>): void => {
  if (section === 'general') {
    setTextField(section, 'timezone', typeof value.timezone === 'string' ? value.timezone : 'UTC');
    setSelectValue(section, 'dateFormat', typeof value.dateFormat === 'string' ? value.dateFormat : 'YYYY-MM-DD HH:mm');
    setSelectValue(section, 'uiDensity', typeof value.uiDensity === 'string' ? value.uiDensity : 'comfortable');
    setBooleanField(section, 'confirmDestructiveActions', value.confirmDestructiveActions !== false);
    return;
  }

  if (section === 'taskDefaults') {
    setTextField(section, 'titleTemplate', typeof value.titleTemplate === 'string' ? value.titleTemplate : '');
    setSelectValue(section, 'smartSummaryBehavior', typeof value.smartSummaryBehavior === 'string' ? value.smartSummaryBehavior : 'manual');
    setSelectValue(section, 'priority', typeof value.priority === 'string' ? value.priority : 'medium');
    setListField(section, 'tags', toStringArray(value.tags));
    setListField(section, 'contexts', toStringArray(value.contexts));
    setListField(section, 'skills', toStringArray(value.skills));
    return;
  }

  if (section === 'pipelineDefaults') {
    setSelectValue(section, 'template', typeof value.template === 'string' ? value.template : 'simple');
    setSelectValue(section, 'createStage', typeof value.createStage === 'string' ? value.createStage : 'capture');
    setTextField(section, 'auditBounceCap', String(typeof value.auditBounceCap === 'number' ? value.auditBounceCap : 2));
    return;
  }

  if (section === 'stageRuntimeMapping') {
    RUNTIME_STAGES.forEach((stage) => {
      const stageValue = isRecord(value[stage]) ? value[stage] : {};
      const readStageField = (field: string): string =>
        typeof stageValue[field] === 'string' ? (stageValue[field] as string) : '';

      setSelectValue(section, `mapping.${stage}.role`, readStageField('role'));
      setSelectValue(section, `mapping.${stage}.provider`, readStageField('provider'));
      setSelectValue(section, `mapping.${stage}.model`, readStageField('model'));
      setSelectValue(section, `mapping.${stage}.profile`, readStageField('profile'));
    });

    return;
  }

  if (section === 'providersAndModels') {
    const providers = isRecord(value.providers) ? value.providers : {};
    const profiles = isRecord(value.profiles) ? value.profiles : {};

    setTextField(section, 'providersRaw', JSON.stringify(providers, null, 2));
    setTextField(section, 'profilesRaw', JSON.stringify(profiles, null, 2));
    return;
  }

  if (section === 'agentBehavior') {
    setTextField(section, 'modesRaw', JSON.stringify(Array.isArray(value.modes) ? value.modes : [], null, 2));
    return;
  }

  if (section === 'roles') {
    setListField(section, 'availableRoles', toStringArray(value.available));
    return;
  }

  if (section === 'queueAndExecution') {
    setSelectValue(section, 'defaultMode', typeof value.defaultMode === 'string' ? value.defaultMode : 'stage');
    setSelectValue(section, 'schedulingPolicy', typeof value.schedulingPolicy === 'string' ? value.schedulingPolicy : 'FIFO');
    setTextField(section, 'maxParallelRuns', String(typeof value.maxParallelRuns === 'number' ? value.maxParallelRuns : 1));
    setBooleanField(section, 'serializedPipeline', value.serializedPipeline !== false);
    setBooleanField(section, 'autoOpenTerminal', value.autoOpenTerminal !== false);
    setBooleanField(section, 'promptMissingFields', value.promptMissingFields !== false);
    setBooleanField(section, 'autoResumeOnSave', value.autoResumeOnSave === true);
    return;
  }

  if (section === 'projectOverrides') {
    const projects = isRecord(value.projects) ? value.projects : {};
    setTextField(section, 'projectsRaw', JSON.stringify(projects, null, 2));
    return;
  }

  if (section === 'notifications') {
    const channels = toStringArray(value.channels);
    const triggers = toStringArray(value.triggers);
    const quietHours = isRecord(value.quietHours) ? value.quietHours : {};

    setBooleanField(section, 'enabled', value.enabled !== false);
    setBooleanField(section, 'channel.in-app', channels.includes('in-app'));
    setBooleanField(section, 'channel.telegram', channels.includes('telegram'));
    setBooleanField(section, 'channel.sound', channels.includes('sound'));

    setBooleanField(section, 'trigger.queued', triggers.includes('queued'));
    setBooleanField(section, 'trigger.running', triggers.includes('running'));
    setBooleanField(section, 'trigger.success', triggers.includes('success'));
    setBooleanField(section, 'trigger.failed', triggers.includes('failed'));
    setBooleanField(section, 'trigger.cancelled', triggers.includes('cancelled'));

    setBooleanField(section, 'quietEnabled', quietHours.enabled === true);
    setTextField(section, 'quietStart', typeof quietHours.start === 'string' ? quietHours.start : '22:00');
    setTextField(section, 'quietEnd', typeof quietHours.end === 'string' ? quietHours.end : '08:00');
    setTextField(section, 'quietTimezone', typeof quietHours.timezone === 'string' ? quietHours.timezone : 'UTC');
    setSelectValue(section, 'digestFrequency', typeof value.digestFrequency === 'string' ? value.digestFrequency : 'off');
    return;
  }

  if (section === 'telemetryAndLogs') {
    setBooleanField(section, 'enabled', value.enabled !== false);
    setBooleanField(section, 'redactSensitive', value.redactSensitive !== false);
    setTextField(section, 'retentionPolicy', typeof value.retentionPolicy === 'string' ? value.retentionPolicy : '30 days');
  }
};

const renderSettings = (settings: Record<string, unknown>): void => {
  PANEL_CONFIGS.forEach((panel) => {
    const editor = getEditorForSection(panel.id);
    if (!editor) {
      return;
    }

    const sectionValue = settings[panel.id];
    const safeValue = isRecord(sectionValue) ? sectionValue : {};
    editor.value = JSON.stringify(safeValue, null, 2);
    applySectionToControls(panel.id, safeValue);
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
    const sectionValue = parseSectionFromControls(section);
    if (!sectionValue) {
      return;
    }

    const editor = getEditorForSection(section);
    if (editor) {
      editor.value = JSON.stringify(sectionValue, null, 2);
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
