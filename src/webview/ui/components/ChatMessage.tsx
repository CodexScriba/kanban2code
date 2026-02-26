import React from 'react';
import { parseTaskProposal } from '../../../services/task-generator';
import type { ChatMessage as ChatMessageModel } from '../../../types/orchestrator';
import type { TaskProposal } from '../../../types/task-proposal';
import { TaskProposalCard } from './TaskProposalCard';

interface ChatMessageProps {
  message: ChatMessageModel;
  onGenerateTask: (proposal: TaskProposal) => void;
}

export function extractTaskProposal(message: ChatMessageModel): TaskProposal | null {
  if (message.role !== 'assistant') return null;
  return parseTaskProposal(message.content);
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onGenerateTask }) => {
  const proposal = extractTaskProposal(message);

  return (
    <div style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div
        style={{
          maxWidth: '90%',
          borderRadius: 8,
          padding: 10,
          background: message.role === 'user' ? 'var(--vscode-button-background)' : 'var(--vscode-editorWidget-background)',
          color: message.role === 'user' ? 'var(--vscode-button-foreground)' : 'var(--vscode-editor-foreground)',
          whiteSpace: 'pre-wrap',
        }}
      >
        <div>{message.content || (message.role === 'assistant' ? '...' : '')}</div>
        {proposal ? <TaskProposalCard proposal={proposal} onGenerate={onGenerateTask} /> : null}
      </div>
    </div>
  );
};
