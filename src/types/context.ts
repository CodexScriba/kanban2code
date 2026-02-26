import { Task } from './task';

export interface ContextService {
  loadGlobalContext(root: string): Promise<string>;
  loadAgentContext(root: string, agentName?: string | null): Promise<string>;
  loadProjectContext(root: string, projectName?: string | null): Promise<string>;
  loadPhaseContext(root: string, projectName?: string | null, phaseName?: string | null): Promise<string>;
  loadCustomContexts(root: string, contextNames?: string[] | null): Promise<string>;
}

export interface PromptBuilder {
  buildXMLPrompt(task: Task, root: string): Promise<string>;
  buildContextOnlyPrompt(task: Task, root: string): Promise<string>;
}
