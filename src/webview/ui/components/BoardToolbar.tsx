import React from 'react';

interface BoardToolbarProps {
  totalTasks: number;
}

export const BoardToolbar: React.FC<BoardToolbarProps> = ({ totalTasks }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid var(--vscode-panel-border)' }}>
      <strong>Board</strong>
      <span style={{ fontSize: 12, opacity: 0.8 }}>Total: {totalTasks}</span>
    </div>
  );
};
