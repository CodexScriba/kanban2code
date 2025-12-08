export type TagCategory = 'scope' | 'type' | 'domain' | 'priority';

export interface TagDefinition {
  value: string;
  label: string;
  color: string;
  description?: string;
}

export const TAG_TAXONOMY: Record<TagCategory, TagDefinition[]> = {
  scope: [
    { value: 'mvp', label: 'MVP', color: '#0ea5e9', description: 'Must-ship for v1' },
    { value: 'post-v1', label: 'Post-v1', color: '#8b5cf6', description: 'Backlog after v1' },
  ],
  type: [
    { value: 'bug', label: 'Bug', color: '#ef4444' },
    { value: 'feature', label: 'Feature', color: '#22c55e' },
    { value: 'spike', label: 'Spike', color: '#f59e0b' },
    { value: 'idea', label: 'Idea', color: '#38bdf8' },
    { value: 'roadmap', label: 'Roadmap', color: '#a855f7' },
  ],
  domain: [
    { value: 'infra', label: 'Infra', color: '#6366f1' },
    { value: 'ui', label: 'UI', color: '#ec4899' },
    { value: 'context', label: 'Context', color: '#14b8a6' },
    { value: 'board', label: 'Board', color: '#10b981' },
    { value: 'filesystem', label: 'Filesystem', color: '#f97316' },
  ],
  priority: [{ value: 'urgent', label: 'Urgent', color: '#ef4444' }],
};

export function categorizeTag(tag: string): TagCategory | 'other' {
  const normalized = tag.toLowerCase();
  for (const [category, defs] of Object.entries(TAG_TAXONOMY) as [TagCategory, TagDefinition[]][]) {
    if (defs.some((def) => def.value === normalized)) {
      return category;
    }
  }
  return 'other';
}

export function tagColor(tag: string): string | null {
  const category = categorizeTag(tag);
  if (category === 'other') return null;
  const normalized = tag.toLowerCase();
  const def = TAG_TAXONOMY[category].find((d) => d.value === normalized);
  return def?.color ?? null;
}

