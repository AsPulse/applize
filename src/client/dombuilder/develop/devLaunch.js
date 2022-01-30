const { build } = require('estrella');
const { resolve } = require('path');
const { dtsPlugin } = require('esbuild-plugin-d.ts');

build({
  define: { 'process.env.NODE_ENV': process.env.NODE_ENV },
  entryPoints: [resolve(__dirname, 'page.ts')],
  target: 'esnext',
  outdir: resolve(__dirname),
  bundle: true,
  minify: true,
  format: 'esm',
  sourcemap: true,
  tslint: true,
}).catch(() => {});
