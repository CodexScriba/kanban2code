import React, { useState } from 'react';
import type { Task } from '../../../types/task';

interface TaskCardProps {
  task: Task;
  onOpen: (task: Task) => void;
  onFocusTask?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onOpen, onFocusTask }) => {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/task', JSON.stringify({ id: task.id, stage: task.stage }));
    setDragging(true);
  };

  const handleDragEnd = () => setDragging(false);

  return (
    <div
      className={`task-card ${dragging ? 'dragging' : ''}`}
      role="button"
      tabIndex={0}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onFocus={() => onFocusTask?.(task)}
      onClick={() => {
        onFocusTask?.(task);
        onOpen(task);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(task);
        }
      }}
      aria-label={`Open task ${task.title}`}
    >
      <div className="task-card-title">{task.title}</div>
      <div className="task-card-meta">
        {task.project && <span className="task-card-pill">{task.project}</span>}
        {task.phase && <span className="task-card-pill">{task.phase}</span>}
        {task.tags?.slice(0, 4).map((tag) => (
          <span key={tag} className={`task-card-tag tag-${tag}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
