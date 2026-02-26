import React from 'react';
import { describe, expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { WorkspaceBar, formatWorkspaceCounts } from '../../src/webview/ui/components/WorkspaceBar';
import type { WorkspaceSnapshot } from '../../src/types/snapshot';

const snapshot: WorkspaceSnapshot = {
  config: { version: '1.0.0', agents: {}, tags: { categories: {} }, stages: {}, preferences: {} },
  tasks: { inbox: [], plan: [], code: [], audit: [], completed: [] },
  agents: [],
  contexts: [],
  skills: [],
  providers: [],
  metadata: {
    taskCounts: { inbox: 2, plan: 1, code: 3, audit: 1, completed: 4 },
    totalTasks: 11,
    agentCount: 0,
    contextCount: 0,
    skillCount: 0,
    providerCount: 0,
  },
};

describe('WorkspaceBar', () => {
  test('returns readable stage counts', () => {
    expect(formatWorkspaceCounts(snapshot)).toEqual([
      'Inbox: 2',
      'Plan: 1',
      'Code: 3',
      'Audit: 1',
      'Done: 4',
    ]);
  });

  test('renders stage count labels', () => {
    const html = renderToStaticMarkup(<WorkspaceBar snapshot={snapshot} />);
    expect(html).toContain('Code: 3');
    expect(html).toContain('Done: 4');
  });
});
