/**
 * Vitest E2E Test Configuration
 * Phase 5.6: E2E Tests for Core Workflows
 *
 * Separate config for E2E tests that require VS Code test electron.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/e2e/**/*.test.ts'],
    testTimeout: 60000, // E2E tests need longer timeout
    hookTimeout: 30000,
    globals: true,
    setupFiles: ['./tests/e2e/setup.ts'],
    // E2E tests run sequentially to avoid conflicts
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
