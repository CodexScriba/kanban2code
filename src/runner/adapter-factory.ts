import type { CliAdapter } from './cli-adapter';
import { ClaudeAdapter } from './adapters/claude-adapter';
import { CodexAdapter } from './adapters/codex-adapter';
import { KimiAdapter } from './adapters/kimi-adapter';
import { KiloAdapter } from './adapters/kilo-adapter';
import { MiniMaxAdapter } from './adapters/minimax-adapter';

/**
 * Resolve the concrete adapter for a configured CLI executable name.
 */
export function getAdapterForCli(cli: string): CliAdapter {
  switch (cli.toLowerCase()) {
    case 'claude':
      return new ClaudeAdapter();
    case 'codex':
      return new CodexAdapter();
    case 'kimi':
      return new KimiAdapter();
    case 'kilo':
      return new KiloAdapter();
    case 'minimax':
      return new MiniMaxAdapter();
    default:
      throw new Error(`Unsupported CLI adapter: ${cli}`);
  }
}
