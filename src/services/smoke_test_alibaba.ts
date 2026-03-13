import * as fs from 'node:fs/promises';
import * as path from 'node:path';

interface SmokeSettingsFile {
  providersAndModels?: {
    providers?: {
      alibaba?: {
        endpoint?: string;
        models?: string[];
      };
    };
  };
}

interface SmokeResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

const DEFAULT_ENDPOINT = 'https://coding-intl.dashscope.aliyuncs.com/v1';
const MODELS_TO_PROBE = ['glm-5', 'qwen3-coder-plus'];

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

    if (key) {
      parsed[key] = value;
    }
  }

  return parsed;
};

const normalizeEndpoint = (endpoint: string): string => {
  const trimmed = endpoint.trim().replace(/\/+$/u, '');
  return trimmed.endsWith('/chat/completions') ? trimmed : `${trimmed}/chat/completions`;
};

const parseAssistantText = (payload: SmokeResponse): string | undefined => {
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content === 'string' && content.trim()) {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const combined = content
      .map((part) => (typeof part?.text === 'string' ? part.text : ''))
      .join('')
      .trim();
    return combined || undefined;
  }

  return undefined;
};

const readWorkspaceSettings = async (workspaceRoot: string): Promise<SmokeSettingsFile> => {
  const settingsPath = path.join(workspaceRoot, '.kanban2code', 'settings.json');

  try {
    const raw = await fs.readFile(settingsPath, 'utf8');
    return JSON.parse(raw) as SmokeSettingsFile;
  } catch {
    return {};
  }
};

const readApiKey = async (workspaceRoot: string): Promise<string | undefined> => {
  const processValue = process.env.ALIBABA_API_KEY?.trim() || process.env.ALIBABA_CLOUD_API_KEY?.trim();
  if (processValue) {
    return processValue;
  }

  try {
    const envPath = path.join(workspaceRoot, '.env');
    const parsed = parseDotEnv(await fs.readFile(envPath, 'utf8'));
    const envValue = parsed.ALIBABA_API_KEY?.trim() || parsed.ALIBABA_CLOUD_API_KEY?.trim();
    if (envValue) {
      process.env.ALIBABA_API_KEY = envValue;
      process.env.ALIBABA_CLOUD_API_KEY = envValue;
      return envValue;
    }
  } catch {
    return undefined;
  }

  return undefined;
};

const probeModel = async (endpoint: string, apiKey: string, model: string): Promise<string> => {
  const response = await fetch(normalizeEndpoint(endpoint), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      stream: false,
      user: 'kanban2code-smoke-test',
      messages: [
        {
          role: 'system',
          content:
            'You are replying to a connectivity smoke test running inside an interactive coding tool.'
        },
        {
          role: 'user',
          content: `Say hi back in one short line and include the exact model name "${model}".`
        }
      ]
    })
  });

  const payload = (await response.json()) as SmokeResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message?.trim() || `Request failed with status ${response.status}.`);
  }

  const text = parseAssistantText(payload);
  if (!text) {
    throw new Error('Model returned an empty response.');
  }

  return text;
};

async function main(): Promise<void> {
  const workspaceRoot = process.cwd();
  const settings = await readWorkspaceSettings(workspaceRoot);
  const endpoint =
    settings.providersAndModels?.providers?.alibaba?.endpoint?.trim() || DEFAULT_ENDPOINT;
  const apiKey = await readApiKey(workspaceRoot);

  if (!apiKey) {
    throw new Error(
      'Alibaba chat is not configured. Set `ALIBABA_API_KEY` or `ALIBABA_CLOUD_API_KEY` in your environment or workspace `.env` file.'
    );
  }

  process.stdout.write(`Alibaba smoke test endpoint: ${endpoint}\n`);

  const results: Array<{ model: string; ok: boolean; detail: string }> = [];
  for (const model of MODELS_TO_PROBE) {
    try {
      const reply = await probeModel(endpoint, apiKey, model);
      results.push({ model, ok: true, detail: reply });
      process.stdout.write(`[PASS] ${model}: ${reply}\n`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({ model, ok: false, detail: message });
      process.stdout.write(`[FAIL] ${model}: ${message}\n`);
    }
  }

  const failures = results.filter((result) => !result.ok);
  if (failures.length > 0) {
    throw new Error(`Smoke test failed for ${failures.map((failure) => failure.model).join(', ')}.`);
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(
      [
        'Alibaba smoke test failed.',
        'Expected config:',
        '- `ALIBABA_API_KEY` or `ALIBABA_CLOUD_API_KEY` in your environment or workspace `.env`',
        '- `providersAndModels.providers.alibaba.endpoint` in `.kanban2code/settings.json` (optional)',
        '- Models probed: `glm-5`, `qwen3-coder-plus`',
        `Workspace: ${path.resolve(process.cwd())}`,
        `Error: ${message}`
      ].join('\n') + '\n'
    );
    process.exitCode = 1;
  });
}
