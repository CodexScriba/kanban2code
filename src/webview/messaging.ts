export type TaskStage = 'inbox' | 'capture' | 'plan' | 'code' | 'audit' | 'completed' | 'unknown';

export interface TaskSnapshotItem {
  id: string;
  title: string;
  stage: TaskStage;
}

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

export type WebviewToHostMessage = RequestTaskSnapshotMessage | ShowKanbanBoardMessage | SendChatMessage;

export interface TaskSnapshotMessage {
  type: 'TaskSnapshot';
  payload: {
    tasks: TaskSnapshotItem[];
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

export type HostToWebviewMessage =
  | TaskSnapshotMessage
  | TaskSelectionResetMessage
  | OrchestratorResponseMessage;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isWebviewToHostMessage = (value: unknown): value is WebviewToHostMessage => {
  if (!isObject(value) || typeof value.type !== 'string') {
    return false;
  }

  if (value.type === 'RequestTaskSnapshot' || value.type === 'ShowKanbanBoard') {
    return true;
  }

  if (value.type !== 'SendChatMessage' || !isObject(value.payload)) {
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
};

export const isHostToWebviewMessage = (value: unknown): value is HostToWebviewMessage => {
  if (!isObject(value) || typeof value.type !== 'string') {
    return false;
  }

  if (value.type === 'TaskSnapshot') {
    return (
      isObject(value.payload) &&
      Array.isArray(value.payload.tasks) &&
      value.payload.tasks.every(
        (task) =>
          isObject(task) &&
          typeof task.id === 'string' &&
          typeof task.title === 'string' &&
          typeof task.stage === 'string'
      )
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

  return false;
};
