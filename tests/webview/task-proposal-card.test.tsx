import React from 'react';
import { describe, expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TaskProposalCard, proposalSummary } from '../../src/webview/ui/components/TaskProposalCard';

const proposal = {
  title: 'Create new task editor',
  description: 'Build metadata + body editing flow',
  stage: 'code' as const,
  tags: ['feature', 'ui'],
};

describe('TaskProposalCard', () => {
  test('formats proposal summary', () => {
    expect(proposalSummary(proposal)).toContain('Create new task editor');
    expect(proposalSummary(proposal)).toContain('code');
  });

  test('renders generate button', () => {
    const html = renderToStaticMarkup(<TaskProposalCard proposal={proposal} onGenerate={() => {}} />);
    expect(html).toContain('Generate .md');
  });
});
