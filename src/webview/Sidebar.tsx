import React, { useEffect, useCallback, useState, useRef } from 'react';
import { ThemeProvider } from './theme';
import { useTaskStore, selectFilteredTasks } from './stores/taskStore';
import { useUIStore } from './stores/uiStore';
import { FilterPanel } from './components/FilterPanel';
import { TaskTree } from './components/TaskTree';
import { TaskModal } from './components/TaskModal';
import { ContextMenu, type ContextMenuState } from './components/ContextMenu';
import { KeyboardHelp } from './components/KeyboardHelp';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { onHostMessage, postMessageToHost } from './messaging/protocol';
import {
  createRefreshMessage,
  createScaffoldMessage,
  createTaskOpenMessage,
  createContextCopyMessage,
  createOpenBoardMessage,
} from './messaging/protocol';
import type { HostMessage } from './messaging/types';
import type { Task } from '../types/task';

interface SidebarProps {
  kanbanRoot: string | null;
  vscode: {
    postMessage: (message: unknown) => void;
    getState: () => unknown;
    setState: (state: unknown) => void;
  };
}

export function Sidebar({ kanbanRoot, vscode: _vscode }: SidebarProps) {
  const { tasks, setTasks, updateTask, removeTask, addTask, setLoading, setError, setFilters } = useTaskStore();
  const {
    workspaceStatus,
    setWorkspaceStatus,
    activeModal,
    openModal,
    closeModal,
    selectTask,
  } = useUIStore();

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Visible tasks respecting filters
  const visibleTasks = useTaskStore(selectFilteredTasks);

  // Set initial workspace status from prop
  useEffect(() => {
    if (kanbanRoot) {
      setWorkspaceStatus('valid', kanbanRoot, `Workspace at ${kanbanRoot}`);
    } else {
      setWorkspaceStatus('missing', null, 'No workspace detected');
    }
  }, [kanbanRoot, setWorkspaceStatus]);

  // Handle messages from the extension host
  useEffect(() => {
    const unsubscribe = onHostMessage((message: HostMessage) => {
      switch (message.type) {
        case 'tasks:loaded':
          setTasks(message.payload.tasks);
          break;
        case 'task:updated':
          updateTask(message.payload.task);
          break;
        case 'task:created':
          addTask(message.payload.task);
          break;
        case 'task:deleted':
          removeTask(message.payload.id);
          break;
        case 'workspace:status':
          setWorkspaceStatus(
            message.payload.status,
            message.payload.root,
            message.payload.message,
          );
          break;
        case 'filters:sync':
          // Sync filters from board/host
          setFilters({
            project: message.payload.project ?? null,
            phase: message.payload.phase ?? null,
            tagFilters: {
              scope: message.payload.tagFilters?.scope ?? [],
              type: message.payload.tagFilters?.type ?? [],
              domain: message.payload.tagFilters?.domain ?? [],
              priority: message.payload.tagFilters?.priority ?? [],
              other: message.payload.tagFilters?.other ?? [],
            },
            search: message.payload.search ?? '',
            stages: message.payload.stages ?? ['inbox', 'plan', 'code', 'audit', 'completed'],
            inboxOnly: message.payload.inboxOnly ?? false,
          });
          break;
        case 'error':
          setError(message.payload.message);
          break;
      }
    });

    return unsubscribe;
  }, [setTasks, updateTask, addTask, removeTask, setWorkspaceStatus, setFilters, setError]);

  // Request tasks on mount if workspace is valid
  useEffect(() => {
    if (workspaceStatus === 'valid') {
      setLoading(true);
      postMessageToHost(createRefreshMessage());
    }
  }, [workspaceStatus, setLoading]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    postMessageToHost(createRefreshMessage(true));
  }, [setLoading]);

  const handleScaffold = useCallback(() => {
    postMessageToHost(createScaffoldMessage());
  }, []);

  const handleOpenBoard = useCallback(() => {
    postMessageToHost(createOpenBoardMessage());
  }, []);

  const handleNewTask = useCallback(() => {
    openModal('create-task');
  }, [openModal]);

  const handleContextMenu = useCallback((task: Task, x: number, y: number) => {
    setContextMenu({ task, x, y });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleToggleKeyboardHelp = useCallback(() => {
    setShowKeyboardHelp((prev) => !prev);
  }, []);

  const focusTaskElement = useCallback((taskId: string | null) => {
    if (!taskId) return;
    const el = document.querySelector<HTMLElement>(`[data-task-id="${taskId}"]`);
    el?.focus();
  }, []);

  const handleNavigate = useCallback(
    (direction: 'up' | 'down') => {
      if (visibleTasks.length === 0) {
        return;
      }
      const currentIndex = visibleTasks.findIndex((t) => t.id === useUIStore.getState().selectedTaskId);
      let nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (currentIndex === -1) {
        nextIndex = direction === 'up' ? visibleTasks.length - 1 : 0;
      } else {
        if (nextIndex < 0) nextIndex = 0;
        if (nextIndex >= visibleTasks.length) nextIndex = visibleTasks.length - 1;
      }
      const nextTask = visibleTasks[nextIndex];
      selectTask(nextTask.id);
      focusTaskElement(nextTask.id);
    },
    [focusTaskElement, selectTask, visibleTasks],
  );

  const handleOpenSelectedTask = useCallback(() => {
    const selectedId = useUIStore.getState().selectedTaskId;
    const target = selectedId
      ? visibleTasks.find((t) => t.id === selectedId)
      : visibleTasks[0];
    if (target) {
      selectTask(target.id);
      postMessageToHost(createTaskOpenMessage(target.filePath));
    }
  }, [selectTask, visibleTasks]);

  const handleCopySelectedContext = useCallback(() => {
    const selectedId = useUIStore.getState().selectedTaskId;
    const target = selectedId
      ? visibleTasks.find((t) => t.id === selectedId)
      : visibleTasks[0];
    if (target) {
      postMessageToHost(createContextCopyMessage(target.filePath));
    }
  }, [visibleTasks]);

  // Keyboard navigation
  useKeyboardNavigation({
    containerRef: sidebarRef,
    onNewTask: handleNewTask,
    onToggleHelp: handleToggleKeyboardHelp,
    onFocusSearch: () => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    },
    onNavigateUp: () => handleNavigate('up'),
    onNavigateDown: () => handleNavigate('down'),
    onSelectTask: handleOpenSelectedTask,
    onCopyContext: handleCopySelectedContext,
    onEscape: () => {
      if (showKeyboardHelp) {
        setShowKeyboardHelp(false);
      } else if (contextMenu) {
        setContextMenu(null);
      } else if (activeModal) {
        closeModal();
      }
    },
  });

  // Render workspace missing state
  if (workspaceStatus === 'missing') {
    return (
      <ThemeProvider>
        <div className="sidebar sidebar--empty" ref={sidebarRef}>
          <style>{styles}</style>
          <div className="sidebar__header">
            <h2 className="sidebar__title">Kanban2Code</h2>
          </div>
          <div className="sidebar__empty">
            <p className="sidebar__empty-message">No workspace detected</p>
            <p className="sidebar__empty-hint">
              Create a <code>.kanban2code</code> folder to get started.
            </p>
            <button className="btn btn--primary" onClick={handleScaffold}>
              Scaffold Workspace
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="sidebar" ref={sidebarRef} tabIndex={-1}>
        <style>{styles}</style>

        {/* Header */}
        <div className="sidebar__header">
          <h2 className="sidebar__title">Kanban2Code</h2>
          <div className="sidebar__actions">
            <button
              className="btn btn--icon"
              onClick={handleOpenBoard}
              title="Open Board"
              aria-label="Open Board"
            >
              <BoardIcon />
            </button>
            <button
              className="btn btn--primary btn--small"
              onClick={handleNewTask}
              title="New Task (Ctrl+N)"
              aria-label="New Task"
            >
              + New
            </button>
            <button
              className="btn btn--icon"
              onClick={handleRefresh}
              title="Refresh"
              aria-label="Refresh"
            >
              <RefreshIcon />
            </button>
            <button
              className="btn btn--icon"
              onClick={handleToggleKeyboardHelp}
              title="Keyboard shortcuts (?)"
              aria-label="Keyboard shortcuts"
            >
              <SettingsIcon />
            </button>
          </div>
        </div>

        {/* Filters */}
        <FilterPanel searchInputRef={searchInputRef} />

        {/* Task Tree */}
        <TaskTree tasks={tasks} onContextMenu={handleContextMenu} />

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            task={contextMenu.task}
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={handleCloseContextMenu}
          />
        )}

        {/* Task Modal */}
        {activeModal === 'create-task' && <TaskModal onClose={closeModal} />}

        {/* Keyboard Help */}
        {showKeyboardHelp && <KeyboardHelp onClose={() => setShowKeyboardHelp(false)} />}
      </div>
    </ThemeProvider>
  );
}

