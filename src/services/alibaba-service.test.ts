import assert from 'node:assert/strict';
import test from 'node:test';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { AlibabaService } from './alibaba-service';
import { SettingsService } from './settings-service';

interface UriLike {
  fsPath: string;
}

const createNodeFsAdapter = () => ({
  readFile: async (uri: UriLike): Promise<Uint8Array> => {
    const buffer = await fs.readFile(uri.fsPath);
    return new Uint8Array(buffer);
  },
  writeFile: async (uri: UriLike, content: Uint8Array): Promise<void> => {
    await fs.mkdir(path.dirname(uri.fsPath), { recursive: true });
    await fs.writeFile(uri.fsPath, Buffer.from(content));
  },
  createDirectory: async (uri: UriLike): Promise<void> => {
    await fs.mkdir(uri.fsPath, { recursive: true });
  }
});

const toFileUri = (filePath: string): UriLike => ({ fsPath: filePath });

const createWorkspace = async (): Promise<string> => {
  return fs.mkdtemp(path.join(os.tmpdir(), 'kanban2code-alibaba-service-'));
};

const writeJson = async (workspaceRoot: string, relativePath: string, value: unknown): Promise<void> => {
  const filePath = path.join(workspaceRoot, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8');
};

const createSettingsService = (workspaceRoot: string): SettingsService =>
  new SettingsService(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri
  });

test('sendMessage posts to Alibaba chat completions endpoint and returns assistant text', async () => {
  const workspaceRoot = await createWorkspace();
  await writeJson(workspaceRoot, '.kanban2code/settings.json', {
    providersAndModels: {
      providers: {
        alibaba: {
          enabled: true,
          models: ['glm-5', 'qwen3-coder-plus', 'qwen3-max-2026-01-23'],
          endpoint: 'https://coding-intl.dashscope.aliyuncs.com/v1'
        }
      }
    }
  });

  let capturedUrl = '';
  let capturedInit: RequestInit | undefined;
  const service = new AlibabaService(workspaceRoot, createSettingsService(workspaceRoot), {
    env: { ALIBABA_API_KEY: 'test-api-key' },
    readFile: async () => '',
    fetch: async (input, init) => {
      capturedUrl = input;
      capturedInit = init;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [
            {
              message: {
                content: 'Alibaba says hello.'
              }
            }
          ]
        }),
        text: async () => ''
      };
    }
  });

  const result = await service.sendMessage(
    {
      message: 'Help me plan the next step.',
      selectedTask: {
        id: '.kanban2code/inbox/123-demo.md',
        taskId: '123-demo',
        title: 'Demo task',
        description: 'Make the sidebar use Alibaba.',
        stage: 'code',
        tags: ['chat'],
        createdAt: 123,
        project: 'roadmap'
      }
    },
    'roadmap'
  );

  assert.equal(result, 'Alibaba says hello.');
  assert.equal(capturedUrl, 'https://coding-intl.dashscope.aliyuncs.com/v1/chat/completions');
  assert.ok(capturedInit);
  assert.equal(capturedInit?.method, 'POST');
  assert.equal((capturedInit?.headers as Record<string, string>).Authorization, 'Bearer test-api-key');

  const body = JSON.parse(String(capturedInit?.body)) as {
    model: string;
    user: string;
    messages: Array<{ role: string; content: string }>;
  };

  assert.equal(body.model, 'glm-5');
  assert.equal(body.user, 'kanban2code-sidebar-interactive');
  assert.match(body.messages[1]?.content ?? '', /interactive IDE user session/i);
  assert.match(body.messages[2]?.content ?? '', /Scoped task: code \| Demo task/);
});

