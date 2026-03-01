import type {
  Task,
  TaskCreateInput,
  TaskSnapshotItem,
  TaskStage,
  TaskUpdateInput
} from '../types/task';
import type { QueueItem, RunState } from '../types/runner';
import type { SettingsSection } from '../types/settings';
export type { TaskSnapshotItem } from '../types/task';
export type { QueueItem, RunResult, RunState } from '../types/runner';

export interface RequestTaskSnapshotMessage {
  type: 'RequestTaskSnapshot';
}

export interface ShowKanbanBoardMessage {
  type: 'ShowKanbanBoard';
}

export interface SendChatMessage {
  type: 'SendChatMessage';
  payload: {
    message: string;
    provider: string;
    selectedTaskId?: string;
  };
}

export interface CreateTaskMessage {
  type: 'CreateTask';
  payload: TaskCreateInput;
}

export interface UpdateTaskMessage {
  type: 'UpdateTask';
  payload: {
    taskId: string;
    updates: TaskUpdateInput;
  };
}

export interface DeleteTaskMessage {
  type: 'DeleteTask';
  payload: {
    taskId: string;
  };
}

export interface MoveTaskMessage {
  type: 'MoveTask';
  payload: {
    taskId: string;
    targetStage: TaskStage;
    order?: number;
  };
}

export interface ReorderTaskMessage {
  type: 'ReorderTask';
  payload: {
    taskId: string;
    newOrder: number;
  };
}

export interface OpenTaskEditorMessage {
  type: 'OpenTaskEditor';
  payload?: {
    taskId?: string;
  };
}

export interface CloseTaskEditorMessage {
  type: 'CloseTaskEditor';
}

export interface SaveTaskMessage {
  type: 'SaveTask';
  payload: {
    taskId?: string;
    task: TaskCreateInput;
  };
}

export interface OpenSettingsMessage {
  type: 'OpenSettings';
  payload?: {
    projectSlug?: string;
  };
}

export interface SaveSettingsMessage {
  type: 'SaveSettings';
  payload: {
    settings: Record<string, unknown>;
    projectSlug?: string;
  };
}

export interface ResetSectionMessage {
  type: 'ResetSection';
  payload: {
    section: SettingsSection;
    projectSlug?: string;
  };
}

export interface ResetToDefaultsMessage {
  type: 'ResetToDefaults';
  payload?: {
    projectSlug?: string;
  };
}

export interface RunStageMessage {
  type: 'RunStage';
  payload: {
    taskId: string;
  };
}

export interface RunAllStagesMessage {
  type: 'RunAllStages';
  payload: {
    taskId: string;
  };
}

export interface QueueStageMessage {
  type: 'QueueStage';
  payload: {
    taskId: string;
  };
}

export interface QueueAllStagesMessage {
  type: 'QueueAllStages';
  payload: {
    taskId: string;
  };
}

export interface CancelRunMessage {
  type: 'CancelRun';
  payload: {
    taskId: string;
  };
}

export interface RetryRunMessage {
  type: 'RetryRun';
  payload: {
    taskId: string;
  };
}

export type WebviewToHostMessage =
  | RequestTaskSnapshotMessage
  | ShowKanbanBoardMessage
  | SendChatMessage
  | CreateTaskMessage
  | UpdateTaskMessage
  | DeleteTaskMessage
  | MoveTaskMessage
  | ReorderTaskMessage
  | OpenTaskEditorMessage
  | CloseTaskEditorMessage
  | SaveTaskMessage
  | OpenSettingsMessage
  | SaveSettingsMessage
  | ResetSectionMessage
  | ResetToDefaultsMessage
  | RunStageMessage
  | RunAllStagesMessage
  | QueueStageMessage
  | QueueAllStagesMessage
  | CancelRunMessage
  | RetryRunMessage;

export interface TaskSnapshotMessage {
  type: 'TaskSnapshot';
  payload: {
    tasks: TaskSnapshotItem[];
  };
}

export interface TaskUpdatedMessage {
  type: 'TaskUpdated';
  payload: {
    taskId: string;
  };
}

export interface TaskDeletedMessage {
  type: 'TaskDeleted';
  payload: {
    taskId: string;
  };
}

export interface SettingsLoadedMessage {
  type: 'SettingsLoaded';
  payload: {
    settings: Record<string, unknown>;
    projectSlug?: string;
  };
}

