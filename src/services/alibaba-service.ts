import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { TaskSnapshotItem } from '../types/task';
import type { Settings, ProviderConfig } from '../types/settings';
import { SettingsService } from './settings-service';

interface FetchLike {
  (input: string, init?: RequestInit): Promise<{
    ok: boolean;
    status: number;
    json(): Promise<unknown>;
    text(): Promise<string>;
  }>;
}

interface AlibabaServiceDeps {
  fetch: FetchLike;
  env: NodeJS.ProcessEnv;
  readFile: (filePath: string) => Promise<string>;
}

export interface AlibabaChatRequest {
  message: string;
  selectedTask?: TaskSnapshotItem | null;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

const DEFAULT_MODEL = 'glm-5';

const createDefaultDeps = (): AlibabaServiceDeps => ({
  fetch: async (input, init) => {
    const response = await fetch(input, init);
    return {
      ok: response.ok,
      status: response.status,
      json: () => response.json(),
      text: () => response.text()
    };
  },
  env: process.env,
  readFile: (filePath) => fs.readFile(filePath, 'utf8')
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseDotEnv = (content: string): Record<string, string> => {
  const parsed: Record<string, string> = {};

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key.length > 0) {
      parsed[key] = value;
    }
  }

  return parsed;
};

const normalizeEndpoint = (endpoint: string): string => {
  const trimmed = endpoint.trim().replace(/\/+$/u, '');
  return trimmed.endsWith('/chat/completions') ? trimmed : `${trimmed}/chat/completions`;
};

const getTaskScopeLabel = (selectedTask?: TaskSnapshotItem | null): string =>
  selectedTask ? `${selectedTask.stage} task "${selectedTask.title}"` : 'general chat';

const buildUserPrompt = (request: AlibabaChatRequest): string => {
  if (!request.selectedTask) {
    return request.message;
  }

  const description = request.selectedTask.description
    ? `\nTask summary: ${request.selectedTask.description}`
    : '';

  return [
    `Scoped task: ${request.selectedTask.stage} | ${request.selectedTask.title}`,
    request.selectedTask.project ? `Project: ${request.selectedTask.project}` : undefined,
    description.trim() || undefined,
    '',
    `User message: ${request.message}`
  ]
    .filter((part): part is string => typeof part === 'string' && part.length > 0)
    .join('\n');
};

const getProviderConfig = (settings: Settings): ProviderConfig | undefined =>
  settings.providersAndModels.providers.alibaba;

const getErrorMessage = (payload: unknown): string | undefined => {
  if (!isRecord(payload)) {
    return undefined;
  }

  const error = payload.error;
  if (!isRecord(error) || typeof error.message !== 'string' || error.message.trim().length === 0) {
    return undefined;
  }

  return error.message.trim();
};

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
};

const getAssistantMessage = (payload: unknown): string | undefined => {
  const response = payload as ChatCompletionResponse;
  const firstChoice = response.choices?.[0];
  const content = firstChoice?.message?.content;

  if (typeof content === 'string' && content.trim().length > 0) {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const joined = content
      .map((part) => (part && typeof part.text === 'string' ? part.text : ''))
      .join('')
      .trim();
    return joined.length > 0 ? joined : undefined;
  }

  return undefined;
};

export class AlibabaService {
  constructor(
    private readonly workspaceRoot: string,
    private readonly settingsService: SettingsService,
    private readonly deps: AlibabaServiceDeps = createDefaultDeps()
  ) {}

  async sendMessage(request: AlibabaChatRequest, projectSlug?: string): Promise<string> {
    const settings = await this.settingsService.getSettings(projectSlug);
    const provider = getProviderConfig(settings);
    const endpoint = provider?.endpoint?.trim();
    const model = provider?.models[0]?.trim() || DEFAULT_MODEL;

    if (!endpoint) {
      throw new Error(
        'Alibaba is missing an endpoint. Set `providersAndModels.providers.alibaba.endpoint` in `.kanban2code/settings.json`.'
      );
    }

    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error(
        'Alibaba chat is not configured. Set `ALIBABA_API_KEY` in your environment or workspace `.env` file.'
      );
    }

    const response = await this.deps.fetch(normalizeEndpoint(endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        stream: false,
        user: 'kanban2code-sidebar-interactive',
        messages: [
          {
            role: 'system',
            content:
              'You are the Kanban2Code sidebar orchestrator in an interactive VS Code session. Give concise, practical help and keep responses grounded in the provided task scope.'
          },
          {
            role: 'system',
            content: `Current scope: ${getTaskScopeLabel(request.selectedTask)}. This request comes from an interactive IDE user session.`
          },
          {
            role: 'user',
            content: buildUserPrompt(request)
          }
        ]
      })
    });

    if (!response.ok) {
      const rawText = await this.safeReadText(response);
      const payload = rawText ? parseJson(rawText) : await this.safeReadJson(response);
      const message =
        getErrorMessage(payload) ?? rawText ?? `Request failed with status ${response.status}.`;
      throw new Error(`Alibaba request failed: ${message}`);
    }

    const payload = await this.safeReadJson(response);
    const message = getAssistantMessage(payload);
    if (!message) {
      throw new Error('Alibaba returned an empty response.');
    }

    return message;
  }

  private async getApiKey(): Promise<string | undefined> {
    const existing = this.deps.env.ALIBABA_API_KEY?.trim();
    if (existing) {
      return existing;
    }

    const envFilePath = path.join(this.workspaceRoot, '.env');
    try {
      const parsed = parseDotEnv(await this.deps.readFile(envFilePath));
      const fileValue = parsed.ALIBABA_API_KEY?.trim();
      if (fileValue) {
        this.deps.env.ALIBABA_API_KEY = fileValue;
        return fileValue;
      }
    } catch {
      return undefined;
    }

    return undefined;
  }

  private async safeReadJson(response: {
    json(): Promise<unknown>;
  }): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }

  private async safeReadText(response: {
    text(): Promise<string>;
  }): Promise<string | undefined> {
    try {
      const text = await response.text();
      return text.trim().length > 0 ? text.trim() : undefined;
    } catch {
      return undefined;
    }
  }
}
