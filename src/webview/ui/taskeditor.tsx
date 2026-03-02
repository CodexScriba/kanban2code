import './taskeditor.css';
import {
  type CancelRunMessage,
  type FocusTaskEditorMessage,
  isHostToWebviewMessage,
  type CloseTaskEditorMessage,
  type LoadTaskEditorMessage,
  type RetryRunMessage,
  type RunAllStagesMessage,
  type RunStageMessage,
  type SaveTaskMessage,
  type ValidationFocusTarget
} from '../messaging';
import type { RunState } from '../../types/runner';

type LocationType = 'inbox' | 'project';
type ChipKind = 'tags' | 'contexts' | 'skills';
type PipelineStatus = 'ready' | 'queued' | 'running' | 'accepted' | 'failed' | 'skipped';
type EditorTab = 'body' | 'frontmatter' | 'runNotes';

interface RecentRunEntry {
  stage: string;
  status: PipelineStatus;
  timestamp: number;
}

interface PipelineStepConfig {
  id: string;
  name: string;
  role: string;
  provider: string;
  model: string;
}

interface VscodeApi {
  postMessage(message: unknown): void;
}

interface ProfileConfig {
  provider: string;
  model: string;
}

interface TaskEditorFormState {
  title: string;
  summary: string;
  locationType: LocationType;
  phase: string;
  stage: string;
  priority: 'low' | 'medium' | 'high';
  policySequentialPipeline: boolean;
  policyRequireAuditGate: boolean;
  policyStrictContext: boolean;
  assignee: string;
  role: string;
  provider: string;
  model: string;
  profile: string;
  tags: string[];
  contexts: string[];
  skills: string[];
  body: string;
  frontmatterText: string;
  runNotes: string;
}

declare const acquireVsCodeApi: (() => VscodeApi) | undefined;

const DEFAULT_ROLES = ['planner', 'coder', 'auditor', 'architect'];
const DEFAULT_PROVIDER_MODELS: Record<string, string[]> = {
  claude: ['yolo'],
  codex: ['yolo'],
  gemini: ['yolo'],
  kimi: ['yolo']
};
const DEFAULT_PROFILES: Record<string, ProfileConfig> = {
  default: { provider: 'claude', model: 'yolo' },
  'coder-default': { provider: 'codex', model: 'yolo' }
};


const app = document.getElementById('app');

if (!app) {
  throw new Error('Task editor root element not found');
}

