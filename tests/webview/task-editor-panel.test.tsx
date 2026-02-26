import React from 'react';
import { describe, expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TaskEditorPanel } from '../../src/webview/ui/components/TaskEditorPanel';
import { createSavePayload } from '../../src/webview/ui/hooks/useTaskEditor';
import type { Task } from '../../src/types/task';

const task: Task = {
  id: 'task-1',
  filePath: '/tmp/task-1.md',
  title: 'Task 1',
  stage: 'plan',
  agent: 'planner',
  provider: 'sonnet',
  tags: ['feature'],
  contexts: ['architecture.md'],
  skills: ['react-core-skills'],
  content: '# Task 1\n\nBody',
};

describe('TaskEditorPanel', () => {
  test('builds save payload from task draft', () => {
    const payload = createSavePayload(task, {
      title: 'Task 1 updated',
      stage: 'code',
      agent: 'coder',
      provider: 'codex',
      tags: 'feature, ui',
      contexts: 'architecture.md',
      skills: 'react-core-skills',
      content: '# Task 1 updated',
    });

    expect(payload.title).toBe('Task 1 updated');
    expect(payload.stage).toBe('code');
    expect(payload.tags).toEqual(['feature', 'ui']);
  });

  test('renders editor shell when open', () => {
    const html = renderToStaticMarkup(
      <TaskEditorPanel task={task} open={true} onClose={() => {}} onSave={() => {}} />,
    );

    expect(html).toContain('Edit Task');
    expect(html).toContain('Task body');
  });
});
