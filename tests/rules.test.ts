import { describe, expect, it } from 'vitest';
import { isTransitionAllowed } from '../src/core/rules';

describe('core/rules', () => {
  it('allows staying in the same stage', () => {
    expect(isTransitionAllowed('inbox', 'inbox')).toBe(true);
    expect(isTransitionAllowed('completed', 'completed')).toBe(true);
  });

  it('allows only forward transitions', () => {
    expect(isTransitionAllowed('inbox', 'plan')).toBe(true);
    expect(isTransitionAllowed('plan', 'code')).toBe(true);
    expect(isTransitionAllowed('code', 'audit')).toBe(true);
    expect(isTransitionAllowed('audit', 'completed')).toBe(true);
  });

  it('rejects invalid transitions', () => {
    expect(isTransitionAllowed('inbox', 'code')).toBe(false);
    expect(isTransitionAllowed('plan', 'audit')).toBe(false);
    expect(isTransitionAllowed('completed', 'inbox')).toBe(false);
  });
});