app.innerHTML = `
<div class="task-editor-shell">
  <header class="task-editor-topbar">
    <div class="breadcrumb">
      <span class="bc-project" id="bcProject">project</span>
      <span class="bc-sep">/</span>
      <span class="bc-title" id="bcTitle">Task Editor</span>
    </div>
    <div class="chip-row">
      <span class="chip" id="chipStage">stage: unknown</span>
      <span class="chip" id="chipRole">role: unassigned</span>
      <span class="chip" id="chipProvider">provider: n/a</span>
      <span class="chip chip-dirty is-hidden" id="chipDirty">unsaved changes</span>
    </div>
    <div class="topbar-actions">
      <button class="action-btn action-save" id="saveBtn" type="button">Save</button>
      <button class="action-btn action-close" id="closeBtn" type="button">Close</button>
    </div>
  </header>

  <main class="task-editor-main">
    <section class="editor-panel panel-left">
      <div class="panel-head">Metadata</div>
      <div class="panel-scroll metadata-scroll">
        <section class="metadata-section">
          <h3 class="metadata-section-title">Basic Info</h3>
          <div class="form-row">
            <label class="form-label" for="metaTitle">Title</label>
            <input class="form-input" id="metaTitle" type="text" placeholder="Task title" />
          </div>
          <div class="form-row">
            <label class="form-label" for="metaSummary">Summary</label>
            <textarea class="form-textarea" id="metaSummary" placeholder="Smart summary"></textarea>
          </div>
        </section>

        <section class="metadata-section">
          <h3 class="metadata-section-title">Location</h3>
          <div class="form-grid-2">
            <div class="form-row">
              <label class="form-label" for="locationType">Type</label>
              <select class="form-select" id="locationType">
                <option value="inbox">Inbox</option>
                <option value="project">Project</option>
              </select>
            </div>
            <div class="form-row">
              <label class="form-label" for="locationPhase">Phase</label>
              <select class="form-select" id="locationPhase"></select>
            </div>
          </div>
          <button class="mini-btn" id="newLocationBtn" type="button">+ New Location</button>
          <div class="field-hint">Changing location will move the file on save.</div>
        </section>

        <section class="metadata-section">
          <h3 class="metadata-section-title">Pipeline</h3>
          <div class="form-grid-2">
            <div class="form-row">
              <span class="form-label">Current Stage</span>
              <div class="readonly-value" id="pipelineStage">unknown</div>
            </div>
            <div class="form-row">
              <label class="form-label" for="pipelinePriority">Priority</label>
              <select class="form-select" id="pipelinePriority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div class="checklist">
            <label class="check-item" for="policySequential">
              <input id="policySequential" type="checkbox" />
              <span>Sequential pipeline</span>
            </label>
            <label class="check-item" for="policyAuditGate">
              <input id="policyAuditGate" type="checkbox" />
              <span>Require audit gate</span>
            </label>
            <label class="check-item" for="policyContext">
              <input id="policyContext" type="checkbox" />
              <span>Strict context injection</span>
            </label>
          </div>
        </section>

        <section class="metadata-section">
          <h3 class="metadata-section-title">Assignment</h3>
          <div class="form-row">
            <label class="form-label" for="assignmentAssignee">Assignee</label>
            <input class="form-input" id="assignmentAssignee" type="text" placeholder="Unassigned" />
          </div>
          <div class="form-grid-2">
            <div class="form-row">
              <label class="form-label" for="assignmentRole">Role</label>
              <select class="form-select" id="assignmentRole"></select>
            </div>
            <div class="form-row">
              <label class="form-label" for="assignmentProvider">Provider</label>
              <select class="form-select" id="assignmentProvider"></select>
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-row">
              <label class="form-label" for="assignmentModel">Model</label>
              <select class="form-select" id="assignmentModel"></select>
            </div>
            <div class="form-row">
              <label class="form-label" for="assignmentProfile">Profile</label>
              <select class="form-select" id="assignmentProfile"></select>
            </div>
          </div>
        </section>

        <section class="metadata-section">
          <h3 class="metadata-section-title">Context</h3>
          <div class="chip-list" id="contextChipList"></div>
          <div class="chip-empty" id="contextEmpty">No contexts added</div>
          <div class="chip-input-row is-hidden" id="contextInputRow">
            <input class="form-input" id="contextInput" type="text" placeholder="Add context" />
            <button class="mini-btn" id="contextConfirmBtn" type="button">Add</button>
          </div>
          <button class="mini-btn" id="contextAddBtn" type="button">+ Add Context</button>
        </section>

        <section class="metadata-section">
          <h3 class="metadata-section-title">Skills</h3>
          <div class="chip-list" id="skillChipList"></div>
          <div class="chip-empty" id="skillEmpty">No skills added</div>
          <div class="chip-input-row is-hidden" id="skillInputRow">
            <input class="form-input" id="skillInput" type="text" placeholder="Add skill" />
            <button class="mini-btn" id="skillConfirmBtn" type="button">Add</button>
          </div>
          <button class="mini-btn" id="skillAddBtn" type="button">+ Add Skill</button>
        </section>

        <section class="metadata-section">
          <h3 class="metadata-section-title">Tags</h3>
          <div class="chip-list" id="tagChipList"></div>
          <div class="chip-empty" id="tagEmpty">No tags added</div>
          <div class="chip-input-row is-hidden" id="tagInputRow">
            <input class="form-input" id="tagInput" type="text" placeholder="Add tag" />
            <button class="mini-btn" id="tagConfirmBtn" type="button">Add</button>
          </div>
          <button class="mini-btn" id="tagAddBtn" type="button">+ Add Tag</button>
        </section>
      </div>
    </section>

    <section class="editor-panel panel-center">
      <div class="panel-head">Editor</div>
      <div class="editor-tabs" role="tablist" aria-label="Task editor tabs">
        <button class="editor-tab is-active" id="tabBody" type="button" role="tab" aria-controls="panelBody" aria-selected="true" data-tab="body">Task Body</button>
        <button class="editor-tab" id="tabFrontmatter" type="button" role="tab" aria-controls="panelFrontmatter" aria-selected="false" data-tab="frontmatter">Frontmatter</button>
        <button class="editor-tab" id="tabRunNotes" type="button" role="tab" aria-controls="panelRunNotes" aria-selected="false" data-tab="runNotes">Run Notes</button>
      </div>
      <div class="panel-scroll panel-scroll-editor">
        <div class="editor-tab-panel is-active" id="panelBody" role="tabpanel" aria-labelledby="tabBody">
          <textarea id="taskBody" class="editor-textarea" spellcheck="false" placeholder="Task markdown body..."></textarea>
        </div>
        <div class="editor-tab-panel" id="panelFrontmatter" role="tabpanel" aria-labelledby="tabFrontmatter">
          <textarea id="taskFrontmatter" class="editor-textarea" spellcheck="false" placeholder="---&#10;title: Example&#10;stage: code&#10;---"></textarea>
        </div>
        <div class="editor-tab-panel" id="panelRunNotes" role="tabpanel" aria-labelledby="tabRunNotes">
          <textarea id="taskRunNotes" class="editor-textarea" spellcheck="false" placeholder="Execution notes, command history, or debugging details..."></textarea>
        </div>
      </div>
      <div class="editor-action-bar">
        <button class="action-btn action-discard" id="discardChangesBtn" type="button">Discard changes</button>
        <button class="action-btn action-save" id="saveChangesBtn" type="button">Save</button>
      </div>
    </section>

    <section class="editor-panel panel-right">
      <div class="panel-head">Execution Rail</div>
      <div class="panel-scroll">
        <section class="rail-section" aria-label="Task preview">
          <h3 class="rail-section-title">Task Preview</h3>
          <div class="preview-list">
            <div class="preview-row">
              <span>Title</span>
              <strong id="previewTitle">Untitled task</strong>
            </div>
            <div class="preview-row">
              <span>Stage</span>
              <strong id="previewStage">unknown</strong>
            </div>
            <div class="preview-row">
              <span>Role</span>
              <strong id="previewRole">unassigned</strong>
            </div>
            <div class="preview-row">
              <span>Provider</span>
              <strong id="previewProvider">n/a</strong>
            </div>
            <div class="preview-row">
              <span>Model</span>
              <strong id="previewModel">n/a</strong>
            </div>
          </div>
        </section>

        <section class="rail-section" aria-label="Pipeline steps">
          <div class="rail-section-head">
            <h3 class="rail-section-title">Pipeline Steps</h3>
            <button class="mini-btn icon-btn" id="editStepsBtn" type="button" aria-label="Edit pipeline steps">⚙</button>
          </div>
          <div class="pipeline-list" id="pipelineList"></div>
          <div class="step-editor is-hidden" id="stepEditor"></div>
        </section>

        <section class="rail-section" aria-label="Pipeline guidance">
          <details class="fyi-helper">
            <summary>FYI Helper Block</summary>
            <div class="fyi-copy">
              <p><strong>Simple pipeline:</strong> keep default stages and run the active step as work advances.</p>
              <p><strong>Complex pipeline:</strong> add specialized steps, tune role/provider/model, and reorder to match dependencies.</p>
              <p>Queued and running states can be cancelled. Failed states can run again or retry from the same task.</p>
            </div>
          </details>
        </section>

        <section class="rail-section" aria-label="Run controls">
          <h3 class="rail-section-title">Run Controls</h3>
          <div class="run-controls">
            <button class="action-btn run-btn" id="runStageBtn" type="button">Run</button>
            <button class="action-btn run-all-btn" id="runAllBtn" type="button">Run All</button>
          </div>
        </section>

        <section class="rail-section" aria-label="Recent runs">
          <h3 class="rail-section-title">Recent Runs</h3>
          <div class="runs-list" id="recentRunsList"></div>
        </section>
      </div>
    </section>
  </main>

  <div class="location-modal-overlay is-hidden" id="locationModalOverlay">
    <div class="location-modal" role="dialog" aria-modal="true" aria-labelledby="locationModalTitle">
      <h2 id="locationModalTitle">Create Location</h2>
      <div class="form-grid-2">
        <div class="form-row">
          <label class="form-label" for="newLocationType">Type</label>
          <select class="form-select" id="newLocationType">
            <option value="project">Project</option>
            <option value="inbox">Inbox</option>
          </select>
        </div>
        <div class="form-row">
          <label class="form-label" for="newLocationPhase">Phase</label>
          <input class="form-input" id="newLocationPhase" type="text" placeholder="optional" />
        </div>
      </div>
      <div class="form-row">
        <label class="form-label" for="newLocationSlug">Slug</label>
        <input class="form-input" id="newLocationSlug" type="text" placeholder="project-slug" />
      </div>
      <div class="location-modal-actions">
        <button class="action-btn action-save" id="createLocationBtn" type="button">Create</button>
        <button class="action-btn action-cancel" id="cancelLocationBtn" type="button">Cancel</button>
      </div>
    </div>
  </div>

  <div class="exit-modal-overlay is-hidden" id="exitModalOverlay">
    <div class="exit-modal" role="dialog" aria-modal="true" aria-labelledby="exitModalTitle">
      <h2 id="exitModalTitle">Unsaved changes</h2>
      <p>You have unsaved changes in this task editor.</p>
      <div class="exit-actions">
        <button id="saveExitBtn" class="action-btn action-save" type="button">Save &amp; Exit</button>
        <button id="discardExitBtn" class="action-btn action-discard" type="button">Discard &amp; Exit</button>
        <button id="cancelExitBtn" class="action-btn action-cancel" type="button">Cancel</button>
      </div>
    </div>
  </div>
</div>
`;

const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;
const bcProject = document.getElementById('bcProject');
const bcTitle = document.getElementById('bcTitle');
const chipStage = document.getElementById('chipStage');
const chipRole = document.getElementById('chipRole');
const chipProvider = document.getElementById('chipProvider');
const chipDirty = document.getElementById('chipDirty');
const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement | null;
const closeBtn = document.getElementById('closeBtn') as HTMLButtonElement | null;
const taskBody = document.getElementById('taskBody') as HTMLTextAreaElement | null;
const taskFrontmatter = document.getElementById('taskFrontmatter') as HTMLTextAreaElement | null;
const taskRunNotes = document.getElementById('taskRunNotes') as HTMLTextAreaElement | null;
const discardChangesBtn = document.getElementById('discardChangesBtn') as HTMLButtonElement | null;
const saveChangesBtn = document.getElementById('saveChangesBtn') as HTMLButtonElement | null;
const editorTabButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.editor-tab'));
const exitModalOverlay = document.getElementById('exitModalOverlay') as HTMLDivElement | null;
const saveExitBtn = document.getElementById('saveExitBtn') as HTMLButtonElement | null;
const discardExitBtn = document.getElementById('discardExitBtn') as HTMLButtonElement | null;
const cancelExitBtn = document.getElementById('cancelExitBtn') as HTMLButtonElement | null;

