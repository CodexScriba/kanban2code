import * as path from 'node:path';
import { parseTaskMarkdown } from './frontmatter-service';
import type { Priority, TaskSnapshotItem, TaskStage } from '../types/task';

interface UriLike {
  fsPath: string;
}

interface DisposableLike {
  dispose(): void;
}

interface EventLike<T> {
  (listener: (event: T) => unknown): DisposableLike;
}

interface EventEmitterLike<T> extends DisposableLike {
  readonly event: EventLike<T>;
  fire(data: T): void;
}

interface FileSystemWatcherLike extends DisposableLike {
  onDidCreate(listener: (uri: UriLike) => unknown): DisposableLike;
  onDidChange(listener: (uri: UriLike) => unknown): DisposableLike;
  onDidDelete(listener: (uri: UriLike) => unknown): DisposableLike;
}

export interface TaskScannerRuntime {
  findFiles(globPattern: string): PromiseLike<UriLike[]>;
  readFile(uri: UriLike): PromiseLike<Uint8Array>;
  toRelativePath(uri: UriLike): string;
  createWatcher(globPattern: string): FileSystemWatcherLike;
  createEventEmitter<T>(): EventEmitterLike<T>;
}

export interface TaskScanFilters {
  stage?: TaskStage | 'all';
  priority?: Priority | 'all';
  project?: string;
  search?: string;
}

export interface TaskScanOptions {
  filters?: TaskScanFilters;
}

const INBOX_GLOB = '.kanban2code/inbox/**/*.md';
const PROJECT_GLOB = '.kanban2code/projects/**/*.md';
const WATCH_GLOB = '.kanban2code/**/*.md';

const normalizeToPosix = (value: string): string => value.split(path.sep).join(path.posix.sep);

const normalizePriority = (value: unknown): Priority | undefined => {
  if (value === 'high' || value === 'medium' || value === 'low') {
    return value;
  }

  return undefined;
};

const normalizeOrder = (value: unknown): number | undefined => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined;
  }

  return value;
};

const toSearchable = (value: string): string => value.trim().toLowerCase();

