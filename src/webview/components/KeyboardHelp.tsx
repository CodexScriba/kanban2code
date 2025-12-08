import React, { useEffect, useRef } from 'react';
import { KEYBOARD_SHORTCUTS } from '../hooks/useKeyboardNavigation';

export interface KeyboardHelpProps {
  onClose: () => void;
}

export function KeyboardHelp({ onClose }: KeyboardHelpProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="keyboard-help-overlay">
      <style>{styles}</style>
      <div
        className="keyboard-help"
        ref={overlayRef}
        role="dialog"
        aria-labelledby="keyboard-help-title"
        aria-describedby="keyboard-help-desc"
      >
        <div className="keyboard-help__header">
          <h2 id="keyboard-help-title" className="keyboard-help__title">
            Keyboard Shortcuts
          </h2>
          <button
            className="keyboard-help__close"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <p id="keyboard-help-desc" className="keyboard-help__desc">
          Use these shortcuts to navigate and perform actions quickly.
        </p>

        <div className="keyboard-help__content">
          {KEYBOARD_SHORTCUTS.map((category) => (
            <div key={category.category} className="keyboard-help__category">
              <h3 className="keyboard-help__category-title">{category.category}</h3>
              <ul className="keyboard-help__list">
                {category.shortcuts.map((shortcut, index) => (
                  <li key={index} className="keyboard-help__item">
                    <span className="keyboard-help__keys">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex}>
                          <kbd className="keyboard-help__key">{key}</kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="keyboard-help__separator">+</span>
                          )}
                        </span>
                      ))}
                    </span>
                    <span className="keyboard-help__description">
                      {shortcut.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="keyboard-help__footer">
          <span className="keyboard-help__hint">
            Press <kbd className="keyboard-help__key">?</kbd> or{' '}
            <kbd className="keyboard-help__key">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const styles = `
.keyboard-help-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 150;
}

.keyboard-help {
  width: 100%;
  max-width: 420px;
  max-height: 80vh;
  overflow-y: auto;
  background: var(--colors-bg);
  border: 1px solid var(--colors-border);
  border-radius: var(--radius);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.keyboard-help__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--colors-border);
}

.keyboard-help__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--colors-text);
}

.keyboard-help__close {
  padding: 4px;
  background: none;
  border: none;
  color: var(--colors-subtext);
  cursor: pointer;
  border-radius: 4px;
}

.keyboard-help__close:hover {
  background: var(--colors-panel);
  color: var(--colors-text);
}

.keyboard-help__desc {
  margin: 0;
  padding: 12px 20px;
  font-size: 12px;
  color: var(--colors-subtext);
  border-bottom: 1px solid var(--colors-border);
}

.keyboard-help__content {
  padding: 16px 20px;
}

.keyboard-help__category {
  margin-bottom: 20px;
}

.keyboard-help__category:last-child {
  margin-bottom: 0;
}

.keyboard-help__category-title {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--colors-accent);
}

.keyboard-help__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.keyboard-help__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.keyboard-help__item:last-child {
  border-bottom: none;
}

.keyboard-help__keys {
  display: flex;
  align-items: center;
  gap: 4px;
}

.keyboard-help__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  background: var(--colors-panel);
  border: 1px solid var(--colors-border);
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 11px;
  font-weight: 500;
  color: var(--colors-text);
}

.keyboard-help__separator {
  margin: 0 2px;
  color: var(--colors-subtext);
  font-size: 10px;
}

.keyboard-help__description {
  font-size: 12px;
  color: var(--colors-text);
}

.keyboard-help__footer {
  padding: 12px 20px;
  border-top: 1px solid var(--colors-border);
  text-align: center;
}

.keyboard-help__hint {
  font-size: 11px;
  color: var(--colors-subtext);
}

.keyboard-help__hint .keyboard-help__key {
  display: inline-flex;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  font-size: 10px;
  vertical-align: middle;
}
`;
