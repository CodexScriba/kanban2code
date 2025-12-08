import { context, build } from 'esbuild';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const watch = process.argv.includes('--watch');
const distDir = path.resolve(__dirname, '../dist');

async function ensureDist() {
  await mkdir(distDir, { recursive: true });
}

async function runBuild() {
  await ensureDist();

  const extensionConfig = {
    bundle: true,
    entryPoints: ['src/extension.ts'],
    outfile: 'dist/extension.js',
    platform: 'node',
    format: 'cjs' as const,
    target: 'node18',
    external: ['vscode'],
    sourcemap: true,
    logLevel: 'info' as const,
  };

  const webviewBaseConfig = {
    bundle: true,
    platform: 'browser',
    format: 'iife' as const,
    target: 'es2020',
    sourcemap: true,
    logLevel: 'info' as const,
    loader: {
      '.ts': 'ts',
      '.tsx': 'tsx',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
    },
  };

  const webviewConfig = {
    ...webviewBaseConfig,
    entryPoints: ['src/webview/main.tsx'],
    outfile: 'dist/webview.js',
  };

  const sidebarConfig = {
    ...webviewBaseConfig,
    entryPoints: ['src/webview/sidebarMain.tsx'],
    outfile: 'dist/sidebar.js',
  };

  if (watch) {
    const extensionCtx = await context(extensionConfig);
    const webviewCtx = await context(webviewConfig);
    const sidebarCtx = await context(sidebarConfig);
    await Promise.all([extensionCtx.watch(), webviewCtx.watch(), sidebarCtx.watch()]);
    // Keep process alive
    // eslint-disable-next-line no-console
    console.log('Watching for changes...');
  } else {
    await Promise.all([
      build(extensionConfig),
      build(webviewConfig),
      build(sidebarConfig),
    ]);
    // eslint-disable-next-line no-console
    console.log('Build complete');
  }
}

runBuild().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
