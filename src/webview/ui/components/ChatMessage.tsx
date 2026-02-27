import React from 'react';
import { parseTaskProposal } from '../../../shared/task-proposal-parser';
import type { ChatMessage as ChatMessageModel } from '../../../types/orchestrator';
import type { TaskProposal } from '../../../types/task-proposal';
import { TaskProposalCard } from './TaskProposalCard';

interface ChatMessageProps {
  message: ChatMessageModel;
  onGenerateTask: (proposal: TaskProposal) => void;
}

function looksLikeTaskProposalAttempt(content: string): boolean {
  const hasFence = /```(?:\s*(yaml|yml|json))?[\s\S]*?```/i.test(content);
  const looksLikeJson = /^\s*\{[\s\S]*\}\s*$/.test(content.trim());
  return hasFence || looksLikeJson;
}

export function extractTaskProposal(message: ChatMessageModel): TaskProposal | null {
  if (message.role !== 'assistant') return null;
  return parseTaskProposal(message.content);
}

export function getTaskProposalParseError(
  message: ChatMessageModel,
  proposal: TaskProposal | null = extractTaskProposal(message),
): string | null {
  if (message.role !== 'assistant') return null;
  if (proposal) return null;
  if (!looksLikeTaskProposalAttempt(message.content)) return null;
  return 'Could not parse task proposal. Please provide valid YAML or JSON with title and description.';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onGenerateTask }) => {
  const proposal = extractTaskProposal(message);
  const parseError = getTaskProposalParseError(message, proposal);

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
        {parseError ? <p style={{ margin: '8px 0 0', color: 'var(--vscode-errorForeground)' }}>{parseError}</p> : null}
        {proposal ? <TaskProposalCard proposal={proposal} onGenerate={onGenerateTask} /> : null}
      </div>
    </div>
  );
};
