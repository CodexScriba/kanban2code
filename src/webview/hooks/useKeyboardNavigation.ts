import { useEffect, useCallback, RefObject } from 'react';

export interface UseKeyboardNavigationOptions {
  containerRef: RefObject<HTMLElement | null>;
  onNewTask?: () => void;
  onToggleHelp?: () => void;
  onEscape?: () => void;
  onFocusSearch?: () => void;
  onNavigateUp?: () => void;
  onNavigateDown?: () => void;
  onSelectTask?: () => void;
  onCopyContext?: () => void;
  enabled?: boolean;
}

/**
 * Hook for handling keyboard navigation within webviews.
 * Provides shortcuts for common actions and navigation.
 */
export function useKeyboardNavigation({
  containerRef,
  onNewTask,
  onToggleHelp,
  onEscape,
  onFocusSearch,
  onNavigateUp,
  onNavigateDown,
  onSelectTask,
  onCopyContext,
  enabled = true,
}: UseKeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Check if we're in an input field
      const target = event.target as HTMLElement;
      const isInInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // Escape always works
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape?.();
        return;
      }

      // ? for help (shift + /)
      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        if (!isInInput) {
          event.preventDefault();
          onToggleHelp?.();
          return;
        }
      }

      // Ctrl+N for new task
      if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        onNewTask?.();
        return;
      }

      // Ctrl+Shift+F for focus search
      if (event.ctrlKey && event.shiftKey && event.key === 'F') {
        event.preventDefault();
        onFocusSearch?.();
        return;
      }

      // Ctrl+C for copy context (when not in input)
      if (event.ctrlKey && event.key === 'c' && !isInInput) {
        // Only if there's no text selection
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          event.preventDefault();
          onCopyContext?.();
          return;
        }
      }

      // Navigation keys (only when not in input)
      if (!isInInput) {
        switch (event.key) {
          case 'ArrowUp':
          case 'k':
            event.preventDefault();
            onNavigateUp?.();
            break;
          case 'ArrowDown':
          case 'j':
            event.preventDefault();
            onNavigateDown?.();
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            onSelectTask?.();
            break;
        }
      }
    },
    [
      enabled,
      onNewTask,
      onToggleHelp,
      onEscape,
      onFocusSearch,
      onNavigateUp,
      onNavigateDown,
      onSelectTask,
      onCopyContext,
    ],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Use document level for global shortcuts
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, handleKeyDown, enabled]);
}

/**
 * List of keyboard shortcuts for display in help overlay.
 */
export const KEYBOARD_SHORTCUTS = [
  {
    category: 'General',
    shortcuts: [
      { keys: ['Ctrl', 'N'], description: 'Create new task' },
      { keys: ['Ctrl', 'Shift', 'F'], description: 'Focus search' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close modal / cancel' },
    ],
  },
  {
    category: 'Navigation',
    shortcuts: [
      { keys: ['\u2191', 'k'], description: 'Move up' },
      { keys: ['\u2193', 'j'], description: 'Move down' },
      { keys: ['Enter'], description: 'Open selected task' },
      { keys: ['Space'], description: 'Select / toggle' },
    ],
  },
  {
    category: 'Actions',
    shortcuts: [
      { keys: ['Ctrl', 'C'], description: 'Copy XML context' },
    ],
  },
];
