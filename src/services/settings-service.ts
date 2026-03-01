import * as path from 'node:path';
import { Settings, SettingsSection, StageMapping } from '../types/settings';

interface UriLike {
  fsPath: string;
}

interface SettingsFsAdapter {
  readFile(uri: UriLike): PromiseLike<Uint8Array>;
  writeFile(uri: UriLike, content: Uint8Array): PromiseLike<void>;
  createDirectory(uri: UriLike): PromiseLike<void>;
}

interface SettingsServiceDeps {
  fs: SettingsFsAdapter;
  toFileUri(filePath: string): UriLike;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

interface SettingsValidationResult {
  valid: boolean;
  errors: string[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const createDefaultDeps = (): SettingsServiceDeps => {
  const vscode = require('vscode') as typeof import('vscode');
  return {
    fs: vscode.workspace.fs,
    toFileUri: (filePath: string): UriLike => vscode.Uri.file(filePath)
  };
};

const DEFAULT_SETTINGS: Settings = {
  general: {
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    uiDensity: 'comfortable',
    confirmDestructiveActions: true
  },
  taskDefaults: {
    titleTemplate: '',
    smartSummaryBehavior: 'ai-assist',
    priority: 'medium',
    tags: [],
    contexts: [],
    skills: []
  },
  pipelineDefaults: {
    template: 'simple',
    createStage: 'capture',
    auditBounceCap: 2
  },
  stageRuntimeMapping: {
    plan: { role: 'planner', provider: 'claude', model: 'yolo', profile: 'default' },
    code: { role: 'coder', provider: 'codex', model: 'yolo', profile: 'coder-default' },
    audit: { role: 'auditor', provider: 'claude', model: 'yolo', profile: 'default' }
  },
  providersAndModels: {
    providers: {
      kimi: { enabled: true, models: ['yolo'] },
      gemini: { enabled: true, models: ['yolo'] },
      codex: { enabled: true, models: ['yolo'] },
      claude: { enabled: true, models: ['yolo'] }
    },
    profiles: {
      default: { provider: 'claude', model: 'yolo', description: 'Default profile' },
      'coder-default': { provider: 'codex', model: 'yolo', description: 'Default coder profile' }
    }
  },
  agentBehavior: {
    modes: [
      {
        id: 'default',
        apiConfig: 'default',
        role: 'planner',
        description: 'General purpose assistant mode',
        whenToUse: 'Use for common planning and execution tasks',
        instructions: 'Follow task instructions and prefer concise output.',
        globalInstructions: '',
        availableTools: ['terminal']
      }
    ]
  },
  roles: { available: ['planner', 'coder', 'auditor', 'architect'] },
  queueAndExecution: {
    defaultMode: 'stage',
    schedulingPolicy: 'FIFO',
    serializedPipeline: true,
    maxParallelRuns: 1,
    autoOpenTerminal: true,
    promptMissingFields: true,
    autoResumeOnSave: true
  },
  notifications: {
    enabled: true,
    channels: ['in-app'],
    triggers: ['success', 'failed'],
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
      timezone: 'UTC'
    },
    digestFrequency: 'off'
  },
  projectOverrides: {
    projects: {}
  },
  telemetryAndLogs: {
    enabled: true,
    redactSensitive: true,
    retentionPolicy: '30d'
  }
};

export class SettingsService {
  constructor(
    private readonly workspaceRoot: string,
    private readonly deps: SettingsServiceDeps = createDefaultDeps()
  ) {}

  async getSettings(projectSlug?: string): Promise<Settings> {
    const globalSettings = await this.readSettingsFile(this.getGlobalPath());
    let projectSettings: Partial<Settings> = {};

    if (projectSlug) {
      projectSettings = await this.readSettingsFile(this.getProjectPath(projectSlug));
    }

    return this.mergeSettings(DEFAULT_SETTINGS, globalSettings, projectSettings);
  }

  async getEffectiveMapping(stage: string, projectSlug?: string): Promise<StageMapping> {
    const settings = await this.getSettings(projectSlug);
    const stageMapping = settings.stageRuntimeMapping[stage];
    const fallback = this.getFallbackMapping(stage);

    return {
      role: stageMapping?.role || fallback.role,
      provider: stageMapping?.provider || fallback.provider,
      model: stageMapping?.model || fallback.model,
      profile: stageMapping?.profile || fallback.profile
    };
  }

  async updateSettings(settings: Partial<Settings>, projectSlug?: string): Promise<void> {
    const scopeFilePath = projectSlug ? this.getProjectPath(projectSlug) : this.getGlobalPath();
    const currentScopeSettings = await this.readSettingsFile(scopeFilePath);
    const updatedScopeSettings = this.deepMerge(currentScopeSettings, settings) as Partial<Settings>;

    const effectiveSettings = await this.getValidatedEffectiveSettings(updatedScopeSettings, projectSlug);
    const validation = this.validateSettings(effectiveSettings);
    if (!validation.valid) {
      throw new Error(`Invalid settings: ${validation.errors.join(' ')}`);
    }

    await this.writeSettingsFile(scopeFilePath, updatedScopeSettings);
  }

