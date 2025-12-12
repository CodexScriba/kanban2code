import React from 'react';
import type { KeyboardShortcut } from '../hooks/useKeyboard';

interface KeyboardHelpProps {
  shortcuts: KeyboardShortcut[];
  onClose: () => void;
}

interface ShortcutCategory {
  title: string;
  category: KeyboardShortcut['category'];
}

const CATEGORIES: ShortcutCategory[] = [
  { title: 'Navigation', category: 'navigation' },
  { title: 'Actions', category: 'actions' },
  { title: 'Stages', category: 'stages' },
  { title: 'Context', category: 'context' },
  { title: 'Help', category: 'help' },
];

function formatKey(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.modifiers?.includes('ctrl') || shortcut.modifiers?.includes('meta')) {
    parts.push('⌘/Ctrl');
  }
  if (shortcut.modifiers?.includes('shift')) {
    parts.push('⇧');
  }
  if (shortcut.modifiers?.includes('alt')) {
    parts.push('Alt');
  }
  
  // Format special keys
  const keyMap: Record<string, string> = {
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'Enter': '↵',
    ' ': 'Space',
    'Escape': 'Esc',
    'Tab': 'Tab',
    'ContextMenu': 'Menu',
  };
  
  parts.push(keyMap[shortcut.key] || shortcut.key);
  
  return parts.join(' + ');
}

export const KeyboardHelp: React.FC<KeyboardHelpProps> = ({ shortcuts, onClose }) => {
  // Handle escape to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="glass-overlay" onClick={handleOverlayClick}>
      <div className="glass-modal keyboard-help" role="dialog" aria-labelledby="keyboard-help-title">
        <div className="modal-header">
          <h2 id="keyboard-help-title">Keyboard Shortcuts</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          {CATEGORIES.map(({ title, category }) => {
            const categoryShortcuts = shortcuts.filter((s) => s.category === category);
            if (categoryShortcuts.length === 0) return null;
            
            return (
              <div key={category} className="shortcut-category">
                <h3 className="shortcut-category-title">{title}</h3>
                <div className="shortcut-list">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div key={index} className="shortcut-item">
                      <kbd className="shortcut-key">{formatKey(shortcut)}</kbd>
                      <span className="shortcut-description">{shortcut.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="modal-footer">
          <p className="keyboard-help-hint">Press <kbd>?</kbd> to toggle this help</p>
        </div>
      </div>
    </div>
  );
};
