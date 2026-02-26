import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createEnvelope,
  MESSAGE_VERSION,
  validateEnvelope,
} from '../../src/webview/messaging';
import type { UseChatResult, VsCodePoster } from '../../src/webview/ui/hooks/useChat';

type StateUpdater<T> = T | ((previous: T) => T);

function createReactHookRuntime() {
  const slots: unknown[] = [];
  let cursor = 0;

  return {
    beginRender() {
      cursor = 0;
    },
    useState<T>(initial: T): [T, (value: StateUpdater<T>) => void] {
      const index = cursor++;
      if (!(index in slots)) {
        slots[index] = initial;
      }

      const setState = (value: StateUpdater<T>): void => {
        const previous = slots[index] as T;
        slots[index] = typeof value === 'function' ? (value as (previous: T) => T)(previous) : value;
      };

      return [slots[index] as T, setState];
    },
    useCallback<T extends (...args: unknown[]) => unknown>(fn: T): T {
      return fn;
    },
  };
}

async function createUseChatHarness(): Promise<{
  render: () => UseChatResult;
  postMessage: ReturnType<typeof vi.fn>;
}> {
  vi.resetModules();
  const runtime = createReactHookRuntime();

  vi.doMock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return {
      ...actual,
      useState: runtime.useState,
      useCallback: runtime.useCallback,
    };
  });

  const { useChat } = await import('../../src/webview/ui/hooks/useChat');
  const postMessage = vi.fn();
  const vscode: VsCodePoster = { postMessage };

  return {
    render: () => {
      runtime.beginRender();
      return useChat(vscode);
    },
    postMessage,
  };
}

describe('E2E: chat flow protocol and streaming lifecycle', () => {
  afterEach(() => {
    vi.doUnmock('react');
    vi.resetModules();
  });

  it('supports SendMessage -> StreamChunk -> MessageComplete with real useChat transitions', async () => {
    const { render, postMessage } = await createUseChatHarness();
    let state = render();

    state.sendMessage('  Generate task please  ', 'codex');
    state = render();

    const outbound = createEnvelope('SendMessage', {
      role: 'user',
      content: 'Generate task please',
      providerId: 'codex',
    });
    const validatedOutbound = validateEnvelope(outbound);

    expect(validatedOutbound.version).toBe(MESSAGE_VERSION);
    expect(validatedOutbound.type).toBe('SendMessage');
    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith(outbound);
    expect(state.messages).toEqual([
      { role: 'user', content: 'Generate task please' },
      { role: 'assistant', content: '' },
    ]);
    expect(state.isStreaming).toBe(true);
    expect(state.error).toBeNull();

    const chunk1 = validateEnvelope(createEnvelope('StreamChunk', { token: 'Drafting ' })).payload.token;
    const chunk2 = validateEnvelope(createEnvelope('StreamChunk', { token: 'task now.' })).payload.token;
    state.handleStreamChunk(chunk1);
    state = render();
    state.handleStreamChunk(chunk2);
    state = render();

    expect(state.messages[state.messages.length - 1]).toEqual({
      role: 'assistant',
      content: 'Drafting task now.',
    });
    expect(state.isStreaming).toBe(true);

    state.handleMessageComplete();
    state = render();
    expect(state.isStreaming).toBe(false);
    expect(state.error).toBeNull();
  });

  it('handles CancelStream mid-stream and remains consistent when late chunks arrive', async () => {
    const { render, postMessage } = await createUseChatHarness();
    let state = render();
    state.sendMessage('Long response please');
    state = render();

    const cancel = validateEnvelope(createEnvelope('CancelStream', {}));
    expect(cancel.version).toBe(MESSAGE_VERSION);
    expect(cancel.type).toBe('CancelStream');
    expect(state.isStreaming).toBe(true);

    state.cancelStream();
    state = render();
    expect(postMessage).toHaveBeenLastCalledWith(cancel);
    expect(state.isStreaming).toBe(false);

    const lateChunk = validateEnvelope(createEnvelope('StreamChunk', { token: 'partial' })).payload.token;
    state.handleStreamChunk(lateChunk);
    state = render();

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
