import type { Kanban2CodeConfig } from './config';
import type { Stage, Task } from './task';
import type { Agent, ContextFile, ProviderConfigFile, SkillFile } from './workspace-entities';

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
