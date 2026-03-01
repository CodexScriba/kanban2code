export type TaskStage = 'inbox' | 'capture' | 'plan' | 'code' | 'audit' | 'completed' | 'unknown';

export type Priority = 'low' | 'medium' | 'high';

export interface TaskFrontmatter {
  title?: string;
  stage: TaskStage;
  role?: string;
  agent?: string; // Legacy field
  provider?: string;
  model?: string;
  profile?: string;
  priority?: Priority;
  tags: string[];
  contexts: string[];
  skills: string[];
  project?: string;
  phase?: string;
}

export interface Task {
  frontmatter: TaskFrontmatter;
  body: string;
}

export interface TaskSnapshotItem {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  stage: TaskStage;
  priority?: Priority;
  role?: string;
  project?: string;
  tags: string[];
  createdAt: number;
}

export interface TaskCreateInput {
  title?: string;
  body?: string;
  stage?: TaskStage;
  role?: string;
  agent?: string;
  provider?: string;
  model?: string;
  profile?: string;
  priority?: Priority;
  tags?: string[];
  contexts?: string[];
  skills?: string[];
  project?: string;
  phase?: string;
  projectSlug?: string;
}

export interface TaskUpdateInput {
  title?: string;
  body?: string;
  stage?: TaskStage;
  role?: string;
  agent?: string;
  provider?: string;
  model?: string;
  profile?: string;
  priority?: Priority;
  tags?: string[];
  contexts?: string[];
  skills?: string[];
  project?: string;
  phase?: string;
}
