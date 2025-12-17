import React from 'react';
import { PlusIcon, FolderIcon, ContextIcon, AgentIcon } from './Icons';

interface SidebarActionsProps {
  onNewTask: () => void;
  onNewProject: () => void;
  onNewContext: () => void;
  onNewAgent: () => void;
}

export const SidebarActions: React.FC<SidebarActionsProps> = ({
  onNewTask,
  onNewProject,
  onNewContext,
  onNewAgent,
}) => {
  return (
    <div className="sidebar-actions">
      <button className="action-btn glass-button" onClick={onNewTask}>
        <PlusIcon />
        New Task
      </button>
      <button className="action-btn glass-button" onClick={onNewProject}>
        <FolderIcon />
        New Project
      </button>
      <button className="action-btn glass-button" onClick={onNewContext}>
        <ContextIcon />
        New Context
      </button>
      <button className="action-btn glass-button" onClick={onNewAgent}>
        <AgentIcon />
        New Agent
      </button>
    </div>
  );
};
