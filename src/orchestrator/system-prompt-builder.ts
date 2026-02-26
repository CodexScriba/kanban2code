import type { SelectedSkill } from '../types/skill';
import type { WorkspaceSnapshot } from '../types/snapshot';

interface BuildSystemPromptOptions {
  snapshot: WorkspaceSnapshot;
  selectedSkills?: SelectedSkill[];
  customSystemPrompt?: string;
  agentInstructions?: string;
  maxTasksPerStage?: number;
  maxSkills?: number;
}

function summarizeTaskTitles(titles: string[], limit: number): string {
  if (titles.length === 0) return '(none)';
  const selected = titles.slice(0, limit).map((title) => `- ${title}`);
  const remaining = titles.length - Math.min(titles.length, limit);
  if (remaining > 0) {
    selected.push(`- ...and ${remaining} more`);
  }
  return selected.join('\n');
}

function summarizeSkills(snapshot: WorkspaceSnapshot, limit: number): string {
  if (snapshot.skills.length === 0) return '(none)';

  return snapshot.skills
    .slice(0, limit)
    .map((skill) => {
      const description = skill.description.trim();
      return description ? `- ${skill.name}: ${description}` : `- ${skill.name}`;
    })
    .join('\n');
}

function summarizeSelectedSkills(skills: SelectedSkill[]): string {
  if (skills.length === 0) return '(none)';

  return skills
    .map((skill) => {
      const reason = skill.reason.trim() || 'selected';
      return `- ${skill.name} (${reason})`;
    })
    .join('\n');
}

export function buildOrchestratorSystemPrompt(options: BuildSystemPromptOptions): string {
  const {
    snapshot,
    selectedSkills = [],
    customSystemPrompt,
    agentInstructions,
    maxTasksPerStage = 5,
    maxSkills = 12,
  } = options;

  const taskSections = {
    inbox: summarizeTaskTitles(
      snapshot.tasks.inbox.map((task) => task.title),
      maxTasksPerStage,
    ),
    plan: summarizeTaskTitles(
      snapshot.tasks.plan.map((task) => task.title),
      maxTasksPerStage,
    ),
    code: summarizeTaskTitles(
      snapshot.tasks.code.map((task) => task.title),
      maxTasksPerStage,
    ),
    audit: summarizeTaskTitles(
      snapshot.tasks.audit.map((task) => task.title),
      maxTasksPerStage,
    ),
    completed: summarizeTaskTitles(
      snapshot.tasks.completed.map((task) => task.title),
      maxTasksPerStage,
    ),
  };

  const sections = [
    'You are the Kanban2Code orchestrator assistant.',
    'Use workspace state, task priorities, and available skills to produce useful responses.',
    '',
    'Workspace Task Summary:',
    `- total tasks: ${snapshot.metadata.totalTasks}`,
    `- inbox (${snapshot.tasks.inbox.length}):\n${taskSections.inbox}`,
    `- plan (${snapshot.tasks.plan.length}):\n${taskSections.plan}`,
    `- code (${snapshot.tasks.code.length}):\n${taskSections.code}`,
    `- audit (${snapshot.tasks.audit.length}):\n${taskSections.audit}`,
    `- completed (${snapshot.tasks.completed.length}):\n${taskSections.completed}`,
    '',
    'Available Skills Summary:',
    summarizeSkills(snapshot, maxSkills),
    '',
    'Selected Skills:',
    summarizeSelectedSkills(selectedSkills),
  ];

  if (agentInstructions?.trim()) {
    sections.push('', 'Agent Instructions:', agentInstructions.trim());
  }

  if (customSystemPrompt?.trim()) {
    sections.push('', 'Additional System Prompt:', customSystemPrompt.trim());
  }

  return sections.join('\n');
}
