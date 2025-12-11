import { useState, useCallback, useMemo } from 'react';
import type { Task, Stage } from '../../../types/task';

export type QuickViewType = 'today' | 'development' | 'bugs' | 'ideas';

export interface FilterState {
  activeStages: Stage[];
  selectedProject: string | null;
  selectedTags: string[];
  quickView: QuickViewType | null;
}

export interface UseFiltersResult {
  // State
  filterState: FilterState;
  
  // Stage actions
  toggleStage: (stage: Stage) => void;
  setActiveStages: (stages: Stage[]) => void;
  
  // Project actions
  setSelectedProject: (project: string | null) => void;
  
  // Tag actions
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  clearTags: () => void;
  
  // Quick view actions
  setQuickView: (view: QuickViewType | null) => void;
  
  // Utility
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  
  // Filter function
  filterTasks: (tasks: Task[]) => Task[];
}

const DEFAULT_STAGES: Stage[] = ['inbox', 'plan', 'code', 'audit'];

const QUICK_VIEW_PRESETS: Record<QuickViewType, Partial<FilterState>> = {
  today: { activeStages: ['inbox', 'plan', 'code', 'audit'] },
  development: { activeStages: ['code'] },
  bugs: { selectedTags: ['bug'] },
  ideas: { selectedTags: ['idea', 'roadmap'] },
};

export function useFilters(): UseFiltersResult {
  const [activeStages, setActiveStagesState] = useState<Stage[]>(DEFAULT_STAGES);
  const [selectedProject, setSelectedProjectState] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [quickView, setQuickViewState] = useState<QuickViewType | null>(null);

  const filterState: FilterState = useMemo(() => ({
    activeStages,
    selectedProject,
    selectedTags,
    quickView,
  }), [activeStages, selectedProject, selectedTags, quickView]);

  const toggleStage = useCallback((stage: Stage) => {
    setActiveStagesState((prev) => {
      if (prev.includes(stage)) {
        if (prev.length === 1) return prev; // Don't remove last stage
        return prev.filter((s) => s !== stage);
      }
      return [...prev, stage];
    });
    setQuickViewState(null); // Clear quick view when manually toggling
  }, []);

  const setActiveStages = useCallback((stages: Stage[]) => {
    if (stages.length > 0) {
      setActiveStagesState(stages);
      setQuickViewState(null);
    }
  }, []);

  const setSelectedProject = useCallback((project: string | null) => {
    setSelectedProjectState(project);
    setQuickViewState(null);
  }, []);

  const addTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev;
      return [...prev, tag];
    });
    setQuickViewState(null);
  }, []);

  const removeTag = useCallback((tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    setQuickViewState(null);
  }, []);

  const clearTags = useCallback(() => {
    setSelectedTags([]);
    setQuickViewState(null);
  }, []);

  const setQuickView = useCallback((view: QuickViewType | null) => {
    setQuickViewState(view);
    if (view) {
      const preset = QUICK_VIEW_PRESETS[view];
      if (preset.activeStages) setActiveStagesState(preset.activeStages);
      if (preset.selectedTags) setSelectedTags(preset.selectedTags);
    }
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveStagesState(DEFAULT_STAGES);
    setSelectedProjectState(null);
    setSelectedTags([]);
    setQuickViewState(null);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      activeStages.length !== DEFAULT_STAGES.length ||
      !DEFAULT_STAGES.every((s) => activeStages.includes(s)) ||
      selectedProject !== null ||
      selectedTags.length > 0 ||
      quickView !== null
    );
  }, [activeStages, selectedProject, selectedTags, quickView]);

  const filterTasks = useCallback((tasks: Task[]): Task[] => {
    return tasks.filter((task) => {
      // Stage filter
      if (!activeStages.includes(task.stage)) return false;
      
      // Project filter
      if (selectedProject !== null) {
        if (selectedProject === '__inbox__') {
          if (task.project) return false;
        } else if (task.project !== selectedProject) {
          return false;
        }
      }
      
      // Tag filter (task must have ALL selected tags)
      if (selectedTags.length > 0) {
        const taskTags = task.tags || [];
        if (!selectedTags.every((tag) => taskTags.includes(tag))) {
          return false;
        }
      }
      
      return true;
    });
  }, [activeStages, selectedProject, selectedTags]);

  return {
    filterState,
    toggleStage,
    setActiveStages,
    setSelectedProject,
    addTag,
    removeTag,
    clearTags,
    setQuickView,
    clearAllFilters,
    hasActiveFilters,
    filterTasks,
  };
}
