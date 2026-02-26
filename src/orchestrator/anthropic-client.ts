import type { ChatMessage } from '../types/orchestrator';

export interface AnthropicStreamOptions {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

function toAnthropicMessages(messages: ChatMessage[]): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content,
    }));
}

async function* readEventStream(response: Response): AsyncIterable<string> {
  if (!response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith('data:')) continue;

      const payload = line.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;

      const parsed = JSON.parse(payload) as {
        type?: string;
        delta?: { text?: string };
        error?: { message?: string };
      };

      if (parsed.type === 'error') {
        throw new Error(parsed.error?.message || 'Anthropic streaming error');
      }

      if (parsed.type === 'content_block_delta' && typeof parsed.delta?.text === 'string') {
        yield parsed.delta.text;
      }
    }
  }

  const tail = buffer.trim();
  if (tail.startsWith('data:')) {
    const payload = tail.slice(5).trim();
    if (payload && payload !== '[DONE]') {
      const parsed = JSON.parse(payload) as { type?: string; delta?: { text?: string } };
      if (parsed.type === 'content_block_delta' && typeof parsed.delta?.text === 'string') {
        yield parsed.delta.text;
      }
    }
  }
}

export async function* streamAnthropicMessages(options: AnthropicStreamOptions): AsyncIterable<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': options.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: options.model,
      max_tokens: options.maxTokens ?? 1024,
      temperature: options.temperature,
      system: options.systemPrompt,
      stream: true,
      messages: toAnthropicMessages(options.messages),
    }),
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => '');
    const retryAfter = response.headers.get('retry-after');
    const retryHint = retryAfter ? ` Retry-After: ${retryAfter}s.` : '';
    throw new Error(
      `Anthropic API error ${response.status}${retryHint}${responseText ? ` ${responseText}` : ''}`,
    );
  }

  yield* readEventStream(response);
}
