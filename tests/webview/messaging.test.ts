import { describe, expect, expectTypeOf, test } from 'vitest';
import {
  type CancelStreamPayload,
  type ErrorPayload,
  type FocusChatInputPayload,
  type GenerateTaskPayload,
  type InitStatePayload,
  type MessagePayloadMap,
  type RequestStatePayload,
  type RunTaskPayload,
  type SaveTaskPayload,
  type SendMessagePayload,
  type StreamChunkPayload,
  type TaskGeneratedPayload,
  type WorkspaceUpdatedPayload,
  MESSAGE_VERSION,
  createEnvelope,
  validateEnvelope,
} from '../../src/webview/messaging';

const baseSnapshot = {
  config: { version: '1.0.0' },
  tasks: {
    inbox: [],
    plan: [],
    code: [],
    audit: [],
    completed: [],
  },
  agents: [],
  contexts: [],
  skills: [],
  providers: [],
  metadata: {
    taskCounts: {
      inbox: 0,
      plan: 0,
      code: 0,
      audit: 0,
      completed: 0,
    },
    totalTasks: 0,
    agentCount: 0,
    contextCount: 0,
    skillCount: 0,
    providerCount: 0,
  },
} satisfies InitStatePayload['workspaceSnapshot'];

const baseProvider = {
  cli: 'codex',
  model: 'gpt-5',
  unattended_flags: ['--unsafe-bypass-approvals-and-sandbox'],
  output_flags: [],
  prompt_style: 'stdin',
} satisfies NonNullable<InitStatePayload['activeProvider']>;

describe('webview messaging protocol v2', () => {
  test('round-trips every message type', () => {
    const payloads: MessagePayloadMap = {
      InitState: {
        kanbanRootExists: true,
        workspaceSnapshot: baseSnapshot,
        activeProvider: baseProvider,
      },
      StreamChunk: {
        token: 'hello',
      },
      MessageComplete: {},
      TaskGenerated: {
        path: '.kanban2code/projects/demo/task.md',
        title: 'Demo Task',
      },
      WorkspaceUpdated: {
        workspaceSnapshot: baseSnapshot,
      },
      Error: {
        message: 'oops',
      },
      FocusChatInput: {},
      RequestState: {},
      SendMessage: {
        role: 'user',
        content: 'Generate a task for this bug',
        providerId: 'codex',
      },
      GenerateTask: {
        title: 'Fix bug',
        description: 'Need to fix a regression',
        stage: 'plan',
      },
      RunTask: {
        taskFilePath: '.kanban2code/projects/demo/task.md',
        allRemaining: true,
      },
      SaveTask: {
        taskFilePath: '.kanban2code/projects/demo/task.md',
        title: 'Updated Demo Task',
        stage: 'code',
        content: '# Updated',
      },
      CancelStream: {},
    };

    for (const [type, payload] of Object.entries(payloads)) {
      const envelope = createEnvelope(type as keyof MessagePayloadMap, payload as never);
      const validated = validateEnvelope(envelope);

      expect(validated.version).toBe(MESSAGE_VERSION);
      expect(validated.type).toBe(type);
      expect(validated.payload).toEqual(payload);
    }
  });

  test('rejects invalid version', () => {
    expect(() =>
      validateEnvelope({
        version: 1,
        type: 'RequestState',
        payload: {},
      }),
    ).toThrow(/Invalid message envelope/);
  });

  test('rejects unknown message type', () => {
    expect(() =>
      validateEnvelope({
        version: MESSAGE_VERSION,
        type: 'RunnerStateChanged',
        payload: {},
      }),
    ).toThrow(/Invalid message envelope/);
  });

  test('rejects payload schema mismatch with path details', () => {
    expect(() =>
      validateEnvelope({
        version: MESSAGE_VERSION,
        type: 'StreamChunk',
        payload: {},
      }),
    ).toThrow(/payload/);
  });

  test('preserves type inference for message payloads', () => {
    const sendMessagePayload: SendMessagePayload = {
      role: 'user',
      content: 'hello',
      providerId: 'codex',
    };
    const sendEnvelope = createEnvelope('SendMessage', sendMessagePayload);

    expectTypeOf(sendEnvelope.payload).toMatchTypeOf<SendMessagePayload>();

    const typedValidated = validateEnvelope<'GenerateTask'>({
      version: MESSAGE_VERSION,
      type: 'GenerateTask',
      payload: {
        title: 'Title',
        description: 'Body',
        stage: 'code',
      },
    });

    expectTypeOf(typedValidated.payload).toMatchTypeOf<GenerateTaskPayload>();
  });

  test('exports all payload types without any', () => {
    const initStatePayload: InitStatePayload = {
      kanbanRootExists: true,
      workspaceSnapshot: baseSnapshot,
      activeProvider: null,
    };
    const streamChunkPayload: StreamChunkPayload = { token: 'chunk' };
    const taskGeneratedPayload: TaskGeneratedPayload = { path: 'a.md', title: 'A' };
    const workspaceUpdatedPayload: WorkspaceUpdatedPayload = { workspaceSnapshot: baseSnapshot };
    const errorPayload: ErrorPayload = { message: 'error' };
    const focusChatInputPayload: FocusChatInputPayload = {};
    const requestStatePayload: RequestStatePayload = {};
    const runTaskPayload: RunTaskPayload = { taskFilePath: 'a.md', allRemaining: true };
    const saveTaskPayload: SaveTaskPayload = {
      taskFilePath: 'a.md',
      title: 'A',
      stage: 'plan',
      content: '# A',
    };
    const cancelStreamPayload: CancelStreamPayload = {};

    expect(initStatePayload.kanbanRootExists).toBe(true);
    expect(streamChunkPayload.token).toBe('chunk');
    expect(taskGeneratedPayload.title).toBe('A');
    expect(workspaceUpdatedPayload.workspaceSnapshot).toEqual(baseSnapshot);
    expect(errorPayload.message).toBe('error');
    expect(focusChatInputPayload).toEqual({});
    expect(requestStatePayload).toEqual({});
    expect(runTaskPayload.taskFilePath).toBe('a.md');
    expect(runTaskPayload.allRemaining).toBe(true);
    expect(saveTaskPayload.title).toBe('A');
    expect(cancelStreamPayload).toEqual({});
  });
});
