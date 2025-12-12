import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    environmentMatchGlobs: [
      ['tests/webview/**', 'jsdom'],
    ],
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/core/**/*.{ts,tsx}',
        'src/services/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
        'src/workspace/**/*.{ts,tsx}',
        'src/types/errors.ts',
        'src/types/filters.ts',
        'src/webview/messaging.ts',
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/webview/ui/main.tsx',
        'src/assets/**',
      ],
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70,
      },
    },
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
});
