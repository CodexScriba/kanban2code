import React from 'react';
import type { Task, Stage } from '../../types/task';

export interface BoardColumnProps {
  stage: Stage;
  title: string;
  color: string;
  tasks: Task[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  renderTask: (task: Task) => React.ReactNode;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

const STAGE_DESCRIPTIONS: Record<Stage, string> = {
  inbox: 'Capture everything fast',
  plan: 'Shape the work and scope',
  code: 'Ship changes with focus',
  audit: 'Verify, test, review',
  completed: 'Archive once shipped',
};

export function BoardColumn({
  stage,
  title,
  color,
  tasks,
  isCollapsed,
  onToggleCollapse,
  renderTask,
  onDragOver,
  onDrop,
}: BoardColumnProps) {
  return (
    <div
      className={`board-column ${isCollapsed ? 'board-column--collapsed' : ''}`}
      data-stage={stage}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <style>{styles}</style>

      {/* Column Header */}
      <div className="board-column__header" style={{ borderColor: color }}>
        <button
          className="board-column__toggle"
          onClick={onToggleCollapse}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
        >
          <ChevronIcon className={isCollapsed ? '' : 'expanded'} />
        </button>

        <div className="board-column__dot" style={{ background: color }} />

        <div className="board-column__title-group">
          <h3 className="board-column__title">{title}</h3>
          {!isCollapsed && (
            <p className="board-column__description">{STAGE_DESCRIPTIONS[stage]}</p>
          )}
        </div>

        <span className="board-column__count" style={{ background: color }}>
          {tasks.length}
        </span>
      </div>

      {/* Column Content */}
      {!isCollapsed && (
        <div className="board-column__content">
          {tasks.length === 0 ? (
            <div className="board-column__empty">
              <p>No tasks</p>
            </div>
          ) : (
            <div className="board-column__tasks">
              {tasks.map(renderTask)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={`board-column__chevron ${className}`}
    >
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

const styles = `
.board-column {
  display: flex;
  flex-direction: column;
  min-width: 280px;
  max-width: 320px;
  flex: 1;
  background: var(--colors-panel);
  border: 1px solid var(--colors-border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.2s ease;
}

.board-column--collapsed {
  min-width: 60px;
  max-width: 60px;
}

.board-column__header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  border-bottom: 2px solid;
  background: rgba(0, 0, 0, 0.1);
}

.board-column--collapsed .board-column__header {
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
}

.board-column__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  background: transparent;
  color: var(--colors-subtext);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.board-column__toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--colors-text);
}

.board-column__chevron {
  transition: transform 0.15s ease;
}

.board-column__chevron.expanded {
  transform: rotate(90deg);
}

.board-column--collapsed .board-column__chevron {
  transform: rotate(0deg);
}

.board-column__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.board-column--collapsed .board-column__dot {
  margin-top: 8px;
}

.board-column__title-group {
  flex: 1;
  min-width: 0;
}

.board-column--collapsed .board-column__title-group {
  display: none;
}

.board-column__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--colors-text);
}

.board-column__description {
  margin: 4px 0 0;
  font-size: 11px;
  color: var(--colors-subtext);
}

.board-column__count {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.board-column--collapsed .board-column__count {
  margin-top: 8px;
}

.board-column__content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.board-column__tasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.board-column__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: var(--colors-subtext);
  font-size: 12px;
  font-style: italic;
}

.board-column__empty p {
  margin: 0;
}
`;
