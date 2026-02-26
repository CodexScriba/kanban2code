import React from 'react';
import type { Stage, Task } from '../../../types/task';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  stage: Stage;
  tasks: Task[];
  onRun: (task: Task, allRemaining: boolean) => void;
  onEdit: (task: Task) => void;
}

const labels: Record<Stage, string> = {
  inbox: 'Inbox',
  plan: 'Plan',
  code: 'Code',
  audit: 'Audit',
  completed: 'Completed',
};

export const Column: React.FC<ColumnProps> = ({ stage, tasks, onRun, onEdit }) => {
  return (
    <section style={{ minWidth: 220, display: 'grid', gridTemplateRows: 'auto 1fr', gap: 8 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{labels[stage]}</strong>
        <span style={{ fontSize: 12, opacity: 0.75 }}>{tasks.length}</span>
      </header>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onRun={onRun} onEdit={onEdit} />
        ))}
      </div>
    </section>
  );
};
