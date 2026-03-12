import assert from 'node:assert/strict';
import test from 'node:test';
import { getMockSidebarResponse, resolveSidebarChatResponse } from './sidebar-chat-router';
import type { TaskSnapshotItem } from '../types/task';

const task: TaskSnapshotItem = {
  id: '.kanban2code/inbox/123-demo.md',
  taskId: '123-demo',
  title: 'Demo task',
  description: 'A task used for routing tests.',
  stage: 'code',
  tags: ['chat'],
  createdAt: 123,
  project: 'roadmap'
};

test('getMockSidebarResponse preserves the existing non-Alibaba host message', () => {
  assert.equal(
    getMockSidebarResponse('codex', task),
    'Context received (code • Demo task) via provider codex.'
  );
  assert.equal(getMockSidebarResponse('kimi', null), 'Context received (general chat) via provider kimi.');
});

test('resolveSidebarChatResponse calls AlibabaService for the alibaba provider', async () => {
  let capturedProject: string | undefined;
  let capturedMessage = '';
  let capturedTask: TaskSnapshotItem | null | undefined;

  const result = await resolveSidebarChatResponse('alibaba', 'Ship it.', task, {
    sendMessage: async (request, projectSlug) => {
      capturedProject = projectSlug;
      capturedMessage = request.message;
      capturedTask = request.selectedTask;
      return 'Alibaba reply';
    }
  });

  assert.equal(result, 'Alibaba reply');
  assert.equal(capturedProject, 'roadmap');
  assert.equal(capturedMessage, 'Ship it.');
  assert.deepEqual(capturedTask, task);
});

test('resolveSidebarChatResponse surfaces AlibabaService errors to chat history', async () => {
  const result = await resolveSidebarChatResponse('alibaba', 'Ship it.', null, {
    sendMessage: async () => {
      throw new Error('Invalid API key');
    }
  });

  assert.equal(result, 'Alibaba error: Invalid API key');
});

test('resolveSidebarChatResponse keeps the old behavior for other providers', async () => {
  const result = await resolveSidebarChatResponse('claude', 'Ship it.', task, {
    sendMessage: async () => {
      throw new Error('should not be called');
    }
  });

  assert.equal(result, 'Context received (code • Demo task) via provider claude.');
});
