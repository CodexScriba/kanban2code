import type { ProviderConfig } from './provider';
import type { WorkspaceSnapshot } from './snapshot';
import type { SelectedSkill } from './skill';

export type ChatMessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

export interface OrchestratorCallOptions {
  kanbanRoot: string;
  provider: string;
  messages: ChatMessage[];
  systemPrompt?: string;
  agentInstructions?: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
  providerConfig?: ProviderConfig;
  workspaceSnapshot?: WorkspaceSnapshot;
  selectedSkills?: SelectedSkill[];
}
