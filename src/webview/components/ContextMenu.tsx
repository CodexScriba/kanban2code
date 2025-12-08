import React, { useEffect, useRef, useCallback } from 'react';
import { postMessageToHost } from '../messaging/protocol';
import {
  createTaskMoveMessage,
  createTaskArchiveMessage,
  createTaskDeleteMessage,
  createContextCopyMessage,
  createTaskMoveLocationMessage,
} from '../messaging/protocol';
import type { Task, Stage } from '../../types/task';

export interface ContextMenuState {
  task: Task;
  x: number;
  y: number;
}

export interface ContextMenuProps {
  task: Task;
  x: number;
  y: number;
  onClose: () => void;
  onFollowUp?: (task: Task) => void;
}

const STAGES: { key: Stage; label: string }[] = [
  { key: 'inbox', label: 'Inbox' },
  { key: 'plan', label: 'Plan' },
  { key: 'code', label: 'Code' },
  { key: 'audit', label: 'Audit' },
  { key: 'completed', label: 'Completed' },
];

export function ContextMenu({ task, x, y, onClose, onFollowUp }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showStageSubmenu, setShowStageSubmenu] = React.useState(false);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Position adjustment
  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();

      // Adjust if overflowing right
      if (rect.right > window.innerWidth) {
        menu.style.left = `${x - rect.width}px`;
      }

      // Adjust if overflowing bottom
      if (rect.bottom > window.innerHeight) {
        menu.style.top = `${y - rect.height}px`;
      }
    }
  }, [x, y]);

  const handleCopyXML = useCallback(() => {
    postMessageToHost(createContextCopyMessage(task.filePath));
    onClose();
  }, [task, onClose]);

  const handleChangeStage = useCallback(
    (newStage: Stage) => {
      if (newStage !== task.stage) {
        postMessageToHost(createTaskMoveMessage(task.id, task.filePath, newStage));
      }
      onClose();
    },
    [task, onClose],
  );

  const handleMarkDone = useCallback(() => {
    if (task.stage === 'code') {
      postMessageToHost(createTaskMoveMessage(task.id, task.filePath, 'audit'));
    }
    onClose();
  }, [task, onClose]);

  const handleArchive = useCallback(() => {
    postMessageToHost(createTaskArchiveMessage(task.id, task.filePath));
    onClose();
  }, [task, onClose]);

  const handleFollowUp = useCallback(() => {
    onFollowUp?.(task);
    onClose();
  }, [task, onClose, onFollowUp]);

  const handleDelete = useCallback(() => {
    if (confirm(`Delete task "${task.title}"? This cannot be undone.`)) {
      postMessageToHost(createTaskDeleteMessage(task.id, task.filePath));
    }
    onClose();
  }, [task, onClose]);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
      role="menu"
      aria-label="Task actions"
    >
      <style>{styles}</style>

      {/* Copy XML */}
      <button className="context-menu__item" onClick={handleCopyXML} role="menuitem">
        <CopyIcon />
        <span>Copy XML (Full Context)</span>
      </button>

      <div className="context-menu__divider" />

      {/* Move to project/phase */}
      <button className="context-menu__item" onClick={() => {
        postMessageToHost(createTaskMoveLocationMessage(task.filePath));
        onClose();
      }} role="menuitem">
        <FolderIcon />
        <span>Move to Project/Phase…</span>
      </button>

      <div className="context-menu__divider" />

      {/* Change Stage */}
      <div
        className="context-menu__item context-menu__item--submenu"
        onMouseEnter={() => setShowStageSubmenu(true)}
        onMouseLeave={() => setShowStageSubmenu(false)}
      >
        <StageIcon />
        <span>Change Stage</span>
        <ChevronIcon />

        {showStageSubmenu && (
          <div className="context-menu__submenu">
            {STAGES.map((stage) => (
              <button
                key={stage.key}
                className={`context-menu__item ${stage.key === task.stage ? 'context-menu__item--active' : ''}`}
                onClick={() => handleChangeStage(stage.key)}
                role="menuitem"
                disabled={stage.key === task.stage}
              >
                {stage.key === task.stage && <CheckIcon />}
                <span>{stage.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mark Implementation Done (only for code stage) */}
      {task.stage === 'code' && (
        <button className="context-menu__item" onClick={handleMarkDone} role="menuitem">
          <CheckCircleIcon />
          <span>Mark Implementation Done</span>
        </button>
      )}

      <div className="context-menu__divider" />

      {/* Add Follow-up in Inbox */}
      {onFollowUp && (
        <button className="context-menu__item" onClick={handleFollowUp} role="menuitem">
          <FollowUpIcon />
          <span>Add Follow-up in Inbox</span>
        </button>
      )}

      {/* Archive (only for completed stage) */}
      {task.stage === 'completed' && (
        <button className="context-menu__item" onClick={handleArchive} role="menuitem">
          <ArchiveIcon />
          <span>Archive</span>
        </button>
      )}

      {/* Delete */}
      <button
        className="context-menu__item context-menu__item--danger"
        onClick={handleDelete}
        role="menuitem"
      >
        <TrashIcon />
        <span>Delete Task</span>
      </button>
    </div>
  );
}

// Icons
function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V2zm2 0v8h6V2H6zM2 4a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2v-1h-2v1H2V6h1V4H2z" />
    </svg>
  );
}

function StageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 2h3v3H2V2zm0 4.5h3v3H2v-3zm0 4.5h3v3H2v-3zM6.5 2H14v3H6.5V2zm0 4.5H14v3H6.5v-3zm0 4.5H14v3H6.5v-3z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="context-menu__chevron">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.5 4.5l-7 7L3 8" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.5-9.5l-4 4L5 7" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function FollowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z" />
      <path d="M2 2a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H2zm0 1h12a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 2h14v3H1V2zm1 4h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6zm4 2h4v2H6V8z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
      <path d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
    </svg>
  );
}

const styles = `
.context-menu {
  position: fixed;
  min-width: 200px;
  padding: 4px;
  background: var(--colors-bg);
  border: 1px solid var(--colors-border);
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  z-index: 200;
}

.context-menu__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--colors-text);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s ease;
}

.context-menu__item:hover {
  background: var(--colors-panel);
}

.context-menu__item:focus {
  outline: none;
  background: var(--colors-panel);
}

.context-menu__item--active {
  color: var(--colors-accent);
}

.context-menu__item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.context-menu__item--danger {
  color: #f87171;
}

.context-menu__item--danger:hover {
  background: rgba(248, 113, 113, 0.1);
}

.context-menu__item--submenu {
  position: relative;
}

.context-menu__chevron {
  margin-left: auto;
}

.context-menu__divider {
  height: 1px;
  margin: 4px 8px;
  background: var(--colors-border);
}

.context-menu__submenu {
  position: absolute;
  left: 100%;
  top: -4px;
  min-width: 140px;
  padding: 4px;
  background: var(--colors-bg);
  border: 1px solid var(--colors-border);
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}
`;
