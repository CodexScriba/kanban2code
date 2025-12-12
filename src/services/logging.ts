/**
 * Structured Logging Service for Kanban2Code
 * Phase 5.2: Error Handling and Logging
 *
 * Provides centralized logging with levels, modules, and context tracking.
 * Logs to VS Code Output Channel for user visibility.
 */

import * as vscode from 'vscode';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  context?: Record<string, unknown>;
  stack?: string;
}

export interface Logger {
  debug(module: string, message: string, context?: Record<string, unknown>): void;
  info(module: string, message: string, context?: Record<string, unknown>): void;
  warn(module: string, message: string, context?: Record<string, unknown>): void;
  error(module: string, message: string, error?: Error, context?: Record<string, unknown>): void;
  getEntries(): LogEntry[];
  clear(): void;
}

class KanbanLogger implements Logger {
  private output: vscode.OutputChannel | null = null;
  private entries: LogEntry[] = [];
  private maxEntries = 1000;
  private minLevel: LogLevel = 'info';

  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  /**
   * Initialize the logger with a VS Code output channel
   * Must be called during extension activation
   */
  initialize(outputChannel?: vscode.OutputChannel): void {
    this.output = outputChannel ?? vscode.window.createOutputChannel('Kanban2Code');
  }

  /**
   * Set minimum log level (default: 'info')
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.minLevel];
  }

  private formatEntry(entry: LogEntry): string {
    const parts = [
      `[${entry.timestamp}]`,
      `[${entry.level.toUpperCase()}]`,
      `[${entry.module}]`,
      entry.message,
    ];

    if (entry.context && Object.keys(entry.context).length > 0) {
      parts.push(`| ${JSON.stringify(entry.context)}`);
    }

    if (entry.stack) {
      parts.push(`\n  Stack: ${entry.stack}`);
    }

    return parts.join(' ');
  }

  private log(level: LogLevel, module: string, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      context,
      stack: error?.stack,
    };

    // Store entry (circular buffer)
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    // Write to output channel
    const formatted = this.formatEntry(entry);
    this.output?.appendLine(formatted);

    // Also log to console in development, or if the output channel is unavailable
    if (process.env.NODE_ENV === 'development' || !this.output) {
      const consoleFn = level === 'error' ? console.error :
                        level === 'warn' ? console.warn :
                        level === 'debug' ? console.debug : console.log;
      consoleFn(formatted);
    }
  }

  debug(module: string, message: string, context?: Record<string, unknown>): void {
    this.log('debug', module, message, context);
  }

  info(module: string, message: string, context?: Record<string, unknown>): void {
    this.log('info', module, message, context);
  }

  warn(module: string, message: string, context?: Record<string, unknown>): void {
    this.log('warn', module, message, context);
  }

  error(module: string, message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log('error', module, message, context, error);
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  getEntriesByLevel(level: LogLevel): LogEntry[] {
    return this.entries.filter(e => e.level === level);
  }

  getEntriesByModule(module: string): LogEntry[] {
    return this.entries.filter(e => e.module === module);
  }

  clear(): void {
    this.entries = [];
    this.output?.clear();
  }

  /**
   * Show the output channel to the user
   */
  show(): void {
    this.output?.show();
  }

  /**
   * Dispose of the logger resources
   */
  dispose(): void {
    this.output?.dispose();
    this.entries = [];
  }
}

// Singleton instance
export const logger = new KanbanLogger();

// Module-specific logger factory
export function createModuleLogger(module: string) {
  return {
    debug: (message: string, context?: Record<string, unknown>) =>
      logger.debug(module, message, context),
    info: (message: string, context?: Record<string, unknown>) =>
      logger.info(module, message, context),
    warn: (message: string, context?: Record<string, unknown>) =>
      logger.warn(module, message, context),
    error: (message: string, error?: Error, context?: Record<string, unknown>) =>
      logger.error(module, message, error, context),
  };
}
