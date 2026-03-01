import assert from 'node:assert/strict';
import test from 'node:test';
import { parseTaskMarkdown, serializeTaskMarkdown } from './frontmatter-service';

test('parses valid frontmatter with all fields', () => {
  const input = `---
stage: code
role: coder
tags:
  - feature
  - p1
contexts:
  - skill-vscode
skills:
  - skill-typescript-config
---
# Example\n`;

  const parsed = parseTaskMarkdown(input);

  assert.equal(parsed.frontmatter.stage, 'code');
  assert.equal(parsed.frontmatter.role, 'coder');
  assert.deepEqual(parsed.frontmatter.tags, ['feature', 'p1']);
  assert.deepEqual(parsed.frontmatter.contexts, ['skill-vscode']);
  assert.deepEqual(parsed.frontmatter.skills, ['skill-typescript-config']);
  assert.equal(parsed.body, '# Example\n');
});

test('normalizes agent to role', () => {
  const input = `---\nstage: plan\nagent: planner\n---\n# Task\n`;

  const parsed = parseTaskMarkdown(input);

  assert.equal(parsed.frontmatter.role, 'planner');
  assert.equal(parsed.frontmatter.agent, 'planner');
});

test('round-trips frontmatter and body without data loss', () => {
  const input = `---
stage: audit
agent: auditor
tags:
  - feature
contexts: []
skills: []
priority: p1
---
# Heading
Body line
---
Not frontmatter delimiter in body
`;

  const parsed = parseTaskMarkdown(input);
  const serialized = serializeTaskMarkdown(parsed);
  const reparsed = parseTaskMarkdown(serialized);

  assert.equal(reparsed.frontmatter.stage, 'audit');
  assert.equal(reparsed.frontmatter.role, 'auditor');
  assert.equal(reparsed.frontmatter.agent, 'auditor');
  assert.equal(reparsed.frontmatter.priority, 'p1');
  assert.deepEqual(reparsed.frontmatter.tags, ['feature']);
  assert.deepEqual(reparsed.frontmatter.contexts, []);
  assert.deepEqual(reparsed.frontmatter.skills, []);
  assert.equal(reparsed.body, parsed.body);
});

test('handles empty or missing frontmatter', () => {
  const parsedMissing = parseTaskMarkdown('# No frontmatter\n');
  assert.equal(parsedMissing.frontmatter.stage, 'unknown');
  assert.deepEqual(parsedMissing.frontmatter.tags, []);
  assert.equal(parsedMissing.body, '# No frontmatter\n');

  const parsedEmpty = parseTaskMarkdown('---\n---\n# Empty frontmatter\n');
  assert.equal(parsedEmpty.frontmatter.stage, 'unknown');
  assert.deepEqual(parsedEmpty.frontmatter.contexts, []);
  assert.equal(parsedEmpty.body, '# Empty frontmatter\n');
});

test('preserves markdown body content unchanged', () => {
  const body = '# Title\n\n```yaml\n---\nnot: frontmatter\n---\n```\n';
  const serialized = serializeTaskMarkdown({
    frontmatter: {
      stage: 'inbox',
      role: 'planner',
      tags: [],
      contexts: [],
      skills: []
    },
    body
  });

  const parsed = parseTaskMarkdown(serialized);
  assert.equal(parsed.body, body);
});

test('handles malformed frontmatter gracefully', () => {
  const malformed = `---\nstage: "code\nrole: coder\n---\n# Broken\n`;
  const parsed = parseTaskMarkdown(malformed);

  assert.equal(parsed.frontmatter.stage, 'unknown');
  assert.deepEqual(parsed.frontmatter.tags, []);
  assert.equal(parsed.body, malformed);
});

test('creates fresh default arrays for each parse result', () => {
  const first = parseTaskMarkdown('# No frontmatter\n');
  first.frontmatter.tags.push('mutated');
  first.frontmatter.contexts.push('ctx');
  first.frontmatter.skills.push('skill');

  const second = parseTaskMarkdown('# No frontmatter\n');
  assert.deepEqual(second.frontmatter.tags, []);
  assert.deepEqual(second.frontmatter.contexts, []);
  assert.deepEqual(second.frontmatter.skills, []);
});

test('parses unicode escapes in frontmatter values', () => {
  const input = `---
stage: inbox
title: "\\U0001F3DB city planning"
---
Body
`;

  const parsed = parseTaskMarkdown(input);
  assert.equal(parsed.frontmatter.title, '🏛 city planning');
  assert.equal(parsed.body, 'Body\n');
});