const metaTitleInput = document.getElementById('metaTitle') as HTMLInputElement | null;
const metaSummaryInput = document.getElementById('metaSummary') as HTMLTextAreaElement | null;
const locationTypeSelect = document.getElementById('locationType') as HTMLSelectElement | null;
const locationPhaseSelect = document.getElementById('locationPhase') as HTMLSelectElement | null;
const newLocationBtn = document.getElementById('newLocationBtn') as HTMLButtonElement | null;
const pipelineStage = document.getElementById('pipelineStage');
const pipelinePrioritySelect = document.getElementById('pipelinePriority') as HTMLSelectElement | null;
const policySequential = document.getElementById('policySequential') as HTMLInputElement | null;
const policyAuditGate = document.getElementById('policyAuditGate') as HTMLInputElement | null;
const policyContext = document.getElementById('policyContext') as HTMLInputElement | null;
const assignmentAssigneeInput = document.getElementById('assignmentAssignee') as HTMLInputElement | null;
const assignmentRoleSelect = document.getElementById('assignmentRole') as HTMLSelectElement | null;
const assignmentProviderSelect = document.getElementById('assignmentProvider') as HTMLSelectElement | null;
const assignmentModelSelect = document.getElementById('assignmentModel') as HTMLSelectElement | null;
const assignmentProfileSelect = document.getElementById('assignmentProfile') as HTMLSelectElement | null;
const previewTitle = document.getElementById('previewTitle');
const previewStage = document.getElementById('previewStage');
const previewRole = document.getElementById('previewRole');
const previewProvider = document.getElementById('previewProvider');
const previewModel = document.getElementById('previewModel');
const pipelineList = document.getElementById('pipelineList');
const editStepsBtn = document.getElementById('editStepsBtn') as HTMLButtonElement | null;
const stepEditor = document.getElementById('stepEditor');
const recentRunsList = document.getElementById('recentRunsList');
const runStageBtn = document.getElementById('runStageBtn') as HTMLButtonElement | null;
const runAllBtn = document.getElementById('runAllBtn') as HTMLButtonElement | null;

const locationModalOverlay = document.getElementById('locationModalOverlay') as HTMLDivElement | null;
const newLocationTypeSelect = document.getElementById('newLocationType') as HTMLSelectElement | null;
const newLocationPhaseInput = document.getElementById('newLocationPhase') as HTMLInputElement | null;
const newLocationSlugInput = document.getElementById('newLocationSlug') as HTMLInputElement | null;
const createLocationBtn = document.getElementById('createLocationBtn') as HTMLButtonElement | null;
const cancelLocationBtn = document.getElementById('cancelLocationBtn') as HTMLButtonElement | null;

const chipRefs: Record<ChipKind, { list: HTMLElement | null; empty: HTMLElement | null }> = {
  contexts: {
    list: document.getElementById('contextChipList'),
    empty: document.getElementById('contextEmpty')
  },
  skills: {
    list: document.getElementById('skillChipList'),
    empty: document.getElementById('skillEmpty')
  },
  tags: {
    list: document.getElementById('tagChipList'),
    empty: document.getElementById('tagEmpty')
  }
};

const chipInputRefs: Record<
  ChipKind,
  {
    row: HTMLDivElement | null;
    input: HTMLInputElement | null;
    addBtn: HTMLButtonElement | null;
    confirmBtn: HTMLButtonElement | null;
  }
> = {
  contexts: {
    row: document.getElementById('contextInputRow') as HTMLDivElement | null,
    input: document.getElementById('contextInput') as HTMLInputElement | null,
    addBtn: document.getElementById('contextAddBtn') as HTMLButtonElement | null,
    confirmBtn: document.getElementById('contextConfirmBtn') as HTMLButtonElement | null
  },
  skills: {
    row: document.getElementById('skillInputRow') as HTMLDivElement | null,
    input: document.getElementById('skillInput') as HTMLInputElement | null,
    addBtn: document.getElementById('skillAddBtn') as HTMLButtonElement | null,
    confirmBtn: document.getElementById('skillConfirmBtn') as HTMLButtonElement | null
  },
  tags: {
    row: document.getElementById('tagInputRow') as HTMLDivElement | null,
    input: document.getElementById('tagInput') as HTMLInputElement | null,
    addBtn: document.getElementById('tagAddBtn') as HTMLButtonElement | null,
    confirmBtn: document.getElementById('tagConfirmBtn') as HTMLButtonElement | null
  }
};

let currentTaskPath = '';
let currentTaskId = '';
let currentProject = 'project';
let isDirty = false;
let discoveredPhases: string[] = [];
let availableRoles = [...DEFAULT_ROLES];
const providerModels: Record<string, string[]> = { ...DEFAULT_PROVIDER_MODELS };
const profiles: Record<string, ProfileConfig> = { ...DEFAULT_PROFILES };
let currentRunState: RunState | null = null;
let recentRuns: RecentRunEntry[] = [];
let pipelineSteps: PipelineStepConfig[] = [];
let isStepEditorOpen = false;
let pipelineStepCounter = 0;

const PIPELINE_STAGES = ['capture', 'plan', 'code', 'audit', 'completed'];
const STEP_ROLE_DEFAULTS: Record<string, string> = {
  capture: 'architect',
  plan: 'planner',
  code: 'coder',
  audit: 'auditor',
  completed: 'auditor'
};
const STEP_PROVIDER_DEFAULTS: Record<string, string> = {
  capture: 'claude',
  plan: 'claude',
  code: 'codex',
  audit: 'claude',
  completed: 'claude'
};

const createEmptyState = (): TaskEditorFormState => ({
  title: '',
  summary: '',
  locationType: 'inbox',
  phase: '',
  stage: 'unknown',
  priority: 'medium',
  policySequentialPipeline: false,
  policyRequireAuditGate: false,
  policyStrictContext: false,
  assignee: '',
  role: '',
  provider: '',
  model: '',
  profile: '',
  tags: [],
  contexts: [],
  skills: [],
  body: '',
  frontmatterText: '',
  runNotes: ''
});

let formState = createEmptyState();
let initialFormState = createEmptyState();

const cloneState = (state: TaskEditorFormState): TaskEditorFormState => ({
  ...state,
  tags: [...state.tags],
  contexts: [...state.contexts],
  skills: [...state.skills]
});

const normalizeArray = (values: string[]): string[] =>
  values.map((value) => value.trim()).filter((value) => value.length > 0);

const serializeState = (state: TaskEditorFormState): string => {
  return JSON.stringify({
    ...state,
    title: state.title.trim(),
    summary: state.summary.trim(),
    assignee: state.assignee.trim(),
    role: state.role.trim(),
    provider: state.provider.trim(),
    model: state.model.trim(),
    profile: state.profile.trim(),
    phase: state.phase.trim(),
    tags: normalizeArray(state.tags),
    contexts: normalizeArray(state.contexts),
    skills: normalizeArray(state.skills),
    body: state.body,
    frontmatterText: state.frontmatterText,
    runNotes: state.runNotes
  });
};

const inferSummaryFromBody = (body: string): string => {
  const line = body
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .find((entry) => entry.length > 0);

  if (!line) {
    return '';
  }

  return line.length > 180 ? `${line.slice(0, 177)}...` : line;
};

const dedupeValues = (values: string[]): string[] => {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }
    const normalized = trimmed.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(trimmed);
  }

  return result;
};

const yamlScalar = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return '""';
  }
  if (/^[A-Za-z0-9_./-]+$/.test(trimmed)) {
    return trimmed;
  }
  return JSON.stringify(trimmed);
};

