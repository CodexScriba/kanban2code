import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { markImplementationDoneCommand } from '../../src/commands/markImplementationDone';
import { parseTaskFile } from '../../src/services/frontmatter';

describe('markImplementationDoneCommand', () => {
  let tempRoot: string;
  let taskPath: string;

  beforeEach(async () => {
    tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'kanban2code-markdone-'));
    const inboxPath = path.join(tempRoot, 'inbox');
    await fs.mkdir(inboxPath, { recursive: true });
    taskPath = path.join(inboxPath, 'task-1.md');
    await fs.writeFile(
      taskPath,
      `---\nstage: code\ntitle: Demo task\n---\n\nBody`,
      'utf8',
    );
  });

  afterEach(async () => {
    await fs.rm(tempRoot, { recursive: true, force: true });
  });

  it('advances a task to the next stage by default', async () => {
    await markImplementationDoneCommand({ taskFilePath: taskPath, rootOverride: tempRoot });

    const content = await fs.readFile(taskPath, 'utf8');
    const { task } = parseTaskFile(content, taskPath);
    expect(task.stage).toBe('audit');
  });

  it('moves to an explicit target stage when provided', async () => {
    await markImplementationDoneCommand({
      taskFilePath: taskPath,
      rootOverride: tempRoot,
      targetStage: 'completed',
    });

    const content = await fs.readFile(taskPath, 'utf8');
    const { task } = parseTaskFile(content, taskPath);
    expect(task.stage).toBe('completed');
  });
});

