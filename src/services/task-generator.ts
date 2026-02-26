import * as fs from 'fs/promises';
import * as path from 'path';
import { INBOX_FOLDER, PROJECTS_FOLDER } from '../core/constants';
import { parseTaskProposal } from '../shared/task-proposal-parser';
import { Task } from '../types/task';
import { TaskProposal } from '../types/task-proposal';
import { stringifyTaskFile } from './frontmatter';
import { ensureSafePath } from '../workspace/validation';

export { parseTaskProposal } from '../shared/task-proposal-parser';

function slugifyTitle(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
    .replace(/-+$/g, '');

  return base || 'untitled-task';
}

function buildTaskContent(title: string, description: string): string {
  const trimmed = description.trim();
  if (!trimmed) {
    return `# ${title}\n`;
  }

  if (/^\s*#\s+.+/m.test(trimmed.split('\n')[0] ?? '')) {
    return `${trimmed}\n`;
  }

  return `# ${title}\n\n${trimmed}\n`;
}

async function getUniqueFileName(targetDir: string, baseName: string): Promise<string> {
  let counter = 0;

  while (true) {
    const fileName = counter === 0 ? `${baseName}.md` : `${baseName}-${counter}.md`;
    const fullPath = path.join(targetDir, fileName);

    try {
      await fs.access(fullPath);
      counter += 1;
    } catch {
      return fileName;
    }
  }
}

export async function generateTaskFile(
  kanbanRoot: string,
  proposal: TaskProposal,
): Promise<string> {
  const folderParts = [kanbanRoot];

  if (proposal.project) {
    folderParts.push(PROJECTS_FOLDER, proposal.project);
    if (proposal.phase) {
      folderParts.push(proposal.phase);
    }
  } else {
    folderParts.push(INBOX_FOLDER);
  }

  const targetDir = path.join(...folderParts);
  await ensureSafePath(kanbanRoot, targetDir);
  await fs.mkdir(targetDir, { recursive: true });

  const baseName = slugifyTitle(proposal.title);
  const fileName = await getUniqueFileName(targetDir, baseName);
  const filePath = path.join(targetDir, fileName);

  await ensureSafePath(kanbanRoot, filePath);

  const task: Task = {
    id: path.basename(fileName, '.md'),
    filePath,
    title: proposal.title,
    stage: proposal.stage,
    agent: proposal.agent,
    tags: proposal.tags ?? [],
    contexts: proposal.contexts ?? [],
    skills: proposal.skills ?? [],
    content: buildTaskContent(proposal.title, proposal.description),
  };

  const serialized = stringifyTaskFile(task);
  await fs.writeFile(filePath, serialized, 'utf-8');

  return path.relative(kanbanRoot, filePath);
}
