export type RunState = 'queued' | 'running' | 'success' | 'failed' | 'cancelled';

export interface QueueItem {
  taskId: string;
  scope: 'stage' | 'all';
  state: RunState;
  enqueuedAt: number;
}

export interface RunResult {
  taskId: string;
  state: RunState;
  output: string;
  error?: string;
  completedAt: number;
}
