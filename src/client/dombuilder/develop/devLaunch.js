const { build } = require('estrella');
const { resolve } = require('path');
const { compiler } = require('google-closure-compiler');
const { stat } = require('fs/promises');

(async () => {
  const tsBuildBegin = new Date();

  await build({
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

  console.log(compiler.COMPILER_PATH);
  console.log(compiler.CONTRIB_PATH);

  const c = new compiler({
    js: resolve(__dirname, 'page.js'),
    compilation_level: 'ADVANCED',
    js_output_file: resolve(__dirname, 'page.min.js'),
    language_out: 'ECMASCRIPT_NEXT',
  });

  const ClosureCompilerBegin = new Date();

  c.run(async (exitCode, stdout, stderr) => {
    console.log({ exitCode, stdout, stderr });
    const finish = new Date();

    console.log();
    console.log(`--- Compile Stats ---`);
    const normalSize = (await stat(resolve(__dirname, 'page.js'))).size;
    const minSize = (await stat(resolve(__dirname, 'page.min.js'))).size;
    console.log(
      `TypeScript Build: ${normalSize}byte(s) [${
        ClosureCompilerBegin.getTime() - tsBuildBegin.getTime()
      }ms]`
    );
    console.log(
      `Closure Compile: ${minSize}byte(s) ${
        Math.round((minSize / normalSize) * 1000) / 10
      }% of Original [${finish.getTime() - ClosureCompilerBegin.getTime()}ms]`
    );
    console.log();
  });
})();
