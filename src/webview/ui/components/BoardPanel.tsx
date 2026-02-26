import React from 'react';
import type { WorkspaceSnapshot } from '../../../types/snapshot';
import type { Stage, Task } from '../../../types/task';
import { BoardToolbar } from './BoardToolbar';
import { Column } from './Column';

const stageOrder: Stage[] = ['inbox', 'plan', 'code', 'audit', 'completed'];

interface BoardPanelProps {
  snapshot: WorkspaceSnapshot;
  onRunTask: (task: Task, allRemaining: boolean) => void;
  onEditTask: (task: Task) => void;
}

export function countBoardColumns(snapshot: WorkspaceSnapshot): number {
  return stageOrder.length;
}

export const BoardPanel: React.FC<BoardPanelProps> = ({ snapshot, onRunTask, onEditTask }) => {
  return (
    <section style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0 }}>
      <BoardToolbar totalTasks={snapshot.metadata.totalTasks} />
      <div style={{ overflowX: 'auto', padding: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          {stageOrder.map((stage) => (
            <Column
              key={stage}
              stage={stage}
              tasks={snapshot.tasks[stage]}
              onRun={onRunTask}
              onEdit={onEditTask}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
