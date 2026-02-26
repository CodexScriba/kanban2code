import type { ProviderConfig } from './provider';

export interface ProviderConfigFile {
  id: string;
  name: string;
  path: string;
  config?: ProviderConfig;
}

export interface ContextFile {
  id: string;
  name: string;
  description: string;
  path: string;
  scope?: 'global' | 'project';
}

export interface SkillFile {
  id: string;
  name: string;
  description: string;
  path: string;
  framework?: string;
  priority?: 'high' | 'medium' | 'low';
  alwaysAttach?: boolean;
  triggers?: string[];
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  path: string;
}
