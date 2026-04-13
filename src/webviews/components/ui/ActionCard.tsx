import React from 'react';
import { ActionIcon, Accent } from './ActionIcon';

interface ActionCardProps {
  accent: Accent;
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export function ActionCard({ accent, label, description, icon, onClick }: ActionCardProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }

  return (
    <div
      className="k2c-action-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <ActionIcon accent={accent}>{icon}</ActionIcon>

      <div className="k2c-action-text">
        <span className="k2c-action-label">{label}</span>
        <span className="k2c-action-desc">{description}</span>
      </div>

      <svg
        className="k2c-action-chevron"
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 4l4 4-4 4"/>
      </svg>
    </div>
  );
}
