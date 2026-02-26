import React from 'react';
import { describe, expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BoardPanel, countBoardColumns } from '../../src/webview/ui/components/BoardPanel';
import type { WorkspaceSnapshot } from '../../src/types/snapshot';

const snapshot: WorkspaceSnapshot = {
  config: { version: '1.0.0', agents: {}, tags: { categories: {} }, stages: {}, preferences: {} },
  tasks: {
    inbox: [{ id: 'a', filePath: '/tmp/a.md', title: 'Task A', stage: 'inbox', content: 'A' }],
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
    taskCounts: { inbox: 1, plan: 0, code: 0, audit: 0, completed: 0 },
    totalTasks: 1,
    agentCount: 0,
    contextCount: 0,
    skillCount: 0,
    providerCount: 0,
  },
};

describe('BoardPanel', () => {
  test('reports fixed kanban column count', () => {
    expect(countBoardColumns(snapshot)).toBe(5);
  });

  test('renders board and task card', () => {
    const html = renderToStaticMarkup(
      <BoardPanel snapshot={snapshot} onRunTask={() => {}} onEditTask={() => {}} />,
    );

    expect(html).toContain('Board');
    expect(html).toContain('Task A');
    expect(html).toContain('Inbox');
  });
});
