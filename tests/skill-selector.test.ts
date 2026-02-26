import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { KANBAN_FOLDER } from '../src/core/constants';
import { detectFrameworks, loadSkillContents, selectSkills } from '../src/services/skill-selector';

let TEST_DIR: string;
let KANBAN_ROOT: string;
let SKILLS_DIR: string;

beforeEach(async () => {
  TEST_DIR = path.join(os.tmpdir(), `kanban-skill-selector-${Date.now()}`);
  KANBAN_ROOT = path.join(TEST_DIR, KANBAN_FOLDER);
  SKILLS_DIR = path.join(KANBAN_ROOT, '_context', 'skills');
  await fs.mkdir(SKILLS_DIR, { recursive: true });
});

afterEach(async () => {
  await fs.rm(TEST_DIR, { recursive: true, force: true });
});

async function writeSkill(
  fileName: string,
  frontmatter: {
    skill_name: string;
    framework?: string;
    always_attach?: boolean;
    priority?: number | 'high' | 'medium' | 'low';
    triggers?: string[];
  },
  body = 'Skill content',
) {
  const triggerLines = (frontmatter.triggers ?? []).map((trigger) => `  - ${trigger}`).join('\n');
  const content = [
    '---',
    `skill_name: ${frontmatter.skill_name}`,
    frontmatter.framework ? `framework: ${frontmatter.framework}` : '',
    typeof frontmatter.always_attach === 'boolean'
      ? `always_attach: ${frontmatter.always_attach ? 'true' : 'false'}`
      : '',
    frontmatter.priority !== undefined ? `priority: ${frontmatter.priority}` : '',
    frontmatter.triggers ? 'triggers:' : '',
    triggerLines,
    '---',
    body,
    '',
  ]
    .filter(Boolean)
    .join('\n');

  await fs.writeFile(path.join(SKILLS_DIR, fileName), content, 'utf-8');
}

describe('detectFrameworks', () => {
  test('detects nextjs, react, and python hints in text and file paths', () => {
    const text = 'Use Next.js app router in src/app/page.tsx and add Python scripts in tools/task.py';
    expect(detectFrameworks(text)).toEqual(expect.arrayContaining(['nextjs', 'react', 'python']));
  });
});

describe('selectSkills', () => {
  test('returns alwaysAttach and matching trigger skills in expected order', async () => {
    await writeSkill(
      'nextjs-core-skills.md',
      {
        skill_name: 'nextjs-core-skills',
        framework: 'Next.js',
        always_attach: true,
        priority: 10,
        triggers: ['nextjs', 'next.js', 'app router'],
      },
      'Next core',
    );
    await writeSkill(
      'skill-caching-data-fetching.md',
      {
        skill_name: 'skill-caching-data-fetching',
        framework: 'Next.js',
        always_attach: false,
        priority: 8,
        triggers: ['cache', 'fetch', 'revalidate'],
      },
      'Caching',
    );
    await writeSkill(
      'skill-dashboard-design.md',
      {
        skill_name: 'skill-dashboard-design',
        framework: 'UI/UX Design',
        always_attach: false,
        priority: 9,
        triggers: ['dashboard'],
      },
      'Dashboard',
    );

    const result = await selectSkills(KANBAN_ROOT, 'add dashboard with caching in nextjs app router');
    expect(result.map((skill) => skill.id)).toEqual([
      'nextjs-core-skills',
      'skill-caching-data-fetching',
      'skill-dashboard-design',
    ]);
    expect(result[0].content).toContain('Next core');
    expect(result[1].content).toContain('Caching');
  });

  test('returns only alwaysAttach skills when conversation is empty', async () => {
    await writeSkill('react-core-skills.md', {
      skill_name: 'react-core-skills',
      framework: 'React',
      always_attach: true,
      priority: 9,
      triggers: ['react'],
    });
    await writeSkill('django-auth.md', {
      skill_name: 'django-auth',
      framework: 'Django',
      always_attach: false,
      priority: 7,
      triggers: ['auth'],
    });

    const result = await selectSkills(KANBAN_ROOT, '');
    expect(result.map((skill) => skill.id)).toEqual(['react-core-skills']);
  });

  test('uses numeric priority descending when label priority is absent', async () => {
    await writeSkill('a.md', {
      skill_name: 'skill-a',
      framework: 'Next.js',
      priority: 5,
      triggers: ['cache'],
    });
    await writeSkill('b.md', {
      skill_name: 'skill-b',
      framework: 'Next.js',
      priority: 8,
      triggers: ['cache'],
    });

    const result = await selectSkills(KANBAN_ROOT, 'next.js cache strategy');
    expect(result.map((skill) => skill.id)).toEqual(['b', 'a']);
  });

  test('returns empty when no skills directory exists or no matches', async () => {
    const missingRoot = path.join(TEST_DIR, 'missing', KANBAN_FOLDER);
    expect(await selectSkills(missingRoot, 'nextjs cache')).toEqual([]);

    await writeSkill('python-core-skills.md', {
      skill_name: 'python-core-skills',
      framework: 'Python',
      always_attach: false,
      priority: 9,
      triggers: ['pandas'],
    });
    expect(await selectSkills(KANBAN_ROOT, 'completely unrelated content')).toEqual([]);
  });
});

describe('loadSkillContents', () => {
  test('hydrates existing skill IDs with full content and ignores missing IDs', async () => {
    await writeSkill(
      'nextjs-core-skills.md',
      {
        skill_name: 'nextjs-core-skills',
        framework: 'Next.js',
        always_attach: true,
        priority: 10,
        triggers: ['nextjs'],
      },
      'Hydrated Next.js Content',
    );

    const result = await loadSkillContents(KANBAN_ROOT, ['nextjs-core-skills', 'missing-id']);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'nextjs-core-skills',
      name: 'nextjs-core-skills',
      path: '_context/skills/nextjs-core-skills.md',
    });
    expect(result[0].content).toContain('Hydrated Next.js Content');
  });
});
