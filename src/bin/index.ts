#!/usr/bin/env node

import {
  print,
  colors,
  decorate,
  filledBySpace,
  printLine,
  symbols,
  outlined,
} from '../util/console/consoleCommunicater';

console.log('Hello binCommand World!');
printLine();
print(
  filledBySpace(
    [symbols.hexagon + ' Hello Applize!', 'Applizeへようこそ！'],
    4,
    1,
    decorate(colors.white, colors.pink, true)
  )
);
printLine();
print(
  decorate(colors.pink, undefined, true),
  outlined(
    [symbols.hexagon + ' Hello Applize!', 'Applizeへようこそ！'],
    4,
    1,
  )
);
printLine();
