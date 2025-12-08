import React, { useEffect, useCallback, useState, useRef } from 'react';
import { ThemeProvider } from './theme';
import { useTaskStore, selectTasksByStage, selectFilteredTasks } from './stores/taskStore';
import { useUIStore, isStageCollapsed } from './stores/uiStore';
import { BoardColumn } from './components/BoardColumn';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { ContextMenu, type ContextMenuState } from './components/ContextMenu';
import { KeyboardHelp } from './components/KeyboardHelp';
import { onHostMessage, postMessageToHost } from './messaging/protocol';
import {
  createRefreshMessage,
  createScaffoldMessage,
  createTaskMoveMessage,
} from './messaging/protocol';
import type { HostMessage } from './messaging/types';
import type { Task, Stage } from '../types/task';

export interface BoardProps {
  kanbanRoot: string | null;
  vscode: {
    postMessage: (message: unknown) => void;
    getState: () => unknown;
    setState: (state: unknown) => void;
  };
}

const STAGE_COLUMNS: { key: Stage; title: string; color: string }[] = [
  { key: 'inbox', title: 'Inbox', color: '#38bdf8' },
  { key: 'plan', title: 'Plan', color: '#a78bfa' },
  { key: 'code', title: 'Code', color: '#fbbf24' },
  { key: 'audit', title: 'Audit', color: '#34d399' },
  { key: 'completed', title: 'Done', color: '#60a5fa' },
];

