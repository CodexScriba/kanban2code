// @vitest-environment jsdom
import './setup-dom';
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import './setup-matchers';

afterEach(() => cleanup());

describe('TaskItem', () => {
  test('displays formatted title for roadmap task ids', async () => {
    const { TaskItem } = await import('../../src/webview/ui/components/TaskItem');
    const task = {
      id: 'task1.2-remove-template-service',
      filePath: '/tmp/task1.2-remove-template-service.md',
      title: 'Remove Template Service',
      stage: 'plan',
      content: '',
    } as any;

    render(<TaskItem task={task} onClick={vi.fn()} />);

    expect(screen.getByText('1.2 Remove Template Service')).toBeInTheDocument();
  });
});

