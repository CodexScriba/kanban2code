import { useCallback, useState } from 'react';
import type { ChatMessage } from '../../../types/orchestrator';
import { createEnvelope } from '../../messaging';

export interface VsCodePoster {
  postMessage: (message: unknown) => void;
}

export interface UseChatResult {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  sendMessage: (text: string) => void;
  cancelStream: () => void;
  handleStreamChunk: (token: string) => void;
  handleMessageComplete: () => void;
  handleError: (message: string) => void;
}

export function useChat(vscode?: VsCodePoster): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }, { role: 'assistant', content: '' }]);
    setIsStreaming(true);
    vscode?.postMessage(createEnvelope('SendMessage', { role: 'user', content: trimmed }));
  }, [isStreaming, vscode]);

  const cancelStream = useCallback(() => {
    if (!isStreaming) return;
    setIsStreaming(false);
    vscode?.postMessage(createEnvelope('CancelStream', {}));
  }, [isStreaming, vscode]);

  const handleStreamChunk = useCallback((token: string) => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [{ role: 'assistant', content: token }];
      }

      const next = [...prev];
      const last = next[next.length - 1];
      if (last.role === 'assistant') {
        next[next.length - 1] = { ...last, content: `${last.content}${token}` };
        return next;
      }

      return [...next, { role: 'assistant', content: token }];
    });
  }, []);

  const handleMessageComplete = useCallback(() => {
    setIsStreaming(false);
  }, []);

  const handleError = useCallback((message: string) => {
    setError(message);
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    cancelStream,
    handleStreamChunk,
    handleMessageComplete,
    handleError,
  };
}
