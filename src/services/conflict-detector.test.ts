import assert from 'node:assert/strict';
import test from 'node:test';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { ConflictDetector } from './conflict-detector';
import { TelemetryLogger } from './telemetry-logger';

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

const toFileUri = (filePath: string): UriLike => ({ fsPath: filePath });

const createWorkspace = async (): Promise<string> => {
  return fs.mkdtemp(path.join(os.tmpdir(), 'kanban2code-conflict-detector-'));
};

const waitForMtimeTick = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 15));
};

test('returns no conflict when file is unchanged since open', async () => {
  const workspaceRoot = await createWorkspace();
  const adapter = createNodeFsAdapter();
  const filePath = path.join('.kanban2code', 'inbox', '1772-no-conflict.md');
  const absolutePath = path.join(workspaceRoot, filePath);
  const content = 'initial content';

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, content, 'utf8');

  const detector = new ConflictDetector(workspaceRoot, {
    fs: adapter,
    toFileUri
  });

  await detector.openFile(filePath, content);
  const result = await detector.checkConflict(filePath, content);

  assert.equal(result.hasConflict, false);
});

test('detects conflict after external file changes and logs telemetry', async () => {
  const workspaceRoot = await createWorkspace();
  const adapter = createNodeFsAdapter();
  const filePath = path.join('.kanban2code', 'inbox', '1772-conflict.md');
  const absolutePath = path.join(workspaceRoot, filePath);
  const openedContent = 'opened content';
  const diskContent = 'disk changed content';
  const localUnsaved = 'local unsaved content';

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, openedContent, 'utf8');

  const telemetry = new TelemetryLogger(workspaceRoot, {
    fs: adapter,
    toFileUri,
    now: () => new Date('2026-03-01T09:00:00.000Z')
  });
  const detector = new ConflictDetector(workspaceRoot, {
    fs: adapter,
    toFileUri,
    telemetryLogger: telemetry
  });

  await detector.openFile(filePath, openedContent);
  await waitForMtimeTick();
  await fs.writeFile(absolutePath, diskContent, 'utf8');

  const result = await detector.checkConflict(filePath, localUnsaved);

  assert.equal(result.hasConflict, true);
  assert.equal(result.diskVersion, diskContent);
  assert.equal(result.localVersion, localUnsaved);

  const telemetryPath = path.join(workspaceRoot, '.kanban2code', '_logs', 'telemetry-20260301.jsonl');
  const records = (await fs.readFile(telemetryPath, 'utf8'))
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as Record<string, unknown>);
  assert.equal(records.length, 1);
  assert.equal(records[0].eventType, 'file_conflict_detected');
  assert.equal(records[0].filePath, filePath);
});

test('creates recovery snapshot and uses suffix when base snapshot exists', async () => {
  const workspaceRoot = await createWorkspace();
  const adapter = createNodeFsAdapter();
  const filePath = path.join('.kanban2code', 'inbox', '1772-snapshot.md');

  const detector = new ConflictDetector(workspaceRoot, {
    fs: adapter,
    toFileUri,
    now: () => 1772300000000
  });

  const firstRelative = await detector.createRecoverySnapshot(filePath, 'snapshot v1');
  const secondRelative = await detector.createRecoverySnapshot(filePath, 'snapshot v2');

  assert.equal(firstRelative, path.join('.kanban2code', '.recovery', '1772-snapshot.md.bak'));
  assert.equal(
    secondRelative,
    path.join('.kanban2code', '.recovery', '1772-snapshot.md.bak.1772300000000')
  );

  const firstContent = await fs.readFile(path.join(workspaceRoot, firstRelative), 'utf8');
  const secondContent = await fs.readFile(path.join(workspaceRoot, secondRelative), 'utf8');
  assert.equal(firstContent, 'snapshot v1');
  assert.equal(secondContent, 'snapshot v2');
});

test('clearFingerprint removes tracking entry for file', async () => {
  const workspaceRoot = await createWorkspace();
  const adapter = createNodeFsAdapter();
  const filePath = path.join('.kanban2code', 'inbox', '1772-clear.md');
  const absolutePath = path.join(workspaceRoot, filePath);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, 'v1', 'utf8');

  const detector = new ConflictDetector(workspaceRoot, {
    fs: adapter,
    toFileUri
  });

  await detector.openFile(filePath, 'v1');
  detector.clearFingerprint(filePath);
  await waitForMtimeTick();
  await fs.writeFile(absolutePath, 'v2', 'utf8');

  const result = await detector.checkConflict(filePath, 'local');
  assert.equal(result.hasConflict, false);
});
