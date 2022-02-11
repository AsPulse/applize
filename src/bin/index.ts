#!/usr/bin/env node
import { cwd } from 'process';
import {
  colors,
  confirmYesNo,
  decorate,
  filledBySpace,
  input,
  say,
  symbols,
} from '../util/console/consoleCommunicater';
import { fileAPISchemats } from './data/file-apischemats';
import { fileBuildjs } from './data/file-buildjs';
import { fileEntryIndexts } from './data/file-entryIndexts';
import { fileIndexhtml } from './data/file-indexhtml';
import { fileIndexts } from './data/file-indexts';
import { filePageIndexts } from './data/file-pagesIndexTs';
import { FileCreator } from './fileio/creator';

say();
say(
  filledBySpace(
    [
      decorate(colors.white, colors.pink, true) +
        symbols.hexagon +
        ' Hello Applize!',
      decorate(colors.white, colors.pink, false) +
        'for TypeScript in everything...',
    ],
    3,
    1,
    decorate(colors.white, colors.pink, true)
  )
);
say();

void (async () => {
  say('Your current-directory: ', cwd());
  const root = await input(
    ['Root directory ( default is current-directory ): '],
    () => Promise.resolve(true)
  );

  const fc = new FileCreator(
    path =>
      confirmYesNo([
        decorate(colors.green),
        'File ',
        path,
        ' is already exists. Override?',
      ]),
    root
  );
  await fc.createDirectory('./src');
  await fc.createDirectory('./pages');
  await fc.createDirectory('./dist');
  await fc.createDirectory('./entry');

  await fc.createFile('./build.js', fileBuildjs);
  await fc.createFile('./src/index.ts', fileIndexts);
  await fc.createFile('./src/apiSchema.ts', fileAPISchemats);

  await fc.createFile('./pages/index.ts', filePageIndexts);

  await fc.createFile('./entry/index.html', fileIndexhtml);
  await fc.createFile('./entry/index.ts', fileEntryIndexts);

  say();
  say(decorate(colors.white, colors.pink, true), ' DONE! ');
})();
