import React, { useCallback, useMemo } from 'react';
import { useUIStore } from '../stores/uiStore';
import { useTaskStore } from '../stores/taskStore';
import { postMessageToHost } from '../messaging/protocol';
import {
  createTaskOpenMessage,
  createContextCopyMessage,
  createTaskMoveMessage,
} from '../messaging/protocol';
import type { Task, Stage } from '../../types/task';
import { categorizeTag, tagColor } from '../../core/tagTaxonomy';

export interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onFollowUp?: () => void;
}

const STAGE_COLORS: Record<Stage, string> = {
  inbox: '#38bdf8',
  plan: '#a78bfa',
  code: '#fbbf24',
  audit: '#34d399',
  completed: '#60a5fa',
};

const STAGE_LABELS: Record<Stage, string> = {
  inbox: 'Inbox',
  plan: 'Plan',
  code: 'Code',
  audit: 'Audit',
  completed: 'Done',
};

const STAGE_KEYS: Stage[] = ['inbox', 'plan', 'code', 'audit', 'completed'];

export function TaskCard({
  task,
  isDragging = false,
  onDragStart,
  onDragEnd,
  onContextMenu,
  onFollowUp,
}: TaskCardProps) {
  const selectedTaskId = useUIStore((state) => state.selectedTaskId);
  const selectTask = useUIStore((state) => state.selectTask);
  const isSelected = selectedTaskId === task.id;

  // Check for follow-ups
  const tasks = useTaskStore((state) => state.tasks);
  const followUpCount = useMemo(() => {
    return tasks.filter((t) => t.parent === task.id).length;
  }, [tasks, task.id]);

  // Location crumb
  const locationCrumb = useMemo(() => {
    if (task.project) {
      if (task.phase) {
        return `${task.project} › ${task.phase}`;
      }
      return task.project;
    }
    return 'Inbox';
  }, [task.project, task.phase]);

  // Display tags (max 3)
  const displayTags = useMemo(() => {
    const tags = task.tags || [];
    return tags.slice(0, 3);
  }, [task.tags]);

  const remainingTagCount = (task.tags?.length || 0) - displayTags.length;

  const handleClick = useCallback(() => {
    selectTask(task.id);
  }, [selectTask, task.id]);

  const handleDoubleClick = useCallback(() => {
    postMessageToHost(createTaskOpenMessage(task.filePath));
  }, [task.filePath]);

  const handleCopyXML = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      postMessageToHost(createContextCopyMessage(task.filePath));
    },
    [task.filePath],
  );

  const handleOpen = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      postMessageToHost(createTaskOpenMessage(task.filePath));
    },
    [task.filePath],
  );

  const handleFollowUp = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onFollowUp?.();
    },
    [onFollowUp],
  );

  // Keyboard shortcuts when focused
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'c':
        case 'C':
          e.preventDefault();
          postMessageToHost(createContextCopyMessage(task.filePath));
          break;
        case 'Enter':
          e.preventDefault();
          postMessageToHost(createTaskOpenMessage(task.filePath));
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          e.preventDefault();
          const stageIndex = parseInt(e.key) - 1;
          const newStage = STAGE_KEYS[stageIndex];
          if (newStage && newStage !== task.stage) {
            postMessageToHost(createTaskMoveMessage(task.id, task.filePath, newStage));
          }
          break;
      }
    },
    [task],
  );

  return (
    <div
      className={`task-card ${isSelected ? 'task-card--selected' : ''} ${isDragging ? 'task-card--dragging' : ''}`}
      data-task-id={task.id}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={onContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-selected={isSelected}
    >
      <style>{styles}</style>

      {/* Main Content */}
      <div className="task-card__main">
        <h4 className="task-card__title">{task.title}</h4>

        <div className="task-card__meta">
          <span className="task-card__location">{locationCrumb}</span>
          {followUpCount > 0 && (
            <span className="task-card__followups" title={`${followUpCount} follow-up(s)`}>
              ↗ {followUpCount}
            </span>
          )}
        </div>

        {/* Tags */}
        {displayTags.length > 0 && (
          <div className="task-card__tags">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className={tagClassName(tag)}
                style={tagStyle(tag)}
              >
                {tag}
              </span>
            ))}
            {remainingTagCount > 0 && (
              <span className="task-card__tag task-card__tag--more">+{remainingTagCount}</span>
            )}
          </div>
        )}

        {/* Stage Pill (optional - shown only if not obvious from column) */}
        <div className="task-card__stage" style={{ background: STAGE_COLORS[task.stage] }}>
          {STAGE_LABELS[task.stage]}
        </div>
      </div>

      {/* Hover Actions */}
      <div className="task-card__actions">
        <button
          className="task-card__action"
          onClick={handleCopyXML}
          title="Copy XML (C)"
          aria-label="Copy XML context"
        >
          <CopyIcon />
          <span>Copy XML</span>
        </button>
        <button
          className="task-card__action"
          onClick={handleOpen}
          title="Open (Enter)"
          aria-label="Open task file"
        >
          <OpenIcon />
          <span>Open</span>
        </button>
        {onFollowUp && (
          <button
            className="task-card__action"
            onClick={handleFollowUp}
            title="Add Follow-up"
            aria-label="Add follow-up task"
          >
            <FollowUpIcon />
          </button>
        )}
        <button
          className="task-card__action task-card__action--more"
          onClick={onContextMenu}
          title="More actions"
          aria-label="More actions"
        >
          <MoreIcon />
        </button>
      </div>
    </div>
  );
}

