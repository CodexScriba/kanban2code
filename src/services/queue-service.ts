import * as path from 'node:path';
import { access } from 'node:fs/promises';
import { EventEmitter } from 'node:events';
import type {
  QueueItem,
  QueueOperation,
  QueueOperationResult,
  QueueScope,
  QueueSnapshot,
  QueueState,
  QueueStateChangeEvent,
  RunState,
  ValidationError,
  ValidationResult
} from '../types/runner';
import type { Task, TaskFrontmatter, TaskUpdateInput } from '../types/task';
import type { Settings } from '../types/settings';

interface QueueTaskServiceLike {
  readTask(taskPath: string): Promise<Task>;
  updateTask(taskPath: string, updates: TaskUpdateInput): Promise<Task>;
}

interface QueueSettingsServiceLike {
  getSettings(projectSlug?: string): Promise<Settings>;
  getEffectiveMapping(stage: string, projectSlug?: string): Promise<{
    role: string;
    provider: string;
    model: string;
    profile: string;
  }>;
  validateProviderModel(provider: string, model: string, settings?: Settings): {
    valid: boolean;
    error?: string;
  };
  validateProfile(profile: string, settings?: Settings): { valid: boolean; error?: string };
}

export interface QueueServiceOptions {
  now?: () => number;
  pathExists?: (absolutePath: string) => Promise<boolean>;
  promptForValidation?: (taskPath: string, validation: ValidationResult) => Promise<void>;
}

interface EnqueueIntent {
  scope: QueueScope;
  projectSlug?: string;
}

type QueueEventMap = {
  state: [taskId: string, state: RunState, timestamp: number];
  queue: [snapshot: QueueSnapshot];
  stateChange: [event: QueueStateChangeEvent];
};

const hasValue = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const inferProjectSlugFromPath = (taskPath: string): string | undefined => {
  const normalized = taskPath.replace(/\\/g, '/');
  const marker = '/.kanban2code/projects/';
  const markerIndex = normalized.indexOf(marker);
  if (markerIndex === -1) {
    return undefined;
  }

  const remainder = normalized.slice(markerIndex + marker.length);
  const [projectSlug] = remainder.split('/');
  return hasValue(projectSlug) ? projectSlug.trim() : undefined;
};

const isTerminalState = (state: RunState): boolean =>
  state === 'success' || state === 'failed' || state === 'cancelled';

const isAllowedStateTransition = (from: RunState | undefined, to: RunState): boolean => {
  if (!from) {
    return true;
  }

  if (from === to) {
    return true;
  }

  if (from === 'queued') {
    return to === 'running' || to === 'cancelled';
  }

  if (from === 'running') {
    return to === 'success' || to === 'failed' || to === 'cancelled';
  }

  if (from === 'failed') {
    return to === 'queued';
  }

  return false;
};

class TypedQueueEmitter {
  private readonly emitter = new EventEmitter();

  on<K extends keyof QueueEventMap>(event: K, listener: (...args: QueueEventMap[K]) => void): void {
    this.emitter.on(event, listener);
  }

  off<K extends keyof QueueEventMap>(event: K, listener: (...args: QueueEventMap[K]) => void): void {
    this.emitter.off(event, listener);
  }

  emit<K extends keyof QueueEventMap>(event: K, ...args: QueueEventMap[K]): void {
    this.emitter.emit(event, ...args);
  }

  removeAllListeners(): void {
    this.emitter.removeAllListeners();
  }
}

export class QueueService {
  private readonly queue: QueueItem[] = [];
  private readonly stateByTaskId = new Map<string, RunState>();
  private readonly pendingRunIntents = new Map<string, EnqueueIntent>();
  private readonly runningTaskIds = new Set<string>();
  private readonly cancellationRequested = new Set<string>();
  private readonly emitter = new TypedQueueEmitter();

  constructor(
    private readonly workspaceRoot: string,
    private readonly taskService: QueueTaskServiceLike,
    private readonly settingsService: QueueSettingsServiceLike,
    private readonly options: QueueServiceOptions = {}
  ) {}

