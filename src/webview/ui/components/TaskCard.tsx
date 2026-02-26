import React from 'react';
import type { Task } from '../../../types/task';
import { EditIcon, FastForwardIcon, PlayIcon } from './Icons';

interface TaskCardProps {
  task: Task;
  onRun: (task: Task, allRemaining: boolean) => void;
  onEdit: (task: Task) => void;
}

export function taskCardLabels(task: Task): string[] {
  return [task.agent, ...(task.tags ?? [])].filter((value): value is string => Boolean(value));
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onRun, onEdit }) => {
  const labels = taskCardLabels(task);

  return (
    <article style={{ border: '1px solid var(--vscode-panel-border)', borderRadius: 8, padding: 10, display: 'grid', gap: 8 }}>
      <button type="button" onClick={() => onEdit(task)} style={{ textAlign: 'left', background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}>
        <strong>{task.title}</strong>
      </button>
      {labels.length > 0 ? (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {labels.map((label) => (
            <span key={label} style={{ fontSize: 11, border: '1px solid var(--vscode-panel-border)', padding: '2px 6px', borderRadius: 999 }}>
              {label}
            </span>
          ))}
        </div>
      ) : null}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button type="button" aria-label={`Run ${task.title}`} onClick={() => onRun(task, false)}><PlayIcon /></button>
        <button type="button" aria-label={`Run all ${task.title}`} onClick={() => onRun(task, true)}><FastForwardIcon /></button>
        <button type="button" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}><EditIcon /></button>
      </div>
    </article>
  );
};