const serializeFrontmatterForEditor = (state: TaskEditorFormState): string => {
  const lines: string[] = ['---'];
  const title = state.title.trim();
  const role = state.role.trim();
  const provider = state.provider.trim();
  const model = state.model.trim();
  const profile = state.profile.trim();
  const phase = state.phase.trim();

  if (title) {
    lines.push(`title: ${yamlScalar(title)}`);
  }
  lines.push(`stage: ${yamlScalar(state.stage || 'unknown')}`);
  lines.push(`priority: ${yamlScalar(state.priority || 'medium')}`);

  if (role) {
    lines.push(`role: ${yamlScalar(role)}`);
  }
  if (provider) {
    lines.push(`provider: ${yamlScalar(provider)}`);
  }
  if (model) {
    lines.push(`model: ${yamlScalar(model)}`);
  }
  if (profile) {
    lines.push(`profile: ${yamlScalar(profile)}`);
  }
  if (state.locationType === 'project' && currentProject && currentProject !== 'inbox') {
    lines.push(`project: ${yamlScalar(currentProject)}`);
  }
  if (state.locationType === 'project' && phase) {
    lines.push(`phase: ${yamlScalar(phase)}`);
  }

  const pushArray = (key: 'tags' | 'contexts' | 'skills', values: string[]): void => {
    const normalized = dedupeValues(values);
    if (!normalized.length) {
      return;
    }
    lines.push(`${key}:`);
    normalized.forEach((value) => {
      lines.push(`  - ${yamlScalar(value)}`);
    });
  };

  pushArray('tags', state.tags);
  pushArray('contexts', state.contexts);
  pushArray('skills', state.skills);
  lines.push('---');

  return lines.join('\n');
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const setDirty = (nextDirty: boolean): void => {
  isDirty = nextDirty;
  if (chipDirty) {
    chipDirty.classList.toggle('is-hidden', !isDirty);
  }
};

const syncDirtyFromState = (): void => {
  setDirty(serializeState(formState) !== serializeState(initialFormState));
};

const switchEditorTab = (nextTab: EditorTab): void => {
  editorTabButtons.forEach((button) => {
    const isActive = button.dataset.tab === nextTab;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  const panels: Record<EditorTab, HTMLDivElement | null> = {
    body: document.getElementById('panelBody') as HTMLDivElement | null,
    frontmatter: document.getElementById('panelFrontmatter') as HTMLDivElement | null,
    runNotes: document.getElementById('panelRunNotes') as HTMLDivElement | null
  };

  (Object.keys(panels) as EditorTab[]).forEach((tab) => {
    const panel = panels[tab];
    if (!panel) {
      return;
    }
    const isActive = tab === nextTab;
    panel.classList.toggle('is-active', isActive);
    panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });
};

const focusField = (target: ValidationFocusTarget): boolean => {
  switch (target.field) {
    case 'title':
      metaTitleInput?.focus();
      return Boolean(metaTitleInput);
    case 'location':
      locationTypeSelect?.focus();
      return Boolean(locationTypeSelect);
    case 'phase':
      if (locationTypeSelect && locationTypeSelect.value === 'inbox') {
        locationTypeSelect.value = 'project';
        formState.locationType = 'project';
        syncLocationControls();
      }
      locationPhaseSelect?.focus();
      return Boolean(locationPhaseSelect);
    case 'stage':
      switchEditorTab('frontmatter');
      taskFrontmatter?.focus();
      return Boolean(taskFrontmatter);
    case 'role':
      assignmentRoleSelect?.focus();
      return Boolean(assignmentRoleSelect);
    case 'provider':
      assignmentProviderSelect?.focus();
      return Boolean(assignmentProviderSelect);
    case 'model':
      assignmentModelSelect?.focus();
      return Boolean(assignmentModelSelect);
    case 'profile':
      assignmentProfileSelect?.focus();
      return Boolean(assignmentProfileSelect);
    case 'contexts':
      showChipInput('contexts');
      return Boolean(chipInputRefs.contexts.input);
    case 'skills':
      showChipInput('skills');
      return Boolean(chipInputRefs.skills.input);
    case 'pipeline':
      if (!isStepEditorOpen) {
        isStepEditorOpen = true;
        renderExecutionRail();
      }
      (
        stepEditor?.querySelector<HTMLElement>(
          '[data-step-field="role"], [data-step-field="provider"], [data-step-field="model"]'
        ) ?? editStepsBtn
      )?.focus();
      return true;
    default:
      return false;
  }
};

const applyValidationFocus = (focusTargets?: ValidationFocusTarget[]): boolean => {
  if (!focusTargets?.length) {
    return false;
  }

  const uniqueTargets = focusTargets.filter(
    (target, index) =>
      focusTargets.findIndex((entry) => entry.field === target.field && entry.stage === target.stage) === index
  );
  for (const target of uniqueTargets) {
    if (focusField(target)) {
      return true;
    }
  }
  return false;
};

const updateHeaderChips = (): void => {
  if (chipStage) {
    chipStage.textContent = `stage: ${formState.stage || 'unknown'}`;
  }
  if (chipRole) {
    chipRole.textContent = `role: ${formState.role || 'unassigned'}`;
  }
  if (chipProvider) {
    chipProvider.textContent = `provider: ${formState.provider || 'n/a'}`;
  }
  if (pipelineStage) {
    pipelineStage.textContent = formState.stage || 'unknown';
  }
  renderExecutionRail();
};

const mapRunStateToPipelineStatus = (state: RunState): PipelineStatus => {
  switch (state) {
    case 'queued':
      return 'queued';
    case 'running':
      return 'running';
    case 'success':
      return 'accepted';
    case 'failed':
      return 'failed';
    case 'cancelled':
      return 'skipped';
    default:
      return 'ready';
  }
};

const getPipelineStages = (): string[] => {
  const currentStage = formState.stage.trim();
  if (!currentStage || currentStage === 'unknown' || currentStage === 'inbox') {
    return PIPELINE_STAGES;
  }
  if (PIPELINE_STAGES.includes(currentStage)) {
    return PIPELINE_STAGES;
  }
  return [...PIPELINE_STAGES, currentStage];
};

const normalizeStageName = (value: string): string => value.trim().toLowerCase();

const toStepId = (): string => {
  pipelineStepCounter += 1;
  return `step-${pipelineStepCounter}`;
};

const createPipelineStep = (name: string): PipelineStepConfig => {
  const normalizedName = normalizeStageName(name) || 'step';
  const defaultRole = STEP_ROLE_DEFAULTS[normalizedName] ?? (formState.role || 'planner');
  const defaultProvider = STEP_PROVIDER_DEFAULTS[normalizedName] ?? (formState.provider || 'claude');
  const models = getModelsForProvider(defaultProvider);
  const defaultModel =
    normalizedName === normalizeStageName(formState.stage)
      ? formState.model || models[0] || 'yolo'
      : models[0] || formState.model || 'yolo';

  return {
    id: toStepId(),
    name: name.trim() || 'step',
    role: normalizedName === normalizeStageName(formState.stage) ? formState.role || defaultRole : defaultRole,
    provider:
      normalizedName === normalizeStageName(formState.stage) ? formState.provider || defaultProvider : defaultProvider,
    model: defaultModel
  };
};

const syncPipelineStepsWithStages = (): void => {
  const stages = getPipelineStages();
  if (!pipelineSteps.length) {
    pipelineSteps = stages.map((stage) => createPipelineStep(stage));
    return;
  }

  const existingNames = new Set(pipelineSteps.map((step) => normalizeStageName(step.name)));
  const missing = stages.filter((stage) => !existingNames.has(normalizeStageName(stage)));
  if (!missing.length) {
    return;
  }

  pipelineSteps = [...pipelineSteps, ...missing.map((stage) => createPipelineStep(stage))];
};

const resolveStageStatus = (stepName: string, index: number): PipelineStatus => {
  const activeStage = normalizeStageName(formState.stage || 'unknown');
  const normalizedStep = normalizeStageName(stepName);
  const activeIndex = pipelineSteps.findIndex(
    (step) => normalizeStageName(step.name) === activeStage
  );

  if (normalizedStep === activeStage && currentRunState) {
    return mapRunStateToPipelineStatus(currentRunState);
  }

  if (activeIndex >= 0) {
    if (index < activeIndex) {
      return 'accepted';
    }
    if (index > activeIndex) {
      return 'ready';
    }
    return 'ready';
  }

  return 'ready';
};

const formatTimestamp = (timestamp: number): string => {
  if (!Number.isFinite(timestamp)) {
    return 'Unknown time';
  }
  return new Date(timestamp).toLocaleString();
};

const renderTaskPreview = (): void => {
  if (previewTitle) {
    previewTitle.textContent = formState.title.trim() || 'Untitled task';
  }
  if (previewStage) {
    previewStage.textContent = formState.stage || 'unknown';
  }
  if (previewRole) {
    previewRole.textContent = formState.role || 'unassigned';
  }
  if (previewProvider) {
    previewProvider.textContent = formState.provider || 'n/a';
  }
  if (previewModel) {
    previewModel.textContent = formState.model || 'n/a';
  }
};

const renderPipeline = (): void => {
  if (!pipelineList) {
    return;
  }

  syncPipelineStepsWithStages();
  if (!pipelineSteps.length) {
    pipelineList.innerHTML = `<div class="runs-empty">No pipeline steps configured.</div>`;
    return;
  }

  pipelineList.innerHTML = '';
  pipelineSteps.forEach((step, index) => {
    const row = document.createElement('div');
    row.className = 'pipeline-step';

    const main = document.createElement('div');
    main.className = 'pipeline-step-main';

    const name = document.createElement('span');
    name.className = 'pipeline-step-name';
    name.textContent = step.name;

    const meta = document.createElement('span');
    meta.className = 'pipeline-step-meta';
    meta.textContent = `${step.role || 'unassigned'} • ${step.provider || 'n/a'} • ${step.model || 'n/a'}`;

    const status = resolveStageStatus(step.name, index);
    const pill = document.createElement('span');
    pill.className = `status-pill status-${status}`;
    pill.textContent = status;

    const actions = document.createElement('div');
    actions.className = 'pipeline-step-actions';

    if (status === 'ready' || status === 'failed') {
      const runButton = document.createElement('button');
      runButton.type = 'button';
      runButton.className = 'step-action-btn';
      runButton.dataset.stepAction = 'run';
      runButton.dataset.stepId = step.id;
      runButton.textContent = 'Run';
      actions.appendChild(runButton);
    }

    if (status === 'failed') {
      const retryButton = document.createElement('button');
      retryButton.type = 'button';
      retryButton.className = 'step-action-btn';
      retryButton.dataset.stepAction = 'retry';
      retryButton.dataset.stepId = step.id;
      retryButton.textContent = 'Retry';
      actions.appendChild(retryButton);
    }

    if (status === 'queued' || status === 'running') {
      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'step-action-btn danger';
      cancelButton.dataset.stepAction = 'cancel';
      cancelButton.dataset.stepId = step.id;
      cancelButton.textContent = 'Cancel';
      actions.appendChild(cancelButton);
    }

    main.appendChild(name);
    main.appendChild(meta);
    row.appendChild(main);
    row.appendChild(pill);
    if (actions.childElementCount > 0) {
      row.appendChild(actions);
    }
    pipelineList.appendChild(row);
  });
};

const renderStepEditor = (): void => {
  if (editStepsBtn) {
    editStepsBtn.classList.toggle('is-active', isStepEditorOpen);
  }
  if (!stepEditor) {
    return;
  }

  stepEditor.classList.toggle('is-hidden', !isStepEditorOpen);
  if (!isStepEditorOpen) {
    stepEditor.innerHTML = '';
    return;
  }

  const roleOptions = [''].concat(availableRoles);
  const providerOptions = [''].concat(getProviders());

  const rows = pipelineSteps
    .map((step, index) => {
      const modelOptions = [''].concat(getModelsForProvider(step.provider));
      const roleSelect = roleOptions
        .map(
          (value) =>
            `<option value="${escapeHtml(value)}"${value === step.role ? ' selected' : ''}>${escapeHtml(value || 'Role')}</option>`
        )
        .join('');
      const providerSelect = providerOptions
        .map(
          (value) =>
            `<option value="${escapeHtml(value)}"${value === step.provider ? ' selected' : ''}>${escapeHtml(value || 'Provider')}</option>`
        )
        .join('');
      const modelSelect = modelOptions
        .map(
          (value) =>
            `<option value="${escapeHtml(value)}"${value === step.model ? ' selected' : ''}>${escapeHtml(value || 'Model')}</option>`
        )
        .join('');

      return `
      <div class="step-editor-row" data-step-index="${index}">
        <input class="form-input step-editor-name" data-step-field="name" data-step-index="${index}" type="text" value="${escapeHtml(step.name)}" />
        <select class="form-select" data-step-field="role" data-step-index="${index}">${roleSelect}</select>
        <select class="form-select" data-step-field="provider" data-step-index="${index}">${providerSelect}</select>
        <select class="form-select" data-step-field="model" data-step-index="${index}">${modelSelect}</select>
        <div class="step-editor-controls">
          <button class="mini-btn" type="button" data-editor-action="up" data-step-index="${index}" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button class="mini-btn" type="button" data-editor-action="down" data-step-index="${index}" ${index === pipelineSteps.length - 1 ? 'disabled' : ''}>↓</button>
          <button class="mini-btn" type="button" data-editor-action="remove" data-step-index="${index}">Remove</button>
        </div>
      </div>`;
    })
    .join('');

  stepEditor.innerHTML = `
    <div class="step-editor-head">
      <span>Inline Step Editor</span>
      <button class="mini-btn" type="button" data-editor-action="add">+ Add Step</button>
    </div>
    <div class="step-editor-list">${rows}</div>
  `;
};

const movePipelineStep = (from: number, to: number): void => {
  if (from === to || from < 0 || to < 0 || from >= pipelineSteps.length || to >= pipelineSteps.length) {
    return;
  }
  const next = [...pipelineSteps];
  const [step] = next.splice(from, 1);
  next.splice(to, 0, step);
  pipelineSteps = next;
};

const renderRecentRuns = (): void => {
  if (!recentRunsList) {
    return;
  }

  if (!recentRuns.length) {
    recentRunsList.innerHTML = `<div class="runs-empty">No runs yet.</div>`;
    return;
  }

  recentRunsList.innerHTML = '';
  for (const run of recentRuns) {
    const row = document.createElement('div');
    row.className = 'run-row';

    const meta = document.createElement('div');
    meta.className = 'run-meta';

    const title = document.createElement('strong');
    title.textContent = run.stage;

    const timestamp = document.createElement('span');
    timestamp.textContent = formatTimestamp(run.timestamp);

    const status = document.createElement('span');
    status.className = `status-pill status-${run.status}`;
    status.textContent = run.status;

    meta.appendChild(title);
    meta.appendChild(timestamp);
    row.appendChild(meta);
    row.appendChild(status);
    recentRunsList.appendChild(row);
  }
};

const renderExecutionRail = (): void => {
  renderTaskPreview();
  renderPipeline();
  renderStepEditor();
  renderRecentRuns();
};

const setSelectOptions = (
  select: HTMLSelectElement | null,
  values: string[],
  selected: string,
  placeholder?: string
): void => {
  if (!select) {
    return;
  }

  const options = placeholder ? [''].concat(values) : values;
  select.innerHTML = options
    .map((value) => {
      if (!value) {
        return `<option value="">${placeholder ?? ''}</option>`;
      }
      return `<option value="${value}">${value}</option>`;
    })
    .join('');

  if (options.includes(selected)) {
    select.value = selected;
    return;
  }

  const fallback = options[0] ?? '';
  select.value = fallback;
};

const ensureRoleOption = (role: string): void => {
  const trimmed = role.trim();
  if (!trimmed || availableRoles.includes(trimmed)) {
    return;
  }
  availableRoles = [...availableRoles, trimmed].sort((a, b) => a.localeCompare(b));
};

const ensureProviderModel = (provider: string, model: string): void => {
  const providerName = provider.trim();
  const modelName = model.trim();
  if (!providerName) {
    return;
  }

  if (!providerModels[providerName]) {
    providerModels[providerName] = [];
  }

  if (modelName && !providerModels[providerName].includes(modelName)) {
    providerModels[providerName] = [...providerModels[providerName], modelName].sort((a, b) =>
      a.localeCompare(b)
    );
  }
};

const ensureProfile = (profile: string, provider: string, model: string): void => {
  const profileName = profile.trim();
  if (!profileName) {
    return;
  }
  if (!profiles[profileName]) {
    profiles[profileName] = {
      provider: provider.trim(),
      model: model.trim()
    };
  }
};

const getProviders = (): string[] => Object.keys(providerModels).sort((a, b) => a.localeCompare(b));

const getModelsForProvider = (provider: string): string[] => {
  const models = providerModels[provider] ?? [];
  return [...models].sort((a, b) => a.localeCompare(b));
};

const getProfilesForProviderModel = (provider: string, model: string): string[] => {
  return Object.entries(profiles)
    .filter(([, config]) => {
      if (!provider && !model) {
        return true;
      }
      return config.provider === provider && config.model === model;
    })
    .map(([name]) => name)
    .sort((a, b) => a.localeCompare(b));
};

const syncLocationControls = (): void => {
  const isInbox = formState.locationType === 'inbox';
  if (locationPhaseSelect) {
    locationPhaseSelect.disabled = isInbox;
  }
};

const syncLocationPhases = (): void => {
  const phaseOptions = [''].concat(discoveredPhases);
  setSelectOptions(locationPhaseSelect, phaseOptions.filter((entry) => entry !== ''), formState.phase, 'No phase');
  if (locationPhaseSelect) {
    formState.phase = locationPhaseSelect.value;
  }
  syncLocationControls();
};

const syncAssignmentSelects = (): void => {
  ensureRoleOption(formState.role);
  ensureProviderModel(formState.provider, formState.model);
  ensureProfile(formState.profile, formState.provider, formState.model);

  setSelectOptions(assignmentRoleSelect, availableRoles, formState.role, 'Unassigned');
  formState.role = assignmentRoleSelect?.value ?? '';

  setSelectOptions(assignmentProviderSelect, getProviders(), formState.provider, 'Provider');
  formState.provider = assignmentProviderSelect?.value ?? '';

  const models = getModelsForProvider(formState.provider);
  setSelectOptions(assignmentModelSelect, models, formState.model, 'Model');
  formState.model = assignmentModelSelect?.value ?? '';

  const profileOptions = getProfilesForProviderModel(formState.provider, formState.model);
  setSelectOptions(assignmentProfileSelect, profileOptions, formState.profile, 'Profile');
  formState.profile = assignmentProfileSelect?.value ?? '';

  updateHeaderChips();
};

const showChipInput = (kind: ChipKind): void => {
  const refs = chipInputRefs[kind];
  refs.row?.classList.remove('is-hidden');
  refs.input?.focus();
};

const hideChipInput = (kind: ChipKind): void => {
  const refs = chipInputRefs[kind];
  refs.row?.classList.add('is-hidden');
  if (refs.input) {
    refs.input.value = '';
  }
};

const renderChipList = (kind: ChipKind): void => {
  const refs = chipRefs[kind];
  const values = formState[kind];

  if (!refs.list || !refs.empty) {
    return;
  }

  refs.list.innerHTML = '';

  if (!values.length) {
    refs.empty.classList.remove('is-hidden');
    return;
  }

  refs.empty.classList.add('is-hidden');

  values.forEach((value, index) => {
    const chip = document.createElement('span');
    chip.className = 'meta-chip';

    const text = document.createElement('span');
    text.textContent = value;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip-remove';
    button.dataset.kind = kind;
    button.dataset.index = String(index);
    button.textContent = 'x';

    chip.appendChild(text);
    chip.appendChild(button);
    refs.list?.appendChild(chip);
  });
};

const addChipValue = (kind: ChipKind, rawValue: string): void => {
  const value = rawValue.trim();
  if (!value) {
    return;
  }

  const existing = formState[kind].map((entry) => entry.toLowerCase());
  if (existing.includes(value.toLowerCase())) {
    hideChipInput(kind);
    return;
  }

  formState = {
    ...formState,
    [kind]: [...formState[kind], value]
  };
  renderChipList(kind);
  hideChipInput(kind);
  syncDirtyFromState();
};

const removeChipValue = (kind: ChipKind, index: number): void => {
  if (Number.isNaN(index) || index < 0 || index >= formState[kind].length) {
    return;
  }

  formState = {
    ...formState,
    [kind]: formState[kind].filter((_, entryIndex) => entryIndex !== index)
  };
  renderChipList(kind);
  syncDirtyFromState();
};

const bindChipInteractions = (kind: ChipKind): void => {
  const refs = chipInputRefs[kind];
  const list = chipRefs[kind].list;

  refs.addBtn?.addEventListener('click', () => {
    showChipInput(kind);
  });

  refs.confirmBtn?.addEventListener('click', () => {
    addChipValue(kind, refs.input?.value ?? '');
  });

  refs.input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addChipValue(kind, refs.input?.value ?? '');
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      hideChipInput(kind);
    }
  });

  list?.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target || !target.classList.contains('chip-remove')) {
      return;
    }

    const removeKind = target.dataset.kind as ChipKind | undefined;
    const index = Number(target.dataset.index ?? '-1');
    if (!removeKind) {
      return;
    }

    removeChipValue(removeKind, index);
  });
};

