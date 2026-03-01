import * as path from 'node:path';
import { access } from 'node:fs/promises';
import { EventEmitter } from 'node:events';
import type { SettingsService } from './settings-service';
import type { TaskService } from './task-service';
import type { QueueItem, QueueScope, RunState, ValidationError, ValidationResult } from '../types/runner';
import type { Task, TaskFrontmatter } from '../types/task';

interface QueueServiceDeps {
  now?: () => number;
  pathExists?: (absolutePath: string) => Promise<boolean>;
  promptForValidation?: (taskPath: string, validation: ValidationResult) => Promise<void> | void;
}

interface PendingRunIntent {
  scope: QueueScope;
  projectSlug?: string;
}

export interface EnqueueResult {
  ok: boolean;
  item?: QueueItem;
  reason?: 'duplicate' | 'validation_failed';
  validation?: ValidationResult;
}

export interface QueueSnapshot {
  items: QueueItem[];
  activeTaskId: string | null;
  totalQueued: number;
}

const hasValue = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const toTaskId = (taskPath: string): string => taskPath.replace(/\\/g, '/').split('/').pop()?.replace(/\.md$/i, '') ?? taskPath;

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

export class QueueService {
  private readonly queue: QueueItem[] = [];
  private readonly stateByTaskId = new Map<string, RunState>();
  private readonly pendingRunIntents = new Map<string, PendingRunIntent>();
  private activeTaskId: string | null = null;
  private readonly emitter = new EventEmitter();

  constructor(
    private readonly workspaceRoot: string,
    private readonly taskService: Pick<TaskService, 'readTask' | 'updateTask'>,
    private readonly settingsService: Pick<
      SettingsService,
      'getSettings' | 'getEffectiveMapping' | 'validateProviderModel' | 'validateProfile'
    >,
    private readonly deps: QueueServiceDeps = {}
  ) {}

  dispose(): void {
    this.emitter.removeAllListeners();
  }

  onDidStateChange(listener: (taskId: string, state: RunState, timestamp: number) => void): () => void {
    this.emitter.on('state', listener);
    return () => this.emitter.off('state', listener);
  }

  onDidQueueChange(listener: (snapshot: QueueSnapshot) => void): () => void {
    this.emitter.on('queue', listener);
    return () => this.emitter.off('queue', listener);
  }

  onDidRunnerStateChange(
    listener: (event: { taskId: string; state: RunState; timestamp: number }) => void
  ): { dispose(): void } {
    const unsubscribe = this.onDidStateChange((taskId, state, timestamp) => {
      listener({ taskId, state, timestamp });
    });
    return { dispose: unsubscribe };
  }

  onDidQueueSnapshotChange(listener: (snapshot: QueueSnapshot) => void): { dispose(): void } {
    const unsubscribe = this.onDidQueueChange(listener);
    return { dispose: unsubscribe };
  }

  onDidRunnerStateChange(
    listener: (event: { taskId: string; state: RunState; timestamp: number }) => void
  ): { dispose: () => void } {
    const unsubscribe = this.onDidStateChange((taskId, state, timestamp) =>
      listener({ taskId, state, timestamp })
    );
    return { dispose: unsubscribe };
  }

  onDidQueueSnapshotChange(listener: () => void): { dispose: () => void } {
    const unsubscribe = this.onDidQueueChange(() => listener());
    return { dispose: unsubscribe };
  }

  async enqueue(taskPath: string, scope: QueueScope, projectSlug?: string): Promise<EnqueueResult> {
    const taskId = toTaskId(taskPath);
    if (this.isDuplicate(taskId)) {
      return { ok: false, reason: 'duplicate' };
    }

    const task = await this.taskService.readTask(taskPath);
    const resolvedProjectSlug = projectSlug ?? task.frontmatter.project ?? inferProjectSlugFromPath(taskPath);
    const effectiveSettings = await this.settingsService.getSettings(resolvedProjectSlug);
    const hydratedTask = await this.applyExecutionDefaults(taskPath, task, resolvedProjectSlug);
    const validation = await this.validateTaskForRun(hydratedTask.frontmatter, effectiveSettings);

    if (!validation.valid) {
      this.pendingRunIntents.set(taskPath, { scope, projectSlug: resolvedProjectSlug });
      if (effectiveSettings.queueAndExecution.promptMissingFields && this.deps.promptForValidation) {
        await this.deps.promptForValidation(taskPath, validation);
      }
      return { ok: false, reason: 'validation_failed', validation };
    }

    this.pendingRunIntents.delete(taskPath);

    const item: QueueItem = {
      taskId,
      taskPath,
      scope,
      state: 'queued',
      enqueuedAt: this.now()
    };

    this.queue.push(item);
    this.transition(taskId, 'queued');
    this.emitQueueSnapshot();
    return { ok: true, item };
  }

  async runTask(taskPath: string, scope: QueueScope): Promise<EnqueueResult> {
    return this.enqueue(taskPath, scope);
  }

  async queueTask(taskPath: string, scope: QueueScope): Promise<EnqueueResult> {
    return this.enqueue(taskPath, scope);
  }

  dequeue(): QueueItem | null {
    const item = this.queue.shift() ?? null;
    this.emitQueueSnapshot();
    return item;
  }

