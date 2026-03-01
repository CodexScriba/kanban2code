import assert from 'node:assert/strict';
import test from 'node:test';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { SettingsService } from './settings-service';
import type { Settings } from '../types/settings';

interface UriLike {
  fsPath: string;
}

const createNodeFsAdapter = () => ({
  readFile: async (uri: UriLike): Promise<Uint8Array> => {
    const buffer = await fs.readFile(uri.fsPath);
    return new Uint8Array(buffer);
  },
  writeFile: async (uri: UriLike, content: Uint8Array): Promise<void> => {
    await fs.writeFile(uri.fsPath, Buffer.from(content));
  },
  createDirectory: async (uri: UriLike): Promise<void> => {
    await fs.mkdir(uri.fsPath, { recursive: true });
  }
});

const toFileUri = (filePath: string): UriLike => ({ fsPath: filePath });

const createWorkspace = async (): Promise<string> => {
  return fs.mkdtemp(path.join(os.tmpdir(), 'kanban2code-settings-service-'));
};

const writeJson = async (workspaceRoot: string, relativePath: string, value: unknown): Promise<void> => {
  const absolutePath = path.join(workspaceRoot, relativePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, JSON.stringify(value, null, 2), 'utf8');
};

const readJson = async (workspaceRoot: string, relativePath: string): Promise<Record<string, unknown>> => {
  const absolutePath = path.join(workspaceRoot, relativePath);
  const content = await fs.readFile(absolutePath, 'utf8');
  return JSON.parse(content) as Record<string, unknown>;
};

const createService = (workspaceRoot: string): SettingsService => {
  return new SettingsService(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri
  });
};

test('reads global settings and fills missing fields from fallbacks', async () => {
  const workspaceRoot = await createWorkspace();
  const service = createService(workspaceRoot);

  await writeJson(workspaceRoot, '.kanban2code/settings.json', {
    general: { timezone: 'America/New_York' }
  });

  const settings = await service.getSettings();
  assert.equal(settings.general.timezone, 'America/New_York');
  assert.equal(settings.general.dateFormat, 'YYYY-MM-DD');
  assert.equal(settings.queueAndExecution.defaultMode, 'stage');
});

test('merges with precedence project > global > fallback', async () => {
  const workspaceRoot = await createWorkspace();
  const service = createService(workspaceRoot);

  await writeJson(workspaceRoot, '.kanban2code/settings.json', {
    taskDefaults: { priority: 'low', titleTemplate: 'global-template' },
    stageRuntimeMapping: {
      plan: { role: 'planner', provider: 'codex', model: 'yolo', profile: 'default' }
    }
  });

  await writeJson(workspaceRoot, '.kanban2code/projects/roadmap/settings.json', {
    taskDefaults: { priority: 'high' },
    stageRuntimeMapping: {
      plan: { profile: 'default' }
    }
  });

  const settings = await service.getSettings('roadmap');
  assert.equal(settings.taskDefaults.priority, 'high');
  assert.equal(settings.taskDefaults.titleTemplate, 'global-template');
  assert.equal(settings.stageRuntimeMapping.plan.provider, 'codex');
  assert.equal(settings.stageRuntimeMapping.plan.model, 'yolo');
  assert.equal(settings.stageRuntimeMapping.plan.profile, 'default');
});

test('hardcoded fallbacks fill missing keys when settings files do not exist', async () => {
  const workspaceRoot = await createWorkspace();
  const service = createService(workspaceRoot);

  const settings = await service.getSettings('missing-project');
  assert.equal(settings.general.timezone, 'UTC');
  assert.equal(settings.notifications.digestFrequency, 'off');
  assert.deepEqual(settings.projectOverrides.projects, {});
});

test('rejects invalid provider/model combinations during updates', async () => {
  const workspaceRoot = await createWorkspace();
  const service = createService(workspaceRoot);

  const invalidUpdate: Partial<Settings> = {
    stageRuntimeMapping: {
      code: { role: 'coder', provider: 'claude', model: 'not-a-model', profile: 'default' }
    }
  };

  await assert.rejects(
    async () => service.updateSettings(invalidUpdate),
    /Model 'not-a-model' not supported by provider 'claude'/
  );
});

test('validates profile existence', () => {
  const service = createService('/tmp');

  assert.equal(service.validateProfile('default').valid, true);
  assert.equal(service.validateProfile('missing-profile').valid, false);
});

test('resetSection only resets the targeted section', async () => {
  const workspaceRoot = await createWorkspace();
  const service = createService(workspaceRoot);

  await writeJson(workspaceRoot, '.kanban2code/settings.json', {
    general: { timezone: 'America/Chicago' },
    taskDefaults: { priority: 'high', titleTemplate: 'custom' },
    queueAndExecution: { maxParallelRuns: 4 }
  });

  await service.resetSection('taskDefaults');

  const persisted = await readJson(workspaceRoot, '.kanban2code/settings.json');
  const general = persisted.general as Record<string, unknown>;
  const taskDefaults = persisted.taskDefaults as Record<string, unknown>;
  const queueAndExecution = persisted.queueAndExecution as Record<string, unknown>;

  assert.equal(general.timezone, 'America/Chicago');
  assert.equal(taskDefaults.priority, 'medium');
  assert.equal(taskDefaults.titleTemplate, '');
  assert.equal(queueAndExecution.maxParallelRuns, 4);
});

test('creates project settings directories when writing project settings', async () => {
  const workspaceRoot = await createWorkspace();
  const service = createService(workspaceRoot);

  await service.updateSettings(
    {
      general: { timezone: 'America/Los_Angeles' }
    } as Partial<Settings>,
    'new-project'
  );

  const projectSettings = await readJson(
    workspaceRoot,
    '.kanban2code/projects/new-project/settings.json'
  );
  const general = projectSettings.general as Record<string, unknown>;
  assert.equal(general.timezone, 'America/Los_Angeles');
});
