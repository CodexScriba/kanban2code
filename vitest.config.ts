import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      vscode: path.resolve(__dirname, 'tests/mocks/vscode.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['vscode'],
    },
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/webview/**/*.tsx'],
      exclude: ['src/**/*.d.ts'],
    },
  },
});