const refreshForm = (): void => {
  if (metaTitleInput) {
    metaTitleInput.value = formState.title;
  }
  if (metaSummaryInput) {
    metaSummaryInput.value = formState.summary;
  }
  if (locationTypeSelect) {
    locationTypeSelect.value = formState.locationType;
  }
  syncLocationPhases();

  if (pipelinePrioritySelect) {
    pipelinePrioritySelect.value = formState.priority;
  }

  if (policySequential) {
    policySequential.checked = formState.policySequentialPipeline;
  }
  if (policyAuditGate) {
    policyAuditGate.checked = formState.policyRequireAuditGate;
  }
  if (policyContext) {
    policyContext.checked = formState.policyStrictContext;
  }

  if (assignmentAssigneeInput) {
    assignmentAssigneeInput.value = formState.assignee;
  }

  syncAssignmentSelects();
  renderChipList('contexts');
  renderChipList('skills');
  renderChipList('tags');

  if (taskBody) {
    taskBody.value = formState.body;
  }
  if (taskFrontmatter) {
    taskFrontmatter.value = formState.frontmatterText || serializeFrontmatterForEditor(formState);
  }
  if (taskRunNotes) {
    taskRunNotes.value = formState.runNotes;
  }

  updateHeaderChips();
  if (runStageBtn) {
    runStageBtn.disabled = !currentTaskId;
  }
  if (runAllBtn) {
    runAllBtn.disabled = !currentTaskId;
  }
  renderExecutionRail();
};

