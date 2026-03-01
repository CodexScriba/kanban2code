import matter from 'gray-matter';
import type { Task, TaskFrontmatter, TaskStage } from '../types/task';

const STAGES: ReadonlySet<string> = new Set([
  'inbox',
  'capture',
  'plan',
  'code',
  'audit',
  'completed',
  'unknown'
]);

const createDefaultFrontmatter = (): TaskFrontmatter => ({
  stage: 'unknown',
  tags: [],
  contexts: [],
  skills: []
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string') {
    return [value];
  }

  return [];
};

const asTaskStage = (value: unknown): TaskStage => {
  if (typeof value !== 'string') {
    return 'unknown';
  }

  const normalized = value.trim().toLowerCase();
  return STAGES.has(normalized) ? (normalized as TaskStage) : 'unknown';
};

export const normalizeFrontmatter = (data: unknown): TaskFrontmatter => {
  if (!isRecord(data)) {
    return createDefaultFrontmatter();
  }

  const normalized: TaskFrontmatter = {
    ...data,
    stage: asTaskStage(data.stage),
    tags: asStringArray(data.tags),
    contexts: asStringArray(data.contexts),
    skills: asStringArray(data.skills)
  };

  if (typeof normalized.role !== 'string' && typeof data.agent === 'string') {
    normalized.role = data.agent;
  }

  return normalized;
};

export const parseTaskMarkdown = (input: string): Task => {
  try {
    const parsed = matter(input);
    return {
      frontmatter: normalizeFrontmatter(parsed.data),
      body: parsed.content
    };
  } catch {
    return {
      frontmatter: createDefaultFrontmatter(),
      body: input
    };
  }
};

export const serializeTaskMarkdown = (task: Task): string => {
  const normalized = normalizeFrontmatter(task.frontmatter);
  const frontmatterForWrite: TaskFrontmatter = {
    ...normalized,
    tags: [...normalized.tags],
    contexts: [...normalized.contexts],
    skills: [...normalized.skills]
  };

  if (typeof frontmatterForWrite.role === 'string' && typeof frontmatterForWrite.agent !== 'string') {
    frontmatterForWrite.agent = frontmatterForWrite.role;
  }

  const serializedFrontmatter = Object.fromEntries(
    Object.entries(frontmatterForWrite).filter(([, value]) => value !== undefined)
  ) as Record<string, unknown>;

  return matter.stringify(task.body, serializedFrontmatter);
};
