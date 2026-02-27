import { describe, expect, test, vi } from 'vitest';
import { createEnvelope } from '../../src/webview/messaging';
import { parseIncomingEnvelope } from '../../src/webview/ui/App';

describe('parseIncomingEnvelope', () => {
  test('returns parsed envelope for valid payloads', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const envelope = parseIncomingEnvelope(createEnvelope('RequestState', {}));
    expect(envelope?.type).toBe('RequestState');
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  test('logs and returns null for invalid envelopes', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const envelope = parseIncomingEnvelope({ version: 2, type: 'Unknown', payload: {} });
    expect(envelope).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});