// Icons
function BoardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 2h4v12H2V2zm5 0h4v8H7V2zm5 0h2v5h-2V2z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.5 2v4h-4l1.6-1.6A5 5 0 006 4a5 5 0 00-5 5h2a3 3 0 016-2.2l.2.2L7 9h6V3l-.5-.5zM13 12a3 3 0 01-6 .8l1.6-1.6L7 13H1v-6l.5.5L3 6a5 5 0 009 3h-2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 10a2 2 0 100-4 2 2 0 000 4zm0-6a4 4 0 110 8 4 4 0 010-8z" />
    </svg>
  );
}

const styles = `
/* Sidebar Shell */
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--colors-bg);
  color: var(--colors-text);
  font-family: var(--font);
  overflow: hidden;
}

.sidebar:focus {
  outline: none;
}

.sidebar--empty {
  justify-content: flex-start;
}

/* Header */
.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 8px;
  border-bottom: 1px solid var(--colors-border);
  flex-shrink: 0;
}

.sidebar__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--colors-accent);
}

.sidebar__actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

/* Empty State */
.sidebar__empty {
  padding: 24px 16px;
  text-align: center;
}

.sidebar__empty-message {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--colors-text);
}

.sidebar__empty-hint {
  margin: 0 0 16px;
  font-size: 12px;
  color: var(--colors-subtext);
}

.sidebar__empty code {
  background: var(--colors-panel);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid var(--colors-border);
  border-radius: 6px;
  background: var(--colors-panel);
  color: var(--colors-text);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.btn:focus {
  outline: 2px solid var(--colors-accent);
  outline-offset: 2px;
}

.btn--primary {
  background: linear-gradient(135deg, var(--colors-accent), var(--colors-accent2));
  border: none;
  color: white;
}

.btn--primary:hover {
  filter: brightness(1.1);
}

.btn--small {
  padding: 4px 10px;
  font-size: 11px;
}

.btn--icon {
  padding: 6px;
  min-width: 28px;
  min-height: 28px;
}

.btn--ghost {
  background: transparent;
  border-color: transparent;
}

.btn--ghost:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Utility */
code {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}
`;
