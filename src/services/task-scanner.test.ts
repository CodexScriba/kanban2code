import assert from 'node:assert/strict';
import test from 'node:test';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { TaskScanner, type TaskScannerRuntime } from './task-scanner';

interface UriLike {
  fsPath: string;
}

interface DisposableLike {
  dispose(): void;
}

type Listener<T> = (event: T) => unknown;

class FakeEventEmitter<T> {
  private readonly listeners = new Set<Listener<T>>();

  readonly event = (listener: Listener<T>): DisposableLike => {
    this.listeners.add(listener);
    return {
      dispose: () => {
        this.listeners.delete(listener);
      }
    };
  };

  fire(data: T): void {
    for (const listener of this.listeners) {
      listener(data);
    }
  }

  dispose(): void {
    this.listeners.clear();
  }
}

class FakeWatcher {
  private readonly createListeners = new Set<Listener<UriLike>>();
  private readonly changeListeners = new Set<Listener<UriLike>>();
  private readonly deleteListeners = new Set<Listener<UriLike>>();

  onDidCreate(listener: Listener<UriLike>): DisposableLike {
    this.createListeners.add(listener);
    return {
      dispose: () => {
        this.createListeners.delete(listener);
      }
    };
  }

  onDidChange(listener: Listener<UriLike>): DisposableLike {
    this.changeListeners.add(listener);
    return {
      dispose: () => {
        this.changeListeners.delete(listener);
      }
    };
  }

  onDidDelete(listener: Listener<UriLike>): DisposableLike {
    this.deleteListeners.add(listener);
    return {
      dispose: () => {
        this.deleteListeners.delete(listener);
      }
    };
  }

  fireCreate(uri: UriLike): void {
    for (const listener of this.createListeners) {
      listener(uri);
    }
  }

  fireChange(uri: UriLike): void {
    for (const listener of this.changeListeners) {
      listener(uri);
    }
  }

  fireDelete(uri: UriLike): void {
    for (const listener of this.deleteListeners) {
      listener(uri);
    }
  }

  dispose(): void {
    this.createListeners.clear();
    this.changeListeners.clear();
    this.deleteListeners.clear();
  }
}

const INBOX_GLOB = '.kanban2code/inbox/**/*.md';
const PROJECT_GLOB = '.kanban2code/projects/**/*.md';

const createWorkspace = async (): Promise<string> => {
  return fs.mkdtemp(path.join(os.tmpdir(), 'kanban2code-task-scanner-'));
};

const writeTaskFile = async (workspaceRoot: string, relativePath: string, content: string): Promise<UriLike> => {
  const absolutePath = path.join(workspaceRoot, relativePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, content, 'utf8');
  return { fsPath: absolutePath };
};

const collectMarkdownFiles = async (root: string): Promise<UriLike[]> => {
  const items = await fs.readdir(root, { withFileTypes: true });
  const uris: UriLike[] = [];

  for (const item of items) {
    const entryPath = path.join(root, item.name);
    if (item.isDirectory()) {
      const nested = await collectMarkdownFiles(entryPath);
      uris.push(...nested);
      continue;
    }

    if (item.isFile() && item.name.endsWith('.md')) {
      uris.push({ fsPath: entryPath });
    }
  }

  return uris;
};

const createRuntime = (workspaceRoot: string): { runtime: TaskScannerRuntime; watcher: FakeWatcher } => {
  const watcher = new FakeWatcher();

  const runtime: TaskScannerRuntime = {
    findFiles: async (globPattern): Promise<UriLike[]> => {
      if (globPattern === INBOX_GLOB) {
        return collectMarkdownFiles(path.join(workspaceRoot, '.kanban2code', 'inbox')).catch(() => []);
      }

      if (globPattern === PROJECT_GLOB) {
        return collectMarkdownFiles(path.join(workspaceRoot, '.kanban2code', 'projects')).catch(() => []);
      }

      return [];
    },
    readFile: async (uri): Promise<Uint8Array> => {
      const buffer = await fs.readFile(uri.fsPath);
      return new Uint8Array(buffer);
    },
    toRelativePath: (uri): string => {
      return path.relative(workspaceRoot, uri.fsPath).split(path.sep).join(path.posix.sep);
    },
    createWatcher: (): FakeWatcher => watcher,
    createEventEmitter: <T>(): FakeEventEmitter<T> => new FakeEventEmitter<T>()
  };

  return { runtime, watcher };
};

test('scans inbox and project task files with snapshot metadata', async () => {
  const workspaceRoot = await createWorkspace();

  await writeTaskFile(
    workspaceRoot,
    '.kanban2code/inbox/1772200000000-capture-user-feedback.md',
    `---
stage: inbox
title: Capture user feedback
priority: high
role: planner
tags:
  - feature
  - ux
---
Body
`
  );
  await writeTaskFile(
    workspaceRoot,
    '.kanban2code/projects/roadmap/1772200001000-implement-scanner.md',
    `---
stage: code
order: 17
priority: medium
tags: [backend]
---
# Implement scanner
`
  );

  const { runtime } = createRuntime(workspaceRoot);
  const scanner = new TaskScanner(runtime);
  const tasks = await scanner.scan();
  scanner.dispose();

  assert.equal(tasks.length, 2);

  const inboxTask = tasks.find((task) => task.stage === 'inbox');
  assert.ok(inboxTask);
  assert.equal(inboxTask.taskId, '1772200000000-capture-user-feedback');
  assert.equal(inboxTask.description, 'Body');
  assert.equal(inboxTask.priority, 'high');
  assert.equal(inboxTask.role, 'planner');
  assert.deepEqual(inboxTask.tags, ['feature', 'ux']);
  assert.equal(inboxTask.project, undefined);

  const projectTask = tasks.find((task) => task.stage === 'code');
  assert.ok(projectTask);
  assert.equal(projectTask.title, 'Implement scanner');
  assert.equal(projectTask.order, 17);
  assert.equal(projectTask.project, 'roadmap');
  assert.equal(projectTask.createdAt, 1772200001000);
});

