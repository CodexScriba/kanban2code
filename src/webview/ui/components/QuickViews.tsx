import React from 'react';
import type { QuickViewType } from '../hooks/useFilters';

interface QuickViewsProps {
  activeView: QuickViewType | null;
  onSetView: (view: QuickViewType | null) => void;
}

interface QuickViewConfig {
  id: QuickViewType;
  label: string;
  icon: string;
}

const QUICK_VIEWS: QuickViewConfig[] = [
  { id: 'today', label: "Today's Focus", icon: '📌' },
  { id: 'development', label: 'In Development', icon: '💻' },
  { id: 'bugs', label: 'Bugs', icon: '🐛' },
  { id: 'ideas', label: 'Ideas & Roadmaps', icon: '💡' },
];

export const QuickViews: React.FC<QuickViewsProps> = ({ activeView, onSetView }) => {
  const handleClick = (viewId: QuickViewType) => {
    if (activeView === viewId) {
      onSetView(null); // Toggle off
    } else {
      onSetView(viewId);
    }
  };

  return (
    <div className="quick-views">
      {QUICK_VIEWS.map(({ id, label, icon }) => (
        <button
          key={id}
          className={`quick-view-btn ${activeView === id ? 'active' : ''}`}
          onClick={() => handleClick(id)}
          title={label}
        >
          <span className="quick-view-icon">{icon}</span>
          <span className="quick-view-label">{label}</span>
        </button>
      ))}
    </div>
  );
};
