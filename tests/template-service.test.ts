import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { loadTaskTemplates } from '../src/services/template';
import { TEMPLATES_FOLDER } from '../src/core/constants';

let TEST_DIR: string;
let KANBAN_ROOT: string;

beforeEach(async () => {
  TEST_DIR = path.join(os.tmpdir(), `kanban-template-test-${Date.now()}`);
  KANBAN_ROOT = path.join(TEST_DIR, '.kanban2code');
  await fs.mkdir(KANBAN_ROOT, { recursive: true });
});

afterEach(async () => {
  await fs.rm(TEST_DIR, { recursive: true, force: true });
});

describe('services/template', () => {
  it('returns empty array when templates directory is missing', async () => {
    const templates = await loadTaskTemplates(KANBAN_ROOT);
    expect(templates).toEqual([]);
  });

  it('loads markdown templates with frontmatter and falls back on parse failures', async () => {
    const templatesDir = path.join(KANBAN_ROOT, TEMPLATES_FOLDER, 'tasks');
    await fs.mkdir(templatesDir, { recursive: true });

    await fs.writeFile(
      path.join(templatesDir, 'bug-report.md'),
      `---
name: Bug Report
description: Report a bug
---

# Bug Report

Steps to reproduce...
`,
    );

    // Invalid YAML frontmatter should fall back to defaults and raw content
    await fs.writeFile(
      path.join(templatesDir, 'feature.md'),
      `---
name: [unclosed
---

# Feature

Describe the feature...
`,
    );

    await fs.writeFile(path.join(templatesDir, 'ignore.txt'), 'not a template');

    const templates = await loadTaskTemplates(KANBAN_ROOT);
    expect(templates.map((t) => t.id)).toEqual(['bug-report', 'feature']);

    const bug = templates.find((t) => t.id === 'bug-report');
    expect(bug?.name).toBe('Bug Report');
    expect(bug?.description).toBe('Report a bug');
    expect(bug?.content).toContain('# Bug Report');

    const feature = templates.find((t) => t.id === 'feature');
    expect(feature?.name).toBe('Feature');
    expect(feature?.description).toBe('');
    expect(feature?.content).toContain('name: [unclosed');
  });
});

