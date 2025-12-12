import React from 'react';
import type { Stage, Task } from '../../../types/task';
import { STAGES } from '../../../core/constants';
import { Column } from './Column';

interface SwimlaneProps {
  label: string;
  tasksByStage: Record<Stage, Task[]>;
  onMoveTask: (taskId: string, toStage: Stage) => void;
  onOpenTask: (task: Task) => void;
  onFocusTask?: (task: Task) => void;
}

export const Swimlane: React.FC<SwimlaneProps> = ({ label, tasksByStage, onMoveTask, onOpenTask, onFocusTask }) => {
  return (
    <div className="swimlane">
      <div className="swimlane-label">{label}</div>
      <div className="swimlane-columns">
        {STAGES.map((stage) => (
          <Column
            key={stage}
            stage={stage}
            title=""
            tasks={tasksByStage[stage] || []}
            onMoveTask={onMoveTask}
            onOpenTask={onOpenTask}
            onFocusTask={onFocusTask}
          />
        ))}
      </div>
    </div>
  );
};
