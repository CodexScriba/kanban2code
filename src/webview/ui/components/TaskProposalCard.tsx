import React from 'react';
import type { TaskProposal } from '../../../types/task-proposal';

interface TaskProposalCardProps {
  proposal: TaskProposal;
  onGenerate: (proposal: TaskProposal) => void;
}

export function proposalSummary(proposal: TaskProposal): string {
  const tags = proposal.tags?.length ? ` [${proposal.tags.join(', ')}]` : '';
  return `${proposal.title} (${proposal.stage})${tags}`;
}

export const TaskProposalCard: React.FC<TaskProposalCardProps> = ({ proposal, onGenerate }) => {
  return (
    <div style={{ border: '1px solid var(--vscode-panel-border)', borderRadius: 8, padding: 10, marginTop: 8 }}>
      <div style={{ fontWeight: 600 }}>{proposal.title}</div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{proposal.description}</div>
      <div style={{ marginTop: 4, fontSize: 12 }}>Stage: {proposal.stage}</div>
      {proposal.agent ? <div style={{ fontSize: 12 }}>Agent: {proposal.agent}</div> : null}
      <button type="button" style={{ marginTop: 8 }} onClick={() => onGenerate(proposal)}>
        Generate .md
      </button>
    </div>
  );
};
