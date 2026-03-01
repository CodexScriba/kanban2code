import * as path from 'path';
import { parseTaskMarkdown, serializeTaskMarkdown } from './frontmatter-service';
import type { Task, TaskCreateInput, TaskFrontmatter, TaskStage, TaskUpdateInput } from '../types/task';

interface UriLike {
  fsPath: string;
}

interface WorkspaceFileSystem {
  readFile(uri: UriLike): Thenable<Uint8Array>;
  writeFile(uri: UriLike, content: Uint8Array): Thenable<void>;
  delete(uri: UriLike): Thenable<void>;
  createDirectory(uri: UriLike): Thenable<void>;
  rename?(source: UriLike, target: UriLike, options?: { overwrite?: boolean }): Thenable<void>;
  stat?(uri: UriLike): Thenable<{ type: number; ctime: number; mtime: number; size: number }>;
}

interface TaskServiceOptions {
  fs?: WorkspaceFileSystem;
  toFileUri?: (filePath: string) => UriLike;
  now?: () => number;
}

interface RuntimeDependencies {
  fs: WorkspaceFileSystem;
  toFileUri: (filePath: string) => UriLike;
}

const FILE_NAME_MAX_SLUG_LENGTH = 50;
const DEFAULT_STAGE: TaskStage = 'inbox';
const DEFAULT_BODY = '';

const hasValue = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const normalizeStringArray = (value?: readonly string[]): string[] => (Array.isArray(value) ? [...value] : []);

const toKebabCase = (value: string): string => {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!normalized) {
    return 'untitled';
  }

  return normalized.slice(0, FILE_NAME_MAX_SLUG_LENGTH).replace(/-+$/g, '') || 'untitled';
};

const cloneFrontmatter = (frontmatter: TaskFrontmatter): TaskFrontmatter => ({
  ...frontmatter,
  tags: [...frontmatter.tags],
  contexts: [...frontmatter.contexts],
  skills: [...frontmatter.skills]
});

export class TaskService {
  private runtimeDependencies?: RuntimeDependencies;

  constructor(
    private readonly workspaceRoot: string,
    private readonly options: TaskServiceOptions = {}
  ) {}

  async createTask(data: TaskCreateInput): Promise<Task> {
    const deps = await this.getRuntimeDependencies();
    const stage = data.stage ?? DEFAULT_STAGE;
    const body = data.body ?? DEFAULT_BODY;
    const title = hasValue(data.title) ? data.title.trim() : undefined;
    const slug = toKebabCase(title ?? 'untitled');
    const timestamp = this.getNow();

    const directory = this.resolveDirectory(data.projectSlug);
    const relativePath = await this.buildUniqueTaskPath(directory, `${timestamp}-${slug}`, deps);

    const task: Task = {
      frontmatter: {
        stage,
        order: data.order,
        title,
        role: data.role,
        agent: data.agent,
        provider: data.provider,
        model: data.model,
        profile: data.profile,
        priority: data.priority,
        tags: normalizeStringArray(data.tags),
        contexts: normalizeStringArray(data.contexts),
        skills: normalizeStringArray(data.skills),
        project: data.project,
        phase: data.phase
      },
      body
    };

    await this.writeTask(relativePath, task, deps);
    return task;
  }

  async readTask(filePath: string): Promise<Task> {
    const deps = await this.getRuntimeDependencies();
    const uri = deps.toFileUri(this.toAbsolutePath(filePath));

    try {
      const raw = await deps.fs.readFile(uri);
      return parseTaskMarkdown(Buffer.from(raw).toString('utf-8'));
    } catch {
      throw new Error(`Task file not found: ${filePath}`);
    }
  }

  async updateTask(filePath: string, changes: TaskUpdateInput): Promise<Task> {
    const existing = await this.readTask(filePath);
    const nextFrontmatter = cloneFrontmatter(existing.frontmatter);

    if (changes.stage !== undefined) nextFrontmatter.stage = changes.stage;
    if (changes.order !== undefined) nextFrontmatter.order = changes.order;
    if (changes.title !== undefined) nextFrontmatter.title = changes.title;
    if (changes.role !== undefined) nextFrontmatter.role = changes.role;
    if (changes.agent !== undefined) nextFrontmatter.agent = changes.agent;
    if (changes.provider !== undefined) nextFrontmatter.provider = changes.provider;
    if (changes.model !== undefined) nextFrontmatter.model = changes.model;
    if (changes.profile !== undefined) nextFrontmatter.profile = changes.profile;
    if (changes.priority !== undefined) nextFrontmatter.priority = changes.priority;
    if (changes.tags !== undefined) nextFrontmatter.tags = normalizeStringArray(changes.tags);
    if (changes.contexts !== undefined) nextFrontmatter.contexts = normalizeStringArray(changes.contexts);
    if (changes.skills !== undefined) nextFrontmatter.skills = normalizeStringArray(changes.skills);
    if (changes.project !== undefined) nextFrontmatter.project = changes.project;
    if (changes.phase !== undefined) nextFrontmatter.phase = changes.phase;

    const updated: Task = {
      frontmatter: nextFrontmatter,
      body: changes.body !== undefined ? changes.body : existing.body
    };

    const deps = await this.getRuntimeDependencies();
    await this.writeTask(filePath, updated, deps);
    return updated;
  }

