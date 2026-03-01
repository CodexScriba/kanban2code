export type RunState = 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
export type QueueScope = 'stage' | 'all';

export interface QueueItem {
  taskId: string;
  scope: QueueScope;
  state: RunState;
  enqueuedAt: number;
  taskPath?: string;
  startedAt?: number;
  completedAt?: number;
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
