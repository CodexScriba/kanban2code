import React from 'react';
import { describe, expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Chat } from '../../src/webview/ui/components/Chat';
import type { WorkspaceSnapshot } from '../../src/types/snapshot';

const snapshot: WorkspaceSnapshot = {
  config: { version: '1.0.0', agents: {}, tags: { categories: {} }, stages: {}, preferences: {} },
  tasks: { inbox: [], plan: [], code: [], audit: [], completed: [] },
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

describe('Chat', () => {
  test('renders chat message and workspace bar', () => {
    const html = renderToStaticMarkup(
      <Chat
        snapshot={snapshot}
        messages={[{ role: 'user', content: 'Ship it' }]}
        providers={[]}
        selectedProvider=""
        hasProvider={false}
        isStreaming={false}
        error={null}
        onProviderChange={() => {}}
        onSend={() => {}}
        onCancel={() => {}}
        onGenerateTask={() => {}}
      />,
    );

    expect(html).toContain('Ship it');
    expect(html).toContain('Inbox: 1');
  });
});
