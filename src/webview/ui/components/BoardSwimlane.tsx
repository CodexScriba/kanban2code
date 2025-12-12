import React from 'react';
import type { Stage, Task } from '../../../types/task';
import { Swimlane } from './Swimlane';

interface BoardSwimlaneProps {
  swimlanes: Array<{ key: string; label: string; tasksByStage: Record<Stage, Task[]> }>;
  onMoveTask: (taskId: string, toStage: Stage) => void;
  onOpenTask: (task: Task) => void;
  onFocusTask?: (task: Task) => void;
}

export const BoardSwimlane: React.FC<BoardSwimlaneProps> = ({ swimlanes, onMoveTask, onOpenTask, onFocusTask }) => {
  return (
    <div className="board-swimlane">
      {swimlanes.map((lane) => (
        <Swimlane
          key={lane.key}
          label={lane.label}
          tasksByStage={lane.tasksByStage}
          onMoveTask={onMoveTask}
          onOpenTask={onOpenTask}
          onFocusTask={onFocusTask}
        />
      ))}
      {swimlanes.length === 0 && <div className="board-empty">No tasks</div>}
    </div>
  );
};
