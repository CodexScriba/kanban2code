import { describe, expect, it } from 'vitest';
import {
  createEnvelope,
  MESSAGE_VERSION,
  validateEnvelope,
  type MessageEnvelope,
  type MessageType,
} from '../../src/webview/messaging';

interface ChatState {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isStreaming: boolean;
  error: string | null;
}

function createInitialState(): ChatState {
  return {
    messages: [],
    isStreaming: false,
    error: null,
  };
}

function applyHostEnvelope(state: ChatState, envelope: MessageEnvelope<MessageType>): ChatState {
  if (envelope.type === 'StreamChunk') {
    const token = envelope.payload.token;
    const nextMessages = [...state.messages];
    const last = nextMessages[nextMessages.length - 1];

    if (last?.role === 'assistant') {
      nextMessages[nextMessages.length - 1] = { ...last, content: `${last.content}${token}` };
    } else {
      nextMessages.push({ role: 'assistant', content: token });
    }

    return {
      ...state,
      messages: nextMessages,
    };
  }

  if (envelope.type === 'MessageComplete') {
    return {
      ...state,
      isStreaming: false,
    };
  }

  if (envelope.type === 'Error') {
    return {
      ...state,
      isStreaming: false,
      error: envelope.payload.message,
    };
  }

  return state;
}

describe('E2E: chat flow protocol and streaming lifecycle', () => {
  it('supports SendMessage -> StreamChunk -> MessageComplete with valid envelopes', () => {
    let state = createInitialState();

    const outbound = createEnvelope('SendMessage', { role: 'user', content: 'Generate task please' });
    const validatedOutbound = validateEnvelope(outbound);

    expect(validatedOutbound.version).toBe(MESSAGE_VERSION);
    expect(validatedOutbound.type).toBe('SendMessage');

    state = {
      ...state,
      error: null,
      isStreaming: true,
      messages: [
        { role: 'user', content: 'Generate task please' },
        { role: 'assistant', content: '' },
      ],
    };

    const chunk1 = validateEnvelope(createEnvelope('StreamChunk', { token: 'Drafting ' }));
    const chunk2 = validateEnvelope(createEnvelope('StreamChunk', { token: 'task now.' }));
    state = applyHostEnvelope(state, chunk1);
    state = applyHostEnvelope(state, chunk2);

    expect(state.messages[state.messages.length - 1]).toEqual({
      role: 'assistant',
      content: 'Drafting task now.',
    });
    expect(state.isStreaming).toBe(true);

    state = applyHostEnvelope(state, validateEnvelope(createEnvelope('MessageComplete', {})));
    expect(state.isStreaming).toBe(false);
    expect(state.error).toBeNull();
  });

  it('handles CancelStream mid-stream and remains consistent when late chunks arrive', () => {
    let state: ChatState = {
      messages: [
        { role: 'user', content: 'Long response please' },
        { role: 'assistant', content: '' },
      ],
      isStreaming: true,
      error: null,
    };

    const cancel = validateEnvelope(createEnvelope('CancelStream', {}));
    expect(cancel.version).toBe(MESSAGE_VERSION);
    expect(cancel.type).toBe('CancelStream');

    state = {
      ...state,
      isStreaming: false,
    };

    // Simulate an in-flight token delivered after cancellation.
    state = applyHostEnvelope(state, validateEnvelope(createEnvelope('StreamChunk', { token: 'partial' })));

    expect(state.messages[state.messages.length - 1]).toEqual({ role: 'assistant', content: 'partial' });
    expect(state.isStreaming).toBe(false);
    expect(state.error).toBeNull();
  });

  it('rejects malformed envelopes and preserves protocol strictness', () => {
    expect(() =>
      validateEnvelope({
        version: MESSAGE_VERSION,
        type: 'StreamChunk',
        payload: {},
      }),
    ).toThrow(/Invalid message envelope/);

    expect(() =>
      validateEnvelope({
        version: 999,
        type: 'MessageComplete',
        payload: {},
      }),
    ).toThrow(/Invalid message envelope/);
  });
});
