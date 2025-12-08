import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore, selectFilteredTasks, selectTasksByStage, selectProjects, selectPhases, selectAllTags, selectTaskById, selectTaskCountByStage } from '../../../src/webview/stores/taskStore';
import type { Task } from '../../../src/types/task';

// Sample tasks for testing
const sampleTasks: Task[] = [
  {
    id: 'task-1',
    filePath: '/workspace/inbox/task-1.md',
    title: 'Task in Inbox',
    stage: 'inbox',
    tags: ['bug', 'mvp'],
    content: 'Content 1',
  },
  {
    id: 'task-2',
    filePath: '/workspace/projects/projectA/task-2.md',
    title: 'Task in Project A',
    stage: 'plan',
    project: 'projectA',
    tags: ['idea'],
    content: 'Content 2',
  },
  {
    id: 'task-3',
    filePath: '/workspace/projects/projectA/phase1/task-3.md',
    title: 'Task in Phase 1',
    stage: 'code',
    project: 'projectA',
    phase: 'phase1',
    tags: ['bug', 'roadmap'],
    content: 'Content 3',
  },
  {
    id: 'task-4',
    filePath: '/workspace/projects/projectB/task-4.md',
    title: 'Task in Project B',
    stage: 'audit',
    project: 'projectB',
    tags: ['mvp'],
    content: 'Content 4',
  },
  {
    id: 'task-5',
    filePath: '/workspace/inbox/task-5.md',
    title: 'Completed task',
    stage: 'completed',
    content: 'Content 5',
  },
];

