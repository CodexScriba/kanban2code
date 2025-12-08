import React, { useMemo, useState, useCallback } from 'react';
import { useTaskStore, selectFilteredTasks } from '../stores/taskStore';
import { useUIStore } from '../stores/uiStore';
import { postMessageToHost, createTaskOpenMessage } from '../messaging/protocol';
import type { Task, Stage } from '../../types/task';

export interface TaskTreeProps {
  tasks: Task[];
  onContextMenu: (task: Task, x: number, y: number) => void;
}

interface TreeNode {
  type: 'inbox' | 'project' | 'phase';
  name: string;
  tasks: Task[];
  children?: TreeNode[];
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

export function TaskTree({ tasks, onContextMenu }: TaskTreeProps) {
  const filters = useTaskStore((state) => state.filters);
  const selectedTaskId = useUIStore((state) => state.selectedTaskId);
  const selectTask = useUIStore((state) => state.selectTask);

  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  // Build filtered tasks
  const filteredTasks = useMemo(() => {
    return selectFilteredTasks({ tasks, filters, loading: false, error: null } as never);
  }, [tasks, filters]);

  // Build tree structure
  const tree = useMemo(() => {
    const inboxTasks = filteredTasks.filter((t) => !t.project);
    const projectTasks = filteredTasks.filter((t) => t.project);

    // Group by project
    const projectMap = new Map<string, Task[]>();
    for (const task of projectTasks) {
      const existing = projectMap.get(task.project!) || [];
      existing.push(task);
      projectMap.set(task.project!, existing);
    }

    // Build project nodes
    const projectNodes: TreeNode[] = Array.from(projectMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([project, tasks]) => {
        // Group by phase within project
        const directTasks = tasks.filter((t) => !t.phase);
        const phaseTasks = tasks.filter((t) => t.phase);

        const phaseMap = new Map<string, Task[]>();
        for (const task of phaseTasks) {
          const existing = phaseMap.get(task.phase!) || [];
          existing.push(task);
          phaseMap.set(task.phase!, existing);
        }

        const phaseNodes: TreeNode[] = Array.from(phaseMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([phase, tasks]) => ({
            type: 'phase' as const,
            name: phase,
            tasks: sortTasks(tasks),
          }));

        return {
          type: 'project' as const,
          name: project,
          tasks: sortTasks(directTasks),
          children: phaseNodes,
        };
      });

    return {
      inbox: {
        type: 'inbox' as const,
        name: 'Inbox',
        tasks: sortTasks(inboxTasks),
      },
      projects: projectNodes,
    };
  }, [filteredTasks]);

  const toggleCollapse = useCallback((nodeId: string) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const handleTaskClick = useCallback(
    (task: Task) => {
      selectTask(task.id);
      postMessageToHost(createTaskOpenMessage(task.filePath));
    },
    [selectTask],
  );

  const handleTaskContextMenu = useCallback(
    (e: React.MouseEvent, task: Task) => {
      e.preventDefault();
      onContextMenu(task, e.clientX, e.clientY);
    },
    [onContextMenu],
  );

  const totalCount = filteredTasks.length;
  const inboxCount = tree.inbox.tasks.length;

  return (
    <div className="task-tree">
      <style>{styles}</style>

      {/* Summary */}
      <div className="task-tree__summary">
        <span className="task-tree__count">{totalCount} task{totalCount !== 1 ? 's' : ''}</span>
        {filters.search && (
          <span className="task-tree__filter-hint">matching "{filters.search}"</span>
        )}
      </div>

      {/* Inbox Section */}
      <div className="task-tree__section">
        <button
          className="task-tree__section-header"
          onClick={() => toggleCollapse('inbox')}
          aria-expanded={!collapsedNodes.has('inbox')}
        >
          <ChevronIcon className={collapsedNodes.has('inbox') ? '' : 'expanded'} />
          <InboxIcon />
          <span className="task-tree__section-name">Inbox</span>
          <span className="task-tree__section-count">{inboxCount}</span>
        </button>

        {!collapsedNodes.has('inbox') && (
          <div className="task-tree__tasks">
            {tree.inbox.tasks.length === 0 ? (
              <div className="task-tree__empty">No inbox tasks</div>
            ) : (
              tree.inbox.tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isSelected={selectedTaskId === task.id}
                  onClick={() => handleTaskClick(task)}
                  onContextMenu={(e) => handleTaskContextMenu(e, task)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Projects Section */}
      {tree.projects.length > 0 && (
        <div className="task-tree__section">
          <div className="task-tree__projects-header">
            <FolderIcon />
            <span>Projects</span>
          </div>

          {tree.projects.map((project) => (
            <ProjectNode
              key={project.name}
              node={project}
              selectedTaskId={selectedTaskId}
              collapsedNodes={collapsedNodes}
              onToggleCollapse={toggleCollapse}
              onTaskClick={handleTaskClick}
              onTaskContextMenu={handleTaskContextMenu}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="task-tree__no-results">
          <p>No tasks found</p>
          {filters.search && <p className="task-tree__no-results-hint">Try a different search term</p>}
        </div>
      )}
    </div>
  );
}

interface ProjectNodeProps {
  node: TreeNode;
  selectedTaskId: string | null;
  collapsedNodes: Set<string>;
  onToggleCollapse: (nodeId: string) => void;
  onTaskClick: (task: Task) => void;
  onTaskContextMenu: (e: React.MouseEvent, task: Task) => void;
}

function ProjectNode({
  node,
  selectedTaskId,
  collapsedNodes,
  onToggleCollapse,
  onTaskClick,
  onTaskContextMenu,
}: ProjectNodeProps) {
  const nodeId = `project:${node.name}`;
  const isCollapsed = collapsedNodes.has(nodeId);
  const totalTasks = node.tasks.length + (node.children?.reduce((sum, c) => sum + c.tasks.length, 0) || 0);

  return (
    <div className="task-tree__project">
      <button
        className="task-tree__project-header"
        onClick={() => onToggleCollapse(nodeId)}
        aria-expanded={!isCollapsed}
      >
        <ChevronIcon className={isCollapsed ? '' : 'expanded'} />
        <FolderIcon />
        <span className="task-tree__project-name">{node.name}</span>
        <span className="task-tree__project-count">{totalTasks}</span>
      </button>

      {!isCollapsed && (
        <div className="task-tree__project-content">
          {/* Direct project tasks */}
          {node.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={selectedTaskId === task.id}
              onClick={() => onTaskClick(task)}
              onContextMenu={(e) => onTaskContextMenu(e, task)}
            />
          ))}

          {/* Phase nodes */}
          {node.children?.map((phase) => (
            <PhaseNode
              key={phase.name}
              node={phase}
              parentProject={node.name}
              selectedTaskId={selectedTaskId}
              collapsedNodes={collapsedNodes}
              onToggleCollapse={onToggleCollapse}
              onTaskClick={onTaskClick}
              onTaskContextMenu={onTaskContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface PhaseNodeProps {
  node: TreeNode;
  parentProject: string;
  selectedTaskId: string | null;
  collapsedNodes: Set<string>;
  onToggleCollapse: (nodeId: string) => void;
  onTaskClick: (task: Task) => void;
  onTaskContextMenu: (e: React.MouseEvent, task: Task) => void;
}

function PhaseNode({
  node,
  parentProject,
  selectedTaskId,
  collapsedNodes,
  onToggleCollapse,
  onTaskClick,
  onTaskContextMenu,
}: PhaseNodeProps) {
  const nodeId = `phase:${parentProject}:${node.name}`;
  const isCollapsed = collapsedNodes.has(nodeId);

  return (
    <div className="task-tree__phase">
      <button
        className="task-tree__phase-header"
        onClick={() => onToggleCollapse(nodeId)}
        aria-expanded={!isCollapsed}
      >
        <ChevronIcon className={isCollapsed ? '' : 'expanded'} />
        <PhaseIcon />
        <span className="task-tree__phase-name">{node.name}</span>
        <span className="task-tree__phase-count">{node.tasks.length}</span>
      </button>

      {!isCollapsed && (
        <div className="task-tree__phase-content">
          {node.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={selectedTaskId === task.id}
              onClick={() => onTaskClick(task)}
              onContextMenu={(e) => onTaskContextMenu(e, task)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function TaskItem({ task, isSelected, onClick, onContextMenu }: TaskItemProps) {
  const stageColor = STAGE_COLORS[task.stage];
  const displayTags = task.tags?.slice(0, 3) || [];

  return (
    <button
      className={`task-item ${isSelected ? 'task-item--selected' : ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
       data-task-id={task.id}
      aria-selected={isSelected}
    >
      <div className="task-item__main">
        <span className="task-item__title">{task.title}</span>
        <span
          className="task-item__stage"
          style={{ background: stageColor }}
          title={STAGE_LABELS[task.stage]}
        >
          {STAGE_LABELS[task.stage]}
        </span>
      </div>
      {displayTags.length > 0 && (
        <div className="task-item__tags">
          {displayTags.map((tag) => (
            <span key={tag} className="task-item__tag">
              {tag}
            </span>
          ))}
          {(task.tags?.length || 0) > 3 && (
            <span className="task-item__tag task-item__tag--more">
              +{(task.tags?.length || 0) - 3}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

// Helper to sort tasks by order, then by created date
function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Sort by order if both have it
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    // Tasks with order come first
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    // Then by created date (newer first)
    if (a.created && b.created) {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    }
    // Finally by title
    return a.title.localeCompare(b.title);
  });
}

// Icons
function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={`task-tree__chevron ${className}`}
    >
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="task-tree__icon">
      <path d="M14 9H2V3a1 1 0 011-1h10a1 1 0 011 1v6zm0 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3h4l1 2h2l1-2h4z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="task-tree__icon">
      <path d="M14 4H8l-1-2H2a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1z" />
    </svg>
  );
}

function PhaseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="task-tree__icon task-tree__icon--small">
      <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

const styles = `
.task-tree {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
}

.task-tree__summary {
  padding: 4px 12px 8px;
  font-size: 11px;
  color: var(--colors-subtext);
}

.task-tree__count {
  font-weight: 500;
}

.task-tree__filter-hint {
  margin-left: 4px;
  font-style: italic;
}

/* Section */
.task-tree__section {
  margin-bottom: 4px;
}

.task-tree__section-header,
.task-tree__project-header,
.task-tree__phase-header {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: var(--colors-text);
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}

.task-tree__section-header:hover,
.task-tree__project-header:hover,
.task-tree__phase-header:hover {
  background: var(--colors-panel);
}

.task-tree__section-name,
.task-tree__project-name,
.task-tree__phase-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-tree__section-count,
.task-tree__project-count,
.task-tree__phase-count {
  padding: 1px 6px;
  background: var(--colors-panel);
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  color: var(--colors-subtext);
}

.task-tree__chevron {
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.task-tree__chevron.expanded {
  transform: rotate(90deg);
}

.task-tree__icon {
  flex-shrink: 0;
  color: var(--colors-subtext);
}

.task-tree__icon--small {
  width: 12px;
  height: 12px;
}

/* Projects header */
.task-tree__projects-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--colors-subtext);
}

/* Project */
.task-tree__project {
  margin-left: 8px;
}

.task-tree__project-content {
  padding-left: 12px;
}

/* Phase */
.task-tree__phase {
  margin-left: 8px;
}

.task-tree__phase-content {
  padding-left: 12px;
}

/* Tasks list */
.task-tree__tasks {
  padding: 0 12px 0 28px;
}

.task-tree__empty {
  padding: 8px 12px;
  font-size: 11px;
  color: var(--colors-subtext);
  font-style: italic;
}

/* Task Item */
.task-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 8px 10px;
  margin: 2px 0;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.task-item:hover {
  background: var(--colors-panel);
  border-color: var(--colors-border);
}

.task-item--selected {
  background: color-mix(in srgb, var(--colors-accent) 15%, transparent);
  border-color: var(--colors-accent);
}

.task-item__main {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.task-item__title {
  flex: 1;
  font-size: 12px;
  color: var(--colors-text);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.task-item__stage {
  flex-shrink: 0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.task-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.task-item__tag {
  padding: 1px 6px;
  background: var(--colors-panel);
  border-radius: 3px;
  font-size: 10px;
  color: var(--colors-subtext);
}

.task-item__tag--more {
  background: transparent;
  color: var(--colors-subtext);
}

/* No results */
.task-tree__no-results {
  padding: 24px 16px;
  text-align: center;
  color: var(--colors-subtext);
}

.task-tree__no-results p {
  margin: 0 0 4px;
}

.task-tree__no-results-hint {
  font-size: 12px;
  font-style: italic;
}
`;
