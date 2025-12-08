import { describe, it, expect } from 'vitest';
import { KEYBOARD_SHORTCUTS } from '../../../src/webview/hooks/useKeyboardNavigation';

describe('useKeyboardNavigation', () => {
  describe('KEYBOARD_SHORTCUTS', () => {
    it('should have General category with shortcuts', () => {
      const general = KEYBOARD_SHORTCUTS.find((c) => c.category === 'General');

      expect(general).toBeDefined();
      expect(general?.shortcuts.length).toBeGreaterThan(0);
    });

    it('should have Navigation category with shortcuts', () => {
      const navigation = KEYBOARD_SHORTCUTS.find((c) => c.category === 'Navigation');

      expect(navigation).toBeDefined();
      expect(navigation?.shortcuts.length).toBeGreaterThan(0);
    });

    it('should have Actions category with shortcuts', () => {
      const actions = KEYBOARD_SHORTCUTS.find((c) => c.category === 'Actions');

      expect(actions).toBeDefined();
      expect(actions?.shortcuts.length).toBeGreaterThan(0);
    });

    it('should have Ctrl+N for new task', () => {
      const general = KEYBOARD_SHORTCUTS.find((c) => c.category === 'General');
      const newTaskShortcut = general?.shortcuts.find((s) =>
        s.keys.includes('Ctrl') && s.keys.includes('N'),
      );

      expect(newTaskShortcut).toBeDefined();
      expect(newTaskShortcut?.description).toContain('task');
    });

    it('should have Escape for close/cancel', () => {
      const general = KEYBOARD_SHORTCUTS.find((c) => c.category === 'General');
      const escShortcut = general?.shortcuts.find((s) => s.keys.includes('Esc'));

      expect(escShortcut).toBeDefined();
    });

    it('should have arrow keys for navigation', () => {
      const navigation = KEYBOARD_SHORTCUTS.find((c) => c.category === 'Navigation');

      // Check for arrow up (or k for vim-style)
      const upShortcut = navigation?.shortcuts.find((s) =>
        s.keys.some((k) => k.includes('\u2191') || k === 'k'),
      );
      expect(upShortcut).toBeDefined();

      // Check for arrow down (or j for vim-style)
      const downShortcut = navigation?.shortcuts.find((s) =>
        s.keys.some((k) => k.includes('\u2193') || k === 'j'),
      );
      expect(downShortcut).toBeDefined();
    });

    it('should have question mark for help', () => {
      const general = KEYBOARD_SHORTCUTS.find((c) => c.category === 'General');
      const helpShortcut = general?.shortcuts.find((s) => s.keys.includes('?'));

      expect(helpShortcut).toBeDefined();
      expect(helpShortcut?.description.toLowerCase()).toContain('shortcut');
    });

    it('all shortcuts should have keys and description', () => {
      for (const category of KEYBOARD_SHORTCUTS) {
        for (const shortcut of category.shortcuts) {
          expect(shortcut.keys).toBeDefined();
          expect(shortcut.keys.length).toBeGreaterThan(0);
          expect(shortcut.description).toBeDefined();
          expect(shortcut.description.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
