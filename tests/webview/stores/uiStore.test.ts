import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore, isStageCollapsed, isWorkspaceReady, isModalOpen, getSelectedTaskId } from '../../../src/webview/stores/uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      selectedTaskId: null,
      selectedStage: null,
      activeModal: null,
      modalData: null,
      viewMode: 'board',
      collapsedStages: new Set(),
      workspaceStatus: 'loading',
      workspaceRoot: null,
      workspaceMessage: 'Loading workspace...',
    });
  });

  describe('task selection', () => {
    it('should select a task', () => {
      const { selectTask } = useUIStore.getState();

      selectTask('task-123');

      expect(useUIStore.getState().selectedTaskId).toBe('task-123');
    });

    it('should deselect a task', () => {
      const { selectTask } = useUIStore.getState();

      selectTask('task-123');
      selectTask(null);

      expect(useUIStore.getState().selectedTaskId).toBeNull();
    });
  });

  describe('stage selection', () => {
    it('should select a stage', () => {
      const { selectStage } = useUIStore.getState();

      selectStage('code');

      expect(useUIStore.getState().selectedStage).toBe('code');
    });

    it('should deselect a stage', () => {
      const { selectStage } = useUIStore.getState();

      selectStage('code');
      selectStage(null);

      expect(useUIStore.getState().selectedStage).toBeNull();
    });
  });

  describe('modals', () => {
    it('should open a modal', () => {
      const { openModal } = useUIStore.getState();

      openModal('create-task');

      expect(useUIStore.getState().activeModal).toBe('create-task');
    });

    it('should open a modal with data', () => {
      const { openModal } = useUIStore.getState();
      const taskData = { id: 'task-123', title: 'Test Task' };

      openModal('task-details', taskData);

      expect(useUIStore.getState().activeModal).toBe('task-details');
      expect(useUIStore.getState().modalData).toEqual(taskData);
    });

    it('should close a modal', () => {
      const { openModal, closeModal } = useUIStore.getState();

      openModal('create-task', { some: 'data' });
      closeModal();

      expect(useUIStore.getState().activeModal).toBeNull();
      expect(useUIStore.getState().modalData).toBeNull();
    });
  });

  describe('view mode', () => {
    it('should set view mode to list', () => {
      const { setViewMode } = useUIStore.getState();

      setViewMode('list');

      expect(useUIStore.getState().viewMode).toBe('list');
    });

    it('should set view mode to board', () => {
      const { setViewMode } = useUIStore.getState();

      setViewMode('list');
      setViewMode('board');

      expect(useUIStore.getState().viewMode).toBe('board');
    });
  });

  describe('stage collapse', () => {
    it('should collapse a stage', () => {
      const { toggleStageCollapse } = useUIStore.getState();

      toggleStageCollapse('inbox');

      expect(useUIStore.getState().collapsedStages.has('inbox')).toBe(true);
    });

    it('should expand a collapsed stage', () => {
      const { toggleStageCollapse } = useUIStore.getState();

      toggleStageCollapse('inbox');
      toggleStageCollapse('inbox');

      expect(useUIStore.getState().collapsedStages.has('inbox')).toBe(false);
    });

    it('should manage multiple collapsed stages', () => {
      const { toggleStageCollapse } = useUIStore.getState();

      toggleStageCollapse('inbox');
      toggleStageCollapse('plan');

      expect(useUIStore.getState().collapsedStages.has('inbox')).toBe(true);
      expect(useUIStore.getState().collapsedStages.has('plan')).toBe(true);
      expect(useUIStore.getState().collapsedStages.has('code')).toBe(false);
    });
  });

  describe('workspace status', () => {
    it('should set workspace status to valid', () => {
      const { setWorkspaceStatus } = useUIStore.getState();

      setWorkspaceStatus('valid', '/path/to/workspace', 'Workspace loaded');

      const state = useUIStore.getState();
      expect(state.workspaceStatus).toBe('valid');
      expect(state.workspaceRoot).toBe('/path/to/workspace');
      expect(state.workspaceMessage).toBe('Workspace loaded');
    });

    it('should set workspace status to missing', () => {
      const { setWorkspaceStatus } = useUIStore.getState();

      setWorkspaceStatus('missing', null, 'No workspace found');

      const state = useUIStore.getState();
      expect(state.workspaceStatus).toBe('missing');
      expect(state.workspaceRoot).toBeNull();
    });
  });

  describe('selectors', () => {
    it('isStageCollapsed should return correct value', () => {
      const { toggleStageCollapse } = useUIStore.getState();

      toggleStageCollapse('inbox');

      const state = useUIStore.getState();
      expect(isStageCollapsed(state, 'inbox')).toBe(true);
      expect(isStageCollapsed(state, 'plan')).toBe(false);
    });

    it('isWorkspaceReady should return true when valid', () => {
      const { setWorkspaceStatus } = useUIStore.getState();

      setWorkspaceStatus('valid', '/path', 'Ready');

      expect(isWorkspaceReady(useUIStore.getState())).toBe(true);
    });

    it('isWorkspaceReady should return false when not valid', () => {
      const { setWorkspaceStatus } = useUIStore.getState();

      setWorkspaceStatus('missing', null, 'Not found');

      expect(isWorkspaceReady(useUIStore.getState())).toBe(false);
    });

    it('isModalOpen should return correct value', () => {
      const { openModal, closeModal } = useUIStore.getState();

      expect(isModalOpen(useUIStore.getState())).toBe(false);

      openModal('create-task');
      expect(isModalOpen(useUIStore.getState())).toBe(true);

      closeModal();
      expect(isModalOpen(useUIStore.getState())).toBe(false);
    });

    it('getSelectedTaskId should return selected task', () => {
      const { selectTask } = useUIStore.getState();

      expect(getSelectedTaskId(useUIStore.getState())).toBeNull();

      selectTask('task-123');
      expect(getSelectedTaskId(useUIStore.getState())).toBe('task-123');
    });
  });
});
