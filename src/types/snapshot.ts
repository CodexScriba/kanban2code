import type { Kanban2CodeConfig } from './config';
import type { Agent, ContextFile, SkillFile } from '../services/context';
import type { ProviderConfigFile } from '../services/provider-service';
import type { Stage, Task } from './task';

export interface WorkspaceSnapshotTasks {
  inbox: Task[];
  plan: Task[];
  code: Task[];
  audit: Task[];
  completed: Task[];
}

export interface WorkspaceSnapshotMetadata {
  taskCounts: Record<Stage, number>;
  totalTasks: number;
  agentCount: number;
  contextCount: number;
  skillCount: number;
  providerCount: number;
}

export interface WorkspaceSnapshot {
  config: Kanban2CodeConfig;
  tasks: WorkspaceSnapshotTasks;
  agents: Agent[];
  contexts: ContextFile[];
  skills: SkillFile[];
  providers: ProviderConfigFile[];
  metadata: WorkspaceSnapshotMetadata;
}