const getTitleFromBody = (body: string): string | undefined => {
  const headingMatch = body.match(/^#\s+(.+)$/m);
  if (!headingMatch) {
    return undefined;
  }

  const heading = headingMatch[1]?.trim();
  return heading && heading.length > 0 ? heading : undefined;
};

const getDescriptionFromBody = (body: string): string | undefined => {
  const paragraphs = body
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter((paragraph) => paragraph.length > 0);

  for (const paragraph of paragraphs) {
    if (paragraph.startsWith('#')) {
      continue;
    }

    const normalized = paragraph.replace(/^[-*+]\s+/, '').trim();
    if (normalized.length === 0) {
      continue;
    }

    return normalized.length > 120 ? `${normalized.slice(0, 117)}...` : normalized;
  }

  return undefined;
};

const extractCreatedAt = (taskId: string): number => {
  const match = taskId.match(/^(\d+)-/);
  if (!match) {
    return 0;
  }

  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const extractProjectFromPath = (relativePath: string): string | undefined => {
  const match = relativePath.match(/^\.kanban2code\/projects\/([^/]+)\//);
  return match?.[1];
};

const sortByCreatedAt = (tasks: TaskSnapshotItem[]): TaskSnapshotItem[] => {
  return [...tasks].sort((left, right) => {
    if (left.createdAt !== right.createdAt) {
      return right.createdAt - left.createdAt;
    }

    const taskIdCompare = left.taskId.localeCompare(right.taskId);
    if (taskIdCompare !== 0) {
      return taskIdCompare;
    }

    return left.id.localeCompare(right.id);
  });
};

export class TaskScanner implements DisposableLike {
  private readonly refreshEmitter = this.runtime.createEventEmitter<void>();
  private readonly watcher: FileSystemWatcherLike;
  private readonly disposables: DisposableLike[] = [];
  private cachedTasks: TaskSnapshotItem[] | null = null;

  public readonly onDidRefresh = this.refreshEmitter.event;

  constructor(private readonly runtime: TaskScannerRuntime) {
    this.watcher = this.runtime.createWatcher(WATCH_GLOB);
    this.disposables.push(
      this.watcher.onDidCreate(() => this.handleWorkspaceMutation()),
      this.watcher.onDidChange(() => this.handleWorkspaceMutation()),
      this.watcher.onDidDelete(() => this.handleWorkspaceMutation())
    );
  }

  async scan(options: TaskScanOptions = {}): Promise<TaskSnapshotItem[]> {
    if (!this.cachedTasks) {
      this.cachedTasks = await this.readWorkspaceTasks();
    }

    const filtered = this.applyFilters(this.cachedTasks, options.filters);
    return sortByCreatedAt(filtered);
  }

  dispose(): void {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    this.watcher.dispose();
    this.refreshEmitter.dispose();
  }

  invalidateCache(): void {
    this.cachedTasks = null;
  }

  private handleWorkspaceMutation(): void {
    this.invalidateCache();
    this.refreshEmitter.fire();
  }

  private applyFilters(tasks: TaskSnapshotItem[], filters?: TaskScanFilters): TaskSnapshotItem[] {
    if (!filters) {
      return tasks;
    }

    let filtered = tasks;

    if (filters.stage && filters.stage !== 'all') {
      filtered = filtered.filter((task) => task.stage === filters.stage);
    }

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    if (filters.project && filters.project !== 'all') {
      filtered = filtered.filter((task) => task.project === filters.project);
    }

    if (filters.search && filters.search.trim().length > 0) {
      const search = toSearchable(filters.search);
      filtered = filtered.filter((task) => {
        const title = toSearchable(task.title);
        const taskId = toSearchable(task.taskId);
        const tags = task.tags.map((tag) => toSearchable(tag));
        return title.includes(search) || taskId.includes(search) || tags.some((tag) => tag.includes(search));
      });
    }

    return filtered;
  }

  private async readWorkspaceTasks(): Promise<TaskSnapshotItem[]> {
    const [inboxUris, projectUris] = await Promise.all([
      this.runtime.findFiles(INBOX_GLOB),
      this.runtime.findFiles(PROJECT_GLOB)
    ]);
    const taskUris = [...inboxUris, ...projectUris];

    const tasks = await Promise.all(taskUris.map((uri) => this.readTask(uri)));
    return tasks.filter((task): task is TaskSnapshotItem => task !== null);
  }

  private async readTask(uri: UriLike): Promise<TaskSnapshotItem | null> {
    try {
      const raw = await this.runtime.readFile(uri);
      const content = Buffer.from(raw).toString('utf8');
      const parsed = parseTaskMarkdown(content);
      const relativePath = normalizeToPosix(this.runtime.toRelativePath(uri));
      const id = relativePath;
      const taskId = path.posix.basename(relativePath, '.md');
      const fallbackTitle = getTitleFromBody(parsed.body) ?? taskId;
      const title =
        typeof parsed.frontmatter.title === 'string' && parsed.frontmatter.title.trim().length > 0
          ? parsed.frontmatter.title.trim()
          : fallbackTitle;

      const project =
        typeof parsed.frontmatter.project === 'string' && parsed.frontmatter.project.trim().length > 0
          ? parsed.frontmatter.project.trim()
          : extractProjectFromPath(relativePath);

      return {
        id,
        taskId,
        title,
        description: getDescriptionFromBody(parsed.body),
        stage: parsed.frontmatter.stage,
        order: normalizeOrder(parsed.frontmatter.order),
        priority: normalizePriority(parsed.frontmatter.priority),
        role:
          typeof parsed.frontmatter.role === 'string'
            ? parsed.frontmatter.role
            : typeof parsed.frontmatter.agent === 'string'
              ? parsed.frontmatter.agent
              : undefined,
        project,
        tags: [...parsed.frontmatter.tags],
        createdAt: extractCreatedAt(taskId)
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Skipping task file ${uri.fsPath}: ${message}`);
      return null;
    }
  }
}

export const __internal = {
  extractCreatedAt,
  sortByCreatedAt
};
