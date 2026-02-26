import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { KanbanError } from '../src/types/errors';
import {
  createRecoverableOperation,
  handleError,
  isRecoverable,
  reportError,
  tryCatch,
  withRecovery,
} from '../src/services/error-recovery';
import { logger } from '../src/services/logging';

const outputChannel = {
  appendLine: vi.fn(),
  show: vi.fn(),
  clear: vi.fn(),
  dispose: vi.fn(),
};

describe('services/error-recovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logger.initialize(outputChannel as any);
  });

  it('isRecoverable returns recoverable flag for KanbanError', () => {
    expect(isRecoverable(new Error('boom'))).toBe(false);
    expect(isRecoverable(new KanbanError('Test', 'boom', { recoverable: true }))).toBe(true);
  });

  it('handleError can skip user notifications', async () => {
    const showErrorMessage = vi.mocked(vscode.window.showErrorMessage);
    const errorSpy = vi.spyOn(logger, 'error');

    await handleError(new Error('boom'), 'Test', 'Operation', { showNotification: false });

    expect(errorSpy).toHaveBeenCalled();
    expect(showErrorMessage).not.toHaveBeenCalled();
  });

  it('handleError shows details when selected', async () => {
    const showErrorMessage = vi.mocked(vscode.window.showErrorMessage);
    showErrorMessage.mockResolvedValueOnce('Show Details' as any);

    await handleError(new Error('boom'), 'Test', 'Operation', { showDetails: true });

    expect(outputChannel.show).toHaveBeenCalled();
  });

  it('handleError retries recoverable errors', async () => {
    const showErrorMessage = vi.mocked(vscode.window.showErrorMessage);
    const showInformationMessage = vi.mocked(vscode.window.showInformationMessage);
    const retryFn = vi.fn(async () => {});

    showErrorMessage.mockResolvedValueOnce('Retry' as any);

    const error = new KanbanError('Test', 'boom', {
      recoverable: true,
      userMessage: 'User message',
    });

    await handleError(error, 'Test', 'Retryable operation', {
      showDetails: false,
      showRetry: true,
      retryFn,
    });

    expect(retryFn).toHaveBeenCalledTimes(1);
    expect(showInformationMessage).toHaveBeenCalledWith('Retryable operation completed successfully.');
  });

  it('withRecovery returns undefined on failure', async () => {
    const fn = vi.fn(async () => {
      throw new Error('boom');
    });

    const wrapped = withRecovery(fn, 'Test', 'Wrapped operation', { showNotification: false });
    const result = await wrapped();

    expect(result).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('createRecoverableOperation returns value on success', async () => {
    const op = vi.fn(async () => 123);
    const run = createRecoverableOperation(op, 'Test', 'Op', 1);

    await expect(run()).resolves.toBe(123);
  });

  it('createRecoverableOperation reports non-recoverable failures', async () => {
    const showErrorMessage = vi.mocked(vscode.window.showErrorMessage);
    showErrorMessage.mockResolvedValueOnce(undefined as any);

    const op = vi.fn(async () => {
      throw new Error('boom');
    });

    const run = createRecoverableOperation(op, 'Test', 'Op', 1);
    await expect(run()).resolves.toBeUndefined();

    expect(showErrorMessage).toHaveBeenCalled();
  });

  it('tryCatch returns fallback on sync exception', () => {
    const result = tryCatch(
      () => {
        throw new Error('boom');
      },
      'Test',
      'Sync op',
      42,
    );
    expect(result).toBe(42);
  });

  it('reportError includes KanbanError context', () => {
    const errorSpy = vi.spyOn(logger, 'error');
    const error = new KanbanError('Test', 'boom', { recoverable: true, context: { taskId: 't1' } });

    reportError(error, 'Test', { extra: true });

    expect(errorSpy).toHaveBeenCalled();
    const [, , , context] = errorSpy.mock.calls[0];
    expect(context).toMatchObject({
      extra: true,
      errorType: 'KanbanError',
      errorContext: { taskId: 't1' },
      recoverable: true,
    });
  });
});