export interface TaskSelectionResetMessage {
  type: 'TaskSelectionReset';
  payload: {
    reason: string;
  };
}

export interface OrchestratorResponseMessage {
  type: 'OrchestratorResponse';
  payload: {
    message: string;
  };
}

export interface RunnerStateChangedMessage {
  type: 'RunnerStateChanged';
  payload: {
    taskId: string;
    state: RunState;
    timestamp: number;
  };
}

export interface QueueSnapshotMessage {
  type: 'QueueSnapshot';
  payload: {
    items: QueueItem[];
    activeTaskId: string | null;
    totalQueued: number;
  };
}

export interface LoadTaskEditorMessage {
  type: 'LoadTaskEditor';
  payload: {
    taskPath: string;
    taskId: string;
    task: Task;
  };
}

export type HostToWebviewMessage =
  | TaskSnapshotMessage
  | TaskUpdatedMessage
  | TaskDeletedMessage
  | SettingsLoadedMessage
  | TaskSelectionResetMessage
  | OrchestratorResponseMessage
  | RunnerStateChangedMessage
  | QueueSnapshotMessage
  | LoadTaskEditorMessage;

const TASK_STAGES: TaskStage[] = ['inbox', 'capture', 'plan', 'code', 'audit', 'completed', 'unknown'];
const PRIORITIES = ['low', 'medium', 'high'] as const;
const RUN_STATES: RunState[] = ['queued', 'running', 'success', 'failed', 'cancelled'];
const QUEUE_SCOPES = ['stage', 'all'] as const;
const SETTINGS_SECTIONS: SettingsSection[] = [
  'general',
  'taskDefaults',
  'pipelineDefaults',
  'stageRuntimeMapping',
  'providersAndModels',
  'agentBehavior',
  'roles',
  'queueAndExecution',
  'projectOverrides',
  'notifications',
  'telemetryAndLogs'
];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === 'string');

const isTaskStage = (value: unknown): value is TaskStage =>
  typeof value === 'string' && TASK_STAGES.includes(value as TaskStage);

const isPriority = (value: unknown): boolean =>
  typeof value === 'string' && PRIORITIES.includes(value as (typeof PRIORITIES)[number]);

const isRunState = (value: unknown): value is RunState =>
  typeof value === 'string' && RUN_STATES.includes(value as RunState);

const isQueueScope = (value: unknown): value is QueueItem['scope'] =>
  typeof value === 'string' && QUEUE_SCOPES.includes(value as (typeof QUEUE_SCOPES)[number]);

const isSettingsSection = (value: unknown): value is SettingsSection =>
  typeof value === 'string' && SETTINGS_SECTIONS.includes(value as SettingsSection);

const isQueueItem = (value: unknown): value is QueueItem => {
  return (
    isObject(value) &&
    typeof value.taskId === 'string' &&
    isQueueScope(value.scope) &&
    isRunState(value.state) &&
    typeof value.enqueuedAt === 'number' &&
    Number.isFinite(value.enqueuedAt)
  );
};

const isTaskInput = (
  value: unknown,
  allowProjectSlug: boolean
): value is TaskCreateInput | TaskUpdateInput => {
  if (!isObject(value)) {
    return false;
  }

  if ('title' in value && value.title !== undefined && typeof value.title !== 'string') {
    return false;
  }

  if ('body' in value && value.body !== undefined && typeof value.body !== 'string') {
    return false;
  }

  if ('stage' in value && value.stage !== undefined && !isTaskStage(value.stage)) {
    return false;
  }

  if ('role' in value && value.role !== undefined && typeof value.role !== 'string') {
    return false;
  }

  if ('agent' in value && value.agent !== undefined && typeof value.agent !== 'string') {
    return false;
  }

  if ('provider' in value && value.provider !== undefined && typeof value.provider !== 'string') {
    return false;
  }

  if ('model' in value && value.model !== undefined && typeof value.model !== 'string') {
    return false;
  }

  if ('profile' in value && value.profile !== undefined && typeof value.profile !== 'string') {
    return false;
  }

  if ('priority' in value && value.priority !== undefined && !isPriority(value.priority)) {
    return false;
  }

  if ('tags' in value && value.tags !== undefined && !isStringArray(value.tags)) {
    return false;
  }

  if ('contexts' in value && value.contexts !== undefined && !isStringArray(value.contexts)) {
    return false;
  }

  if ('skills' in value && value.skills !== undefined && !isStringArray(value.skills)) {
    return false;
  }

  if ('project' in value && value.project !== undefined && typeof value.project !== 'string') {
    return false;
  }

  if ('phase' in value && value.phase !== undefined && typeof value.phase !== 'string') {
    return false;
  }

  if ('projectSlug' in value) {
    if (!allowProjectSlug) {
      return false;
    }

    if (value.projectSlug !== undefined && typeof value.projectSlug !== 'string') {
      return false;
    }
  }

  return true;
};

