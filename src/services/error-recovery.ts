/**
 * Error Recovery Service for Kanban2Code
 * Phase 5.2: Error Handling and Logging
 *
 * Provides error handling, user notifications, and recovery options.
 */

import * as vscode from 'vscode';
import { logger, createModuleLogger } from './logging';
import { isKanbanError, getUserMessage, type KanbanError } from '../types/errors';

const log = createModuleLogger('ErrorRecovery');

export interface ErrorRecoveryOptions {
  /** Show error to user via VS Code notification */
  showNotification?: boolean;
  /** Include "Show Details" button to open output channel */
  showDetails?: boolean;
  /** Include "Retry" button for recoverable errors */
  showRetry?: boolean;
  /** Custom retry function */
  retryFn?: () => Promise<void>;
  /** Custom action buttons */
  actions?: Array<{
    label: string;
    action: () => void | Promise<void>;
  }>;
}

/**
 * Handle an error with logging, notification, and optional recovery
 */
export async function handleError(
  error: unknown,
  module: string,
  operation: string,
  options: ErrorRecoveryOptions = {}
): Promise<void> {
  const {
    showNotification = true,
    showDetails = true,
    showRetry = false,
    retryFn,
    actions = [],
  } = options;

  // Log the error
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const context = isKanbanError(error)
    ? (error as KanbanError).context
    : { operation };

  logger.error(module, `${operation} failed: ${errorObj.message}`, errorObj, context);

  if (!showNotification) {
    return;
  }

  // Build notification message
  const userMessage = getUserMessage(error);

  // Build action buttons
  const buttons: string[] = [];

  if (showDetails) {
    buttons.push('Show Details');
  }

  if (showRetry && retryFn && isRecoverable(error)) {
    buttons.push('Retry');
  }

  for (const action of actions) {
    buttons.push(action.label);
  }

  // Show notification
  const selection = await vscode.window.showErrorMessage(userMessage, ...buttons);

  // Handle button clicks
  if (selection === 'Show Details') {
    logger.show();
  } else if (selection === 'Retry' && retryFn) {
    try {
      await retryFn();
      vscode.window.showInformationMessage(`${operation} completed successfully.`);
    } catch (retryError) {
      // Recursive handling without retry option to prevent infinite loops
      await handleError(retryError, module, operation, {
        ...options,
        showRetry: false,
        retryFn: undefined,
      });
    }
  } else {
    const customAction = actions.find(a => a.label === selection);
    if (customAction) {
      try {
        await customAction.action();
      } catch (actionError) {
        log.error('Custom action failed', actionError instanceof Error ? actionError : undefined, {
          action: selection,
        });
      }
    }
  }
}

/**
 * Check if an error is recoverable
 */
export function isRecoverable(error: unknown): boolean {
  if (isKanbanError(error)) {
    return (error as KanbanError).recoverable;
  }
  // Default: most errors are considered non-recoverable
  return false;
}

/**
 * Wrap an async function with automatic error handling
 */
export function withRecovery<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  module: string,
  operation: string,
  options: ErrorRecoveryOptions = {}
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      await handleError(error, module, operation, {
        ...options,
        retryFn: options.showRetry ? () => fn(...args) as Promise<void> : undefined,
      });
      return undefined;
    }
  }) as T;
}

/**
 * Create a recoverable operation with retry support
 */
export function createRecoverableOperation<T>(
  operation: () => Promise<T>,
  module: string,
  operationName: string,
  maxRetries: number = 3
): () => Promise<T | undefined> {
  let attempts = 0;

  const execute = async (): Promise<T | undefined> => {
    attempts++;
    try {
      const result = await operation();
      log.info(`${operationName} succeeded`, { attempts });
      return result;
    } catch (error) {
      log.warn(`${operationName} attempt ${attempts} failed`, {
        error: error instanceof Error ? error.message : String(error),
        maxRetries,
      });

      if (attempts < maxRetries && isRecoverable(error)) {
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempts - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return execute();
      }

      await handleError(error, module, operationName, {
        showNotification: true,
        showDetails: true,
        showRetry: attempts >= maxRetries,
        retryFn: () => {
          attempts = 0;
          return execute() as Promise<void>;
        },
      });

      return undefined;
    }
  };

  return execute;
}

/**
 * Error boundary for synchronous operations
 */
export function tryCatch<T>(
  fn: () => T,
  module: string,
  operation: string,
  fallback: T
): T {
  try {
    return fn();
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error(module, `${operation} failed: ${errorObj.message}`, errorObj);
    return fallback;
  }
}

/**
 * Report error to output channel with full context
 */
export function reportError(error: unknown, module: string, additionalContext?: Record<string, unknown>): void {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  const context: Record<string, unknown> = {
    ...additionalContext,
  };

  if (isKanbanError(error)) {
    const kanbanError = error as KanbanError;
    context.errorType = kanbanError.name;
    context.errorContext = kanbanError.context;
    context.recoverable = kanbanError.recoverable;
  }

  logger.error(module, errorObj.message, errorObj, context);
}
