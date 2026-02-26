import { describe, expect, test } from 'vitest';
import { getAdapterForCli } from '../src/runner/adapter-factory';
import { MiniMaxAdapter } from '../src/runner/adapters/minimax-adapter';
import type { ProviderConfig } from '../src/types/provider';

const baseConfig: ProviderConfig = {
  cli: 'minimax',
  model: 'kimi-k2-5',
  unattended_flags: ['--print'],
  output_flags: ['--quiet'],
  prompt_style: 'flag',
};

describe('MiniMaxAdapter', () => {
  test('adapter-factory resolves minimax cli adapter', () => {
    expect(getAdapterForCli('minimax')).toBeInstanceOf(MiniMaxAdapter);
  });

  test('buildCommand assembles minimax flag-based command', () => {
    const adapter = new MiniMaxAdapter();

    const command = adapter.buildCommand(baseConfig, 'Solve task');

    expect(command).toEqual({
      command: 'minimax',
      args: ['--print', '--model', 'kimi-k2-5', '-p', 'Solve task', '--quiet'],
    });
  });

  test('parseResponse returns failure on empty output', () => {
    const adapter = new MiniMaxAdapter();

    const parsed = adapter.parseResponse('   ', 1);

    expect(parsed.success).toBe(false);
    expect(parsed.result).toBe('');
    expect(parsed.error).toContain('no output');
  });

  test('parseResponse returns stdout as result for successful run', () => {
    const adapter = new MiniMaxAdapter();

    const parsed = adapter.parseResponse('\n  completed response  \n', 0);

    expect(parsed).toEqual({
      success: true,
      result: 'completed response',
      error: undefined,
    });
  });
});
