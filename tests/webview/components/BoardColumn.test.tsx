import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BoardColumn, type BoardColumnProps } from '../../../src/webview/components/BoardColumn';
import type { Task } from '../../../src/types/task';

const mockTasks: Task[] = [
  {
    id: 'task-1',
    filePath: '/path/to/task1.md',
    title: 'Task 1',
    stage: 'code',
    content: 'Content 1',
  },
  {
    id: 'task-2',
    filePath: '/path/to/task2.md',
    title: 'Task 2',
    stage: 'code',
    content: 'Content 2',
  },
];

const defaultProps: BoardColumnProps = {
  stage: 'code',
  title: 'Code',
  color: '#fbbf24',
  tasks: mockTasks,
  isCollapsed: false,
  onToggleCollapse: vi.fn(),
  renderTask: (task: Task) => <div key={task.id} data-testid={`task-${task.id}`}>{task.title}</div>,
  onDragOver: vi.fn(),
  onDrop: vi.fn(),
};

describe('BoardColumn', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render column title', () => {
      const { getByText } = render(<BoardColumn {...defaultProps} />);
      expect(getByText('Code')).toBeInTheDocument();
    });

    it('should render stage description', () => {
      const { getByText } = render(<BoardColumn {...defaultProps} />);
      expect(getByText('Ship changes with focus')).toBeInTheDocument();
    });

    it('should render task count badge', () => {
      const { getByText } = render(<BoardColumn {...defaultProps} />);
      expect(getByText('2')).toBeInTheDocument();
    });

    it('should render all tasks', () => {
      const { getByTestId } = render(<BoardColumn {...defaultProps} />);
      expect(getByTestId('task-task-1')).toBeInTheDocument();
      expect(getByTestId('task-task-2')).toBeInTheDocument();
    });

    it('should show empty state when no tasks', () => {
      const { getByText } = render(<BoardColumn {...defaultProps} tasks={[]} />);
      expect(getByText('No tasks')).toBeInTheDocument();
    });

    it('should set data-stage attribute', () => {
      const { container } = render(<BoardColumn {...defaultProps} />);
      expect(container.querySelector('[data-stage="code"]')).toBeInTheDocument();
    });

    it('should apply color to dot and count badge', () => {
      const { container } = render(<BoardColumn {...defaultProps} />);
      const dot = container.querySelector('.board-column__dot');
      const count = container.querySelector('.board-column__count');
      expect(dot).toHaveStyle({ background: '#fbbf24' });
      expect(count).toHaveStyle({ background: '#fbbf24' });
    });
  });

  describe('collapsed state', () => {
    it('should apply collapsed class when collapsed', () => {
      const { container } = render(<BoardColumn {...defaultProps} isCollapsed={true} />);
      expect(container.querySelector('.board-column--collapsed')).toBeInTheDocument();
    });

    it('should hide tasks when collapsed', () => {
      const { queryByTestId } = render(<BoardColumn {...defaultProps} isCollapsed={true} />);
      expect(queryByTestId('task-task-1')).not.toBeInTheDocument();
      expect(queryByTestId('task-task-2')).not.toBeInTheDocument();
    });

    it('should hide description when collapsed', () => {
      const { queryByText } = render(<BoardColumn {...defaultProps} isCollapsed={true} />);
      expect(queryByText('Ship changes with focus')).not.toBeInTheDocument();
    });

    it('should still show task count when collapsed', () => {
      const { getByText } = render(<BoardColumn {...defaultProps} isCollapsed={true} />);
      expect(getByText('2')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onToggleCollapse when toggle button is clicked', () => {
      const onToggleCollapse = vi.fn();
      const { container } = render(<BoardColumn {...defaultProps} onToggleCollapse={onToggleCollapse} />);
      const toggleButton = container.querySelector('.board-column__toggle');
      fireEvent.click(toggleButton!);
      expect(onToggleCollapse).toHaveBeenCalledTimes(1);
    });

    it('should set correct aria-expanded on toggle button', () => {
      const { container, rerender } = render(<BoardColumn {...defaultProps} isCollapsed={false} />);
      const toggleButton = container.querySelector('.board-column__toggle');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

      rerender(<BoardColumn {...defaultProps} isCollapsed={true} />);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should call onDragOver on drag over', () => {
      const onDragOver = vi.fn();
      const { container } = render(<BoardColumn {...defaultProps} onDragOver={onDragOver} />);
      fireEvent.dragOver(container.querySelector('.board-column')!);
      expect(onDragOver).toHaveBeenCalled();
    });

    it('should call onDrop on drop', () => {
      const onDrop = vi.fn();
      const { container } = render(<BoardColumn {...defaultProps} onDrop={onDrop} />);
      fireEvent.drop(container.querySelector('.board-column')!);
      expect(onDrop).toHaveBeenCalled();
    });
  });

  describe('different stages', () => {
    it('should render inbox column correctly', () => {
      const { getByText } = render(
        <BoardColumn
          {...defaultProps}
          stage="inbox"
          title="Inbox"
          color="#38bdf8"
        />
      );
      expect(getByText('Inbox')).toBeInTheDocument();
      expect(getByText('Capture everything fast')).toBeInTheDocument();
    });

    it('should render plan column correctly', () => {
      const { getByText } = render(
        <BoardColumn
          {...defaultProps}
          stage="plan"
          title="Plan"
          color="#a78bfa"
        />
      );
      expect(getByText('Plan')).toBeInTheDocument();
      expect(getByText('Shape the work and scope')).toBeInTheDocument();
    });

    it('should render audit column correctly', () => {
      const { getByText } = render(
        <BoardColumn
          {...defaultProps}
          stage="audit"
          title="Audit"
          color="#34d399"
        />
      );
      expect(getByText('Audit')).toBeInTheDocument();
      expect(getByText('Verify, test, review')).toBeInTheDocument();
    });

    it('should render completed column correctly', () => {
      const { getByText } = render(
        <BoardColumn
          {...defaultProps}
          stage="completed"
          title="Done"
          color="#60a5fa"
        />
      );
      expect(getByText('Done')).toBeInTheDocument();
      expect(getByText('Archive once shipped')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have correct aria-label on collapse button', () => {
      const { container } = render(<BoardColumn {...defaultProps} />);
      const toggleButton = container.querySelector('.board-column__toggle');
      expect(toggleButton).toHaveAttribute('aria-label', 'Collapse Code');
    });

    it('should update aria-label when collapsed', () => {
      const { container } = render(<BoardColumn {...defaultProps} isCollapsed={true} />);
      const toggleButton = container.querySelector('.board-column__toggle');
      expect(toggleButton).toHaveAttribute('aria-label', 'Expand Code');
    });
  });
});
