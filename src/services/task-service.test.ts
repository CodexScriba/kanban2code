import assert from 'node:assert/strict';
import test from 'node:test';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { TaskService } from './task-service';

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
  delete: async (uri: UriLike): Promise<void> => {
    await fs.rm(uri.fsPath, { force: false });
  },
  createDirectory: async (uri: UriLike): Promise<void> => {
    await fs.mkdir(uri.fsPath, { recursive: true });
  },
  stat: async (uri: UriLike): Promise<{ type: number; ctime: number; mtime: number; size: number }> => {
    const stats = await fs.stat(uri.fsPath);
    return {
      type: stats.isDirectory() ? 2 : 1,
      ctime: stats.ctimeMs,
      mtime: stats.mtimeMs,
      size: stats.size
    };
  }
});

const createWorkspace = async (): Promise<string> => {
  return fs.mkdtemp(path.join(os.tmpdir(), 'kanban2code-task-service-'));
};

const toFileUri = (filePath: string): UriLike => ({ fsPath: filePath });

test('creates task file at correct path with valid frontmatter', async () => {
  const workspaceRoot = await createWorkspace();
  const service = new TaskService(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri,
    now: () => 1772200000000
  });

  await service.createTask({
    title: 'Build API client',
    body: 'Implement endpoints',
    stage: 'inbox'
  });

  const expectedPath = path.join(
    workspaceRoot,
    '.kanban2code',
    'inbox',
    '1772200000000-build-api-client.md'
  );

  const content = await fs.readFile(expectedPath, 'utf-8');
  assert.match(content, /^---\n/);
  assert.match(content, /stage: inbox/);
  assert.match(content, /title: Build API client/);
  assert.match(content, /Implement endpoints/);
});

test('reads task and returns typed object', async () => {
  const workspaceRoot = await createWorkspace();
  const filePath = path.join(workspaceRoot, '.kanban2code', 'inbox', '1772200001111-read-test.md');

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(
    filePath,
    `---\nstage: code\ntitle: Read test\nrole: coder\ntags:\n  - feature\ncontexts: []\nskills: []\n---\nBody\n`
  );

  const service = new TaskService(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri
  });

  const task = await service.readTask(path.join('.kanban2code', 'inbox', '1772200001111-read-test.md'));

  assert.equal(task.frontmatter.stage, 'code');
  assert.equal(task.frontmatter.title, 'Read test');
  assert.equal(task.frontmatter.role, 'coder');
  assert.equal(task.body, 'Body\n');
});

test('updates single field without clobbering others', async () => {
  const workspaceRoot = await createWorkspace();
  const relativePath = path.join('.kanban2code', 'inbox', '1772200002222-update-test.md');
  const absolutePath = path.join(workspaceRoot, relativePath);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(
    absolutePath,
    `---\nstage: plan\ntitle: Update test\nrole: planner\ntags:\n  - feature\ncontexts:\n  - skill-vscode\nskills:\n  - testing\n---\nOriginal body\n`
  );

  const service = new TaskService(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri
  });

  const updated = await service.updateTask(relativePath, {
    stage: 'code'
  });

  assert.equal(updated.frontmatter.stage, 'code');
  assert.equal(updated.frontmatter.title, 'Update test');
  assert.equal(updated.frontmatter.role, 'planner');
  assert.deepEqual(updated.frontmatter.tags, ['feature']);
  assert.deepEqual(updated.frontmatter.contexts, ['skill-vscode']);
  assert.deepEqual(updated.frontmatter.skills, ['testing']);
  assert.equal(updated.body, 'Original body\n');
});

test('persists order updates in frontmatter', async () => {
  const workspaceRoot = await createWorkspace();
  const relativePath = path.join('.kanban2code', 'inbox', '1772200002555-order-test.md');
  const absolutePath = path.join(workspaceRoot, relativePath);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(
    absolutePath,
    `---\nstage: plan\ntitle: Order test\norder: 10\ntags: []\ncontexts: []\nskills: []\n---\nBody\n`
  );

  const service = new TaskService(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri
  });

  await service.updateTask(relativePath, {
    order: 42
  });

  const persisted = await service.readTask(relativePath);
  assert.equal(persisted.frontmatter.order, 42);
});

test('deletes file from disk', async () => {
  const workspaceRoot = await createWorkspace();
  const relativePath = path.join('.kanban2code', 'inbox', '1772200003333-delete-test.md');
  const absolutePath = path.join(workspaceRoot, relativePath);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, '---\nstage: inbox\n---\nBody\n');

  const service = new TaskService(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri
  });

  await service.deleteTask(relativePath);

  await assert.rejects(async () => fs.stat(absolutePath));
});

test('stage change updates frontmatter', async () => {
  const workspaceRoot = await createWorkspace();
  const relativePath = path.join('.kanban2code', 'inbox', '1772200004444-move-test.md');
  const absolutePath = path.join(workspaceRoot, relativePath);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(
    absolutePath,
    `---\nstage: code\ntitle: Move me\ntags: []\ncontexts: []\nskills: []\n---\nBody\n`
  );

  const service = new TaskService(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri
  });

  const moved = await service.moveTask(relativePath, 'audit');

  assert.equal(moved.frontmatter.stage, 'audit');
  const persisted = await service.readTask(relativePath);
  assert.equal(persisted.frontmatter.stage, 'audit');
});

test('handles filename collisions by appending a counter suffix', async () => {
  const workspaceRoot = await createWorkspace();
  const service = new TaskService(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri,
    now: () => 1772200005555
  });

  await service.createTask({ title: 'Collision test' });
  await service.createTask({ title: 'Collision test' });

  const first = path.join(
    workspaceRoot,
    '.kanban2code',
    'inbox',
    '1772200005555-collision-test.md'
  );
  const second = path.join(
    workspaceRoot,
    '.kanban2code',
    'inbox',
    '1772200005555-collision-test-1.md'
  );

  const [firstStat, secondStat] = await Promise.all([fs.stat(first), fs.stat(second)]);
  assert.equal(firstStat.isFile(), true);
  assert.equal(secondStat.isFile(), true);
});
