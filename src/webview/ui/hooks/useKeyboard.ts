import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[];
  action: () => void;
  description: string;
  category: 'navigation' | 'actions' | 'context' | 'help';
}

interface UseKeyboardOptions {
  enabled?: boolean;
  onFocusNext?: () => void;
  onFocusPrev?: () => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onActivate?: () => void;
  onToggle?: () => void;
  onNewTask?: () => void;
  onNewTaskModal?: () => void;
  onFocusFilter?: () => void;
  onFocusSearch?: () => void;
  onShowHelp?: () => void;
  onOpenContextMenu?: () => void;
  onEscape?: () => void;
}

export interface UseKeyboardResult {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  shortcuts: KeyboardShortcut[];
}

export function useKeyboard(options: UseKeyboardOptions = {}): UseKeyboardResult {
  const {
    enabled = true,
    onFocusNext,
    onFocusPrev,
    onExpand,
    onCollapse,
    onActivate,
    onToggle,
    onNewTask,
    onNewTaskModal,
    onFocusFilter,
    onFocusSearch,
    onShowHelp,
    onOpenContextMenu,
    onEscape,
  } = options;

  const focusedIndexRef = useRef(0);

  const setFocusedIndex = useCallback((index: number) => {
    focusedIndexRef.current = index;
  }, []);

  const shortcuts: KeyboardShortcut[] = [
    // Navigation
    { key: 'ArrowUp', action: () => onFocusPrev?.(), description: 'Focus previous task', category: 'navigation' },
    { key: 'ArrowDown', action: () => onFocusNext?.(), description: 'Focus next task', category: 'navigation' },
    { key: 'ArrowLeft', action: () => onCollapse?.(), description: 'Collapse node or go to parent', category: 'navigation' },
    { key: 'ArrowRight', action: () => onExpand?.(), description: 'Expand node or go to child', category: 'navigation' },
    { key: 'Tab', action: () => {}, description: 'Move to next section', category: 'navigation' },
    { key: 'Tab', modifiers: ['shift'], action: () => {}, description: 'Move to previous section', category: 'navigation' },
    
    // Actions
    { key: 'Enter', action: () => onActivate?.(), description: 'Open focused task', category: 'actions' },
    { key: ' ', action: () => onToggle?.(), description: 'Toggle node expand/collapse', category: 'actions' },
    { key: 'n', action: () => onNewTask?.(), description: 'New task (quick create)', category: 'actions' },
    { key: 'N', modifiers: ['shift'], action: () => onNewTaskModal?.(), description: 'New task (detailed modal)', category: 'actions' },
    { key: 'f', action: () => onFocusFilter?.(), description: 'Focus filter bar', category: 'actions' },
    { key: '/', action: () => onFocusSearch?.(), description: 'Focus search', category: 'actions' },
    { key: 'Escape', action: () => onEscape?.(), description: 'Clear focus/close modal', category: 'actions' },
    
    // Context menu
    { key: 'F10', modifiers: ['shift'], action: () => onOpenContextMenu?.(), description: 'Open context menu for focused task', category: 'context' },
    { key: 'ContextMenu', action: () => onOpenContextMenu?.(), description: 'Open context menu', category: 'context' },
    
    // Help
    { key: '?', action: () => onShowHelp?.(), description: 'Show keyboard shortcuts overlay', category: 'help' },
  ];

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const key = event.key;
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      // Check for matching shortcut
      for (const shortcut of shortcuts) {
        const modifiers = shortcut.modifiers || [];
        const needsCtrl = modifiers.includes('ctrl') || modifiers.includes('meta');
        const needsShift = modifiers.includes('shift');
        const needsAlt = modifiers.includes('alt');

        if (
          shortcut.key === key &&
          needsCtrl === ctrl &&
          needsShift === shift &&
          needsAlt === alt
        ) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, shortcuts]);

  return {
    focusedIndex: focusedIndexRef.current,
    setFocusedIndex,
    shortcuts,
  };
}
