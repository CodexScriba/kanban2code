import React, { useRef } from 'react';
import type { ProviderConfigFile } from '../../../types/workspace-entities';
import { SendIcon, XIcon } from './Icons';

interface ChatInputProps {
  providers: ProviderConfigFile[];
  selectedProvider: string;
  disabled: boolean;
  isStreaming: boolean;
  onProviderChange: (providerId: string) => void;
  onSend: (message: string) => void;
  onCancel: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  providers,
  selectedProvider,
  disabled,
  isStreaming,
  onProviderChange,
  onSend,
  onCancel,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const text = inputRef.current?.value ?? '';
    if (!text.trim()) return;
    onSend(text);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.style.height = 'auto';
    }
  };

  return (
    <div style={{ borderTop: '1px solid var(--vscode-panel-border)', padding: 12, display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <select
          aria-label="Provider selector"
          value={selectedProvider}
          onChange={(event) => onProviderChange(event.target.value)}
          style={{ flex: 1 }}
        >
          <option value="">Select provider</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>{provider.name}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <textarea
          ref={inputRef}
          aria-label="Chat input"
          disabled={disabled || isStreaming}
          placeholder={disabled ? 'Configure provider to chat' : 'Ask Kanban2Code...'}
          rows={1}
          onInput={(event) => {
            const target = event.currentTarget;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          style={{ resize: 'none', flex: 1 }}
        />
        {isStreaming ? (
          <button type="button" onClick={onCancel} aria-label="Cancel streaming">
            <XIcon />
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={disabled} aria-label="Send message">
            <SendIcon />
          </button>
        )}
      </div>
    </div>
  );
};