  async resetSection(section: SettingsSection, projectSlug?: string): Promise<void> {
    const scopeFilePath = projectSlug ? this.getProjectPath(projectSlug) : this.getGlobalPath();
    const currentScopeSettings = await this.readSettingsFile(scopeFilePath);
    const updatedScopeSettings: Partial<Settings> = {
      ...currentScopeSettings,
      [section]: clone(DEFAULT_SETTINGS[section])
    };

    await this.writeSettingsFile(scopeFilePath, updatedScopeSettings);
  }

  async resetToDefaults(projectSlug?: string): Promise<void> {
    if (projectSlug) {
      await this.writeSettingsFile(this.getProjectPath(projectSlug), {});
      return;
    }

    await this.writeSettingsFile(this.getGlobalPath(), DEFAULT_SETTINGS);
  }

  validateProviderModel(provider: string, model: string, settings?: Settings): ValidationResult {
    const providers = settings?.providersAndModels.providers ?? DEFAULT_SETTINGS.providersAndModels.providers;
    const config = providers[provider];
    if (!config) {
      return { valid: false, error: `Provider '${provider}' not found.` };
    }
    if (!config.enabled) {
      return { valid: false, error: `Provider '${provider}' is disabled.` };
    }
    if (!config.models.includes(model)) {
      return { valid: false, error: `Model '${model}' not supported by provider '${provider}'.` };
    }
    return { valid: true };
  }

  validateProfile(profile: string, settings?: Settings): ValidationResult {
    const profiles = settings?.providersAndModels.profiles ?? DEFAULT_SETTINGS.providersAndModels.profiles;
    if (!profiles[profile]) {
      return { valid: false, error: `Profile '${profile}' not found.` };
    }

    return { valid: true };
  }

  validateSettings(settings: Settings): SettingsValidationResult {
    const errors: string[] = [];

    for (const [stage, mapping] of Object.entries(settings.stageRuntimeMapping)) {
      const providerModelValidation = this.validateProviderModel(mapping.provider, mapping.model, settings);
      if (!providerModelValidation.valid && providerModelValidation.error) {
        errors.push(`Stage '${stage}': ${providerModelValidation.error}`);
      }

      const profileValidation = this.validateProfile(mapping.profile, settings);
      if (!profileValidation.valid && profileValidation.error) {
        errors.push(`Stage '${stage}': ${profileValidation.error}`);
        continue;
      }

      const profileConfig = settings.providersAndModels.profiles[mapping.profile];
      if (
        profileConfig &&
        (profileConfig.provider !== mapping.provider || profileConfig.model !== mapping.model)
      ) {
        errors.push(
          `Stage '${stage}': profile '${mapping.profile}' expects '${profileConfig.provider}/${profileConfig.model}' but got '${mapping.provider}/${mapping.model}'.`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  validateMapping(provider: string, model: string): ValidationResult {
    return this.validateProviderModel(provider, model);
  }

  private getFallbackMapping(stage: string): StageMapping {
    const fromDefaults = DEFAULT_SETTINGS.stageRuntimeMapping[stage];
    if (fromDefaults) {
      return fromDefaults;
    }

    return { role: 'planner', provider: 'claude', model: 'yolo', profile: 'default' };
  }

  private getGlobalPath(): string {
    return '.kanban2code/settings.json';
  }

  private getProjectPath(slug: string): string {
    return `.kanban2code/projects/${slug}/settings.json`;
  }

  private async readSettingsFile(relativePath: string): Promise<Partial<Settings>> {
    const uri = this.deps.toFileUri(path.join(this.workspaceRoot, relativePath));
    try {
      const content = await this.deps.fs.readFile(uri);
      const parsed: unknown = JSON.parse(Buffer.from(content).toString('utf8'));
      return isRecord(parsed) ? (parsed as Partial<Settings>) : {};
    } catch {
      return {};
    }
  }

  private mergeSettings(fallback: Settings, global: Partial<Settings>, project: Partial<Settings>): Settings {
    return this.deepMerge(this.deepMerge(fallback, global), project) as Settings;
  }

  private async writeSettingsFile(relativePath: string, settings: Partial<Settings>): Promise<void> {
    const absolutePath = path.join(this.workspaceRoot, relativePath);
    await this.deps.fs.createDirectory(this.deps.toFileUri(path.dirname(absolutePath)));
    await this.deps.fs.writeFile(
      this.deps.toFileUri(absolutePath),
      Buffer.from(JSON.stringify(settings, null, 2), 'utf8')
    );
  }

  private async getValidatedEffectiveSettings(
    scopedSettings: Partial<Settings>,
    projectSlug?: string
  ): Promise<Settings> {
    if (!projectSlug) {
      return this.mergeSettings(DEFAULT_SETTINGS, scopedSettings, {});
    }

    const globalSettings = await this.readSettingsFile(this.getGlobalPath());
    return this.mergeSettings(DEFAULT_SETTINGS, globalSettings, scopedSettings);
  }

  private deepMerge(base: unknown, override: unknown): unknown {
    if (!isRecord(base) || !isRecord(override)) {
      return override === undefined ? base : override;
    }

    const result: Record<string, unknown> = { ...base };
    for (const [key, overrideValue] of Object.entries(override)) {
      if (overrideValue === undefined) {
        continue;
      }

      const baseValue = result[key];
      if (isRecord(baseValue) && isRecord(overrideValue)) {
        result[key] = this.deepMerge(baseValue, overrideValue);
      } else {
        result[key] = overrideValue;
      }
    }
    return result;
  }
}