const discardChanges = (): void => {
  formState = cloneState(initialFormState);
  refreshForm();
  syncLocationControls();
  setDirty(false);
};

const postRunStage = (): void => {
  if (!vscode || !currentTaskId) {
    return;
  }
  const message: RunStageMessage = {
    type: 'RunStage',
    payload: {
      taskId: currentTaskId
    }
  };
  vscode.postMessage(message);
};

const postRunAllStages = (): void => {
  if (!vscode || !currentTaskId) {
    return;
  }
  const message: RunAllStagesMessage = {
    type: 'RunAllStages',
    payload: {
      taskId: currentTaskId
    }
  };
  vscode.postMessage(message);
};

const postCancelRun = (): void => {
  if (!vscode || !currentTaskId) {
    return;
  }
  const message: CancelRunMessage = {
    type: 'CancelRun',
    payload: {
      taskId: currentTaskId
    }
  };
  vscode.postMessage(message);
};

const postRetryRun = (): void => {
  if (!vscode || !currentTaskId) {
    return;
  }
  const message: RetryRunMessage = {
    type: 'RetryRun',
    payload: {
      taskId: currentTaskId
    }
  };
  vscode.postMessage(message);
};

const postSave = (): void => {
  if (!vscode) {
    return;
  }

  const title = formState.title.trim();
  const role = formState.role.trim();
  const provider = formState.provider.trim();
  const model = formState.model.trim();
  const profile = formState.profile.trim();
  const phase = formState.phase.trim();

  const message: SaveTaskMessage = {
    type: 'SaveTask',
    payload: {
      taskId: currentTaskPath || undefined,
      task: {
        title: title || undefined,
        body: formState.body,
        stage: formState.stage as SaveTaskMessage['payload']['task']['stage'],
        priority: formState.priority,
        role: role || undefined,
        provider: provider || undefined,
        model: model || undefined,
        profile: profile || undefined,
        project: formState.locationType === 'project' ? currentProject : undefined,
        phase: formState.locationType === 'project' && phase ? phase : undefined,
        tags: dedupeValues(formState.tags),
        contexts: dedupeValues(formState.contexts),
        skills: dedupeValues(formState.skills)
      }
    }
  };

  vscode.postMessage(message);
  initialFormState = cloneState(formState);
  setDirty(false);
};

