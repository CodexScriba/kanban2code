import React, { useState } from 'react';
import type { Stage, Task } from '../../../types/task';
import {
  createSavePayload,
  useTaskEditor,
  type TaskEditorDraft,
  type TaskEditorSavePayload,
} from '../hooks/useTaskEditor';

type EditorTab = 'body' | 'frontmatter';

interface TaskEditorPanelProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSave: (payload: TaskEditorSavePayload) => void;
}

const stages: Stage[] = ['inbox', 'plan', 'code', 'audit', 'completed'];

function frontmatterPreview(draft: TaskEditorDraft): string {
  const lines = [
    '---',
    `stage: ${draft.stage}`,
    draft.agent.trim() ? `agent: ${draft.agent.trim()}` : '',
    draft.provider.trim() ? `provider: ${draft.provider.trim()}` : '',
    `tags: [${draft.tags}]`,
    '---',
    '',
    draft.content,
  ].filter(Boolean);

  return lines.join('\n');
}

export function confirmCloseIfDirty(isDirty: boolean, confirmDiscard: () => boolean): boolean {
  if (!isDirty) return true;
  return confirmDiscard();
}

export const TaskEditorPanel: React.FC<TaskEditorPanelProps> = ({ task, open, onClose, onSave }) => {
  const { draft, setDraft, isDirty } = useTaskEditor(task);
  const [tab, setTab] = useState<EditorTab>('body');

  if (!open || !task || !draft) return null;

  const requestClose = () => {
    const shouldClose = confirmCloseIfDirty(isDirty, () => window.confirm('Discard unsaved changes?'));
    if (!shouldClose) return;
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'grid', placeItems: 'center', zIndex: 10 }}>
      <section style={{ width: 'min(920px, 95vw)', maxHeight: '90vh', overflow: 'auto', background: 'var(--vscode-editor-background)', border: '1px solid var(--vscode-panel-border)', borderRadius: 10, padding: 14, display: 'grid', gap: 10 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>Edit Task</strong>
          <button type="button" onClick={requestClose}>Close</button>
        </header>

        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <label>
            Title
            <input value={draft.title} onChange={(event) => setDraft((prev) => prev ? { ...prev, title: event.target.value } : prev)} />
          </label>
          <label>
            Stage
            <select value={draft.stage} onChange={(event) => setDraft((prev) => prev ? { ...prev, stage: event.target.value as Stage } : prev)}>
              {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
            </select>
          </label>
          <label>
            Agent
            <input value={draft.agent} onChange={(event) => setDraft((prev) => prev ? { ...prev, agent: event.target.value } : prev)} />
          </label>
          <label>
            Provider
            <input value={draft.provider} onChange={(event) => setDraft((prev) => prev ? { ...prev, provider: event.target.value } : prev)} />
          </label>
          <label>
            Tags
            <input value={draft.tags} onChange={(event) => setDraft((prev) => prev ? { ...prev, tags: event.target.value } : prev)} />
          </label>
          <label>
            Contexts
            <input value={draft.contexts} onChange={(event) => setDraft((prev) => prev ? { ...prev, contexts: event.target.value } : prev)} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setTab('body')} disabled={tab === 'body'}>Body</button>
          <button type="button" onClick={() => setTab('frontmatter')} disabled={tab === 'frontmatter'}>Frontmatter</button>
        </div>

        {tab === 'body' ? (
          <textarea
            aria-label="Task body"
            value={draft.content}
            onChange={(event) => setDraft((prev) => prev ? { ...prev, content: event.target.value } : prev)}
            rows={16}
            style={{ width: '100%' }}
          />
        ) : (
          <pre aria-label="Frontmatter preview" style={{ margin: 0, maxHeight: 320, overflow: 'auto' }}>{frontmatterPreview(draft)}</pre>
        )}

        <footer style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={requestClose}>Cancel</button>
          <button
            type="button"
            disabled={!isDirty}
            onClick={() => {
              onSave(createSavePayload(task, draft));
            }}
          >
            Save
          </button>
        </footer>
      </section>
    </div>
  );
};