const isTaskSnapshotItem = (task: unknown): task is TaskSnapshotItem => {
  return (
    isObject(task) &&
    typeof task.id === 'string' &&
    typeof task.taskId === 'string' &&
    typeof task.title === 'string' &&
    (task.description === undefined || typeof task.description === 'string') &&
    isTaskStage(task.stage) &&
    (task.order === undefined || (typeof task.order === 'number' && Number.isFinite(task.order))) &&
    isStringArray(task.tags) &&
    typeof task.createdAt === 'number' &&
    Number.isFinite(task.createdAt) &&
    (task.priority === undefined || isPriority(task.priority)) &&
    (task.role === undefined || typeof task.role === 'string') &&
    (task.project === undefined || typeof task.project === 'string')
  );
};

const isTaskFrontmatter = (value: unknown): value is Task['frontmatter'] => {
  return (
    isObject(value) &&
    isTaskStage(value.stage) &&
    (value.order === undefined || (typeof value.order === 'number' && Number.isFinite(value.order))) &&
    (value.title === undefined || typeof value.title === 'string') &&
    (value.role === undefined || typeof value.role === 'string') &&
    (value.agent === undefined || typeof value.agent === 'string') &&
    (value.provider === undefined || typeof value.provider === 'string') &&
    (value.model === undefined || typeof value.model === 'string') &&
    (value.profile === undefined || typeof value.profile === 'string') &&
    (value.priority === undefined || isPriority(value.priority)) &&
    isStringArray(value.tags) &&
    isStringArray(value.contexts) &&
    isStringArray(value.skills) &&
    (value.project === undefined || typeof value.project === 'string') &&
    (value.phase === undefined || typeof value.phase === 'string')
  );
};

const isTask = (value: unknown): value is Task => {
  return isObject(value) && isTaskFrontmatter(value.frontmatter) && typeof value.body === 'string';
};

