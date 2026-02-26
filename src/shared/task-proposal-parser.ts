import matter from 'gray-matter';
import { STAGES } from '../core/constants';
import type { Task } from '../types/task';
import type { TaskProposal } from '../types/task-proposal';

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
