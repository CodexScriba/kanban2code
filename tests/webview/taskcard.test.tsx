import './setup-dom';
import React from 'react';
import { expect, test, vi, beforeAll, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import './setup-matchers';

let postMessageSpy = vi.fn();

beforeAll(() => {
  (globalThis as any).acquireVsCodeApi = () => ({ postMessage: postMessageSpy });
});

afterEach(() => postMessageSpy.mockClear());
afterEach(() => cleanup());

test('TaskCard calls onOpen when clicked', async () => {
  const { TaskCard } = await import('../../src/webview/ui/components/TaskCard');
  const onOpen = vi.fn();
  const task = {
    id: 't1',
    filePath: '/tmp/t1.md',
    title: 'Hello',
    stage: 'inbox',
    content: '',
  } as any;

  render(<TaskCard task={task} onOpen={onOpen} />);

  screen.getByRole('button', { name: /open task hello/i }).click();
  expect(onOpen).toHaveBeenCalledWith(task);
});