const postClose = (): void => {
  if (!vscode) {
    return;
  }
  const closeMessage: CloseTaskEditorMessage = { type: 'CloseTaskEditor' };
  vscode.postMessage(closeMessage);
};

const requestClose = (): void => {
  if (!isDirty) {
    postClose();
    return;
  }
  exitModalOverlay?.classList.remove('is-hidden');
};

const extractProjectFromPath = (taskPath: string): string => {
  const normalizedPath = taskPath.replace(/\\/g, '/');
  const pathParts = normalizedPath.split('/').filter((entry) => entry.length > 0);
  const projectIndex = pathParts.indexOf('projects');

  if (projectIndex >= 0 && projectIndex < pathParts.length - 1) {
    return pathParts[projectIndex + 1];
  }

  if (pathParts.includes('inbox')) {
    return 'inbox';
  }

  return 'project';
};

const extractPhaseFromPath = (taskPath: string, project: string): string => {
  const normalizedPath = taskPath.replace(/\\/g, '/');
  const marker = `/projects/${project}/`;
  const markerIndex = normalizedPath.indexOf(marker);

  if (markerIndex < 0) {
    return '';
  }

  const remainder = normalizedPath.slice(markerIndex + marker.length);
  const parts = remainder.split('/').filter((entry) => entry.length > 0);
  if (parts.length < 2) {
    return '';
  }

  const candidate = parts[0];
  return candidate.endsWith('.md') ? '' : candidate;
};

saveBtn?.addEventListener('click', () => {
  postSave();
});

closeBtn?.addEventListener('click', () => {
  requestClose();
});

saveChangesBtn?.addEventListener('click', () => {
  postSave();
});

discardChangesBtn?.addEventListener('click', () => {
  discardChanges();
});

metaTitleInput?.addEventListener('input', () => {
  formState.title = metaTitleInput.value;
  if (bcTitle) {
    bcTitle.textContent = formState.title.trim() || 'Untitled task';
  }
  syncDirtyFromState();
});

metaSummaryInput?.addEventListener('input', () => {
  formState.summary = metaSummaryInput.value;
  syncDirtyFromState();
});

locationTypeSelect?.addEventListener('change', () => {
  formState.locationType = (locationTypeSelect.value as LocationType) || 'inbox';
  if (formState.locationType === 'inbox') {
    formState.phase = '';
  }
  syncLocationControls();
  syncDirtyFromState();
});

locationPhaseSelect?.addEventListener('change', () => {
  formState.phase = locationPhaseSelect.value;
  syncDirtyFromState();
});

pipelinePrioritySelect?.addEventListener('change', () => {
  const nextPriority = pipelinePrioritySelect.value as TaskEditorFormState['priority'];
  formState.priority = nextPriority || 'medium';
  syncDirtyFromState();
});

policySequential?.addEventListener('change', () => {
  formState.policySequentialPipeline = policySequential.checked;
  syncDirtyFromState();
});

policyAuditGate?.addEventListener('change', () => {
  formState.policyRequireAuditGate = policyAuditGate.checked;
  syncDirtyFromState();
});

policyContext?.addEventListener('change', () => {
  formState.policyStrictContext = policyContext.checked;
  syncDirtyFromState();
});

assignmentAssigneeInput?.addEventListener('input', () => {
  formState.assignee = assignmentAssigneeInput.value;
  syncDirtyFromState();
});

assignmentRoleSelect?.addEventListener('change', () => {
  formState.role = assignmentRoleSelect.value;
  updateHeaderChips();
  syncDirtyFromState();
});

assignmentProviderSelect?.addEventListener('change', () => {
  formState.provider = assignmentProviderSelect.value;
  const models = getModelsForProvider(formState.provider);
  formState.model = models.includes(formState.model) ? formState.model : models[0] ?? '';
  const profileOptions = getProfilesForProviderModel(formState.provider, formState.model);
  formState.profile = profileOptions.includes(formState.profile)
    ? formState.profile
    : profileOptions[0] ?? '';
  syncAssignmentSelects();
  syncDirtyFromState();
});

assignmentModelSelect?.addEventListener('change', () => {
  formState.model = assignmentModelSelect.value;
  const profileOptions = getProfilesForProviderModel(formState.provider, formState.model);
  formState.profile = profileOptions.includes(formState.profile)
    ? formState.profile
    : profileOptions[0] ?? '';
  syncAssignmentSelects();
  syncDirtyFromState();
});

assignmentProfileSelect?.addEventListener('change', () => {
  formState.profile = assignmentProfileSelect.value;
  syncDirtyFromState();
});

taskBody?.addEventListener('input', () => {
  formState.body = taskBody.value ?? '';
  if (!formState.summary.trim()) {
    formState.summary = inferSummaryFromBody(formState.body);
    if (metaSummaryInput) {
      metaSummaryInput.value = formState.summary;
    }
  }
  syncDirtyFromState();
});

taskFrontmatter?.addEventListener('input', () => {
  formState.frontmatterText = taskFrontmatter.value ?? '';
  syncDirtyFromState();
});

taskRunNotes?.addEventListener('input', () => {
  formState.runNotes = taskRunNotes.value ?? '';
  syncDirtyFromState();
});

editorTabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab as EditorTab | undefined;
    if (!tab || (tab !== 'body' && tab !== 'frontmatter' && tab !== 'runNotes')) {
      return;
    }
    switchEditorTab(tab);
  });
});

runStageBtn?.addEventListener('click', () => {
  postRunStage();
});

runAllBtn?.addEventListener('click', () => {
  postRunAllStages();
});

editStepsBtn?.addEventListener('click', () => {
  isStepEditorOpen = !isStepEditorOpen;
  renderExecutionRail();
});

