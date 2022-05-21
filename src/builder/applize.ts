import { build } from 'esbuild';
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'fs/promises';
import { basename, extname, join, resolve } from 'path';
import type { ApplizeBuilder } from '.';
import { decorate, say } from '../util/console/consoleCommunicater';
import { FileSystemErrorSerialize } from '../util/error/fileSystemError';

export type ApplizePostBuilder = {
  name: string;
  compiler: (filePath: string) => Promise<boolean>;
};
export interface IApplizeBuildOptions {
  serverEntryPoint: string;
  pagesDirectory: string;
  publicDirectory: string;
  entryHTML: string;
  entryTS: string;
  distDirectory: string;
  serverPostBuilder?: ApplizePostBuilder[];
  pagesPostBuilder?: ApplizePostBuilder[];
  additionExternals?: string[];
  treeShaking?: boolean;
}

export function ApplizeProjectMakeUp(
  builder: ApplizeBuilder,
  options: IApplizeBuildOptions
): void {
  builder.addPhaseAsync('Reset Dist Directory', async () => {
    try {
      await rm(options.distDirectory, { recursive: true });
    } catch (e) {
      if (FileSystemErrorSerialize(e).code.type !== 'NoEntityError') {
        console.error(e);
        return false;
      }
    }
    await mkdir(resolve(options.distDirectory, 'pages'), { recursive: true });
    await mkdir(resolve(options.distDirectory, 'entry'), { recursive: true });
    await mkdir(resolve(options.distDirectory, 'pages', 'tmp'), {
      recursive: true,
    });
    return true;
  });
  builder.addPhaseAsync('Build Entry', async () => {
    await copyFile(
      options.entryHTML,
      resolve(options.distDirectory, 'entry', 'index.html')
    );
    await build({
      entryPoints: [options.entryTS],
      minify: true,
      bundle: true,
      target: 'esnext',
      outfile: resolve(options.distDirectory, 'entry', 'index.js'),
      sourcemap: false,
    });
    return true;
  });
  builder.addPhaseAsync('Build Pages', async () => {
    try {
      const pages = await getAllFilesInDir(options.pagesDirectory, [
        '.ts',
        '.js',
      ]);
      await copyResclusive(
        options.pagesDirectory,
        resolve(options.distDirectory, 'pages', 'tmp'),
        ['.ts', '.js']
      );
      const success = (
        await Promise.all(
          pages
            .map((v, i) => ({ path: v, deployFileName: `page-${i}` }))
            .map(async v => {
              try {
                const originalPath = resolve(
                  v.path.directory,
                  v.path.dirent.name
                );
                const distPath = resolve(
                  options.distDirectory,
                  'pages',
                  `${v.deployFileName}.js`
                );
                const result = await build({
                  entryPoints: [originalPath],
                  minify: true,
                  bundle: true,
                  target: 'esnext',
                  outfile: distPath,
                  sourcemap: false,
                  treeShaking: options.treeShaking === true ? true : undefined,
                });
                if (!result) throw false;
                say(
                  decorate(),
                  basename(originalPath),
                  ' --> ',
                  basename(distPath),
                  ' ( ',
                  `${Math.round((await stat(distPath)).size / 10) / 100}`,
                  'k )'
                );
                await writeFile(
                  originalPath,
                  getFilenameTyper(
                    v.deployFileName,
                    (await readFile(originalPath)).toString()
                  )
                );
                return true;
              } catch (e) {
                return e;
              }
            })
        )
      ).filter(v => v !== true);
      if (success.length > 0) {
        throw success[0];
      }
    } catch {
      await copyResclusive(
        resolve(options.distDirectory, 'pages', 'tmp'),
        options.pagesDirectory,
        ['.ts', '.js']
      );
      await rm(resolve(options.distDirectory, 'pages', 'tmp'), {
        recursive: true,
      });
      return false;
    }
    await copyResclusive(
      resolve(options.distDirectory, 'pages', 'tmp'),
      options.pagesDirectory,
      ['.ts', '.js']
    );
    await rm(resolve(options.distDirectory, 'pages', 'tmp'), {
      recursive: true,
    });
    return true;
  });
  builder.addPhaseAsync('Build Server', async () => {
    const result = await build({
      entryPoints: [options.serverEntryPoint],
      outfile: resolve(options.distDirectory, 'index.js'),
      minify: true,
      bundle: true,
      sourcemap: true,
      platform: 'node',
      external: ['fp-ts', ...(options.additionExternals ?? [])],
    });
    if (!result) return false;
    return true;
  });
  (options.pagesPostBuilder ?? []).forEach(v => {
    builder.addPhaseAsync(`PostBuild ${v.name} Pages`, async () => {
      const success = await Promise.all(
        (
          await getAllFilesInDir(resolve(options.distDirectory, 'pages'), [
            '.js',
          ])
        ).map(async e => {
          const file = resolve(e.directory, e.dirent.name);
          const beforeSize = (await stat(file)).size;
          const successPost = await v.compiler(file);
          if (!successPost) return false;
          const afterSize = (await stat(file)).size;
          say(
            e.dirent.name,
            ' is finished ( ',
            `${beforeSize}byte -> ${afterSize}byte ${
              Math.round((afterSize / beforeSize) * 1000) / 10
            }%`,
            ' )'
          );
          return successPost;
        })
      );
      return success.every(v => v);
    });
  });
  (options.serverPostBuilder ?? []).forEach(v => {
    builder.addPhaseAsync(`PostBuild ${v.name} Server`, async () => {
      const file = resolve(options.distDirectory, 'index.js');
      const beforeSize = (await stat(file)).size;
      const successPost = await v.compiler(file);
      if (!successPost) return false;
      const afterSize = (await stat(file)).size;
      say(
        'index.js',
        ' is finished ( ',
        `${beforeSize}byte -> ${afterSize}byte ${
          Math.round((afterSize / beforeSize) * 1000) / 10
        }%`,
        ' )'
      );
      return successPost;
    });
  });
  builder.addPhaseAsync('Copy Public', async () => {
    await copyResclusive(
      options.publicDirectory,
      resolve(options.distDirectory, 'public'),
      []
    );
    return true;
  });
}

