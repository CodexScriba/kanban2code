/**
 * Custom Error Types for Kanban2Code
 * Phase 5.2: Error Handling and Logging
 *
 * Typed errors with module context and recovery hints.
 */

import type { Stage } from './task';

/**
 * Base error class for all Kanban2Code errors
 */
export class KanbanError extends Error {
  public readonly module: string;
  public readonly context: Record<string, unknown>;
  public readonly recoverable: boolean;
  public readonly userMessage: string;

  constructor(
    module: string,
    message: string,
    options: {
      context?: Record<string, unknown>;
      recoverable?: boolean;
      userMessage?: string;
      cause?: Error;
    } = {}
  ) {
    super(message, { cause: options.cause });
    this.name = 'KanbanError';
    this.module = module;
    this.context = options.context ?? {};
    this.recoverable = options.recoverable ?? false;
    this.userMessage = options.userMessage ?? message;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      module: this.module,
      message: this.message,
      userMessage: this.userMessage,
      context: this.context,
      recoverable: this.recoverable,
      stack: this.stack,
    };
  }
}

/**
 * File system operation errors (read, write, delete, move)
 */
export class FileSystemError extends KanbanError {
  constructor(
    filePath: string,
    operation: 'read' | 'write' | 'delete' | 'move' | 'create' | 'stat',
    cause?: Error
  ) {
    super('FileSystem', `Failed to ${operation} file: ${filePath}`, {
      context: { filePath, operation, originalError: cause?.message },
      recoverable: operation !== 'delete', // Most FS errors are retryable
      userMessage: `Could not ${operation} the file. Please check file permissions.`,
      cause,
    });
    this.name = 'FileSystemError';
  }
}

/**
 * Invalid stage transition errors
 */
export class StageTransitionError extends KanbanError {
  constructor(taskId: string, fromStage: Stage, toStage: Stage) {
    super('StageManager', `Invalid stage transition: ${fromStage} → ${toStage}`, {
      context: { taskId, fromStage, toStage },
      recoverable: true,
      userMessage: `Cannot move task from "${fromStage}" to "${toStage}". Tasks must progress through stages in order.`,
    });
    this.name = 'StageTransitionError';
  }
}

/**
 * Task validation errors (missing required fields, invalid format)
 */
export class TaskValidationError extends KanbanError {
  constructor(taskId: string, field: string, issue: string) {
    super('TaskValidation', `Task "${taskId}" validation failed: ${field} - ${issue}`, {
      context: { taskId, field, issue },
      recoverable: true,
      userMessage: `Task has invalid ${field}. ${issue}`,
    });
    this.name = 'TaskValidationError';
  }
}

/**
 * Context assembly errors (missing context files, invalid format)
 */
export class ContextError extends KanbanError {
  constructor(layer: string, path: string, issue: string, cause?: Error) {
    super('Context', `Context layer "${layer}" error at "${path}": ${issue}`, {
      context: { layer, path, issue },
      recoverable: true,
      userMessage: `Could not load context from ${path}. The file may be missing or malformed.`,
      cause,
    });
    this.name = 'ContextError';
  }
}

/**
 * Workspace validation errors (missing .kanban2code folder, invalid structure)
 */
export class WorkspaceError extends KanbanError {
  constructor(issue: string, path?: string) {
    super('Workspace', issue, {
      context: { path },
      recoverable: true,
      userMessage: path
        ? `Workspace issue at "${path}": ${issue}`
        : `Workspace issue: ${issue}`,
    });
    this.name = 'WorkspaceError';
  }
}

/**
 * Template errors (missing template, invalid template format)
 */
export class TemplateError extends KanbanError {
  constructor(templateName: string, issue: string, cause?: Error) {
    super('Template', `Template "${templateName}" error: ${issue}`, {
      context: { templateName, issue },
      recoverable: true,
      userMessage: `Template "${templateName}" could not be loaded. ${issue}`,
      cause,
    });
    this.name = 'TemplateError';
  }
}

/**
 * Copy/clipboard errors
 */
export class CopyError extends KanbanError {
  constructor(taskId: string, mode: string, cause?: Error) {
    super('Copy', `Failed to copy task "${taskId}" with mode "${mode}"`, {
      context: { taskId, mode },
      recoverable: true,
      userMessage: 'Could not copy task context to clipboard. Please try again.',
      cause,
    });
    this.name = 'CopyError';
  }
}

/**
 * Archive errors
 */
export class ArchiveError extends KanbanError {
  constructor(taskId: string, operation: 'archive' | 'restore', cause?: Error) {
    super('Archive', `Failed to ${operation} task "${taskId}"`, {
      context: { taskId, operation },
      recoverable: true,
      userMessage: `Could not ${operation} the task. Please ensure the task is in a valid state.`,
      cause,
    });
    this.name = 'ArchiveError';
  }
}

/**
 * Type guard to check if an error is a KanbanError
 */
export function isKanbanError(error: unknown): error is KanbanError {
  return error instanceof KanbanError;
}

/**
 * Extract user-friendly message from any error
 */
export function getUserMessage(error: unknown): string {
  if (isKanbanError(error)) {
    return error.userMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
}

/**
 * Wrap a function with error handling
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  module: string,
  errorMessage: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (isKanbanError(error)) {
        throw error;
      }
      throw new KanbanError(module, errorMessage, {
        cause: error instanceof Error ? error : undefined,
        context: { args: args.map(a => typeof a === 'object' ? '[object]' : String(a)) },
      });
    }
  }) as T;
}
