import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest';
import * as vscode from 'vscode';
import { executeTaskInTerminal } from '../src/services/terminal-executor';

vi.mock('../src/services/scanner');
vi.mock('../src/services/provider-service');
vi.mock('../src/services/prompt-builder');
vi.mock('../src/runner/adapter-factory');

import { findTaskById } from '../src/services/scanner';
import { resolveProviderConfig } from '../src/services/provider-service';
import { buildXMLPrompt } from '../src/services/prompt-builder';
import { getAdapterForCli } from '../src/runner/adapter-factory';

describe('terminal-executor', () => {
  const mockTerminal = {
    name: 'Task Title',
    sendText: vi.fn(),
    show: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    (findTaskById as Mock).mockResolvedValue({
      id: 'task-1',
      filePath: '/repo/.kanban2code/inbox/task-1.md',
      title: 'Task Title',
      stage: 'code',
      provider: 'opus',
      content: 'Body',
    });

    (resolveProviderConfig as Mock).mockResolvedValue({
      cli: 'claude',
      model: 'opus-4',
      unattended_flags: [],
      output_flags: [],
      prompt_style: 'flag',
    });

    (buildXMLPrompt as Mock).mockResolvedValue('<system attr="a b">it\'s ok</system>');
    (getAdapterForCli as Mock).mockReturnValue({
      buildCommand: vi.fn(() => ({
        command: 'claude',
        args: ['-p', '<system attr="a b">it\'s ok</system>', '--model', 'opus-4'],
      })),
    });

    (vscode.window as unknown as { terminals: unknown[] }).terminals = [];
    (vscode.window as unknown as { createTerminal: Mock }).createTerminal = vi
      .fn()
      .mockReturnValue(mockTerminal);
  });

  test('creates terminal, sends quoted command, and shows terminal', async () => {
    await executeTaskInTerminal('/kanban', 'task-1', '/workspace');

    expect(findTaskById).toHaveBeenCalledWith('/kanban', 'task-1');
    expect(resolveProviderConfig).toHaveBeenCalledWith('/kanban', 'opus');
    expect(buildXMLPrompt).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'task-1', title: 'Task Title' }),
      '/kanban',
    );
    expect(getAdapterForCli).toHaveBeenCalledWith('claude');
    expect((vscode.window as unknown as { createTerminal: Mock }).createTerminal).toHaveBeenCalledWith({
      name: 'Task Title',
      cwd: '/workspace',
    });
    expect(mockTerminal.sendText).toHaveBeenCalledWith(
      `'claude' '-p' '<system attr="a b">it'\\''s ok</system>' '--model' 'opus-4'`,
    );
    expect(mockTerminal.show).toHaveBeenCalled();
  });

  test('reuses terminal with same name when present', async () => {
    (vscode.window as unknown as { terminals: unknown[] }).terminals = [mockTerminal];

    await executeTaskInTerminal('/kanban', 'task-1', '/workspace');

    expect((vscode.window as unknown as { createTerminal: Mock }).createTerminal).not.toHaveBeenCalled();
    expect(mockTerminal.sendText).toHaveBeenCalledTimes(1);
  });

  test('warns when prompt exceeds 50k chars and still executes', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    (buildXMLPrompt as Mock).mockResolvedValue('x'.repeat(50_001));
    (getAdapterForCli as Mock).mockReturnValue({
      buildCommand: vi.fn(() => ({
        command: 'claude',
        args: ['-p', 'x'.repeat(50_001)],
      })),
    });

    await executeTaskInTerminal('/kanban', 'task-1', '/workspace');

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(mockTerminal.sendText).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  test('shows error when task is not found', async () => {
    (findTaskById as Mock).mockResolvedValue(undefined);
    const showError = vscode.window.showErrorMessage as Mock;

    await expect(executeTaskInTerminal('/kanban', 'missing-task', '/workspace')).rejects.toThrow(
      'Task not found: missing-task',
    );
    expect(showError).toHaveBeenCalledWith(
      'Failed to execute task in terminal: Task not found: missing-task',
    );
  });

  test('shows error when task has no provider configured', async () => {
    (findTaskById as Mock).mockResolvedValue({
      id: 'task-1',
      filePath: '/repo/.kanban2code/inbox/task-1.md',
      title: 'Task Title',
      stage: 'code',
      content: 'Body',
    });
    const showError = vscode.window.showErrorMessage as Mock;

    await expect(executeTaskInTerminal('/kanban', 'task-1', '/workspace')).rejects.toThrow(
      'No provider configured for task "Task Title". Configure a provider first.',
    );
    expect(showError).toHaveBeenCalledWith(
      'Failed to execute task in terminal: No provider configured for task "Task Title". Configure a provider first.',
    );
  });

  test('shows error when configured provider cannot be resolved', async () => {
    (resolveProviderConfig as Mock).mockResolvedValue(undefined);
    const showError = vscode.window.showErrorMessage as Mock;

    await expect(executeTaskInTerminal('/kanban', 'task-1', '/workspace')).rejects.toThrow(
      'Provider not found: opus. Configure a valid provider in .kanban2code/_providers.',
    );
    expect(showError).toHaveBeenCalledWith(
      'Failed to execute task in terminal: Provider not found: opus. Configure a valid provider in .kanban2code/_providers.',
    );
  });

  test('shows error when CLI adapter is unsupported', async () => {
    (resolveProviderConfig as Mock).mockResolvedValue({
      cli: 'unknown-cli',
      model: 'm',
      unattended_flags: [],
      output_flags: [],
      prompt_style: 'flag',
    });
    (getAdapterForCli as Mock).mockImplementation(() => {
      throw new Error('Unsupported CLI adapter: unknown-cli');
    });
    const showError = vscode.window.showErrorMessage as Mock;

    await expect(executeTaskInTerminal('/kanban', 'task-1', '/workspace')).rejects.toThrow(
      'Unsupported CLI adapter: unknown-cli',
    );
    expect(showError).toHaveBeenCalledWith(
      'Failed to execute task in terminal: Unsupported CLI adapter: unknown-cli',
    );
  });
});
