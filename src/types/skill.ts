export type SkillPriority = 'high' | 'medium' | 'low' | number | undefined;

export interface SelectedSkill {
  id: string;
  name: string;
  path: string;
  content: string;
  priority?: SkillPriority;
  reason: string;
}

export interface SkillsIndexEntry {
  id: string;
  name: string;
  path: string;
  framework?: string;
  priority?: SkillPriority;
  alwaysAttach: boolean;
  triggers: string[];
}

export type SkillsIndex = Record<string, SkillsIndexEntry>;
