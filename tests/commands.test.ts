import * as path from 'path';
import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest';
import * as vscode from 'vscode';
import { registerCommands } from '../src/commands';

vi.mock('../src/services/scaffolder', () => ({
  scaffoldWorkspace: vi.fn(),
}));
vi.mock('../src/services/scanner', () => ({
  loadAllTasks: vi.fn(),
}));
vi.mock('../src/services/terminal-executor', () => ({
  executeTaskInTerminal: vi.fn(),
}));
vi.mock('../src/workspace/validation', () => ({
  findKanbanRoot: vi.fn(),
}));

import { scaffoldWorkspace } from '../src/services/scaffolder';
import { loadAllTasks } from '../src/services/scanner';
import { executeTaskInTerminal } from '../src/services/terminal-executor';
import { findKanbanRoot } from '../src/workspace/validation';

type CommandHandler = () => Promise<void> | void;

function createCommandRegistry() {
  const handlers = new Map<string, CommandHandler>();

  (vscode.commands.registerCommand as Mock).mockImplementation((id: string, handler: CommandHandler) => {
    handlers.set(id, handler);
    return { dispose: vi.fn() };
  });

  return handlers;
}

describe('registerCommands', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    (vscode.workspace as unknown as { workspaceFolders: unknown[] }).workspaceFolders = [
      { uri: { fsPath: '/repo' } },
    ];

    (vscode.window as unknown as { showQuickPick: Mock }).showQuickPick = vi.fn();
    (vscode.commands.executeCommand as Mock).mockResolvedValue(undefined);
    (findKanbanRoot as Mock).mockResolvedValue('/repo/.kanban2code');
  });

  test('registers all four commands', () => {
    const handlers = createCommandRegistry();
    const context = { subscriptions: [] } as unknown as vscode.ExtensionContext;

    registerCommands(context);

    expect(handlers.has('kanban2code.createWorkspace')).toBe(true);
    expect(handlers.has('kanban2code.runTask')).toBe(true);
    expect(handlers.has('kanban2code.newTask')).toBe(true);
    expect(handlers.has('kanban2code.openSettings')).toBe(true);
    expect(context.subscriptions).toHaveLength(4);
  });

  test('createWorkspace scaffolds workspace and invokes callback', async () => {
    const handlers = createCommandRegistry();
    const context = { subscriptions: [] } as unknown as vscode.ExtensionContext;
    const setKanbanRoot = vi.fn();
    const onWorkspaceCreated = vi.fn();

    registerCommands(context, { setKanbanRoot, onWorkspaceCreated });
    const run = handlers.get('kanban2code.createWorkspace');

    await run?.();

    expect(scaffoldWorkspace).toHaveBeenCalledWith('/repo');
    expect(setKanbanRoot).toHaveBeenCalledWith('/repo/.kanban2code');
    expect(onWorkspaceCreated).toHaveBeenCalledWith('/repo/.kanban2code', '/repo');
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      'Kanban2Code workspace created successfully',
    );
  });

  test('runTask only offers runnable tasks and executes selected task', async () => {
    const handlers = createCommandRegistry();
    const context = { subscriptions: [] } as unknown as vscode.ExtensionContext;

    (loadAllTasks as Mock).mockResolvedValue([
      {
        id: 'task-a',
        title: 'Task A',
        stage: 'code',
        filePath: '/repo/.kanban2code/inbox/task-a.md',
        content: '',
      },
      {
        id: 'task-b',
        title: 'Task B',
        stage: 'plan',
        provider: 'codex',
        filePath: '/repo/.kanban2code/inbox/task-b.md',
        content: '',
      },
    ]);

    (vscode.window as unknown as { showQuickPick: Mock }).showQuickPick.mockResolvedValue({
      label: 'Task B',
      taskId: 'task-b',
    });

    registerCommands(context, { getKanbanRoot: () => '/repo/.kanban2code' });
    const run = handlers.get('kanban2code.runTask');

    await run?.();

    expect(loadAllTasks).toHaveBeenCalledWith('/repo/.kanban2code');
    expect((vscode.window as unknown as { showQuickPick: Mock }).showQuickPick).toHaveBeenCalledWith(
      [
        {
          label: 'Task B',
          description: 'plan | codex',
          detail: '/repo/.kanban2code/inbox/task-b.md',
          taskId: 'task-b',
        },
      ],
      expect.objectContaining({ placeHolder: 'Select a task to run in terminal' }),
    );
    expect(executeTaskInTerminal).toHaveBeenCalledWith('/repo/.kanban2code', 'task-b', '/repo');
  });

  test('runTask shows info when there are no runnable tasks', async () => {
    const handlers = createCommandRegistry();
    const context = { subscriptions: [] } as unknown as vscode.ExtensionContext;

    (loadAllTasks as Mock).mockResolvedValue([
      {
        id: 'task-a',
        title: 'Task A',
        stage: 'code',
        filePath: '/repo/.kanban2code/inbox/task-a.md',
        content: '',
      },
    ]);

    registerCommands(context, { getKanbanRoot: () => '/repo/.kanban2code' });
    const run = handlers.get('kanban2code.runTask');

    await run?.();

    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      'No tasks with providers configured found',
    );
    expect(executeTaskInTerminal).not.toHaveBeenCalled();
  });

  test('newTask focuses sidebar and invokes focus callback', async () => {
    const handlers = createCommandRegistry();
    const context = { subscriptions: [] } as unknown as vscode.ExtensionContext;
    const focusSidebarChat = vi.fn();

    registerCommands(context, { focusSidebarChat });
    const run = handlers.get('kanban2code.newTask');

    await run?.();

    expect(vscode.commands.executeCommand).toHaveBeenCalledWith('kanban2code.sidebar.focus');
    expect(focusSidebarChat).toHaveBeenCalled();
  });

  test('openSettings reveals providers folder in explorer', async () => {
    const handlers = createCommandRegistry();
    const context = { subscriptions: [] } as unknown as vscode.ExtensionContext;

    registerCommands(context, { getKanbanRoot: () => '/repo/.kanban2code' });
    const run = handlers.get('kanban2code.openSettings');

    await run?.();

    expect(vscode.commands.executeCommand).toHaveBeenCalledWith(
      'revealInExplorer',
      expect.objectContaining({
        fsPath: path.join('/repo/.kanban2code', '_providers'),
      }),
    );
  });
});
