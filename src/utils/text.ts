export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

const ROADMAP_TASK_NUMBER_RE = /^task(\d+\.\d+)-/;

export function getDisplayTitle(task: { id: string; title: string }): string {
  const title = task.title?.trim?.() ?? '';

  const match = ROADMAP_TASK_NUMBER_RE.exec(task.id);
  if (match) {
    const taskNumber = match[1];
    return title ? `${taskNumber} ${title}` : taskNumber;
  }

  return title || 'Untitled';
}
