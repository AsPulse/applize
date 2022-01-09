const { build } = require('estrella');
const { resolve } = require('path');
const { dtsPlugin } = require('esbuild-plugin-d.ts');

build({
  define: { 'process.env.NODE_ENV': process.env.NODE_ENV },
  entryPoints: [resolve(__dirname, 'src/index.ts')],
  target: 'esnext',
  outdir: resolve(__dirname, 'lib'),
  bundle: true,
  minify: true,
  sourcemap: true,
  splitting: true,
  format: 'esm',
  tslint: true,
  plugins: [dtsPlugin()],
}).catch(() => {});
