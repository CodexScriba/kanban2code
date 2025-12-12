import { useEffect, useCallback, useMemo, useRef } from 'react';
import type { Stage } from '../../../types/task';

export interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[];
  action: () => void;
  description: string;
  category: 'navigation' | 'actions' | 'context' | 'help' | 'stages';
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
  // Phase 5.1: Additional shortcuts
  onCopyContext?: () => void;
  onCopyTaskOnly?: () => void;
  onToggleLayout?: () => void;
  onMoveToStage?: (stage: Stage) => void;
  onDelete?: () => void;
  onArchive?: () => void;
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
    // Phase 5.1: Additional options
    onCopyContext,
    onCopyTaskOnly,
    onToggleLayout,
    onMoveToStage,
    onDelete,
    onArchive,
  } = options;

  const focusedIndexRef = useRef(0);

  const setFocusedIndex = useCallback((index: number) => {
    focusedIndexRef.current = index;
  }, []);

  const shortcuts: KeyboardShortcut[] = useMemo(() => {
    const list: KeyboardShortcut[] = [];

    // Navigation
    if (onFocusPrev) {
      list.push({ key: 'ArrowUp', action: onFocusPrev, description: 'Focus previous task', category: 'navigation' });
    }
    if (onFocusNext) {
      list.push({ key: 'ArrowDown', action: onFocusNext, description: 'Focus next task', category: 'navigation' });
    }
    if (onCollapse) {
      list.push({ key: 'ArrowLeft', action: onCollapse, description: 'Collapse node or go to parent', category: 'navigation' });
    }
    if (onExpand) {
      list.push({ key: 'ArrowRight', action: onExpand, description: 'Expand node or go to child', category: 'navigation' });
    }

    // Actions
    if (onActivate) {
      list.push({ key: 'Enter', action: onActivate, description: 'Open focused task', category: 'actions' });
    }
    if (onToggle) {
      list.push({ key: ' ', action: onToggle, description: 'Toggle node expand/collapse', category: 'actions' });
    }
    if (onNewTask) {
      list.push({ key: 'n', action: onNewTask, description: 'New task (quick create)', category: 'actions' });
    }
    if (onNewTaskModal) {
      list.push({ key: 'N', modifiers: ['shift'], action: onNewTaskModal, description: 'New task (detailed modal)', category: 'actions' });
    }
    if (onFocusFilter) {
      list.push({ key: 'f', action: onFocusFilter, description: 'Focus filter bar', category: 'actions' });
    }
    if (onFocusSearch) {
      list.push({ key: '/', action: onFocusSearch, description: 'Focus search', category: 'actions' });
    }
    if (onEscape) {
      list.push({ key: 'Escape', action: onEscape, description: 'Clear focus/close modal', category: 'actions' });
    }

    // Phase 5.1: Copy shortcuts
    if (onCopyContext) {
      list.push({ key: 'c', modifiers: ['ctrl', 'shift'], action: onCopyContext, description: 'Copy task context (full XML)', category: 'context' });
      list.push({ key: 'c', modifiers: ['meta', 'shift'], action: onCopyContext, description: 'Copy task context (full XML)', category: 'context' });
    }
    if (onCopyTaskOnly) {
      list.push({ key: 'c', action: onCopyTaskOnly, description: 'Copy task only', category: 'context' });
    }

    // Phase 5.1: Layout toggle
    if (onToggleLayout) {
      list.push({ key: 'l', modifiers: ['ctrl'], action: onToggleLayout, description: 'Toggle board layout', category: 'actions' });
      list.push({ key: 'l', modifiers: ['meta'], action: onToggleLayout, description: 'Toggle board layout', category: 'actions' });
    }

    // Phase 5.1: Stage shortcuts (1-5)
    if (onMoveToStage) {
      list.push({ key: '1', action: () => onMoveToStage('plan'), description: 'Move to Plan', category: 'stages' });
      list.push({ key: '2', action: () => onMoveToStage('code'), description: 'Move to Code', category: 'stages' });
      list.push({ key: '3', action: () => onMoveToStage('audit'), description: 'Move to Audit', category: 'stages' });
      list.push({ key: '4', action: () => onMoveToStage('completed'), description: 'Move to Completed', category: 'stages' });
      list.push({ key: '5', action: () => onMoveToStage('inbox'), description: 'Move to Inbox', category: 'stages' });
    }

    // Phase 5.1: Delete and Archive
    if (onDelete) {
      list.push({ key: 'Delete', action: onDelete, description: 'Delete focused task', category: 'actions' });
      list.push({ key: 'Backspace', action: onDelete, description: 'Delete focused task', category: 'actions' });
    }
    if (onArchive) {
      list.push({ key: 'a', action: onArchive, description: 'Archive focused task', category: 'actions' });
    }

    // Context menu
    if (onOpenContextMenu) {
      list.push({ key: 'F10', modifiers: ['shift'], action: onOpenContextMenu, description: 'Open context menu for focused task', category: 'context' });
      list.push({ key: 'ContextMenu', action: onOpenContextMenu, description: 'Open context menu', category: 'context' });
    }

    // Help
    if (onShowHelp) {
      list.push({ key: '?', action: onShowHelp, description: 'Show keyboard shortcuts overlay', category: 'help' });
    }

    return list;
  }, [
    onArchive,
    onCollapse,
    onCopyContext,
    onCopyTaskOnly,
    onDelete,
    onEscape,
    onExpand,
    onFocusFilter,
    onFocusNext,
    onFocusPrev,
    onFocusSearch,
    onMoveToStage,
    onNewTask,
    onNewTaskModal,
    onOpenContextMenu,
    onActivate,
    onShowHelp,
    onToggle,
    onToggleLayout,
  ]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const key = event.key;
      const ctrl = event.ctrlKey;
      const meta = event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      // Check for matching shortcut
      for (const shortcut of shortcuts) {
        const modifiers = shortcut.modifiers || [];
        const needsCtrl = modifiers.includes('ctrl');
        const needsMeta = modifiers.includes('meta');
        const needsShift = modifiers.includes('shift');
        const needsAlt = modifiers.includes('alt');

        if (
          shortcut.key === key &&
          needsCtrl === ctrl &&
          needsMeta === meta &&
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