export async function copyResclusive(
  original: string,
  dist: string,
  extensions: string[],
  extensionExcludes?: string[]
) {
  return Promise.all(
    (await getAllFilesInJoin(original, extensions, extensionExcludes)).map(
      async v => {
        await mkdir(resolve(dist, v.directory), { recursive: true });
        await copyFile(
          resolve(v.basePath, v.directory, v.dirent.name),
          resolve(dist, v.directory, v.dirent.name)
        );
        return;
      }
    )
  );
}

export function getFilenameTyper(fileName: string, original: string) {
  const before = `(<any>global).fileName = '${fileName}';`;
  const after = `(<any>global).fileName = undefined;`;
  return [before, original, after].join('\n');
}

export async function getAllFilesInJoin(
  path: string,
  extension: string[],
  extensionsExclude?: string[]
) {
  let files = (await readdir(path, { withFileTypes: true })).map(v => ({
    directory: '',
    dirent: v,
    basePath: path,
  }));
  while (files.some(v => v.dirent.isDirectory())) {
    files = (
      await Promise.all(
        files.map(async v =>
          v.dirent.isDirectory()
            ? (
                await readdir(resolve(v.basePath, v.directory, v.dirent.name), {
                  withFileTypes: true,
                })
              ).map(e => ({
                basePath: v.basePath,
                directory: join(v.directory, v.dirent.name),
                dirent: e,
              }))
            : [v]
        )
      )
    ).flat();
  }
  return files
    .filter(v =>
      extension.length > 0 ? extension.includes(extname(v.dirent.name)) : true
    )
    .filter(v =>
      extensionsExclude
        ? !extensionsExclude.includes(extname(v.dirent.name))
        : true
    );
}
export async function getAllFilesInDir(path: string, extension: string[]) {
  return (await getAllFilesInJoin(path, extension)).map(v => ({
    dirent: v.dirent,
    directory: resolve(v.basePath, v.directory),
  }));
}
