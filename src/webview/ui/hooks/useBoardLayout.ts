import { useCallback, useEffect, useState } from 'react';

export type BoardLayout = 'columns' | 'swimlanes';

const STORAGE_KEY = 'kanban2code.boardLayout';

export function useBoardLayout(defaultLayout: BoardLayout = 'columns') {
  const [layout, setLayout] = useState<BoardLayout>(defaultLayout);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as BoardLayout | null;
      if (stored === 'columns' || stored === 'swimlanes') {
        setLayout(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const updateLayout = useCallback((next: BoardLayout) => {
    setLayout(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  return { layout, setLayout: updateLayout };
}

