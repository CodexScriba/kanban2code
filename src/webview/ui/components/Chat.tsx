import React from 'react';
import type { ProviderConfigFile } from '../../../services/provider-service';
import type { ChatMessage as ChatMessageModel } from '../../../types/orchestrator';
import type { TaskProposal } from '../../../types/task-proposal';
import type { WorkspaceSnapshot } from '../../../types/snapshot';
import { WorkspaceBar } from './WorkspaceBar';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';

interface ChatProps {
  snapshot: WorkspaceSnapshot;
  messages: ChatMessageModel[];
  providers: ProviderConfigFile[];
  selectedProvider: string;
  hasProvider: boolean;
  isStreaming: boolean;
  error: string | null;
  onProviderChange: (providerId: string) => void;
  onSend: (message: string) => void;
  onCancel: () => void;
  onGenerateTask: (proposal: TaskProposal) => void;
}

export const Chat: React.FC<ChatProps> = ({
  snapshot,
  messages,
  providers,
  selectedProvider,
  hasProvider,
  isStreaming,
  error,
  onProviderChange,
  onSend,
  onCancel,
  onGenerateTask,
}) => {
  return (
    <section style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', minHeight: 0, borderRight: '1px solid var(--vscode-panel-border)' }}>
      <WorkspaceBar snapshot={snapshot} />
      <div style={{ overflowY: 'auto', padding: 12 }}>
        {messages.length === 0 ? <p style={{ opacity: 0.7 }}>Start by describing the task you want to create.</p> : null}
        {messages.map((message, index) => (
          <ChatMessage key={`${message.role}-${index}`} message={message} onGenerateTask={onGenerateTask} />
        ))}
        {error ? <p style={{ color: 'var(--vscode-errorForeground)' }}>{error}</p> : null}
      </div>
      <ChatInput
        providers={providers}
        selectedProvider={selectedProvider}
        disabled={!hasProvider}
        isStreaming={isStreaming}
        onProviderChange={onProviderChange}
        onSend={onSend}
        onCancel={onCancel}
      />
    </section>
  );
};
