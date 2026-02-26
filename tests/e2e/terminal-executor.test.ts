import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { TEST_WORKSPACE, e2eUtils } from './setup';

const mockTerminal = {
  name: 'Terminal E2E Task',
  sendText: vi.fn(),
  show: vi.fn(),
};

vi.mock('vscode', () => ({
  window: {
    terminals: [] as Array<{ name: string; sendText: (text: string) => void; show: () => void }>,
    createTerminal: vi.fn(() => mockTerminal),
    showErrorMessage: vi.fn(),
    showWarningMessage: vi.fn(),
  },
  workspace: {
    createFileSystemWatcher: vi.fn(() => ({
      onDidChange: vi.fn(),
      onDidCreate: vi.fn(),
      onDidDelete: vi.fn(),
      dispose: vi.fn(),
    })),
  },
  RelativePattern: class RelativePattern {
    constructor(
      public base: string,
      public pattern: string,
    ) {}
  },
  EventEmitter: class EventEmitter<T> {
    event = vi.fn();
    fire = vi.fn((_data?: T) => {});
    dispose = vi.fn();
  },
}));

import * as vscode from 'vscode';
import { executeTaskInTerminal } from '../../src/services/terminal-executor';

describe('E2E: terminal executor integration seam', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await e2eUtils.cleanWorkspace();
    await e2eUtils.createKanbanWorkspace();

    (vscode.window as unknown as { terminals: unknown[] }).terminals = [];
    (vscode.window as unknown as { createTerminal: Mock }).createTerminal = vi
      .fn()
      .mockReturnValue(mockTerminal);
  });

  it('builds terminal command with shell-quoted prompt and sends it to terminal', async () => {
    const taskFile = await e2eUtils.createTask('Terminal E2E Task', 'code', {
      agent: 'coder',
      content: "Need apostrophe's handling in prompt",
    });

    const taskId = path.basename(taskFile, '.md');
    const kanbanRoot = path.join(TEST_WORKSPACE, '.kanban2code');

    fs.mkdirSync(path.join(kanbanRoot, '_providers'), { recursive: true });
    fs.writeFileSync(
      path.join(kanbanRoot, '_providers', 'codex.md'),
      [
        '---',
        'name: Codex',
        'cli: codex',
        'model: gpt-5',
        'unattended_flags: []',
        'output_flags: []',
        'prompt_style: stdin',
        '---',
        'Provider config',
        '',
      ].join('\n'),
      'utf-8',
    );

    const original = fs.readFileSync(taskFile, 'utf-8');
    fs.writeFileSync(taskFile, original.replace('agent: coder', 'agent: coder\nprovider: codex'), 'utf-8');

    await executeTaskInTerminal(kanbanRoot, taskId, TEST_WORKSPACE);

    expect((vscode.window as unknown as { createTerminal: Mock }).createTerminal).toHaveBeenCalledWith({
      name: 'Terminal E2E Task',
      cwd: TEST_WORKSPACE,
    });

    expect(mockTerminal.sendText).toHaveBeenCalledTimes(1);
    const commandText = (mockTerminal.sendText as Mock).mock.calls[0][0] as string;

    expect(commandText).toContain("'codex'");
    expect(commandText).toContain("'--model' 'gpt-5'");
    expect(commandText).toContain("printf %s '");
    expect(commandText).toContain('apostrophe&apos;s');
    expect(mockTerminal.show).toHaveBeenCalledTimes(1);
  });

  it('reuses an existing terminal with matching task title', async () => {
    const taskFile = await e2eUtils.createTask('Terminal E2E Task', 'code', { content: 'Body' });
    const taskId = path.basename(taskFile, '.md');
    const kanbanRoot = path.join(TEST_WORKSPACE, '.kanban2code');

    fs.mkdirSync(path.join(kanbanRoot, '_providers'), { recursive: true });
    fs.writeFileSync(
      path.join(kanbanRoot, '_providers', 'codex.md'),
      [
        '---',
        'name: Codex',
        'cli: codex',
        'model: gpt-5',
        'unattended_flags: []',
        'output_flags: []',
        'prompt_style: stdin',
        '---',
        '',
      ].join('\n'),
      'utf-8',
    );

    const original = fs.readFileSync(taskFile, 'utf-8');
    fs.writeFileSync(taskFile, original.replace('created:', 'provider: codex\ncreated:'), 'utf-8');

    (vscode.window as unknown as { terminals: unknown[] }).terminals = [mockTerminal];

    await executeTaskInTerminal(kanbanRoot, taskId, TEST_WORKSPACE);

    expect((vscode.window as unknown as { createTerminal: Mock }).createTerminal).not.toHaveBeenCalled();
    expect(mockTerminal.sendText).toHaveBeenCalledTimes(1);
  });
});