export const isWebviewToHostMessage = (value: unknown): value is WebviewToHostMessage => {
  if (!isObject(value) || typeof value.type !== 'string') {
    return false;
  }

  if (
    value.type === 'RequestTaskSnapshot' ||
    value.type === 'ShowKanbanBoard' ||
    value.type === 'CloseTaskEditor'
  ) {
    return true;
  }

  if (value.type === 'SendChatMessage') {
    if (!isObject(value.payload)) {
      return false;
    }

    if (typeof value.payload.message !== 'string' || typeof value.payload.provider !== 'string') {
      return false;
    }

    if (
      'selectedTaskId' in value.payload &&
      value.payload.selectedTaskId !== undefined &&
      typeof value.payload.selectedTaskId !== 'string'
    ) {
      return false;
    }

    return true;
  }

  if (value.type === 'CreateTask') {
    return isTaskInput(value.payload, true);
  }

  if (value.type === 'UpdateTask') {
    return (
      isObject(value.payload) &&
      typeof value.payload.taskId === 'string' &&
      isTaskInput(value.payload.updates, false)
    );
  }

  if (value.type === 'DeleteTask') {
    return isObject(value.payload) && typeof value.payload.taskId === 'string';
  }

  if (value.type === 'MoveTask') {
    if (
      !isObject(value.payload) ||
      typeof value.payload.taskId !== 'string' ||
      !isTaskStage(value.payload.targetStage)
    ) {
      return false;
    }

    if (
      'order' in value.payload &&
      value.payload.order !== undefined &&
      (typeof value.payload.order !== 'number' || !Number.isFinite(value.payload.order))
    ) {
      return false;
    }

    return true;
  }

  if (value.type === 'ReorderTask') {
    return (
      isObject(value.payload) &&
      typeof value.payload.taskId === 'string' &&
      typeof value.payload.newOrder === 'number' &&
      Number.isFinite(value.payload.newOrder)
    );
  }

  if (value.type === 'OpenTaskEditor') {
    if (value.payload === undefined) {
      return true;
    }

    return (
      isObject(value.payload) &&
      (!('taskId' in value.payload) ||
        value.payload.taskId === undefined ||
        typeof value.payload.taskId === 'string')
    );
  }

  if (value.type === 'SaveTask') {
    return (
      isObject(value.payload) &&
      isTaskInput(value.payload.task, true) &&
      (!('taskId' in value.payload) ||
        value.payload.taskId === undefined ||
        typeof value.payload.taskId === 'string')
    );
  }

  if (value.type === 'OpenSettings') {
    if (value.payload === undefined) {
      return true;
    }

    return (
      isObject(value.payload) &&
      (!('projectSlug' in value.payload) ||
        value.payload.projectSlug === undefined ||
        typeof value.payload.projectSlug === 'string')
    );
  }

  if (value.type === 'SaveSettings') {
    return (
      isObject(value.payload) &&
      isObject(value.payload.settings) &&
      (!('projectSlug' in value.payload) ||
        value.payload.projectSlug === undefined ||
        typeof value.payload.projectSlug === 'string')
    );
  }

  if (value.type === 'ResetSection') {
    return (
      isObject(value.payload) &&
      isSettingsSection(value.payload.section) &&
      (!('projectSlug' in value.payload) ||
        value.payload.projectSlug === undefined ||
        typeof value.payload.projectSlug === 'string')
    );
  }

  if (value.type === 'ResetToDefaults') {
    if (value.payload === undefined) {
      return true;
    }

    return (
      isObject(value.payload) &&
      (!('projectSlug' in value.payload) ||
        value.payload.projectSlug === undefined ||
        typeof value.payload.projectSlug === 'string')
    );
  }

  if (
    value.type === 'RunStage' ||
    value.type === 'RunAllStages' ||
    value.type === 'QueueStage' ||
    value.type === 'QueueAllStages' ||
    value.type === 'CancelRun' ||
    value.type === 'RetryRun'
  ) {
    return isObject(value.payload) && typeof value.payload.taskId === 'string';
  }

  return false;
};

export const isHostToWebviewMessage = (value: unknown): value is HostToWebviewMessage => {
  if (!isObject(value) || typeof value.type !== 'string') {
    return false;
  }

  if (value.type === 'TaskSnapshot') {
    return (
      isObject(value.payload) &&
      Array.isArray(value.payload.tasks) &&
      value.payload.tasks.every(isTaskSnapshotItem)
    );
  }

  if (value.type === 'TaskUpdated' || value.type === 'TaskDeleted') {
    return isObject(value.payload) && typeof value.payload.taskId === 'string';
  }

  if (value.type === 'SettingsLoaded') {
    return (
      isObject(value.payload) &&
      isObject(value.payload.settings) &&
      (!('projectSlug' in value.payload) ||
        value.payload.projectSlug === undefined ||
        typeof value.payload.projectSlug === 'string')
    );
  }

  if (value.type === 'TaskSelectionReset' || value.type === 'OrchestratorResponse') {
    if (!isObject(value.payload)) {
      return false;
    }

    if (value.type === 'TaskSelectionReset') {
      return typeof value.payload.reason === 'string';
    }

    return typeof value.payload.message === 'string';
  }

  if (value.type === 'RunnerStateChanged') {
    return (
      isObject(value.payload) &&
      typeof value.payload.taskId === 'string' &&
      isRunState(value.payload.state) &&
      typeof value.payload.timestamp === 'number' &&
      Number.isFinite(value.payload.timestamp)
    );
  }

  if (value.type === 'QueueSnapshot') {
    return (
      isObject(value.payload) &&
      Array.isArray(value.payload.items) &&
      value.payload.items.every(isQueueItem) &&
      (value.payload.activeTaskId === null || typeof value.payload.activeTaskId === 'string') &&
      typeof value.payload.totalQueued === 'number' &&
      Number.isFinite(value.payload.totalQueued)
    );
  }

  if (value.type === 'LoadTaskEditor') {
    return (
      isObject(value.payload) &&
      typeof value.payload.taskPath === 'string' &&
      typeof value.payload.taskId === 'string' &&
      isTask(value.payload.task)
    );
  }

  return false;
};
