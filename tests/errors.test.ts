/**
 * Unit Tests for Error Types
 * Phase 5.2: Error Handling and Logging
 */

import { describe, it, expect } from 'vitest';
import {
  KanbanError,
  FileSystemError,
  StageTransitionError,
  TaskValidationError,
  ContextError,
  WorkspaceError,
  TemplateError,
  CopyError,
  ArchiveError,
  isKanbanError,
  getUserMessage,
} from '../src/types/errors';

describe('Error Types', () => {
  describe('KanbanError', () => {
    it('should create with required fields', () => {
      const error = new KanbanError('TestModule', 'Test message');

      expect(error.name).toBe('KanbanError');
      expect(error.module).toBe('TestModule');
      expect(error.message).toBe('Test message');
      expect(error.recoverable).toBe(false);
      expect(error.context).toEqual({});
    });

    it('should accept optional fields', () => {
      const cause = new Error('Original error');
      const error = new KanbanError('TestModule', 'Test message', {
        context: { taskId: '123' },
        recoverable: true,
        userMessage: 'User-friendly message',
        cause,
      });

      expect(error.recoverable).toBe(true);
      expect(error.userMessage).toBe('User-friendly message');
      expect(error.context).toEqual({ taskId: '123' });
      expect(error.cause).toBe(cause);
    });

    it('should serialize to JSON', () => {
      const error = new KanbanError('TestModule', 'Test message', {
        context: { key: 'value' },
        recoverable: true,
      });

      const json = error.toJSON();
      expect(json.name).toBe('KanbanError');
      expect(json.module).toBe('TestModule');
      expect(json.context).toEqual({ key: 'value' });
      expect(json.recoverable).toBe(true);
    });
  });

  describe('FileSystemError', () => {
    it('should create for read operation', () => {
      const error = new FileSystemError('/path/to/file.md', 'read');

      expect(error.name).toBe('FileSystemError');
      expect(error.module).toBe('FileSystem');
      expect(error.message).toContain('read');
      expect(error.message).toContain('/path/to/file.md');
      expect(error.recoverable).toBe(true);
    });

    it('should include original error in context', () => {
      const cause = new Error('ENOENT: file not found');
      const error = new FileSystemError('/path/to/file.md', 'read', cause);

      expect(error.context.originalError).toBe('ENOENT: file not found');
    });
  });

  describe('StageTransitionError', () => {
    it('should create with stage information', () => {
      const error = new StageTransitionError('task-123', 'inbox', 'completed');

      expect(error.name).toBe('StageTransitionError');
      expect(error.module).toBe('StageManager');
      expect(error.context.taskId).toBe('task-123');
      expect(error.context.fromStage).toBe('inbox');
      expect(error.context.toStage).toBe('completed');
      expect(error.recoverable).toBe(true);
    });

    it('should have user-friendly message', () => {
      const error = new StageTransitionError('task-123', 'inbox', 'completed');

      expect(error.userMessage).toContain('inbox');
      expect(error.userMessage).toContain('completed');
    });
  });

  describe('TaskValidationError', () => {
    it('should create with validation details', () => {
      const error = new TaskValidationError('task-123', 'title', 'Title is required');

      expect(error.name).toBe('TaskValidationError');
      expect(error.context.field).toBe('title');
      expect(error.context.issue).toBe('Title is required');
    });
  });

  describe('ContextError', () => {
    it('should create with layer information', () => {
      const error = new ContextError('agent', '/path/to/agent.md', 'File not found');

      expect(error.name).toBe('ContextError');
      expect(error.context.layer).toBe('agent');
      expect(error.context.path).toBe('/path/to/agent.md');
    });
  });

  describe('WorkspaceError', () => {
    it('should create without path', () => {
      const error = new WorkspaceError('No .kanban2code folder found');

      expect(error.name).toBe('WorkspaceError');
      expect(error.message).toContain('No .kanban2code');
    });

    it('should create with path', () => {
      const error = new WorkspaceError('Invalid structure', '/workspace/path');

      expect(error.context.path).toBe('/workspace/path');
    });
  });

  describe('TemplateError', () => {
    it('should create with template name', () => {
      const error = new TemplateError('inbox', 'Template not found');

      expect(error.name).toBe('TemplateError');
      expect(error.context.templateName).toBe('inbox');
    });
  });

  describe('CopyError', () => {
    it('should create with copy mode', () => {
      const error = new CopyError('task-123', 'full_xml');

      expect(error.name).toBe('CopyError');
      expect(error.context.mode).toBe('full_xml');
    });
  });

  describe('ArchiveError', () => {
    it('should create for archive operation', () => {
      const error = new ArchiveError('task-123', 'archive');

      expect(error.name).toBe('ArchiveError');
      expect(error.context.operation).toBe('archive');
    });

    it('should create for restore operation', () => {
      const error = new ArchiveError('task-123', 'restore');

      expect(error.context.operation).toBe('restore');
    });
  });

  describe('isKanbanError', () => {
    it('should return true for KanbanError instances', () => {
      expect(isKanbanError(new KanbanError('Test', 'message'))).toBe(true);
      expect(isKanbanError(new FileSystemError('/path', 'read'))).toBe(true);
      expect(isKanbanError(new StageTransitionError('id', 'inbox', 'plan'))).toBe(true);
    });

    it('should return false for regular errors', () => {
      expect(isKanbanError(new Error('Regular error'))).toBe(false);
      expect(isKanbanError('string error')).toBe(false);
      expect(isKanbanError(null)).toBe(false);
      expect(isKanbanError(undefined)).toBe(false);
    });
  });

  describe('getUserMessage', () => {
    it('should return userMessage for KanbanError', () => {
      const error = new KanbanError('Test', 'Technical message', {
        userMessage: 'User-friendly message',
      });

      expect(getUserMessage(error)).toBe('User-friendly message');
    });

    it('should return message for regular Error', () => {
      const error = new Error('Regular error message');

      expect(getUserMessage(error)).toBe('Regular error message');
    });

    it('should return fallback for unknown types', () => {
      expect(getUserMessage('string error')).toBe('An unexpected error occurred.');
      expect(getUserMessage(null)).toBe('An unexpected error occurred.');
    });
  });
});