describe('taskStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTaskStore.setState({
      tasks: [],
      loading: false,
      error: null,
      filters: {
        project: null,
        inboxOnly: false,
        phase: null,
        tags: [],
        search: '',
        stages: ['inbox', 'plan', 'code', 'audit', 'completed'],
      },
    });
  });

  describe('basic actions', () => {
    it('should set tasks', () => {
      const { setTasks } = useTaskStore.getState();
      setTasks(sampleTasks);

      expect(useTaskStore.getState().tasks).toHaveLength(5);
      expect(useTaskStore.getState().loading).toBe(false);
    });

    it('should add a task', () => {
      const { setTasks, addTask } = useTaskStore.getState();
      setTasks(sampleTasks);

      const newTask: Task = {
        id: 'task-6',
        filePath: '/workspace/inbox/task-6.md',
        title: 'New Task',
        stage: 'inbox',
        content: 'New content',
      };

      addTask(newTask);
      expect(useTaskStore.getState().tasks).toHaveLength(6);
    });

    it('should update a task', () => {
      const { setTasks, updateTask } = useTaskStore.getState();
      setTasks(sampleTasks);

      updateTask({ ...sampleTasks[0], title: 'Updated Title' });

      const updated = useTaskStore.getState().tasks.find(t => t.id === 'task-1');
      expect(updated?.title).toBe('Updated Title');
    });

    it('should remove a task', () => {
      const { setTasks, removeTask } = useTaskStore.getState();
      setTasks(sampleTasks);

      removeTask('task-1');

      expect(useTaskStore.getState().tasks).toHaveLength(4);
      expect(useTaskStore.getState().tasks.find(t => t.id === 'task-1')).toBeUndefined();
    });

    it('should set loading state', () => {
      const { setLoading } = useTaskStore.getState();

      setLoading(true);
      expect(useTaskStore.getState().loading).toBe(true);

      setLoading(false);
      expect(useTaskStore.getState().loading).toBe(false);
    });

    it('should set error state', () => {
      const { setError } = useTaskStore.getState();

      setError('Something went wrong');
      expect(useTaskStore.getState().error).toBe('Something went wrong');
      expect(useTaskStore.getState().loading).toBe(false);
    });

    it('should set filters', () => {
      const { setFilters } = useTaskStore.getState();

      setFilters({ project: 'projectA', tags: ['bug'] });

      const { filters } = useTaskStore.getState();
      expect(filters.project).toBe('projectA');
      expect(filters.tags).toEqual(['bug']);
      expect(filters.phase).toBeNull(); // Unchanged
    });

    it('should reset filters', () => {
      const { setFilters, resetFilters } = useTaskStore.getState();

      setFilters({ project: 'projectA', tags: ['bug'], search: 'test' });
      resetFilters();

      const { filters } = useTaskStore.getState();
      expect(filters.project).toBeNull();
      expect(filters.tags).toEqual([]);
      expect(filters.search).toBe('');
    });
  });

  describe('selectors', () => {
    describe('selectFilteredTasks', () => {
      it('should return all tasks when no filters', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const filtered = selectFilteredTasks(state as never);
        expect(filtered).toHaveLength(5);
      });

      it('should filter by project', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: 'projectA', inboxOnly: false, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const filtered = selectFilteredTasks(state as never);
        expect(filtered).toHaveLength(2);
        expect(filtered.every(t => t.project === 'projectA')).toBe(true);
      });

      it('should filter by phase', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: 'phase1', tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const filtered = selectFilteredTasks(state as never);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].phase).toBe('phase1');
      });

      it('should filter by tags (any match)', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: ['bug'], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const filtered = selectFilteredTasks(state as never);
        expect(filtered).toHaveLength(2);
        expect(filtered.every(t => t.tags?.includes('bug'))).toBe(true);
      });

      it('should filter by search term', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: 'Project A', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const filtered = selectFilteredTasks(state as never);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].title).toBe('Task in Project A');
      });

      it('should combine multiple filters', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: 'projectA', inboxOnly: false, phase: null, tags: ['bug'], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const filtered = selectFilteredTasks(state as never);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('task-3');
      });

      it('should filter by stages', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: '', stages: ['plan'] },
          loading: false,
          error: null,
        };

        const filtered = selectFilteredTasks(state as never);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].stage).toBe('plan');
      });

      it('should filter inbox only', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: true, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const filtered = selectFilteredTasks(state as never);
        expect(filtered.every((t) => !t.project)).toBe(true);
      });
    });

    describe('selectTasksByStage', () => {
      it('should group tasks by stage', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const byStage = selectTasksByStage(state as never);

        expect(byStage.inbox).toHaveLength(1);
        expect(byStage.plan).toHaveLength(1);
        expect(byStage.code).toHaveLength(1);
        expect(byStage.audit).toHaveLength(1);
        expect(byStage.completed).toHaveLength(1);
      });
    });

    describe('selectProjects', () => {
      it('should return unique projects sorted', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const projects = selectProjects(state as never);

        expect(projects).toEqual(['projectA', 'projectB']);
      });

      it('should return empty array when no projects', () => {
        const state = {
          tasks: sampleTasks.filter(t => !t.project),
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const projects = selectProjects(state as never);
        expect(projects).toEqual([]);
      });
    });

    describe('selectPhases', () => {
      it('should return phases for a project', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const phases = selectPhases(state as never, 'projectA');
        expect(phases).toEqual(['phase1']);
      });

      it('should return empty array for project without phases', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const phases = selectPhases(state as never, 'projectB');
        expect(phases).toEqual([]);
      });
    });

    describe('selectAllTags', () => {
      it('should return all unique tags sorted', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const tags = selectAllTags(state as never);
        expect(tags).toEqual(['bug', 'idea', 'mvp', 'roadmap']);
      });
    });

    describe('selectTaskById', () => {
      it('should return task by id', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const task = selectTaskById(state as never, 'task-2');
        expect(task?.title).toBe('Task in Project A');
      });

      it('should return undefined for non-existent id', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const task = selectTaskById(state as never, 'non-existent');
        expect(task).toBeUndefined();
      });
    });

    describe('selectTaskCountByStage', () => {
      it('should count tasks per stage', () => {
        const state = {
          tasks: sampleTasks,
          filters: { project: null, inboxOnly: false, phase: null, tags: [], search: '', stages: ['inbox', 'plan', 'code', 'audit', 'completed'] },
          loading: false,
          error: null,
        };

        const counts = selectTaskCountByStage(state as never);

        expect(counts.inbox).toBe(1);
        expect(counts.plan).toBe(1);
        expect(counts.code).toBe(1);
        expect(counts.audit).toBe(1);
        expect(counts.completed).toBe(1);
      });
    });
  });
});
