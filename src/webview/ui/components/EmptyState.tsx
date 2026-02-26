import React from 'react';
import { EmptyBoardIcon, PlusIcon } from './Icons';

interface EmptyStateProps {
  onCreateKanban: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateKanban }) => {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 24, textAlign: 'center' }}>
      <div style={{ maxWidth: 340 }}>
        <EmptyBoardIcon size={44} />
        <h2 style={{ margin: '12px 0 8px' }}>No Kanban Workspace</h2>
        <p style={{ margin: 0, opacity: 0.8 }}>Create a Kanban workspace to start organizing and running tasks.</p>
        <button
          type="button"
          onClick={onCreateKanban}
          style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer' }}
        >
          <PlusIcon />
          Create Kanban
        </button>
      </div>
    </div>
  );
};
