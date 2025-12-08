import { describe, it, expect, beforeEach } from 'vitest';
import { logInfo, logError, notifyError } from '../../src/utils/logger';
import { __outputChannels } from 'vscode';

describe('logger', () => {
  beforeEach(() => {
    if (__outputChannels[0]) {
      __outputChannels[0].lines.splice(0, __outputChannels[0].lines.length);
    } else {
      logInfo('init');
      __outputChannels[0].lines.splice(0, __outputChannels[0].lines.length);
    }
  });

  it('writes info messages to the output channel', () => {
    logInfo('hello world');
    expect(__outputChannels[0]).toBeDefined();
    expect(__outputChannels[0].lines.some((line) => line.includes('hello world'))).toBe(true);
  });

  it('writes error details', () => {
    logError('failed thing', new Error('boom'));
    const lines = __outputChannels[0].lines.join('\n');
    expect(lines).toContain('failed thing');
    expect(lines).toContain('boom');
  });

  it('notifyError logs and surfaces message', () => {
    notifyError('visible problem', new Error('trace'));
    const lines = __outputChannels[0].lines.join('\n');
    expect(lines).toContain('visible problem');
    expect(lines).toContain('trace');
  });
});
