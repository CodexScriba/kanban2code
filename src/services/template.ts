import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import { TEMPLATES_FOLDER } from '../core/constants';

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
}

/**
 * Load all task templates from the _templates/tasks/ directory.
 * Templates are markdown files with optional frontmatter containing name and description.
 */
export async function loadTaskTemplates(kanbanRoot: string): Promise<TaskTemplate[]> {
  const templatesDir = path.join(kanbanRoot, TEMPLATES_FOLDER, 'tasks');
  const templates: TaskTemplate[] = [];

  try {
    const files = await fs.readdir(templatesDir);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(templatesDir, file);
      const content = await fs.readFile(filePath, 'utf-8');

      try {
        const parsed = matter(content);
        const id = path.basename(file, '.md');

        templates.push({
          id,
          name: typeof parsed.data.name === 'string' ? parsed.data.name : formatTemplateName(id),
          description: typeof parsed.data.description === 'string' ? parsed.data.description : '',
          content: parsed.content,
        });
      } catch {
        // If parsing fails, still include the template with defaults
        const id = path.basename(file, '.md');
        templates.push({
          id,
          name: formatTemplateName(id),
          description: '',
          content,
        });
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
    return [];
  }

  return templates.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Format a template ID into a human-readable name.
 * e.g., "bug-report" -> "Bug Report"
 */
function formatTemplateName(id: string): string {
  return id
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
