import matter from 'gray-matter';
import * as fs from 'fs/promises';
import * as path from 'path';
import { INBOX_FOLDER, PROJECTS_FOLDER, STAGES } from '../core/constants';
import { TaskProposal } from '../types/task-proposal';
import { Task } from '../types/task';
import { stringifyTaskFile } from './frontmatter';
import { ensureSafePath } from '../workspace/validation';

type ProposalLike = {
  title?: unknown;
  description?: unknown;
  body?: unknown;
  content?: unknown;
  stage?: unknown;
  agent?: unknown;
  tags?: unknown;
  project?: unknown;
  phase?: unknown;
  contexts?: unknown;
  skills?: unknown;
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  return [];
}

function extractProposalFromYaml(yamlContent: string): ProposalLike | null {
  try {
    const parsed = matter(`---\n${yamlContent}\n---\n`);
    return (parsed.data ?? {}) as ProposalLike;
  } catch {
    return null;
  }
}

function extractProposalFromJson(jsonContent: string): ProposalLike | null {
  try {
    const parsed = JSON.parse(jsonContent) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as ProposalLike;
    }
    return null;
  } catch {
    return null;
  }
}

function normalizeProposal(raw: ProposalLike): TaskProposal | null {
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const descriptionSource =
    typeof raw.description === 'string'
      ? raw.description
      : typeof raw.body === 'string'
        ? raw.body
        : typeof raw.content === 'string'
          ? raw.content
          : '';
  const description = descriptionSource.trim();

  if (!title || !description) {
    return null;
  }

  const rawStage = typeof raw.stage === 'string' ? raw.stage.trim() : '';
  const stage = STAGES.includes(rawStage as Task['stage']) ? (rawStage as Task['stage']) : 'inbox';
  const agent = typeof raw.agent === 'string' && raw.agent.trim() ? raw.agent.trim() : undefined;
  const project =
    typeof raw.project === 'string' && raw.project.trim() ? raw.project.trim() : undefined;
  const phase = typeof raw.phase === 'string' && raw.phase.trim() ? raw.phase.trim() : undefined;

  return {
    title,
    description,
    stage,
    agent,
    project,
    phase,
    tags: toStringArray(raw.tags),
    contexts: toStringArray(raw.contexts),
    skills: toStringArray(raw.skills),
  };
}

function slugifyTitle(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
    .replace(/-+$/g, '');

  return base || 'untitled-task';
}

function buildTaskContent(title: string, description: string): string {
  const trimmed = description.trim();
  if (!trimmed) {
    return `# ${title}\n`;
  }

  if (/^\s*#\s+.+/m.test(trimmed.split('\n')[0] ?? '')) {
    return `${trimmed}\n`;
  }

  return `# ${title}\n\n${trimmed}\n`;
}

async function getUniqueFileName(targetDir: string, baseName: string): Promise<string> {
  let counter = 0;

  while (true) {
    const fileName = counter === 0 ? `${baseName}.md` : `${baseName}-${counter}.md`;
    const fullPath = path.join(targetDir, fileName);

    try {
      await fs.access(fullPath);
      counter += 1;
    } catch {
      return fileName;
    }
  }
}

export function parseTaskProposal(responseText: string): TaskProposal | null {
  const fencedBlockPattern = /```(?:\s*(yaml|yml|json))?\s*\n([\s\S]*?)```/gi;
  const matches = Array.from(responseText.matchAll(fencedBlockPattern));

  for (const match of matches) {
    const lang = (match[1] ?? '').toLowerCase();
    const blockContent = (match[2] ?? '').trim();
    if (!blockContent) {
      continue;
    }

    if (lang === 'json') {
      const parsed = extractProposalFromJson(blockContent);
      if (parsed) {
        return normalizeProposal(parsed);
      }
      continue;
    }

    if (lang === 'yaml' || lang === 'yml' || !lang) {
      const parsed = extractProposalFromYaml(blockContent);
      if (parsed) {
        const normalized = normalizeProposal(parsed);
        if (normalized) {
          return normalized;
        }
      }
      if (!lang) {
        const parsedJson = extractProposalFromJson(blockContent);
        if (parsedJson) {
          return normalizeProposal(parsedJson);
        }
      }
    }
  }

  const trimmed = responseText.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    const parsed = extractProposalFromJson(trimmed);
    return parsed ? normalizeProposal(parsed) : null;
  }

  return null;
}

export async function generateTaskFile(
  kanbanRoot: string,
  proposal: TaskProposal,
): Promise<string> {
  const folderParts = [kanbanRoot];

  if (proposal.project) {
    folderParts.push(PROJECTS_FOLDER, proposal.project);
    if (proposal.phase) {
      folderParts.push(proposal.phase);
    }
  } else {
    folderParts.push(INBOX_FOLDER);
  }

  const targetDir = path.join(...folderParts);
  await ensureSafePath(kanbanRoot, targetDir);
  await fs.mkdir(targetDir, { recursive: true });

  const baseName = slugifyTitle(proposal.title);
  const fileName = await getUniqueFileName(targetDir, baseName);
  const filePath = path.join(targetDir, fileName);

  await ensureSafePath(kanbanRoot, filePath);

  const task: Task = {
    id: path.basename(fileName, '.md'),
    filePath,
    title: proposal.title,
    stage: proposal.stage,
    agent: proposal.agent,
    tags: proposal.tags ?? [],
    contexts: proposal.contexts ?? [],
    skills: proposal.skills ?? [],
    content: buildTaskContent(proposal.title, proposal.description),
  };

  const serialized = stringifyTaskFile(task);
  await fs.writeFile(filePath, serialized, 'utf-8');

  return path.relative(kanbanRoot, filePath);
}
