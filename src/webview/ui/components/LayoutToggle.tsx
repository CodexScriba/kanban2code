import React from 'react';
import type { BoardLayout } from '../hooks/useBoardLayout';

interface LayoutToggleProps {
  layout: BoardLayout;
  onChange: (layout: BoardLayout) => void;
}

export const LayoutToggle: React.FC<LayoutToggleProps> = ({ layout, onChange }) => {
  return (
    <div className="layout-toggle" role="group" aria-label="Board layout">
      <button
        className={`layout-btn ${layout === 'columns' ? 'active' : ''}`}
        onClick={() => onChange('columns')}
        aria-pressed={layout === 'columns'}
      >
        Columns
      </button>
      <button
        className={`layout-btn ${layout === 'swimlanes' ? 'active' : ''}`}
        onClick={() => onChange('swimlanes')}
        aria-pressed={layout === 'swimlanes'}
      >
        Swimlanes
      </button>
    </div>
  );
};