  cancel(taskId: string): boolean {
    const index = this.queue.findIndex((item) => item.taskId === taskId);
    if (index >= 0) {
      this.queue.splice(index, 1);
      this.transition(taskId, 'cancelled');
      this.emitQueueSnapshot();
      return true;
    }

    if (this.activeTaskId === taskId) {
      this.activeTaskId = null;
      this.transition(taskId, 'cancelled');
      this.emitQueueSnapshot();
      return true;
    }

    return false;
  }

  cancelTask(taskId: string): boolean {
    return this.cancel(taskId);
  }

  retry(taskPath: string, scope: QueueScope = 'stage'): Promise<EnqueueResult> {
    const taskId = toTaskId(taskPath);
    if (this.stateByTaskId.get(taskId) !== 'failed') {
      return Promise.resolve({ ok: false, reason: 'validation_failed' });
    }

    return this.enqueue(taskPath, scope);
  }

  async queueTask(taskPath: string, scope: QueueScope): Promise<EnqueueResult> {
    return this.enqueue(taskPath, scope);
  }

  async runTask(taskPath: string, scope: QueueScope): Promise<EnqueueResult> {
    const result = await this.enqueue(taskPath, scope);
    if (!result.ok) {
      return result;
    }

    const next = this.dequeue();
    if (!next) {
      return result;
    }

    this.markRunning(next.taskId);
    this.markCompleted(next.taskId, true);
    return result;
  }

  cancelTask(taskId: string): boolean {
    return this.cancel(taskId);
  }

  retryTask(taskPath: string, scope: QueueScope = 'stage'): Promise<EnqueueResult> {
    return this.retry(taskPath, scope);
  }

  retryTask(taskPath: string, scope: QueueScope = 'stage'): Promise<EnqueueResult> {
    return this.retry(taskPath, scope);
  }

  markRunning(taskId: string): void {
    this.activeTaskId = taskId;
    this.transition(taskId, 'running');
    this.emitQueueSnapshot();
  }

  markCompleted(taskId: string, success: boolean): void {
    if (this.activeTaskId === taskId) {
      this.activeTaskId = null;
    }
    this.transition(taskId, success ? 'success' : 'failed');
    this.emitQueueSnapshot();
  }

  getSnapshot(): QueueSnapshot {
    return {
      items: [...this.queue],
      activeTaskId: this.activeTaskId,
      totalQueued: this.queue.length
    };
  }

  async handleTaskSaved(taskPath: string): Promise<void> {
    const pending = this.pendingRunIntents.get(taskPath);
    if (!pending) {
      return;
    }

    const settings = await this.settingsService.getSettings(pending.projectSlug);
    if (!settings.queueAndExecution.autoResumeOnSave) {
      return;
    }

    await this.enqueue(taskPath, pending.scope, pending.projectSlug);
  }

  dispose(): void {
    this.emitter.removeAllListeners();
    this.queue.length = 0;
    this.stateByTaskId.clear();
    this.pendingRunIntents.clear();
    this.activeTaskId = null;
  }

  private async applyExecutionDefaults(taskPath: string, task: Task, projectSlug?: string): Promise<Task> {
    const mapping = await this.settingsService.getEffectiveMapping(task.frontmatter.stage, projectSlug);
    const updates: Partial<TaskFrontmatter> = {};

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

    const updatedTask = await this.taskService.updateTask(taskPath, updates);
    return updatedTask;
  }

  private async validateTaskForRun(
    frontmatter: TaskFrontmatter,
    settings: Awaited<ReturnType<SettingsService['getSettings']>>
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const missingRequiredFields: ValidationResult['missingRequiredFields'] = [];

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
      const providerModelValidation = this.settingsService.validateProviderModel(provider, model, settings);
      if (!providerModelValidation.valid && providerModelValidation.error) {
        errors.push({ field: 'provider', message: providerModelValidation.error });
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

  private async findUnavailableContexts(contexts: string[]): Promise<string[]> {
    const unavailable: string[] = [];
    for (const entry of contexts) {
      const name = entry.trim();
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

  private async findUnavailableSkills(skills: string[]): Promise<string[]> {
    const unavailable: string[] = [];
    for (const entry of skills) {
      const name = entry.trim();
      if (!name) {
        continue;
      }

      const skillPath = path.join(this.workspaceRoot, '.kanban2code', '_context', 'skills', `${name}.md`);
      if (!(await this.pathExists(skillPath))) {
        unavailable.push(name);
      }
    }
    return unavailable;
  }

  private resolveContextCandidates(name: string): string[] {
    const normalizedName = name.endsWith('.md') ? name : `${name}.md`;
    return [
      path.join(this.workspaceRoot, '.kanban2code', '_context', normalizedName),
      path.join(this.workspaceRoot, '.kanban2code', '_context', 'skills', normalizedName)
    ];
  }

  private isDuplicate(taskId: string): boolean {
    return this.activeTaskId === taskId || this.queue.some((item) => item.taskId === taskId);
  }

  private transition(taskId: string, state: RunState): void {
    this.stateByTaskId.set(taskId, state);
    this.emitter.emit('state', taskId, state, this.now());
  }

  private emitQueueSnapshot(): void {
    this.emitter.emit('queue', this.getSnapshot());
  }

  private now(): number {
    return typeof this.deps.now === 'function' ? this.deps.now() : Date.now();
  }

  private async pathExists(absolutePath: string): Promise<boolean> {
    if (this.deps.pathExists) {
      return this.deps.pathExists(absolutePath);
    }

    try {
      await access(absolutePath);
      return true;
    } catch {
      return false;
    }
  }
}
