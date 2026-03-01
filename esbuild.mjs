import esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const extensionConfig = {
  entryPoints: ['src/extension.ts'],
  outfile: 'dist/extension.js',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  external: ['vscode'],
  sourcemap: true,
  logLevel: 'info'
};

const webviewConfig = {
  entryPoints: {
    webview: 'src/webview/ui/index.tsx',
    board: 'src/webview/ui/board.tsx',
    taskeditor: 'src/webview/ui/taskeditor.tsx'
  },
  outdir: 'dist',
  bundle: true,
  platform: 'browser',
  format: 'iife',
  target: 'es2020',
  sourcemap: true,
  entryNames: '[name]',
  assetNames: 'assets/[name]-[hash]',
  logLevel: 'info'
};

async function runBuild() {
  if (watch) {
    const [extensionCtx, webviewCtx] = await Promise.all([
      esbuild.context(extensionConfig),
      esbuild.context(webviewConfig)
    ]);

    await Promise.all([extensionCtx.watch(), webviewCtx.watch()]);
    console.log('Watching extension and webview bundles...');
    return;
  }

  await Promise.all([esbuild.build(extensionConfig), esbuild.build(webviewConfig)]);
}

runBuild().catch((error) => {
  console.error(error);
  process.exit(1);
});
