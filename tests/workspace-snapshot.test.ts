import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import {
  AGENTS_FOLDER,
  CONTEXT_FOLDER,
  INBOX_FOLDER,
  KANBAN_FOLDER,
  PROJECTS_FOLDER,
  PROVIDERS_FOLDER,
} from '../src/core/constants';
import { configService } from '../src/services/config';
import { buildWorkspaceSnapshot } from '../src/services/workspace-snapshot';
import { DEFAULT_CONFIG } from '../src/types/config';

let TEST_DIR: string;
let KANBAN_ROOT: string;

beforeEach(async () => {
  TEST_DIR = path.join(os.tmpdir(), `kanban-workspace-snapshot-${Date.now()}`);
  KANBAN_ROOT = path.join(TEST_DIR, KANBAN_FOLDER);
  await fs.mkdir(KANBAN_ROOT, { recursive: true });
});

afterEach(async () => {
  configService.dispose();
  await fs.rm(TEST_DIR, { recursive: true, force: true });
});

describe('buildWorkspaceSnapshot', () => {
  test('returns grouped workspace data and metadata', async () => {
    await fs.mkdir(path.join(KANBAN_ROOT, INBOX_FOLDER), { recursive: true });
    await fs.mkdir(path.join(KANBAN_ROOT, PROJECTS_FOLDER, 'alpha', 'phase-1'), { recursive: true });
    await fs.mkdir(path.join(KANBAN_ROOT, AGENTS_FOLDER), { recursive: true });
    await fs.mkdir(path.join(KANBAN_ROOT, CONTEXT_FOLDER, 'skills'), { recursive: true });
    await fs.mkdir(path.join(KANBAN_ROOT, PROVIDERS_FOLDER), { recursive: true });

    await fs.writeFile(
      path.join(KANBAN_ROOT, 'config.json'),
      JSON.stringify(
        {
          version: '2.1.0',
          preferences: { defaultAgent: 'codex' },
        },
        null,
        2,
      ),
    );

    await fs.writeFile(
      path.join(KANBAN_ROOT, INBOX_FOLDER, 'task-inbox.md'),
      '# Inbox Task\n\nbody',
    );

    await fs.writeFile(
      path.join(KANBAN_ROOT, PROJECTS_FOLDER, 'alpha', 'phase-1', 'task-code.md'),
      '---\nstage: code\n---\n# Code Task\n\nbody',
    );

    await fs.writeFile(
      path.join(KANBAN_ROOT, PROJECTS_FOLDER, 'alpha', 'phase-1', 'task-audit.md'),
      '---\nstage: audit\n---\n# Audit Task\n\nbody',
    );

    await fs.writeFile(
      path.join(KANBAN_ROOT, AGENTS_FOLDER, 'coder.md'),
      '---\nname: Coder\ndescription: Coder agent\n---\nInstructions',
    );

    await fs.writeFile(
      path.join(KANBAN_ROOT, CONTEXT_FOLDER, 'architecture.md'),
      '---\nname: Architecture\ndescription: System architecture\n---\nArchitecture context',
    );

    await fs.writeFile(
      path.join(KANBAN_ROOT, CONTEXT_FOLDER, 'skills', 'typescript.md'),
      '---\nskill_name: TypeScript\ndescription: TS skill\n---\nSkill body',
    );

    await fs.writeFile(
      path.join(KANBAN_ROOT, PROVIDERS_FOLDER, 'opus.md'),
      '---\nname: Opus\ncli: claude\nmodel: opus-4\nunattended_flags: []\noutput_flags: []\nprompt_style: flag\n---\nProvider',
    );

    const snapshot = await buildWorkspaceSnapshot(KANBAN_ROOT);

    expect(snapshot.config.version).toBe('2.1.0');

    expect(snapshot.tasks.inbox).toHaveLength(1);
    expect(snapshot.tasks.code).toHaveLength(1);
    expect(snapshot.tasks.audit).toHaveLength(1);
    expect(snapshot.tasks.plan).toHaveLength(0);
    expect(snapshot.tasks.completed).toHaveLength(0);

    expect(snapshot.tasks.code[0].project).toBe('alpha');
    expect(snapshot.tasks.code[0].phase).toBe('phase-1');

    expect(snapshot.agents).toHaveLength(1);
    expect(snapshot.contexts).toHaveLength(1);
    expect(snapshot.skills).toHaveLength(1);
    expect(snapshot.providers).toHaveLength(1);

    expect(snapshot.metadata.taskCounts).toEqual({
      inbox: 1,
      plan: 0,
      code: 1,
      audit: 1,
      completed: 0,
    });
    expect(snapshot.metadata.totalTasks).toBe(3);
    expect(snapshot.metadata.agentCount).toBe(1);
    expect(snapshot.metadata.contextCount).toBe(1);
    expect(snapshot.metadata.skillCount).toBe(1);
    expect(snapshot.metadata.providerCount).toBe(1);
  });

  test('returns defaults and empty collections for an empty workspace', async () => {
    const snapshot = await buildWorkspaceSnapshot(KANBAN_ROOT);

    expect(snapshot.config).toEqual(DEFAULT_CONFIG);
    expect(snapshot.tasks).toEqual({
      inbox: [],
      plan: [],
      code: [],
      audit: [],
      completed: [],
    });
    expect(snapshot.agents).toEqual([]);
    expect(snapshot.contexts).toEqual([]);
    expect(snapshot.skills).toEqual([]);
    expect(snapshot.providers).toEqual([]);
    expect(snapshot.metadata.totalTasks).toBe(0);
    expect(snapshot.metadata.taskCounts).toEqual({
      inbox: 0,
      plan: 0,
      code: 0,
      audit: 0,
      completed: 0,
    });
  });

  test('throws a clear error when the kanban root does not exist', async () => {
    const missingRoot = path.join(TEST_DIR, 'missing-root');

    await expect(buildWorkspaceSnapshot(missingRoot)).rejects.toThrow(
      `Kanban root does not exist: ${missingRoot}`,
    );
  });
});
