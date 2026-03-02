export type QueueState = 'pending' | 'running' | 'completed' | 'failed';

export type RunState = 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
export type QueueScope = 'stage' | 'all';

export type QueueOperation = 'RunStage' | 'RunAllStages' | 'CancelRun' | 'RetryRun';

export interface QueueItem {
  taskId: string;
  scope: QueueScope;
  state: RunState;
  enqueuedAt: number;
  taskPath?: string;
  startedAt?: number;
  completedAt?: number;
}

export interface QueueSnapshot {
  items: QueueItem[];
  activeTaskId: string | null;
  totalQueued: number;
}

export interface QueueStateChangeEvent {
  taskId: string;
  oldState: RunState | null;
  state: RunState;
  newState: RunState;
  timestamp: number;
}

export interface RunResult {
  taskId: string;
  state: RunState;
  output: string;
  error?: string;
  completedAt: number;
}

export interface ValidationError {
  field: 'title' | 'stage' | 'role' | 'provider' | 'model' | 'profile' | 'contexts' | 'skills';
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  missingRequiredFields: Array<'title' | 'stage' | 'role'>;
}

export type QueueOperationFailureReason = 'duplicate' | 'validation_failed' | 'invalid_state';

export type QueueOperationResult =
  | {
      ok: true;
      item: QueueItem;
    }
  | {
      ok: false;
      reason: QueueOperationFailureReason;
      validation?: ValidationResult;
    };