  async enqueue(taskId: string, scope: QueueScope, projectSlug?: string): Promise<QueueOperationResult> {
    if (this.isDuplicate(taskId)) {
      return { ok: false, reason: 'duplicate' };
    }

    const task = await this.taskService.readTask(taskId);
    const resolvedProjectSlug = projectSlug ?? task.frontmatter.project ?? inferProjectSlugFromPath(taskId);
    const settings = await this.settingsService.getSettings(resolvedProjectSlug);

    const hydratedTask = await this.applyExecutionDefaults(taskId, task, resolvedProjectSlug);
    const validation = await this.validateTaskForRun(hydratedTask.frontmatter, settings);
    if (!validation.valid) {
      this.pendingRunIntents.set(taskId, { scope, projectSlug: resolvedProjectSlug });

      if (settings.queueAndExecution.promptMissingFields && this.options.promptForValidation) {
        await this.options.promptForValidation(taskId, validation);
      }

      return {
        ok: false,
        reason: 'validation_failed',
        validation
      };
    }

    this.pendingRunIntents.delete(taskId);

    const item: QueueItem = {
      taskId,
      taskPath: taskId,
      scope,
      state: 'queued',
      enqueuedAt: this.now()
    };

    this.queue.push(item);
    this.transition(taskId, 'queued');
    this.emitQueueChange();

    return { ok: true, item };
  }

  async dequeue(): Promise<QueueItem | null> {
    const maxParallelRuns = await this.getMaxParallelRuns();
    if (this.runningTaskIds.size >= maxParallelRuns) {
      return null;
    }

    const item = this.queue.shift() ?? null;
    if (!item) {
      return null;
    }

    this.emitQueueChange();
    return item;
  }

  peek(): QueueItem | null {
    return this.queue[0] ?? null;
  }

  setState(taskId: string, state: RunState): boolean {
    return this.transition(taskId, state);
  }

  cancel(taskId: string): boolean {
    const queuedIndex = this.queue.findIndex((item) => item.taskId === taskId);
    if (queuedIndex >= 0) {
      this.queue.splice(queuedIndex, 1);
      this.transition(taskId, 'cancelled');
      this.emitQueueChange();
      return true;
    }

    if (this.runningTaskIds.has(taskId)) {
      this.cancellationRequested.add(taskId);
      this.transition(taskId, 'cancelled');
      this.emitQueueChange();
      return true;
    }

    return false;
  }

  async retry(taskId: string, scope: QueueScope = 'stage'): Promise<QueueOperationResult> {
    const state = this.stateByTaskId.get(taskId);
    if (state !== 'failed') {
      return { ok: false, reason: 'invalid_state' };
    }

    return this.enqueue(taskId, scope);
  }

  async runStage(taskId: string): Promise<QueueOperationResult> {
    return this.enqueue(taskId, 'stage');
  }

  async runAllStages(taskId: string): Promise<QueueOperationResult> {
    return this.enqueue(taskId, 'all');
  }

  cancelRun(taskId: string): boolean {
    return this.cancel(taskId);
  }

  async retryRun(taskId: string): Promise<QueueOperationResult> {
    return this.retry(taskId, 'stage');
  }

  async handleOperation(operation: QueueOperation, taskId: string): Promise<QueueOperationResult | boolean> {
    if (operation === 'RunStage') {
      return this.runStage(taskId);
    }
    if (operation === 'RunAllStages') {
      return this.runAllStages(taskId);
    }
    if (operation === 'RetryRun') {
      return this.retryRun(taskId);
    }

    return this.cancelRun(taskId);
  }

  getSnapshot(): QueueSnapshot {
    return {
      items: this.queue.map((item) => ({ ...item })),
      activeTaskId: this.runningTaskIds.values().next().value ?? null,
      totalQueued: this.queue.length
    };
  }

  onDidStateChange(listener: (taskId: string, state: RunState, timestamp: number) => void): () => void {
    this.emitter.on('state', listener);
    return () => {
      this.emitter.off('state', listener);
    };
  }

  onDidQueueChange(listener: () => void): () => void {
    const wrapped = (): void => listener();
    this.emitter.on('queue', wrapped);
    return () => {
      this.emitter.off('queue', wrapped);
    };
  }

