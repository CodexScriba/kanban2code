import React from 'react';
import { describe, expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TaskCard, taskCardLabels } from '../../src/webview/ui/components/TaskCard';
import type { Task } from '../../src/types/task';

const task: Task = {
  id: 'task-a',
  filePath: '/tmp/task-a.md',
  title: 'Task A',
  stage: 'code',
  agent: 'coder',
  tags: ['api', 'feature'],
  content: 'Body',
};

describe('TaskCard', () => {
  test('composes agent + tag labels', () => {
    expect(taskCardLabels(task)).toEqual(['coder', 'api', 'feature']);
  });

  test('renders run and edit controls', () => {
    const html = renderToStaticMarkup(
      <TaskCard task={task} onRun={() => {}} onEdit={() => {}} />,
    );

    expect(html).toContain('Task A');
    expect(html).toContain('Run Task A');
    expect(html).toContain('Edit Task A');
  });
});
