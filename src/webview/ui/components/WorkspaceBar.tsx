import React from 'react';
import type { WorkspaceSnapshot } from '../../../types/snapshot';
import type { Stage } from '../../../types/task';

const stageLabels: Record<Stage, string> = {
  inbox: 'Inbox',
  plan: 'Plan',
  code: 'Code',
  audit: 'Audit',
  completed: 'Done',
};

const stageOrder: Stage[] = ['inbox', 'plan', 'code', 'audit', 'completed'];

export function formatWorkspaceCounts(snapshot: WorkspaceSnapshot): string[] {
  return stageOrder.map((stage) => `${stageLabels[stage]}: ${snapshot.metadata.taskCounts[stage]}`);
}

interface WorkspaceBarProps {
  snapshot: WorkspaceSnapshot;
}

export const WorkspaceBar: React.FC<WorkspaceBarProps> = ({ snapshot }) => {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '8px 12px', borderBottom: '1px solid var(--vscode-panel-border)' }}>
      {formatWorkspaceCounts(snapshot).map((label) => (
        <span key={label} style={{ fontSize: 12, opacity: 0.85 }}>{label}</span>
      ))}
    </div>
  );
};
