import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TaskEditorPanel, confirmCloseIfDirty } from '../../src/webview/ui/components/TaskEditorPanel';
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

  test('asks for confirmation when closing with unsaved changes', () => {
    const confirmDiscard = vi.fn(() => false);
    const shouldClose = confirmCloseIfDirty(true, confirmDiscard);
    expect(shouldClose).toBe(false);
    expect(confirmDiscard).toHaveBeenCalledTimes(1);
  });

  test('allows both close and cancel paths when clean', () => {
    const confirmDiscard = vi.fn(() => true);
    const shouldClose = confirmCloseIfDirty(false, confirmDiscard);
    expect(shouldClose).toBe(true);
    expect(confirmDiscard).not.toHaveBeenCalled();
  });
});
