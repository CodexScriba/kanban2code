import React from 'react';

export type Accent = 'blue' | 'cyan' | 'violet' | 'amber' | 'green' | 'red';

interface ActionIconProps {
  accent: Accent;
  children: React.ReactNode;
}

export function ActionIcon({ accent, children }: ActionIconProps) {
  return (
    <div className="k2c-action-icon" data-accent={accent}>
      {children}
    </div>
  );
}
