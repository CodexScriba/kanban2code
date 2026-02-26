import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { KANBAN_FOLDER } from '../src/core/constants';
import { parseTaskFile } from '../src/services/frontmatter';
import { generateTaskFile, parseTaskProposal } from '../src/services/task-generator';

let TEST_DIR: string;
let KANBAN_ROOT: string;

beforeEach(async () => {
  TEST_DIR = path.join(os.tmpdir(), `kanban-task-generator-${Date.now()}`);
  KANBAN_ROOT = path.join(TEST_DIR, KANBAN_FOLDER);
  await fs.mkdir(KANBAN_ROOT, { recursive: true });
});

afterEach(async () => {
  await fs.rm(TEST_DIR, { recursive: true, force: true });
});

describe('task-generator', () => {
  test('parses mock proposal and writes a valid task file readable by parseTaskFile', async () => {
    const responseText = `
The task proposal:

\`\`\`yaml
title: Build task generator
description: |
  Add support for proposal parsing.

  ## Notes
  - include secure path checks
stage: code
agent: coder
tags:
  - feature
  - automation
project: roadmap
phase: phase-6
contexts:
  - ai-guide
skills:
  - skill-installer
\`\`\`
`;

    const proposal = parseTaskProposal(responseText);
    expect(proposal).not.toBeNull();

    const relativePath = await generateTaskFile(KANBAN_ROOT, proposal!);
    const fullPath = path.join(KANBAN_ROOT, relativePath);
    const parsedTask = await parseTaskFile(fullPath);

    expect(relativePath).toMatch(/^projects[\\/]roadmap[\\/]phase-6[\\/]build-task-generator\.md$/);
    expect(parsedTask.stage).toBe('code');
    expect(parsedTask.agent).toBe('coder');
    expect(parsedTask.tags).toEqual(['feature', 'automation']);
    expect(parsedTask.contexts).toEqual(['ai-guide']);
    expect(parsedTask.skills).toEqual(['skill-installer']);
    expect(parsedTask.project).toBe('roadmap');
    expect(parsedTask.phase).toBe('phase-6');
    expect(parsedTask.title).toBe('Build task generator');
    expect(parsedTask.content).toContain('## Notes');
  });
});
