import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, watch as watchDir } from 'fs';

const watch = process.argv.includes('--watch');

// Extension host bundle (Node / CJS — no React)
const extensionCtx = await esbuild.context({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  sourcemap: true,
  minify: false,
});

// Webview bundle (browser / IIFE — React + JSX)
const webviewCtx = await esbuild.context({
  entryPoints: ['src/webviews/home/index.tsx'],
  bundle: true,
  outfile: 'dist/webviews/home.js',
  format: 'iife',
  platform: 'browser',
  jsx: 'automatic',
  sourcemap: true,
  minify: false,
});

function copyStyles() {
  mkdirSync('dist/webviews/styles', { recursive: true });
  copyFileSync('src/styles/tokens.css',       'dist/webviews/styles/tokens.css');
  copyFileSync('src/styles/webview-base.css', 'dist/webviews/styles/webview-base.css');
  copyFileSync('src/styles/components.css',   'dist/webviews/styles/components.css');
}

if (watch) {
  await Promise.all([extensionCtx.watch(), webviewCtx.watch()]);
  copyStyles();
  // Recopy CSS files whenever anything in src/styles/ changes
  watchDir('src/styles', () => {
    copyStyles();
    console.log('[styles] recopied');
  });
  console.log('Watching for changes...');
} else {
  await Promise.all([extensionCtx.rebuild(), webviewCtx.rebuild()]);
  copyStyles();
  await Promise.all([extensionCtx.dispose(), webviewCtx.dispose()]);
}
