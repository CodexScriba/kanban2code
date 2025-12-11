import React from 'react';
import { EmptyBoardIcon, PlusIcon } from './Icons';

interface EmptyStateProps {
  onCreateKanban: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateKanban }) => {
  return (
    <div className="sidebar-empty">
      <EmptyBoardIcon />
      <div className="empty-title">No Kanban Board</div>
      <div className="empty-description">
        Create a Kanban board to start organizing your tasks and projects.
      </div>
      <button className="btn btn-primary" onClick={onCreateKanban}>
        <PlusIcon />
        Create Kanban
      </button>
    </div>
  );
};
