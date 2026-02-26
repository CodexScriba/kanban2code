import { afterEach, beforeEach, describe, expect, test, vi, type Mock } from 'vitest';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { KANBAN_FOLDER } from '../../src/core/constants';
import { configService } from '../../src/services/config';
import { buildWorkspaceSnapshot } from '../../src/services/workspace-snapshot';
import { DEFAULT_CONFIG } from '../../src/types/config';

let testDir: string;
let kanbanRoot: string;

beforeEach(async () => {
  testDir = path.join(os.tmpdir(), `kanban-integration-workspace-snapshot-${Date.now()}`);
  kanbanRoot = path.join(testDir, KANBAN_FOLDER);
  await fs.mkdir(kanbanRoot, { recursive: true });
});

afterEach(async () => {
  configService.dispose();
  await fs.rm(testDir, { recursive: true, force: true });
});

describe('integration: workspace snapshot hardening', () => {
  test('falls back to DEFAULT_CONFIG and warns when config.json is corrupted', async () => {
    await fs.mkdir(path.join(kanbanRoot, 'inbox'), { recursive: true });
    await fs.writeFile(path.join(kanbanRoot, 'config.json'), '{invalid json', 'utf-8');

    const warningSpy = vscode.window.showWarningMessage as Mock;
    const snapshot = await buildWorkspaceSnapshot(kanbanRoot);

    expect(snapshot.config).toEqual(DEFAULT_CONFIG);
    expect(warningSpy).toHaveBeenCalledTimes(1);
    expect((warningSpy.mock.calls[0]?.[0] as string) ?? '').toContain('Error loading config.json');
  });

  test('groups mixed valid and invalid task files without failing whole snapshot', async () => {
    await fs.mkdir(path.join(kanbanRoot, 'inbox'), { recursive: true });
    await fs.mkdir(path.join(kanbanRoot, 'projects', 'alpha', 'phase-1'), { recursive: true });

    await fs.writeFile(path.join(kanbanRoot, 'inbox', 'task-valid.md'), '---\nstage: inbox\n---\n# Inbox\n\nBody');
    await fs.writeFile(
      path.join(kanbanRoot, 'projects', 'alpha', 'phase-1', 'task-code.md'),
      '---\nstage: code\n---\n# Code\n\nBody',
    );

    // Invalid frontmatter is tolerated and defaults to inbox stage.
    await fs.writeFile(path.join(kanbanRoot, 'inbox', 'task-bad.md'), Buffer.from([0xff, 0xfe, 0xfd]));

    const snapshot = await buildWorkspaceSnapshot(kanbanRoot);

    expect(snapshot.tasks.inbox).toHaveLength(2);
    expect(snapshot.tasks.code).toHaveLength(1);
    expect(snapshot.metadata.totalTasks).toBe(3);
  });

  test('supports concurrent snapshot builds with stable metadata', async () => {
    await fs.mkdir(path.join(kanbanRoot, 'inbox'), { recursive: true });
    await fs.writeFile(path.join(kanbanRoot, 'inbox', 'task-a.md'), '---\nstage: inbox\n---\n# A\n\nbody');
    await fs.writeFile(path.join(kanbanRoot, 'inbox', 'task-b.md'), '---\nstage: inbox\n---\n# B\n\nbody');

    const [a, b, c] = await Promise.all([
      buildWorkspaceSnapshot(kanbanRoot),
      buildWorkspaceSnapshot(kanbanRoot),
      buildWorkspaceSnapshot(kanbanRoot),
    ]);

    for (const snapshot of [a, b, c]) {
      expect(snapshot.metadata.taskCounts.inbox).toBe(2);
      expect(snapshot.metadata.totalTasks).toBe(2);
    }
  });

  test('throws clear errors for missing root and non-directory root', async () => {
    const missing = path.join(testDir, 'missing-root');
    await expect(buildWorkspaceSnapshot(missing)).rejects.toThrow(`Kanban root does not exist: ${missing}`);

    const fileRoot = path.join(testDir, 'not-a-dir.txt');
    await fs.writeFile(fileRoot, 'nope', 'utf-8');
    await expect(buildWorkspaceSnapshot(fileRoot)).rejects.toThrow(`Kanban root is not a directory: ${fileRoot}`);
  });
});