test('filters by stage, priority, and project', async () => {
  const workspaceRoot = await createWorkspace();

  await writeTaskFile(
    workspaceRoot,
    '.kanban2code/inbox/1772200100000-prioritize-bugs.md',
    `---
stage: plan
priority: high
tags: [triage]
---
# Prioritize bugs
`
  );
  await writeTaskFile(
    workspaceRoot,
    '.kanban2code/projects/app/1772200200000-build-ui.md',
    `---
stage: code
priority: medium
tags: [ui]
---
# Build UI
`
  );
  await writeTaskFile(
    workspaceRoot,
    '.kanban2code/projects/platform/1772200300000-security-review.md',
    `---
stage: audit
priority: low
tags: [security]
---
# Security review
`
  );

  const { runtime } = createRuntime(workspaceRoot);
  const scanner = new TaskScanner(runtime);

  const codeOnly = await scanner.scan({ filters: { stage: 'code' } });
  assert.equal(codeOnly.length, 1);
  assert.equal(codeOnly[0].title, 'Build UI');

  const highPriority = await scanner.scan({ filters: { priority: 'high' } });
  assert.equal(highPriority.length, 1);
  assert.equal(highPriority[0].title, 'Prioritize bugs');

  const appProject = await scanner.scan({ filters: { project: 'app' } });
  assert.equal(appProject.length, 1);
  assert.equal(appProject[0].project, 'app');

  scanner.dispose();
});

test('search matches title, tags, and taskId case-insensitively', async () => {
  const workspaceRoot = await createWorkspace();

  await writeTaskFile(
    workspaceRoot,
    '.kanban2code/inbox/1772200400000-generate-release-notes.md',
    `---
stage: plan
title: Generate Release Notes
tags:
  - Docs
---
Body
`
  );
  await writeTaskFile(
    workspaceRoot,
    '.kanban2code/projects/docs/1772200500000-migrate-api-guide.md',
    `---
stage: code
tags:
  - migration
---
# Migrate API guide
`
  );

  const { runtime } = createRuntime(workspaceRoot);
  const scanner = new TaskScanner(runtime);

  const byTitle = await scanner.scan({ filters: { search: 'release' } });
  assert.equal(byTitle.length, 1);
  assert.equal(byTitle[0].title, 'Generate Release Notes');

  const byTag = await scanner.scan({ filters: { search: 'MIGRAT' } });
  assert.equal(byTag.length, 1);
  assert.equal(byTag[0].taskId, '1772200500000-migrate-api-guide');

  const byTaskId = await scanner.scan({ filters: { search: '0400000-GENERATE' } });
  assert.equal(byTaskId.length, 1);
  assert.equal(byTaskId[0].taskId, '1772200400000-generate-release-notes');

  scanner.dispose();
});

test('sorts newest-first using taskId as stable tiebreaker', async () => {
  const workspaceRoot = await createWorkspace();

  await writeTaskFile(
    workspaceRoot,
    '.kanban2code/inbox/1772200600000-beta-task.md',
    `---
stage: inbox
tags: []
---
# Beta task
`
  );
  await writeTaskFile(
    workspaceRoot,
    '.kanban2code/inbox/1772200600000-alpha-task.md',
    `---
stage: inbox
tags: []
---
# Alpha task
`
  );
  await writeTaskFile(
    workspaceRoot,
    '.kanban2code/inbox/1772200700000-latest-task.md',
    `---
stage: inbox
tags: []
---
# Latest task
`
  );

  const { runtime } = createRuntime(workspaceRoot);
  const scanner = new TaskScanner(runtime);
  const tasks = await scanner.scan();
  scanner.dispose();

  assert.deepEqual(
    tasks.map((task) => task.taskId),
    ['1772200700000-latest-task', '1772200600000-alpha-task', '1772200600000-beta-task']
  );
});

test('file watcher emits refresh events on create/change/delete', async () => {
  const workspaceRoot = await createWorkspace();

  const existingUri = await writeTaskFile(
    workspaceRoot,
    '.kanban2code/inbox/1772200800000-existing-task.md',
    `---
stage: inbox
tags: []
---
# Existing task
`
  );

  const { runtime, watcher } = createRuntime(workspaceRoot);
  const scanner = new TaskScanner(runtime);
  const refreshEvents: number[] = [];

  const subscription = scanner.onDidRefresh(() => {
    refreshEvents.push(Date.now());
  });

  await scanner.scan();

  watcher.fireCreate(existingUri);
  watcher.fireChange(existingUri);
  watcher.fireDelete(existingUri);

  assert.equal(refreshEvents.length, 3);

  subscription.dispose();
  scanner.dispose();
});