  onDidRunnerStateChange(listener: (event: QueueStateChangeEvent) => void): { dispose: () => void } {
    this.emitter.on('stateChange', listener);
    return {
      dispose: () => {
        this.emitter.off('stateChange', listener);
      }
    };
  }

  onDidQueueSnapshotChange(listener: () => void): { dispose: () => void } {
    const wrapped = (): void => listener();
    this.emitter.on('queue', wrapped);
    return {
      dispose: () => {
        this.emitter.off('queue', wrapped);
      }
    };
  }

  isCancellationRequested(taskId: string): boolean {
    return this.cancellationRequested.has(taskId);
  }

  consumeCancellation(taskId: string): boolean {
    const exists = this.cancellationRequested.has(taskId);
    this.cancellationRequested.delete(taskId);
    return exists;
  }

  async handleTaskSaved(taskId: string): Promise<void> {
    const pendingIntent = this.pendingRunIntents.get(taskId);
    if (!pendingIntent) {
      return;
    }

    const settings = await this.settingsService.getSettings(pendingIntent.projectSlug);
    if (!settings.queueAndExecution.autoResumeOnSave) {
      return;
    }

    await this.enqueue(taskId, pendingIntent.scope, pendingIntent.projectSlug);
  }

  dispose(): void {
    this.queue.length = 0;
    this.stateByTaskId.clear();
    this.pendingRunIntents.clear();
    this.runningTaskIds.clear();
    this.cancellationRequested.clear();
    this.emitter.removeAllListeners();
  }

  private async getMaxParallelRuns(): Promise<number> {
    const settings = await this.settingsService.getSettings();
    const configured = settings.queueAndExecution.maxParallelRuns;
    if (typeof configured !== 'number' || !Number.isFinite(configured)) {
      return 1;
    }
    return Math.max(1, Math.floor(configured));
  }

  private isDuplicate(taskId: string): boolean {
    return this.runningTaskIds.has(taskId) || this.queue.some((item) => item.taskId === taskId);
  }

  private transition(taskId: string, nextState: RunState): boolean {
    const previousState = this.stateByTaskId.get(taskId);

    if (!isAllowedStateTransition(previousState, nextState)) {
      if (previousState && isTerminalState(previousState)) {
        return false;
      }
      return false;
    }

    this.stateByTaskId.set(taskId, nextState);

    if (nextState === 'running') {
      this.runningTaskIds.add(taskId);
      this.cancellationRequested.delete(taskId);
    }

    if (nextState !== 'running') {
      this.runningTaskIds.delete(taskId);
      if (nextState !== 'cancelled') {
        this.cancellationRequested.delete(taskId);
      }
    }

    const timestamp = this.now();
    const event: QueueStateChangeEvent = {
      taskId,
      oldState: previousState ?? null,
      state: nextState,
      newState: nextState,
      timestamp
    };

    this.emitter.emit('state', taskId, nextState, timestamp);
    this.emitter.emit('stateChange', event);
    return true;
  }

  private emitQueueChange(): void {
    this.emitter.emit('queue', this.getSnapshot());
  }

  private now(): number {
    return typeof this.options.now === 'function' ? this.options.now() : Date.now();
  }

  private async applyExecutionDefaults(
    taskPath: string,
    task: Task,
    projectSlug?: string
  ): Promise<Task> {
    const mapping = await this.settingsService.getEffectiveMapping(task.frontmatter.stage, projectSlug);
    const updates: TaskUpdateInput = {};

    if (!hasValue(task.frontmatter.role)) {
      updates.role = mapping.role;
    }
    if (!hasValue(task.frontmatter.provider)) {
      updates.provider = mapping.provider;
    }
    if (!hasValue(task.frontmatter.model)) {
      updates.model = mapping.model;
    }
    if (!hasValue(task.frontmatter.profile)) {
      updates.profile = mapping.profile;
    }

    if (Object.keys(updates).length === 0) {
      return task;
    }

    return this.taskService.updateTask(taskPath, updates);
  }

