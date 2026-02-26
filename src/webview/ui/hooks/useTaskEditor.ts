import { useEffect, useMemo, useState } from 'react';
import type { Stage, Task } from '../../../types/task';

export interface TaskEditorDraft {
  title: string;
  stage: Stage;
  agent: string;
  provider: string;
  tags: string;
  contexts: string;
  skills: string;
  content: string;
}

export interface TaskEditorSavePayload {
  taskFilePath: string;
  title: string;
  stage: Stage;
  agent?: string;
  provider?: string;
  tags?: string[];
  contexts?: string[];
  skills?: string[];
  content: string;
  project?: string;
  phase?: string;
}

function toCsv(items: string[] | undefined): string {
  return (items ?? []).join(', ');
}

function createDraft(task: Task): TaskEditorDraft {
  return {
    title: task.title,
    stage: task.stage,
    agent: task.agent ?? '',
    provider: task.provider ?? '',
    tags: toCsv(task.tags),
    contexts: toCsv(task.contexts),
    skills: toCsv(task.skills),
    content: task.content,
  };
}

function fromCsv(csv: string): string[] {
  return csv.split(',').map((item) => item.trim()).filter(Boolean);
}

export function createSavePayload(task: Task, draft: TaskEditorDraft): TaskEditorSavePayload {
  return {
    taskFilePath: task.filePath,
    title: draft.title.trim() || task.title,
    stage: draft.stage,
    agent: draft.agent.trim() || undefined,
    provider: draft.provider.trim() || undefined,
    tags: fromCsv(draft.tags),
    contexts: fromCsv(draft.contexts),
    skills: fromCsv(draft.skills),
    content: draft.content,
    project: task.project,
    phase: task.phase,
  };
}

export function useTaskEditor(task: Task | null) {
  const [draft, setDraft] = useState<TaskEditorDraft | null>(() => (task ? createDraft(task) : null));

  useEffect(() => {
    if (!task) {
      setDraft(null);
      return;
    }

    setDraft(createDraft(task));
  }, [task]);

  const isDirty = useMemo(() => {
    if (!task || !draft) return false;
    return JSON.stringify(createSavePayload(task, draft)) !== JSON.stringify(createSavePayload(task, createDraft(task)));
  }, [draft, task]);

  return { draft, setDraft, isDirty };
}
