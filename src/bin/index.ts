#!/usr/bin/env node
import {
  colors,
  confirmYesNo,
  decorate,
  filledBySpace,
  say,
  symbols,
} from '../util/console/consoleCommunicater';
import { FileCreator } from './fileio/creator';

new FileCreator(path =>
  confirmYesNo([
    decorate(colors.green),
    'File ',
    path,
    ' is already exists. Override?',
  ])
);

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
