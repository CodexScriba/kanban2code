import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

function iconSize(size?: number): React.CSSProperties {
  return { width: size ?? 16, height: size ?? 16 };
}

export const PlusIcon: React.FC<IconProps> = ({ className = 'icon', size }) => (
  <svg className={className} style={iconSize(size)} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 3.5a.5.5 0 0 1 .5.5v3.5H12a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5Z" />
  </svg>
);

export const EmptyBoardIcon: React.FC<IconProps> = ({ className = 'empty-icon', size = 32 }) => (
  <svg className={className} style={iconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className = 'icon', size }) => (
  <svg className={className} style={iconSize(size)} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-7.11 7.11a.75.75 0 0 1-.298.184l-2.84.947a.75.75 0 0 1-.949-.949l.947-2.84a.75.75 0 0 1 .184-.298l7.11-7.11Z" />
    <path d="M2 13.5A1.5 1.5 0 0 0 3.5 15h9a.5.5 0 0 0 0-1h-9a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h5a.5.5 0 0 0 0-1h-5A1.5 1.5 0 0 0 2 4.5v9Z" />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ className = 'icon', size }) => (
  <svg className={className} style={iconSize(size)} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M4.5 3.5A1 1 0 0 1 6 2.634l6 3.5a1 1 0 0 1 0 1.732l-6 3.5A1 1 0 0 1 4.5 10.5v-7Z" />
  </svg>
);

export const FastForwardIcon: React.FC<IconProps> = ({ className = 'icon', size }) => (
  <svg className={className} style={iconSize(size)} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M1.5 3.5A1 1 0 0 1 3 2.634l4.75 2.771a1 1 0 0 1 0 1.73L3 9.906A1 1 0 0 1 1.5 9.04V3.5Zm6.5 0A1 1 0 0 1 9.5 2.634l4.75 2.771a1 1 0 0 1 0 1.73L9.5 9.906A1 1 0 0 1 8 9.04V3.5Z" />
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className = 'icon', size }) => (
  <svg className={className} style={iconSize(size)} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M15.854.646a.5.5 0 0 0-.528-.115l-14 5a.5.5 0 0 0 .032.949l5.178 1.48 1.48 5.178a.5.5 0 0 0 .949.032l5-14a.5.5 0 0 0-.111-.524ZM7.25 7.5l5.447-5.447-4.12 9.263-.999-3.495a.75.75 0 0 0-.514-.514L3.57 6.31l9.264-4.121L7.25 7.5Z" />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ className = 'icon', size }) => (
  <svg className={className} style={iconSize(size)} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 0 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 1 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const Icons = {
  Plus: PlusIcon,
  EmptyBoard: EmptyBoardIcon,
  Edit: EditIcon,
  Play: PlayIcon,
  FastForward: FastForwardIcon,
  Send: SendIcon,
  X: XIcon,
};