pipelineList?.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;
  const actionButton = target?.closest('[data-step-action]') as HTMLButtonElement | null;
  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.stepAction;
  if (action === 'run') {
    postRunStage();
    return;
  }
  if (action === 'retry') {
    postRetryRun();
    return;
  }
  if (action === 'cancel') {
    postCancelRun();
  }
});

stepEditor?.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;
  const actionButton = target?.closest('[data-editor-action]') as HTMLButtonElement | null;
  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.editorAction;
  const index = Number(actionButton.dataset.stepIndex ?? '-1');
  if (action === 'add') {
    pipelineSteps = [...pipelineSteps, createPipelineStep(`step-${pipelineSteps.length + 1}`)];
    renderExecutionRail();
    return;
  }
  if (action === 'remove' && index >= 0 && pipelineSteps.length > 1) {
    pipelineSteps = pipelineSteps.filter((_, entryIndex) => entryIndex !== index);
    renderExecutionRail();
    return;
  }
  if (action === 'up' && index > 0) {
    movePipelineStep(index, index - 1);
    renderExecutionRail();
    return;
  }
  if (action === 'down' && index >= 0 && index < pipelineSteps.length - 1) {
    movePipelineStep(index, index + 1);
    renderExecutionRail();
  }
});

stepEditor?.addEventListener('input', (event) => {
  const target = event.target as HTMLInputElement | null;
  if (!target || target.dataset.stepField !== 'name') {
    return;
  }
  const index = Number(target.dataset.stepIndex ?? '-1');
  if (index < 0 || index >= pipelineSteps.length) {
    return;
  }
  pipelineSteps[index] = {
    ...pipelineSteps[index],
    name: target.value.trim() || pipelineSteps[index].name
  };
  renderPipeline();
});

stepEditor?.addEventListener('change', (event) => {
  const target = event.target as HTMLSelectElement | null;
  if (!target) {
    return;
  }
  const field = target.dataset.stepField;
  const index = Number(target.dataset.stepIndex ?? '-1');
  if (!field || index < 0 || index >= pipelineSteps.length) {
    return;
  }

  if (field === 'provider') {
    const provider = target.value;
    const models = getModelsForProvider(provider);
    pipelineSteps[index] = {
      ...pipelineSteps[index],
      provider,
      model: models.includes(pipelineSteps[index].model) ? pipelineSteps[index].model : models[0] ?? ''
    };
    renderExecutionRail();
    return;
  }

  if (field === 'role' || field === 'model') {
    pipelineSteps[index] = {
      ...pipelineSteps[index],
      [field]: target.value
    };
    renderPipeline();
  }
});

newLocationBtn?.addEventListener('click', () => {
  locationModalOverlay?.classList.remove('is-hidden');
  if (newLocationTypeSelect) {
    newLocationTypeSelect.value = 'project';
  }
  if (newLocationPhaseInput) {
    newLocationPhaseInput.value = '';
  }
  if (newLocationSlugInput) {
    newLocationSlugInput.value = '';
    newLocationSlugInput.focus();
  }
});

cancelLocationBtn?.addEventListener('click', () => {
  locationModalOverlay?.classList.add('is-hidden');
});

createLocationBtn?.addEventListener('click', () => {
  const type = (newLocationTypeSelect?.value as LocationType | undefined) ?? 'project';
  const slug = newLocationSlugInput?.value.trim() ?? '';
  const phase = newLocationPhaseInput?.value.trim() ?? '';

  if (type === 'project' && !slug) {
    newLocationSlugInput?.focus();
    return;
  }

  formState.locationType = type;
  if (type === 'project') {
    currentProject = slug;
    if (bcProject) {
      bcProject.textContent = currentProject;
    }
    if (phase && !discoveredPhases.includes(phase)) {
      discoveredPhases = [...discoveredPhases, phase].sort((a, b) => a.localeCompare(b));
    }
    formState.phase = phase;
  } else {
    currentProject = 'inbox';
    if (bcProject) {
      bcProject.textContent = currentProject;
    }
    formState.phase = '';
  }

  if (locationTypeSelect) {
    locationTypeSelect.value = formState.locationType;
  }

  syncLocationPhases();
  syncDirtyFromState();
  locationModalOverlay?.classList.add('is-hidden');
});

saveExitBtn?.addEventListener('click', () => {
  postSave();
  postClose();
});

discardExitBtn?.addEventListener('click', () => {
  discardChanges();
  postClose();
});

cancelExitBtn?.addEventListener('click', () => {
  exitModalOverlay?.classList.add('is-hidden');
});

bindChipInteractions('contexts');
bindChipInteractions('skills');
bindChipInteractions('tags');

window.addEventListener('message', (event: MessageEvent<unknown>) => {
  const message = event.data;
  if (!isHostToWebviewMessage(message)) {
    return;
  }

  if (message.type === 'FocusTaskEditor') {
    applyValidationFocus((message as FocusTaskEditorMessage).payload.focusTargets);
    return;
  }

  if (message.type === 'RunnerStateChanged') {
    if (!currentTaskId || message.payload.taskId !== currentTaskId) {
      return;
    }

    currentRunState = message.payload.state;
    const run: RecentRunEntry = {
      stage: formState.stage || 'unknown',
      status: mapRunStateToPipelineStatus(message.payload.state),
      timestamp: message.payload.timestamp
    };
    recentRuns = [run, ...recentRuns].slice(0, 5);
    renderExecutionRail();
    return;
  }

  if (message.type !== 'LoadTaskEditor') {
    return;
  }

  const loadMessage = message as LoadTaskEditorMessage;
  const { frontmatter, body } = loadMessage.payload.task;

  currentTaskId = loadMessage.payload.taskId;
  currentTaskPath = loadMessage.payload.taskPath;
  currentProject = (frontmatter.project?.trim() || extractProjectFromPath(currentTaskPath)).trim();
  currentRunState = null;
  recentRuns = [];
  pipelineSteps = [];
  isStepEditorOpen = false;

  const inferredPhase = extractPhaseFromPath(currentTaskPath, currentProject);
  const phase = frontmatter.phase?.trim() || inferredPhase;

  discoveredPhases = dedupeValues([phase]).sort((a, b) => a.localeCompare(b));

  const inferredLocationType: LocationType = currentProject && currentProject !== 'inbox' ? 'project' : 'inbox';

  formState = {
    title: frontmatter.title?.trim() || 'Untitled task',
    summary: inferSummaryFromBody(body ?? ''),
    locationType: inferredLocationType,
    phase,
    stage: frontmatter.stage || 'unknown',
    priority: frontmatter.priority ?? 'medium',
    policySequentialPipeline: false,
    policyRequireAuditGate: false,
    policyStrictContext: false,
    assignee: '',
    role: frontmatter.role?.trim() || '',
    provider: frontmatter.provider?.trim() || '',
    model: frontmatter.model?.trim() || '',
    profile: frontmatter.profile?.trim() || '',
    tags: dedupeValues(frontmatter.tags ?? []),
    contexts: dedupeValues(frontmatter.contexts ?? []),
    skills: dedupeValues(frontmatter.skills ?? []),
    body: body ?? '',
    frontmatterText: '',
    runNotes: ''
  };
  formState.frontmatterText = serializeFrontmatterForEditor(formState);

  ensureRoleOption(formState.role);
  ensureProviderModel(formState.provider, formState.model);
  ensureProfile(formState.profile, formState.provider, formState.model);

  initialFormState = cloneState(formState);

  if (bcProject) {
    bcProject.textContent = currentProject;
  }
  if (bcTitle) {
    bcTitle.textContent = formState.title;
  }

  refreshForm();
  if (!applyValidationFocus(loadMessage.payload.focusTargets)) {
    switchEditorTab('body');
  }
  syncLocationControls();
  exitModalOverlay?.classList.add('is-hidden');
  locationModalOverlay?.classList.add('is-hidden');
  setDirty(false);
});
