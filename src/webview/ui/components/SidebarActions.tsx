import React from 'react';
import { PlusIcon, FolderIcon, ContextIcon, AgentIcon, TemplateIcon } from './Icons';

interface SidebarActionsProps {
  onNewTask: () => void;
  onNewProject: () => void;
  onNewContext: () => void;
  onNewAgent: () => void;
  onNewTemplate: () => void;
}

export const SidebarActions: React.FC<SidebarActionsProps> = ({
  onNewTask,
  onNewProject,
  onNewContext,
  onNewAgent,
  onNewTemplate,
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
      <button className="action-btn glass-button" onClick={onNewTemplate}>
        <TemplateIcon />
        New Template
      </button>
    </div>
  );
};
