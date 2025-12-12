import React from 'react';
import { LayoutToggle } from './LayoutToggle';
import type { BoardLayout } from '../hooks/useBoardLayout';

interface BoardHeaderProps {
  layout: BoardLayout;
  onLayoutChange: (layout: BoardLayout) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onNewTask: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  layout,
  onLayoutChange,
  search,
  onSearchChange,
  onNewTask,
}) => {
  return (
    <header className="board-header glass-panel">
      <div className="board-header-left">
        <div className="board-title">Kanban Board</div>
        <input
          className="board-search"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tasks"
        />
      </div>
      <div className="board-header-right">
        <LayoutToggle layout={layout} onChange={onLayoutChange} />
        <button className="btn btn-primary" onClick={onNewTask}>
          New Task
        </button>
      </div>
    </header>
  );
};