  private async validateTaskForRun(frontmatter: TaskFrontmatter, settings: Settings): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const missingRequiredFields: Array<'title' | 'stage' | 'role'> = [];

    if (!hasValue(frontmatter.title)) {
      errors.push({ field: 'title', message: 'Task title is required before run.' });
      missingRequiredFields.push('title');
    }

    if (!hasValue(frontmatter.stage) || frontmatter.stage === 'unknown') {
      errors.push({ field: 'stage', message: 'Task stage is required before run.' });
      missingRequiredFields.push('stage');
    }

    if (!hasValue(frontmatter.role)) {
      errors.push({ field: 'role', message: 'Task role is required before run.' });
      missingRequiredFields.push('role');
    }

    const provider = frontmatter.provider?.trim();
    const model = frontmatter.model?.trim();
    if (!provider || !model) {
      errors.push({ field: 'provider', message: 'Provider and model must be configured before run.' });
      if (!model) {
        errors.push({ field: 'model', message: 'Model must be configured before run.' });
      }
    } else {
      const providerValidation = this.settingsService.validateProviderModel(provider, model, settings);
      if (!providerValidation.valid && providerValidation.error) {
        errors.push({ field: 'provider', message: providerValidation.error });
      }
    }

    const profile = frontmatter.profile?.trim();
    if (!profile) {
      errors.push({ field: 'profile', message: 'Profile must be configured before run.' });
    } else {
      const profileValidation = this.settingsService.validateProfile(profile, settings);
      if (!profileValidation.valid && profileValidation.error) {
        errors.push({ field: 'profile', message: profileValidation.error });
      } else {
        const profileConfig = settings.providersAndModels.profiles[profile];
        if (
          profileConfig &&
          provider &&
          model &&
          (profileConfig.provider !== provider || profileConfig.model !== model)
        ) {
          errors.push({
            field: 'profile',
            message: `Profile '${profile}' expects '${profileConfig.provider}/${profileConfig.model}'.`
          });
        }
      }
    }

    const unavailableContexts = await this.findUnavailableContexts(frontmatter.contexts);
    if (unavailableContexts.length > 0) {
      errors.push({
        field: 'contexts',
        message: `Unavailable context(s): ${unavailableContexts.join(', ')}.`
      });
    }

    const unavailableSkills = await this.findUnavailableSkills(frontmatter.skills);
    if (unavailableSkills.length > 0) {
      errors.push({
        field: 'skills',
        message: `Unavailable skill(s): ${unavailableSkills.join(', ')}.`
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      missingRequiredFields
    };
  }

  private async findUnavailableContexts(contexts: readonly string[]): Promise<string[]> {
    const unavailable: string[] = [];

    for (const raw of contexts) {
      const name = raw.trim();
      if (!name) {
        continue;
      }

      const candidates = this.resolveContextCandidates(name);
      let exists = false;
      for (const candidate of candidates) {
        if (await this.pathExists(candidate)) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        unavailable.push(name);
      }
    }

    return unavailable;
  }

  private async findUnavailableSkills(skills: readonly string[]): Promise<string[]> {
    const unavailable: string[] = [];

    for (const raw of skills) {
      const name = raw.trim();
      if (!name) {
        continue;
      }

      const normalized = name.endsWith('.md') ? name : `${name}.md`;
      const skillPath = path.join(this.workspaceRoot, '.kanban2code', '_context', 'skills', normalized);
      if (!(await this.pathExists(skillPath))) {
        unavailable.push(name);
      }
    }

    return unavailable;
  }

  private resolveContextCandidates(name: string): string[] {
    const normalized = name.endsWith('.md') ? name : `${name}.md`;
    return [
      path.join(this.workspaceRoot, '.kanban2code', '_context', normalized),
      path.join(this.workspaceRoot, '.kanban2code', '_context', 'skills', normalized)
    ];
  }

  private async pathExists(absolutePath: string): Promise<boolean> {
    if (this.options.pathExists) {
      return this.options.pathExists(absolutePath);
    }

    try {
      await access(absolutePath);
      return true;
    } catch {
      return false;
    }
  }
}

export type { QueueScope, RunState };
export type QueueStateManagement = QueueState;
