import assert from 'node:assert/strict';
import test from 'node:test';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
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
  }
});

const toFileUri = (filePath: string): UriLike => ({ fsPath: filePath });

const createWorkspace = async (): Promise<string> => {
  return fs.mkdtemp(path.join(os.tmpdir(), 'kanban2code-telemetry-logger-'));
};

test('writes event to daily telemetry jsonl file', async () => {
  const workspaceRoot = await createWorkspace();
  const logger = new TelemetryLogger(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri,
    now: () => new Date('2026-03-01T12:34:56.000Z')
  });

  await logger.logEvent('file_conflict_detected', {
    taskId: '1772-test-task',
    filePath: '.kanban2code/inbox/1772-test-task.md',
    metadata: { source: 'unit-test' }
  });

  const logPath = path.join(workspaceRoot, '.kanban2code', '_logs', 'telemetry-20260301.jsonl');
  const lines = (await fs.readFile(logPath, 'utf8')).trim().split('\n');
  assert.equal(lines.length, 1);

  const record = JSON.parse(lines[0]) as Record<string, unknown>;
  assert.equal(record.eventType, 'file_conflict_detected');
  assert.equal(record.timestamp, '2026-03-01T12:34:56.000Z');
  assert.equal(record.taskId, '1772-test-task');
  assert.equal(record.filePath, '.kanban2code/inbox/1772-test-task.md');
});

test('appends multiple events to same daily log file', async () => {
  const workspaceRoot = await createWorkspace();
  const logger = new TelemetryLogger(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri,
    now: () => new Date('2026-03-01T00:00:00.000Z')
  });

  await logger.logEvent('file_conflict_detected');
  await logger.logConflictEvent('file_conflict_compare_opened', '.kanban2code/inbox/a.md', {
    selectedSide: 'disk'
  });

  const logPath = path.join(workspaceRoot, '.kanban2code', '_logs', 'telemetry-20260301.jsonl');
  const lines = (await fs.readFile(logPath, 'utf8')).trim().split('\n');
  assert.equal(lines.length, 2);

  const first = JSON.parse(lines[0]) as Record<string, unknown>;
  const second = JSON.parse(lines[1]) as Record<string, unknown>;
  assert.equal(first.eventType, 'file_conflict_detected');
  assert.equal(second.eventType, 'file_conflict_compare_opened');
  assert.equal(second.filePath, '.kanban2code/inbox/a.md');
});
