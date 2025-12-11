import React from 'react';
import { SettingsIcon, BoardIcon } from './Icons';

interface SidebarToolbarProps {
  onOpenBoard: () => void;
  onOpenSettings: () => void;
}

export const SidebarToolbar: React.FC<SidebarToolbarProps> = ({
  onOpenBoard,
  onOpenSettings,
}) => {
  return (
    <div className="sidebar-toolbar">
      <span className="sidebar-title">Kanban2Code</span>
      <div className="toolbar-actions">
        <button
          className="btn btn-icon btn-ghost tooltip"
          data-tooltip="Open Board"
          onClick={onOpenBoard}
        >
          <BoardIcon />
        </button>
        <button
          className="btn btn-icon btn-ghost tooltip"
          data-tooltip="Settings"
          onClick={onOpenSettings}
        >
          <SettingsIcon />
        </button>
      </div>
    </div>
  );
};
