/**
 * Unit Tests for Logging Service
 * Phase 5.2: Error Handling and Logging
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger, createModuleLogger } from '../src/services/logging';

// Mock VS Code output channel
const mockOutputChannel = {
  appendLine: vi.fn(),
  show: vi.fn(),
  clear: vi.fn(),
  dispose: vi.fn(),
};

vi.mock('vscode', () => ({
  window: {
    createOutputChannel: vi.fn(() => mockOutputChannel),
  },
}));

describe('Logging Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logger.clear();
  });

  describe('logger', () => {
    it('should initialize without error', () => {
      expect(() => logger.initialize()).not.toThrow();
    });

    it('should log info messages', () => {
      logger.initialize();
      logger.info('TestModule', 'Test message');

      const entries = logger.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].level).toBe('info');
      expect(entries[0].module).toBe('TestModule');
      expect(entries[0].message).toBe('Test message');
    });

    it('should log warn messages', () => {
      logger.initialize();
      logger.warn('TestModule', 'Warning message');

      const entries = logger.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].level).toBe('warn');
    });

    it('should log error messages with stack trace', () => {
      logger.initialize();
      const error = new Error('Test error');
      logger.error('TestModule', 'Error occurred', error);

      const entries = logger.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].level).toBe('error');
      expect(entries[0].stack).toBeDefined();
    });

    it('should include context in log entries', () => {
      logger.initialize();
      logger.info('TestModule', 'Message with context', { taskId: '123', stage: 'inbox' });

      const entries = logger.getEntries();
      expect(entries[0].context).toEqual({ taskId: '123', stage: 'inbox' });
    });

    it('should respect minimum log level', () => {
      logger.initialize();
      logger.setMinLevel('warn');

      logger.debug('TestModule', 'Debug message');
      logger.info('TestModule', 'Info message');
      logger.warn('TestModule', 'Warn message');

      const entries = logger.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].level).toBe('warn');
    });

    it('should filter entries by level', () => {
      logger.initialize();
      logger.setMinLevel('debug');

      logger.debug('TestModule', 'Debug');
      logger.info('TestModule', 'Info');
      logger.warn('TestModule', 'Warn');
      logger.error('TestModule', 'Error');

      const errorEntries = logger.getEntriesByLevel('error');
      expect(errorEntries).toHaveLength(1);
      expect(errorEntries[0].message).toBe('Error');
    });

    it('should filter entries by module', () => {
      logger.initialize();

      logger.info('ModuleA', 'Message A');
      logger.info('ModuleB', 'Message B');
      logger.info('ModuleA', 'Another A');

      const moduleAEntries = logger.getEntriesByModule('ModuleA');
      expect(moduleAEntries).toHaveLength(2);
    });

    it('should clear entries', () => {
      logger.initialize();

      logger.info('TestModule', 'Message 1');
      logger.info('TestModule', 'Message 2');
      expect(logger.getEntries()).toHaveLength(2);

      logger.clear();
      expect(logger.getEntries()).toHaveLength(0);
    });
  });

  describe('createModuleLogger', () => {
    it('should create a logger with fixed module name', () => {
      logger.initialize();
      const moduleLog = createModuleLogger('MyModule');

      moduleLog.info('Test message');

      const entries = logger.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].module).toBe('MyModule');
    });

    it('should provide all log level methods', () => {
      logger.initialize();
      logger.setMinLevel('debug');
      const moduleLog = createModuleLogger('MyModule');

      moduleLog.debug('Debug');
      moduleLog.info('Info');
      moduleLog.warn('Warn');
      moduleLog.error('Error');

      const entries = logger.getEntries();
      expect(entries).toHaveLength(4);
    });
  });
});
