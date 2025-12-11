import React from 'react';
import type { Stage } from '../../../types/task';

interface QuickFiltersProps {
  activeStages: Stage[];
  onToggleStage: (stage: Stage) => void;
}

const STAGES: { stage: Stage; label: string; colorVar: string }[] = [
  { stage: 'inbox', label: 'Inbox', colorVar: 'var(--stage-inbox)' },
  { stage: 'plan', label: 'Plan', colorVar: 'var(--stage-plan)' },
  { stage: 'code', label: 'Code', colorVar: 'var(--stage-code)' },
  { stage: 'audit', label: 'Audit', colorVar: 'var(--stage-audit)' },
  { stage: 'completed', label: 'Done', colorVar: 'var(--stage-completed)' },
];

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  activeStages,
  onToggleStage,
}) => {
  return (
    <div className="quick-filters">
      {STAGES.map(({ stage, label, colorVar }) => (
        <button
          key={stage}
          className={`filter-chip ${activeStages.includes(stage) ? 'active' : ''}`}
          onClick={() => onToggleStage(stage)}
        >
          <span className="dot" style={{ background: colorVar }} />
          {label}
        </button>
      ))}
    </div>
  );
};