function tagClassName(tag: string): string {
  const category = categorizeTag(tag);
  const classes = ['task-card__tag'];
  if (category !== 'other') classes.push('task-card__tag--tax');
  if (category === 'priority') classes.push('task-card__tag--priority');
  if (category === 'type') classes.push('task-card__tag--type');
  return classes.join(' ');
}

function tagStyle(tag: string): React.CSSProperties | undefined {
  const color = tagColor(tag);
  if (!color) return undefined;
  return { borderColor: color, color };
}

// Icons
function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V2zm2 0v8h6V2H6zM2 4a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2v-1h-2v1H2V6h1V4H2z" />
    </svg>
  );
}

function OpenIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8.636 3.5a.5.5 0 00-.5-.5H1.5A1.5 1.5 0 000 4.5v10A1.5 1.5 0 001.5 16h10a1.5 1.5 0 001.5-1.5V7.864a.5.5 0 00-1 0V14.5a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5h6.636a.5.5 0 00.5-.5z" />
      <path d="M16 .5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h3.793L6.146 9.146a.5.5 0 10.708.708L15 1.707V5.5a.5.5 0 001 0v-5z" />
    </svg>
  );
}

function FollowUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z" />
      <path d="M2 2a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H2zm0 1h12a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
    </svg>
  );
}

const styles = `
.task-card {
  position: relative;
  padding: 12px;
  background: var(--colors-bg);
  border: 1px solid var(--colors-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.task-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.task-card:focus {
  outline: 2px solid var(--colors-accent);
  outline-offset: 2px;
}

.task-card--selected {
  border-color: var(--colors-accent);
  background: color-mix(in srgb, var(--colors-accent) 8%, var(--colors-bg));
}

.task-card--dragging {
  opacity: 0.5;
  transform: scale(0.98);
}

/* Main content */
.task-card__main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-card__title {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--colors-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.task-card__location {
  color: var(--colors-subtext);
}

.task-card__followups {
  color: var(--colors-accent);
  font-weight: 500;
}

/* Tags */
.task-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.task-card__tag {
  padding: 2px 6px;
  background: var(--colors-panel);
  border: 1px solid var(--colors-border);
  border-radius: 4px;
  font-size: 10px;
  color: var(--colors-subtext);
}

.task-card__tag--tax {
  font-weight: 600;
}

.task-card__tag--type {
  background: color-mix(in srgb, currentColor 12%, transparent);
}

.task-card__tag--priority {
  background: color-mix(in srgb, currentColor 20%, transparent);
}

.task-card__tag--more {
  background: transparent;
  color: var(--colors-subtext);
}

/* Stage pill */
.task-card__stage {
  align-self: flex-start;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Hover actions */
.task-card__actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: none;
  gap: 4px;
  padding: 4px;
  background: var(--colors-bg);
  border: 1px solid var(--colors-border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.task-card:hover .task-card__actions,
.task-card:focus-within .task-card__actions {
  display: flex;
}

.task-card__action {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--colors-subtext);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.1s ease;
  white-space: nowrap;
}

.task-card__action:hover {
  background: var(--colors-panel);
  color: var(--colors-text);
}

.task-card__action--more {
  padding: 4px 6px;
}

.task-card__action span {
  display: none;
}

@media (min-width: 1200px) {
  .task-card__action span {
    display: inline;
  }
}
`;