  async deleteTask(filePath: string): Promise<void> {
    const deps = await this.getRuntimeDependencies();
    const uri = deps.toFileUri(this.toAbsolutePath(filePath));

    try {
      await deps.fs.delete(uri);
    } catch {
      throw new Error(`Task file not found: ${filePath}`);
    }
  }

  async moveTask(filePath: string, newStage: TaskStage, projectSlug?: string): Promise<Task> {
    const deps = await this.getRuntimeDependencies();
    const task = await this.readTask(filePath);
    const nextTask: Task = {
      frontmatter: {
        ...cloneFrontmatter(task.frontmatter),
        stage: newStage,
        order: task.frontmatter.order
      },
      body: task.body
    };

    const currentDirectory = path.dirname(filePath);
    const targetDirectory = this.resolveDirectory(projectSlug);

    if (currentDirectory === targetDirectory) {
      await this.writeTask(filePath, nextTask, deps);
      return nextTask;
    }

    const baseName = path.basename(filePath, '.md');
    const targetPath = await this.buildUniqueTaskPath(targetDirectory, baseName, deps);

    await this.writeTask(targetPath, nextTask, deps);
    await this.deleteTask(filePath);

    return nextTask;
  }

  private resolveDirectory(projectSlug?: string): string {
    if (hasValue(projectSlug)) {
      return path.join('.kanban2code', 'projects', projectSlug.trim());
    }

    return path.join('.kanban2code', 'inbox');
  }

  private async writeTask(filePath: string, task: Task, deps: RuntimeDependencies): Promise<void> {
    const parentDirectory = path.dirname(filePath);
    const dirUri = deps.toFileUri(this.toAbsolutePath(parentDirectory));
    await deps.fs.createDirectory(dirUri);

    const fileUri = deps.toFileUri(this.toAbsolutePath(filePath));
    const content = serializeTaskMarkdown(task);
    await deps.fs.writeFile(fileUri, Buffer.from(content));
  }

  private async buildUniqueTaskPath(
    directory: string,
    baseName: string,
    deps: RuntimeDependencies
  ): Promise<string> {
    let counter = 0;

    while (true) {
      const suffix = counter === 0 ? '' : `-${counter}`;
      const candidate = path.join(directory, `${baseName}${suffix}.md`);

      if (!(await this.pathExists(candidate, deps))) {
        return candidate;
      }

      counter += 1;
    }
  }

  private async pathExists(filePath: string, deps: RuntimeDependencies): Promise<boolean> {
    const fileUri = deps.toFileUri(this.toAbsolutePath(filePath));

    if (typeof deps.fs.stat === 'function') {
      try {
        await deps.fs.stat(fileUri);
        return true;
      } catch {
        return false;
      }
    }

    try {
      await deps.fs.readFile(fileUri);
      return true;
    } catch {
      return false;
    }
  }

  private toAbsolutePath(relativePath: string): string {
    return path.join(this.workspaceRoot, relativePath);
  }

  private getNow(): number {
    return typeof this.options.now === 'function' ? this.options.now() : Date.now();
  }

  private async getRuntimeDependencies(): Promise<RuntimeDependencies> {
    if (this.runtimeDependencies) {
      return this.runtimeDependencies;
    }

    if (this.options.fs && this.options.toFileUri) {
      this.runtimeDependencies = {
        fs: this.options.fs,
        toFileUri: this.options.toFileUri
      };
      return this.runtimeDependencies;
    }

    const vscode = await import('vscode');
    this.runtimeDependencies = {
      fs: vscode.workspace.fs,
      toFileUri: vscode.Uri.file
    };
    return this.runtimeDependencies;
  }
}

export const __internal = {
  toKebabCase
};
