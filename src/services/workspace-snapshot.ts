import * as fs from 'fs/promises';
import type { Stage, Task } from '../types/task';
import type { WorkspaceSnapshot, WorkspaceSnapshotTasks } from '../types/snapshot';
import { STAGES } from '../core/constants';
import { configService } from './config';
import { loadAllTasks } from './scanner';
import { listAvailableAgents, listAvailableContexts, listAvailableSkills } from './context';
import { listAvailableProviders } from './provider-service';

function createEmptyTaskGroups(): WorkspaceSnapshotTasks {
  return {
    inbox: [],
    plan: [],
    code: [],
    audit: [],
    completed: [],
  };
}

function groupTasksByStage(tasks: Task[]): WorkspaceSnapshotTasks {
  const grouped = createEmptyTaskGroups();

  for (const task of tasks) {
    grouped[task.stage].push(task);
  }

  return grouped;
}

function createTaskCounts(groupedTasks: WorkspaceSnapshotTasks): Record<Stage, number> {
  return {
    inbox: groupedTasks.inbox.length,
    plan: groupedTasks.plan.length,
    code: groupedTasks.code.length,
    audit: groupedTasks.audit.length,
    completed: groupedTasks.completed.length,
  };
}

export async function buildWorkspaceSnapshot(kanbanRoot: string): Promise<WorkspaceSnapshot> {
  let stats;
  try {
    stats = await fs.stat(kanbanRoot);
  } catch {
    throw new Error(`Kanban root does not exist: ${kanbanRoot}`);
  }

  if (!stats.isDirectory()) {
    throw new Error(`Kanban root is not a directory: ${kanbanRoot}`);
  }

  await configService.initialize(kanbanRoot);

  const [tasks, agents, contexts, skills, providers] = await Promise.all([
    loadAllTasks(kanbanRoot),
    listAvailableAgents(kanbanRoot),
    listAvailableContexts(kanbanRoot),
    listAvailableSkills(kanbanRoot),
    listAvailableProviders(kanbanRoot),
  ]);

  const groupedTasks = groupTasksByStage(tasks);
  const taskCounts = createTaskCounts(groupedTasks);

  const totalTasks = STAGES.reduce((sum, stage) => sum + taskCounts[stage], 0);

  return {
    config: configService.getConfig(),
    tasks: groupedTasks,
    agents,
    contexts,
    skills,
    providers,
    metadata: {
      taskCounts,
      totalTasks,
      agentCount: agents.length,
      contextCount: contexts.length,
      skillCount: skills.length,
      providerCount: providers.length,
    },
  };
}
