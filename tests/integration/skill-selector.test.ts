import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { KANBAN_FOLDER } from '../../src/core/constants';
import { loadSkillContents, selectSkills } from '../../src/services/skill-selector';

let testDir: string;
let kanbanRoot: string;
let skillsDir: string;

beforeEach(async () => {
  testDir = path.join(os.tmpdir(), `kanban-integration-skill-selector-${Date.now()}`);
  kanbanRoot = path.join(testDir, KANBAN_FOLDER);
  skillsDir = path.join(kanbanRoot, '_context', 'skills');
  await fs.mkdir(skillsDir, { recursive: true });
});

afterEach(async () => {
  await fs.rm(testDir, { recursive: true, force: true });
});

async function writeSkill(fileName: string, contents: string): Promise<void> {
  await fs.writeFile(path.join(skillsDir, fileName), contents, 'utf-8');
}

describe('integration: skill selector hardening', () => {
  test('ignores malformed skill files and still selects valid matches', async () => {
    await writeSkill(
      'valid-react-skill.md',
      [
        '---',
        'skill_name: valid-react-skill',
        'framework: React',
        'always_attach: true',
        'priority: high',
        'triggers:',
        '  - state',
        '---',
        'Reliable skill content',
        '',
      ].join('\n'),
    );

    // Invalid frontmatter should be handled gracefully by context reader.
    await writeSkill('broken-skill.md', '---\nskill_name: broken\npriority: [\n---\nBroken');

    const selected = await selectSkills(kanbanRoot, 'need react state handling');

    expect(selected.map((skill) => skill.id)).toContain('valid-react-skill');
    expect(selected.find((skill) => skill.id === 'valid-react-skill')?.content).toContain(
      'Reliable skill content',
    );
  });

  test('returns empty result for empty skills directory and unknown requested IDs', async () => {
    await fs.rm(skillsDir, { recursive: true, force: true });

    expect(await selectSkills(kanbanRoot, 'nextjs cache')).toEqual([]);
    expect(await loadSkillContents(kanbanRoot, ['missing-id'])).toEqual([]);
  });

  test('caps selected skills when many triggers match', async () => {
    for (let i = 1; i <= 7; i++) {
      await writeSkill(
        `skill-${i}.md`,
        [
          '---',
          `skill_name: skill-${i}`,
          'framework: React',
          'always_attach: false',
          `priority: ${i}`,
          'triggers:',
          '  - react',
          '---',
          `Skill ${i}`,
          '',
        ].join('\n'),
      );
    }

    const selected = await selectSkills(kanbanRoot, 'react component work');
    expect(selected).toHaveLength(5);
  });
});
