import { expect, test, afterEach, describe } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { scaffoldWorkspace, syncBundledAgents, KANBAN_FOLDER } from '../src/services/scaffolder';
import { BUNDLED_AGENTS } from '../src/assets/agents';

const TEST_DIR = path.join(os.tmpdir(), 'kanban2code-test-' + Date.now());

test('scaffolderWorkspace creates expected structure', async () => {
  await fs.mkdir(TEST_DIR, { recursive: true });

  await scaffoldWorkspace(TEST_DIR);

  const kanbanRoot = path.join(TEST_DIR, KANBAN_FOLDER);

  // Check directories
  const statsInbox = await fs.stat(path.join(kanbanRoot, 'inbox'));
  expect(statsInbox.isDirectory()).toBe(true);

  const statsArchive = await fs.stat(path.join(kanbanRoot, '_archive'));
  expect(statsArchive.isDirectory()).toBe(true);

  await expect(fs.stat(path.join(kanbanRoot, '_templates'))).rejects.toMatchObject({ code: 'ENOENT' });
  await expect(fs.stat(path.join(kanbanRoot, '_templates', 'tasks'))).rejects.toMatchObject({ code: 'ENOENT' });
  await expect(fs.stat(path.join(kanbanRoot, '_templates', 'stages'))).rejects.toMatchObject({ code: 'ENOENT' });

  // Check files
  const howItWorks = await fs.readFile(path.join(kanbanRoot, 'how-it-works.md'), 'utf-8');
  expect(howItWorks).toContain('# How Kanban2Code Works');

  const architecture = await fs.readFile(path.join(kanbanRoot, 'architecture.md'), 'utf-8');
  expect(architecture).toContain('# Architecture');

  const agent = await fs.readFile(path.join(kanbanRoot, '_agents/opus.md'), 'utf-8');
  expect(agent).toContain('name: Opus');

  const inboxTask = await fs.readFile(path.join(kanbanRoot, 'inbox/sample-task.md'), 'utf-8');
  expect(inboxTask).toContain('# Explore Kanban2Code');

  const gitignore = await fs.readFile(path.join(kanbanRoot, '.gitignore'), 'utf-8');
  expect(gitignore).toContain('_archive/');
});

test('scaffoldWorkspace fails if already initialized', async () => {
  await fs.mkdir(TEST_DIR, { recursive: true });
  await scaffoldWorkspace(TEST_DIR);

  await expect(scaffoldWorkspace(TEST_DIR)).rejects.toThrow('Kanban2Code already initialized.');
});

describe('bundled agents scaffolding', () => {
  test('scaffoldWorkspace creates all bundled agent files', async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
    await scaffoldWorkspace(TEST_DIR);

    const kanbanRoot = path.join(TEST_DIR, KANBAN_FOLDER);
    const agentsDir = path.join(kanbanRoot, '_agents');

    // Check all bundled agents are created
    for (const filename of Object.keys(BUNDLED_AGENTS)) {
      const agentPath = path.join(agentsDir, filename);
      const stat = await fs.stat(agentPath);
      expect(stat.isFile()).toBe(true);
    }

    // Verify content of a few agents
    const roadmapper = await fs.readFile(path.join(agentsDir, 'roadmapper.md'), 'utf-8');
    expect(roadmapper).toContain('name: roadmapper');
    expect(roadmapper).toContain('type: human');

    const coder = await fs.readFile(path.join(agentsDir, 'coder.md'), 'utf-8');
    expect(coder).toContain('name: coder');
    expect(coder).toContain('type: robot');

    const auditor = await fs.readFile(path.join(agentsDir, 'auditor.md'), 'utf-8');
    expect(auditor).toContain('name: auditor');
    expect(auditor).toContain('Rating 8-10');
  });

  test('syncBundledAgents adds missing agents without overwriting existing', async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
    const kanbanRoot = path.join(TEST_DIR, KANBAN_FOLDER);
    const agentsDir = path.join(kanbanRoot, '_agents');

    // Create _agents directory and one custom agent
    await fs.mkdir(agentsDir, { recursive: true });
    const customContent = '---\nname: roadmapper\ncustom: true\n---\nCustom roadmapper';
    await fs.writeFile(path.join(agentsDir, 'roadmapper.md'), customContent);

    // Sync bundled agents
    const synced = await syncBundledAgents(TEST_DIR);

    // roadmapper.md should NOT be synced (already exists)
    expect(synced).not.toContain('roadmapper.md');

    // Other agents should be synced
    expect(synced).toContain('architect.md');
    expect(synced).toContain('splitter.md');
    expect(synced).toContain('planner.md');
    expect(synced).toContain('coder.md');
    expect(synced).toContain('auditor.md');

    // Verify custom roadmapper is preserved
    const roadmapper = await fs.readFile(path.join(agentsDir, 'roadmapper.md'), 'utf-8');
    expect(roadmapper).toContain('custom: true');

    // Verify new agents are created correctly
    const architect = await fs.readFile(path.join(agentsDir, 'architect.md'), 'utf-8');
    expect(architect).toContain('name: architect');
  });

  test('syncBundledAgents creates _agents directory if missing', async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
    const kanbanRoot = path.join(TEST_DIR, KANBAN_FOLDER);

    // Create only the kanban root, not _agents
    await fs.mkdir(kanbanRoot, { recursive: true });

    // Sync should create _agents and all bundled agents
    const synced = await syncBundledAgents(TEST_DIR);

    expect(synced.length).toBe(Object.keys(BUNDLED_AGENTS).length);

    const agentsDir = path.join(kanbanRoot, '_agents');
    const stat = await fs.stat(agentsDir);
    expect(stat.isDirectory()).toBe(true);
  });
});

afterEach(async () => {
  await fs.rm(TEST_DIR, { recursive: true, force: true });
});