export function Board({ kanbanRoot, vscode: _vscode }: BoardProps) {
  const { setTasks, updateTask, removeTask, addTask, setLoading, setError, setFilters, filters } =
    useTaskStore();
  const {
    workspaceStatus,
    setWorkspaceStatus,
    activeModal,
    modalData,
    openModal,
    closeModal,
    selectTask,
    toggleStageCollapse,
    collapsedStages,
  } = useUIStore();

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get tasks by stage
  const tasksByStage = useTaskStore(selectTasksByStage);
  const allFilteredTasks = useTaskStore(selectFilteredTasks);

  // Apply local search filter
  const getFilteredTasksForStage = useCallback(
    (stage: Stage) => {
      const tasks = tasksByStage[stage];
      if (!localSearch) return tasks;

      const searchLower = localSearch.toLowerCase();
      return tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.content.toLowerCase().includes(searchLower),
      );
    },
    [tasksByStage, localSearch],
  );

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
          // Sync filters from sidebar/host
          setFilters({
            project: message.payload.project ?? null,
            phase: message.payload.phase ?? null,
            tags: message.payload.tags ?? [],
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

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    searchInputRef.current?.focus();
  }, []);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTaskId(task.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetStage: Stage) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');

      if (!taskId) return;

      // Find the task
      const task = allFilteredTasks.find((t) => t.id === taskId);
      if (!task || task.stage === targetStage) {
        setDraggedTaskId(null);
        return;
      }

      // Send move message
      postMessageToHost(createTaskMoveMessage(task.id, task.filePath, targetStage));
      setDraggedTaskId(null);
    },
    [allFilteredTasks],
  );

  const handleFollowUp = useCallback(
    (task: Task) => {
      openModal('create-task', { parentTask: task });
    },
    [openModal],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts if we're in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        // But allow escape in modals
        if (e.key === 'Escape') {
          if (showKeyboardHelp) {
            setShowKeyboardHelp(false);
          } else if (contextMenu) {
            setContextMenu(null);
          } else if (activeModal) {
            closeModal();
          }
        }
        return;
      }

      switch (e.key) {
        case 'n':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleNewTask();
          }
          break;
        case '?':
          e.preventDefault();
          handleToggleKeyboardHelp();
          break;
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'Escape':
          if (showKeyboardHelp) {
            setShowKeyboardHelp(false);
          } else if (contextMenu) {
            setContextMenu(null);
          } else if (activeModal) {
            closeModal();
          }
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleRefresh();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeModal,
    closeModal,
    contextMenu,
    handleNewTask,
    handleRefresh,
    handleToggleKeyboardHelp,
    showKeyboardHelp,
  ]);

  // Render workspace missing state
  if (workspaceStatus === 'missing') {
    return (
      <ThemeProvider>
        <div className="board board--empty" ref={boardRef}>
          <style>{styles}</style>
          <div className="board__empty-state">
            <div className="board__empty-icon">
              <KanbanIcon />
            </div>
            <h1 className="board__empty-title">Kanban2Code</h1>
            <p className="board__empty-message">No workspace detected</p>
            <p className="board__empty-hint">
              Create a <code>.kanban2code</code> folder to get started.
            </p>
            <button className="btn btn--primary btn--large" onClick={handleScaffold}>
              Scaffold Workspace
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Render workspace loading state
  if (workspaceStatus === 'loading') {
    return (
      <ThemeProvider>
        <div className="board board--loading" ref={boardRef}>
          <style>{styles}</style>
          <div className="board__loading">
            <div className="board__spinner" />
            <p>Loading workspace...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  const totalTasks = allFilteredTasks.length;

  return (
    <ThemeProvider>
      <div className="board" ref={boardRef}>
        <style>{styles}</style>

        {/* Top Bar */}
        <header className="board__header">
          <div className="board__header-left">
            <h1 className="board__title">
              <KanbanIcon />
              <span>Kanban2Code</span>
            </h1>
            <span className="board__task-count">
              {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="board__header-center">
            <div className="board__search">
              <SearchIcon />
              <input
                ref={searchInputRef}
                type="text"
                className="board__search-input"
                placeholder="Search tasks... (press /)"
                value={localSearch}
                onChange={handleSearchChange}
              />
              {localSearch && (
                <button
                  className="board__search-clear"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>

          <div className="board__header-right">
            <button
              className="btn btn--primary"
              onClick={handleNewTask}
              title="New Task (Ctrl+N)"
            >
              <PlusIcon />
              <span>New Task</span>
            </button>
            <button
              className="btn btn--icon"
              onClick={handleRefresh}
              title="Refresh (Ctrl+R)"
            >
              <RefreshIcon />
            </button>
            <button
              className="btn btn--icon"
              onClick={handleToggleKeyboardHelp}
              title="Keyboard shortcuts (?)"
            >
              <HelpIcon />
            </button>
          </div>
        </header>

        {/* Board Content */}
        <div className="board__content">
          <div className="board__columns">
            {STAGE_COLUMNS.map((column) => (
              <BoardColumn
                key={column.key}
                stage={column.key}
                title={column.title}
                color={column.color}
                tasks={getFilteredTasksForStage(column.key)}
                isCollapsed={isStageCollapsed(useUIStore.getState(), column.key)}
                onToggleCollapse={() => toggleStageCollapse(column.key)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.key)}
                renderTask={(task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isDragging={draggedTaskId === task.id}
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    onContextMenu={(e) => handleContextMenu(task, e.clientX, e.clientY)}
                    onFollowUp={() => handleFollowUp(task)}
                  />
                )}
              />
            ))}
          </div>
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            task={contextMenu.task}
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={handleCloseContextMenu}
            onFollowUp={handleFollowUp}
          />
        )}

        {/* Task Modal */}
        {activeModal === 'create-task' && (
          <TaskModal
            onClose={closeModal}
            parentTask={modalData?.parentTask as Task | undefined}
          />
        )}

        {/* Keyboard Help */}
        {showKeyboardHelp && <KeyboardHelp onClose={() => setShowKeyboardHelp(false)} />}
      </div>
    </ThemeProvider>
  );
}

// Icons
function KanbanIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="board__icon">
      <path d="M3 3h6v18H3V3zm7 0h6v12h-6V3zm7 0h4v8h-4V3z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.1zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.534 7h3.932a.25.25 0 01.192.41l-1.966 2.36a.25.25 0 01-.384 0l-1.966-2.36a.25.25 0 01.192-.41zm-11 2h3.932a.25.25 0 00.192-.41L2.692 6.23a.25.25 0 00-.384 0L.342 8.59A.25.25 0 00.534 9z" />
      <path d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 11-.771-.636A6.002 6.002 0 0113.917 7H12.9A5.002 5.002 0 008 3zM3.1 9a5.002 5.002 0 008.757 2.182.5.5 0 11.771.636A6.002 6.002 0 012.083 9H3.1z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 118 0a8 8 0 010 16z" />
      <path d="M5.255 5.786a.237.237 0 00.241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 00.25.246h.811a.25.25 0 00.25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
    </svg>
  );
}

const styles = `
/* Board Layout */
.board {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: radial-gradient(circle at 20% 20%, rgba(124,58,237,0.15), transparent 25%),
              radial-gradient(circle at 80% 0%, rgba(56,189,248,0.12), transparent 22%),
              var(--colors-bg);
  color: var(--colors-text);
  font-family: var(--font);
  overflow: hidden;
}

.board--empty,
.board--loading {
  justify-content: center;
  align-items: center;
}

/* Header */
.board__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--colors-border);
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.board__header-left,
.board__header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.board__header-center {
  flex: 1;
  max-width: 400px;
}

.board__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--colors-accent);
}

.board__icon {
  color: var(--colors-accent);
}

.board__task-count {
  padding: 4px 10px;
  background: var(--colors-panel);
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  color: var(--colors-subtext);
}

/* Search */
.board__search {
  position: relative;
  display: flex;
  align-items: center;
}

.board__search svg {
  position: absolute;
  left: 12px;
  color: var(--colors-subtext);
  pointer-events: none;
}

.board__search-input {
  width: 100%;
  padding: 8px 36px;
  border: 1px solid var(--colors-border);
  border-radius: 8px;
  background: var(--colors-panel);
  color: var(--colors-text);
  font-size: 13px;
  transition: all 0.15s ease;
}

.board__search-input:focus {
  outline: none;
  border-color: var(--colors-accent);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
}

.board__search-input::placeholder {
  color: var(--colors-subtext);
}

.board__search-clear {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  background: transparent;
  color: var(--colors-subtext);
  cursor: pointer;
  border-radius: 4px;
}

.board__search-clear:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--colors-text);
}

/* Content */
.board__content {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px;
}

.board__columns {
  display: flex;
  gap: 12px;
  height: 100%;
  min-height: 0;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid var(--colors-border);
  border-radius: 8px;
  background: var(--colors-panel);
  color: var(--colors-text);
  font-size: 13px;
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

.btn--icon {
  padding: 8px;
}

.btn--large {
  padding: 12px 24px;
  font-size: 14px;
}

/* Empty State */
.board__empty-state {
  text-align: center;
  padding: 40px;
}

.board__empty-icon {
  margin-bottom: 16px;
  color: var(--colors-accent);
}

.board__empty-icon svg {
  width: 48px;
  height: 48px;
}

.board__empty-title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
}

.board__empty-message {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--colors-text);
}

.board__empty-hint {
  margin: 0 0 20px;
  font-size: 12px;
  color: var(--colors-subtext);
}

.board__empty-hint code {
  background: var(--colors-panel);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}

/* Loading State */
.board__loading {
  text-align: center;
  color: var(--colors-subtext);
}

.board__loading p {
  margin: 12px 0 0;
}

.board__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--colors-border);
  border-top-color: var(--colors-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`;
