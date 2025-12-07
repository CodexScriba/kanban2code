import React, { PropsWithChildren, useEffect, useMemo } from 'react';

const tokens = {
  colors: {
    bg: '#0b1220',
    panel: 'rgba(255,255,255,0.03)',
    border: '#1f2937',
    text: '#e5e7eb',
    subtext: '#94a3b8',
    accent: '#7c3aed',
    accent2: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
  },
  shadow: '0 10px 30px rgba(0,0,0,0.2)',
  radius: '12px',
  font: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
};

export function ThemeProvider({ children }: PropsWithChildren) {
  const cssVars = useMemo(() => tokensToCSS(tokens), []);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [cssVars]);

  return <>{children}</>;
}

function tokensToCSS(obj: Record<string, unknown>, prefix = '--'): Record<string, string> {
  return Object.entries(obj).reduce<Record<string, string>>((acc, [key, value]) => {
    const varName = `${prefix}${key}`;
    if (typeof value === 'string') {
      acc[varName] = value;
      return acc;
    }
    if (typeof value === 'object' && value) {
      Object.assign(acc, tokensToCSS(value as Record<string, unknown>, `${varName}-`));
    }
    return acc;
  }, {});
}
