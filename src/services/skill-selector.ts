import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import { listAvailableSkills } from './context';
import type { SkillFile } from './context';
import type { SelectedSkill, SkillPriority, SkillsIndex } from '../types/skill';

const DEFAULT_MAX_SKILLS = 5;

const FRAMEWORK_HINTS: Array<{ name: string; patterns: string[] }> = [
  { name: 'nextjs', patterns: ['nextjs', 'next.js', 'app router'] },
  { name: 'react', patterns: ['react', 'jsx', 'tsx'] },
  { name: 'python', patterns: ['python', 'pyproject.toml', '.py'] },
  { name: 'django', patterns: ['django'] },
  { name: 'flask', patterns: ['flask'] },
  { name: 'node', patterns: ['node', 'node.js', 'package.json'] },
];

interface ScoredSkill {
  skill: SkillFile;
  score: number;
  reason: string[];
  priorityValue: number;
  priorityLabel: SkillPriority;
}

function normalizeText(text: string): string {
  return text.toLowerCase();
}

function normalizeFramework(value?: string): string {
  if (!value) return '';
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function frameworkMatches(framework: string | undefined, detectedFrameworks: string[]): boolean {
  if (!framework) return false;
  const normalized = normalizeFramework(framework);
  if (!normalized) return false;

  return detectedFrameworks.some((detected) => {
    const target = normalizeFramework(detected);
    return normalized.includes(target) || target.includes(normalized);
  });
}

function triggerMatches(conversationText: string, triggers: string[] | undefined): string[] {
  if (!triggers || triggers.length === 0) return [];
  const normalized = normalizeText(conversationText);
  return triggers.filter((trigger) => normalized.includes(normalizeText(trigger)));
}

function labelPriorityRank(priority: SkillPriority): number {
  if (priority === 'high') return 0;
  if (priority === 'medium') return 1;
  if (priority === 'low') return 2;
  return 3;
}

function numericPriorityRank(priorityValue: number): number {
  return -priorityValue;
}

async function readNumericPriority(kanbanRoot: string, relativePath: string): Promise<number | undefined> {
  try {
    const fullPath = path.join(kanbanRoot, relativePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    const parsed = matter(content);
    if (typeof parsed.data.priority === 'number' && Number.isFinite(parsed.data.priority)) {
      return parsed.data.priority;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

async function buildSkillsIndex(kanbanRoot: string, skills: SkillFile[]): Promise<SkillsIndex> {
  const priorities = await Promise.all(skills.map((skill) => readNumericPriority(kanbanRoot, skill.path)));
  const entries = skills.map((skill, index) => [
    skill.id,
    {
      id: skill.id,
      name: skill.name,
      path: skill.path,
      framework: skill.framework,
      priority: priorities[index] ?? skill.priority,
      alwaysAttach: skill.alwaysAttach ?? false,
      triggers: skill.triggers ?? [],
    },
  ]);
  return Object.fromEntries(entries);
}

function scoreSkill(
  skill: SkillFile,
  detectedFrameworks: string[],
  matchingTriggers: string[],
  priority: SkillPriority,
): ScoredSkill {
  const reasons: string[] = [];
  let score = 0;

  if (skill.alwaysAttach) {
    reasons.push('alwaysAttach');
    score += 100;
  }

  const hasFrameworkMatch = frameworkMatches(skill.framework, detectedFrameworks);
  if (hasFrameworkMatch) {
    reasons.push(`framework:${skill.framework}`);
    score += 20;
  }

  if (matchingTriggers.length > 0) {
    reasons.push(`triggers:${matchingTriggers.join(',')}`);
    score += 10 + matchingTriggers.length;
  }

  return {
    skill,
    score,
    reason: reasons,
    priorityValue: typeof priority === 'number' ? priority : 0,
    priorityLabel: priority,
  };
}

function toSelectedSkill(skill: SkillFile, content: string, reason: string, priority: SkillPriority): SelectedSkill {
  return {
    id: skill.id,
    name: skill.name,
    path: skill.path,
    content,
    priority,
    reason,
  };
}

export function detectFrameworks(text: string): string[] {
  const normalized = normalizeText(text);
  const matches = new Set<string>();

  for (const hint of FRAMEWORK_HINTS) {
    if (hint.patterns.some((pattern) => normalized.includes(pattern))) {
      matches.add(hint.name);
    }
  }

  return Array.from(matches);
}

export async function loadSkillContents(
  kanbanRoot: string,
  skillIds: string[],
): Promise<SelectedSkill[]> {
  const skills = await listAvailableSkills(kanbanRoot);
  if (skills.length === 0 || skillIds.length === 0) return [];

  const skillById = new Map(skills.map((skill) => [skill.id, skill]));
  const index = await buildSkillsIndex(kanbanRoot, skills);

  const loaded = await Promise.all(
    skillIds.map(async (skillId) => {
      const skill = skillById.get(skillId);
      if (!skill) return null;
      try {
        const content = await fs.readFile(path.join(kanbanRoot, skill.path), 'utf-8');
        const priority = index[skill.id]?.priority ?? skill.priority;
        return toSelectedSkill(skill, content, 'hydrated by id', priority);
      } catch {
        return null;
      }
    }),
  );

  return loaded.filter((skill): skill is SelectedSkill => Boolean(skill));
}

export async function selectSkills(
  kanbanRoot: string,
  conversationText: string,
  maxSkills = DEFAULT_MAX_SKILLS,
): Promise<SelectedSkill[]> {
  const skills = await listAvailableSkills(kanbanRoot);
  if (skills.length === 0) return [];

  const detectedFrameworks = detectFrameworks(conversationText);
  const index = await buildSkillsIndex(kanbanRoot, skills);
  const scoredById = new Map<string, ScoredSkill>();

  for (const skill of skills) {
    const matchingTriggers = triggerMatches(conversationText, skill.triggers);
    const hasFrameworkMatch = frameworkMatches(skill.framework, detectedFrameworks);
    const hasTriggerMatch = matchingTriggers.length > 0;
    const include = Boolean(skill.alwaysAttach) || hasFrameworkMatch || hasTriggerMatch;
    if (!include) continue;

    const priority = index[skill.id]?.priority ?? skill.priority;
    const scored = scoreSkill(skill, detectedFrameworks, matchingTriggers, priority);
    const existing = scoredById.get(skill.id);
    if (!existing || scored.score > existing.score) {
      scoredById.set(skill.id, scored);
    }
  }

  const ordered = Array.from(scoredById.values()).sort((a, b) => {
    if (a.skill.alwaysAttach !== b.skill.alwaysAttach) {
      return a.skill.alwaysAttach ? -1 : 1;
    }

    const labelA = labelPriorityRank(a.priorityLabel);
    const labelB = labelPriorityRank(b.priorityLabel);
    if (labelA !== labelB) return labelA - labelB;

    if (a.score !== b.score) return b.score - a.score;

    if (a.priorityValue !== b.priorityValue) {
      return numericPriorityRank(a.priorityValue) - numericPriorityRank(b.priorityValue);
    }
    return a.skill.name.localeCompare(b.skill.name);
  });

  const selected = ordered.slice(0, Math.max(0, maxSkills));
  const hydrated = await Promise.all(
    selected.map(async (item) => {
      try {
        const content = await fs.readFile(path.join(kanbanRoot, item.skill.path), 'utf-8');
        return toSelectedSkill(
          item.skill,
          content,
          item.reason.join('; ') || 'matched',
          index[item.skill.id]?.priority ?? item.skill.priority,
        );
      } catch {
        return null;
      }
    }),
  );

  return hydrated.filter((skill): skill is SelectedSkill => Boolean(skill));
}
