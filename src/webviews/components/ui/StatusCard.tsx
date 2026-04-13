import React from 'react';

interface StatusCardProps {
  children: React.ReactNode;
}

export function StatusCard({ children }: StatusCardProps) {
  return (
    <div className="k2c-status-card">
      <div className="k2c-status-dot" aria-hidden />
      <div className="k2c-status-text">{children}</div>
    </div>
  );
}
