import { TaskStage } from './task';

export interface StageMapping {
  role: string;
  provider: string;
  model: string;
  profile: string;
}

export interface ProviderConfig {
  enabled: boolean;
  models: string[];
  endpoint?: string;
  apiKey?: string;
}

export interface ProviderProfile {
  provider: string;
  model: string;
  description?: string;
}

export interface AgentBehaviorMode {
  id: string;
  apiConfig: string;
  role: string;
  description: string;
  whenToUse: string;
  instructions: string;
  globalInstructions?: string;
  availableTools: string[];
}

export type NotificationChannel = 'in-app' | 'telegram' | 'sound';
export type NotificationTrigger = 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
export type NotificationDigestFrequency = 'off' | 'hourly' | 'daily';

export interface NotificationQuietHours {
  enabled: boolean;
  start: string;
  end: string;
  timezone: string;
}

export interface ProjectOverrideConfig {
  enabled: boolean;
  applyToTaskDefaults: boolean;
  applyToPipelineDefaults: boolean;
  applyToRuntimeMapping: boolean;
}

export interface Settings {
  general: {
    timezone: string;
    dateFormat: string;
    uiDensity: 'comfortable' | 'compact';
    confirmDestructiveActions: boolean;
  };
  taskDefaults: {
    titleTemplate: string;
    smartSummaryBehavior: 'manual' | 'ai-assist';
    priority: 'low' | 'medium' | 'high';
    tags: string[];
    contexts: string[];
    skills: string[];
  };
  pipelineDefaults: {
    template: 'simple' | 'complex';
    createStage: TaskStage;
    auditBounceCap: number;
  };
  stageRuntimeMapping: Record<string, StageMapping>;
  providersAndModels: {
    providers: Record<string, ProviderConfig>;
    profiles: Record<string, ProviderProfile>;
  };
  agentBehavior: {
    modes: AgentBehaviorMode[];
  };
  roles: {
    available: string[];
  };
  queueAndExecution: {
    defaultMode: 'stage' | 'all stages';
    schedulingPolicy: 'FIFO';
    serializedPipeline: boolean;
    maxParallelRuns: number;
    autoOpenTerminal: boolean;
    promptMissingFields: boolean;
    autoResumeOnSave: boolean;
  };
  notifications: {
    enabled: boolean;
    channels: NotificationChannel[];
    triggers: NotificationTrigger[];
    quietHours: NotificationQuietHours;
    digestFrequency: NotificationDigestFrequency;
  };
  projectOverrides: {
    projects: Record<string, ProjectOverrideConfig>;
  };
  telemetryAndLogs: {
    enabled: boolean;
    redactSensitive: boolean;
    retentionPolicy: string;
  };
}

export type SettingsSection = keyof Settings;
