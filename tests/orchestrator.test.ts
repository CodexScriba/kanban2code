import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { DEFAULT_CONFIG } from '../src/types/config';
import type { WorkspaceSnapshot } from '../src/types/snapshot';
import { buildOrchestratorSystemPrompt } from '../src/orchestrator/system-prompt-builder';
import { sendMessage } from '../src/orchestrator/orchestrator';

function createSnapshot(): WorkspaceSnapshot {
  return {
    config: DEFAULT_CONFIG,
    tasks: {
      inbox: [
        {
          id: 'inbox-1',
          filePath: '.kanban2code/inbox/one.md',
          title: 'Inbox Task One',
          stage: 'inbox',
          content: 'body',
        },
      ],
      plan: [],
      code: [
        {
          id: 'code-1',
          filePath: '.kanban2code/projects/alpha/task.md',
          title: 'Implement Orchestrator',
          stage: 'code',
          content: 'body',
        },
      ],
      audit: [],
      completed: [],
    },
    agents: [],
    contexts: [],
    skills: [
      {
        id: 'ts-core',
        name: 'TypeScript Core',
        description: 'Use strict typings and avoid any.',
        path: '_context/skills/typescript-core.md',
      },
    ],
    providers: [],
    metadata: {
      taskCounts: {
        inbox: 1,
        plan: 0,
        code: 1,
        audit: 0,
        completed: 0,
      },
      totalTasks: 2,
      agentCount: 0,
      contextCount: 0,
      skillCount: 1,
      providerCount: 0,
    },
  };
}

function streamFromChunks(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

async function collectTokens(stream: AsyncIterable<string>): Promise<string[]> {
  const tokens: string[] = [];
  for await (const token of stream) {
    tokens.push(token);
  }
  return tokens;
}

describe('buildOrchestratorSystemPrompt', () => {
  test('includes task summary and available skill summary', () => {
    const snapshot = createSnapshot();

    const prompt = buildOrchestratorSystemPrompt({
      snapshot,
      selectedSkills: [
        {
          id: 'ts-core',
          name: 'TypeScript Core',
          path: '_context/skills/typescript-core.md',
          content: 'Skill body',
          reason: 'alwaysAttach',
        },
      ],
      agentInstructions: 'Focus on safe refactors.',
      customSystemPrompt: 'Return concise output.',
    });

    expect(prompt).toContain('Workspace Task Summary:');
    expect(prompt).toContain('Implement Orchestrator');
    expect(prompt).toContain('Available Skills Summary:');
    expect(prompt).toContain('TypeScript Core: Use strict typings and avoid any.');
    expect(prompt).toContain('Selected Skills:');
    expect(prompt).toContain('TypeScript Core (alwaysAttach)');
    expect(prompt).toContain('Focus on safe refactors.');
    expect(prompt).toContain('Return concise output.');
  });
});

describe('sendMessage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
  });

  afterEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  test('streams Anthropic tokens and sends system prompt with task+skill summaries', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: vi.fn(async () => ''),
      body: streamFromChunks([
        'data: {"type":"content_block_delta","delta":{"text":"Hello"}}\n\n',
        'data: {"type":"content_block_delta","delta":{"text":" world"}}\n\n',
        'data: [DONE]\n\n',
      ]),
    } as Response);

    const snapshot = createSnapshot();

    const tokens = await collectTokens(
      sendMessage({
        kanbanRoot: '/unused',
        provider: 'anthropic-test',
        providerConfig: {
          cli: 'claude',
          model: 'claude-sonnet-4',
          unattended_flags: [],
          output_flags: [],
          prompt_style: 'stdin',
          provider: 'anthropic',
        },
        messages: [{ role: 'user', content: 'Say hello' }],
        workspaceSnapshot: snapshot,
        selectedSkills: [
          {
            id: 'ts-core',
            name: 'TypeScript Core',
            path: '_context/skills/typescript-core.md',
            content: 'Skill body',
            reason: 'matched',
          },
        ],
      }),
    );

    expect(tokens).toEqual(['Hello', ' world']);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.anthropic.com/v1/messages');

    const requestBody = JSON.parse(String(request.body));
    expect(requestBody.system).toContain('Workspace Task Summary:');
    expect(requestBody.system).toContain('Inbox Task One');
    expect(requestBody.system).toContain('Available Skills Summary:');
    expect(requestBody.system).toContain('TypeScript Core');
    expect(requestBody.messages).toEqual([{ role: 'user', content: 'Say hello' }]);
  });

  test('yields formatted error token when provider call fails', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    fetchMock.mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers({ 'retry-after': '10' }),
      text: vi.fn(async () => 'rate limit'),
      body: null,
    } as Response);

    const snapshot = createSnapshot();

    const tokens = await collectTokens(
      sendMessage({
        kanbanRoot: '/unused',
        provider: 'anthropic-test',
        providerConfig: {
          cli: 'claude',
          model: 'claude-sonnet-4',
          unattended_flags: [],
          output_flags: [],
          prompt_style: 'stdin',
          provider: 'anthropic',
        },
        messages: [{ role: 'user', content: 'Say hello' }],
        workspaceSnapshot: snapshot,
        selectedSkills: [],
      }),
    );

    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toContain('[ERROR: Anthropic API error 429');
    expect(tokens[0]).toContain('Retry-After: 10s.');
  });
});