test('sendMessage loads ALIBABA_API_KEY from workspace .env when process env is empty', async () => {
  const workspaceRoot = await createWorkspace();
  await writeJson(workspaceRoot, '.kanban2code/settings.json', {
    providersAndModels: {
      providers: {
        alibaba: {
          enabled: true,
          models: ['glm-5'],
          endpoint: 'https://coding-intl.dashscope.aliyuncs.com/v1'
        }
      }
    }
  });
  await fs.writeFile(path.join(workspaceRoot, '.env'), 'ALIBABA_API_KEY=from-dotenv\n', 'utf8');

  const env: NodeJS.ProcessEnv = {};
  const service = new AlibabaService(workspaceRoot, createSettingsService(workspaceRoot), {
    env,
    readFile: (filePath) => fs.readFile(filePath, 'utf8'),
    fetch: async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'Loaded from .env'
            }
          }
        ]
      }),
      text: async () => ''
    })
  });

  const result = await service.sendMessage({ message: 'Ping Alibaba.' });

  assert.equal(result, 'Loaded from .env');
  assert.equal(env.ALIBABA_API_KEY, 'from-dotenv');
});

test('sendMessage rejects when ALIBABA_API_KEY is missing', async () => {
  const workspaceRoot = await createWorkspace();
  const service = new AlibabaService(workspaceRoot, createSettingsService(workspaceRoot), {
    env: {},
    readFile: async () => {
      throw new Error('missing');
    },
    fetch: async () => {
      throw new Error('fetch should not run');
    }
  });

  await assert.rejects(
    async () =>
      service.sendMessage({
        message: 'Hello'
      }),
    /ALIBABA_API_KEY/
  );
});

test('sendMessage rejects when Alibaba endpoint is missing from settings', async () => {
  const workspaceRoot = await createWorkspace();
  await writeJson(workspaceRoot, '.kanban2code/settings.json', {
    providersAndModels: {
      providers: {
        alibaba: {
          enabled: true,
          models: ['glm-5'],
          endpoint: ''
        }
      }
    }
  });

  const service = new AlibabaService(workspaceRoot, createSettingsService(workspaceRoot), {
    env: { ALIBABA_API_KEY: 'test-api-key' },
    readFile: async () => '',
    fetch: async () => {
      throw new Error('fetch should not run');
    }
  });

  await assert.rejects(async () => service.sendMessage({ message: 'Hello' }), /missing an endpoint/);
});

test('sendMessage surfaces Alibaba API error messages', async () => {
  const workspaceRoot = await createWorkspace();
  await writeJson(workspaceRoot, '.kanban2code/settings.json', {
    providersAndModels: {
      providers: {
        alibaba: {
          enabled: true,
          models: ['glm-5'],
          endpoint: 'https://coding-intl.dashscope.aliyuncs.com/v1'
        }
      }
    }
  });

  const service = new AlibabaService(workspaceRoot, createSettingsService(workspaceRoot), {
    env: { ALIBABA_API_KEY: 'test-api-key' },
    readFile: async () => '',
    fetch: async () => ({
      ok: false,
      status: 401,
      json: async () => ({
        error: {
          message: 'Invalid API key'
        }
      }),
      text: async () => ''
    })
  });

  await assert.rejects(async () => service.sendMessage({ message: 'Hello' }), /Invalid API key/);
});

test('sendMessage falls back to the current Coding Plan default model when settings omit models', async () => {
  const workspaceRoot = await createWorkspace();
  await writeJson(workspaceRoot, '.kanban2code/settings.json', {
    providersAndModels: {
      providers: {
        alibaba: {
          enabled: true,
          models: [],
          endpoint: 'https://coding-intl.dashscope.aliyuncs.com/v1'
        }
      }
    }
  });

  let capturedBody = '';
  const service = new AlibabaService(workspaceRoot, createSettingsService(workspaceRoot), {
    env: { ALIBABA_API_KEY: 'test-api-key' },
    readFile: async () => '',
    fetch: async (_input, init) => {
      capturedBody = String(init?.body ?? '');
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: 'ok' } }]
        }),
        text: async () => ''
      };
    }
  });

  await service.sendMessage({ message: 'Hello' });

  const body = JSON.parse(capturedBody) as { model: string };
  assert.equal(body.model, 'glm-5');
});
