import type { ChatMessage } from '../types/orchestrator';

export interface OpenAIStreamOptions {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  apiBaseUrl?: string;
  providerLabel?: string;
}

function toOpenAIMessages(messages: ChatMessage[], systemPrompt?: string): Array<{ role: string; content: string }> {
  const mapped = messages.map((message) => ({ role: message.role, content: message.content }));
  if (systemPrompt?.trim()) {
    return [{ role: 'system', content: systemPrompt.trim() }, ...mapped];
  }
  return mapped;
}

function parseContentChunk(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const payload = trimmed.startsWith('data:') ? trimmed.slice(5).trim() : trimmed;
  if (!payload || payload === '[DONE]') return null;

  const parsed = JSON.parse(payload) as {
    choices?: Array<{ delta?: { content?: string } }>;
    error?: { message?: string };
  };

  if (parsed.error?.message) {
    throw new Error(parsed.error.message);
  }

  const content = parsed.choices?.[0]?.delta?.content;
  return typeof content === 'string' ? content : null;
}

async function* readJsonStream(response: Response): AsyncIterable<string> {
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

    for (const line of lines) {
      const token = parseContentChunk(line);
      if (token) yield token;
    }
  }

  const tailToken = parseContentChunk(buffer);
  if (tailToken) yield tailToken;
}

export async function* streamOpenAIMessages(options: OpenAIStreamOptions): AsyncIterable<string> {
  const apiBaseUrl = options.apiBaseUrl?.replace(/\/+$/, '') || 'https://api.openai.com';
  const endpoint = `${apiBaseUrl}/v1/chat/completions`;
  const providerLabel = options.providerLabel?.trim() || 'OpenAI';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${options.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      stream: true,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      messages: toOpenAIMessages(options.messages, options.systemPrompt),
    }),
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => '');
    const retryAfter = response.headers.get('retry-after');
    const retryHint = retryAfter ? ` Retry-After: ${retryAfter}s.` : '';
    throw new Error(
      `${providerLabel} API error ${response.status}${retryHint}${responseText ? ` ${responseText}` : ''}`,
    );
  }

  yield* readJsonStream(response);
}
