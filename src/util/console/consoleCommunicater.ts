import { createInterface } from 'readline';
import { renderLength } from './renderLength';

// value 0 ... 255
interface IRGBColor {
  r: number;
  g: number;
  b: number;
}

const resetColor = `\x1b[0m`;
const resetForegroundColor = `\x1b[39m`;
const resetBackgroundColor = `\x1b[49m`;

type TColorVariation =
  | 'pink'
  | 'green'
  | 'blue'
  | 'white'
  | 'black'
  | 'gray'
  | 'lightBlue';
export const colors: { [key in TColorVariation]: IRGBColor } = {
  pink: { r: 255, g: 50, b: 125 },
  green: { r: 0, g: 217, b: 98 },
  blue: { r: 0, g: 119, b: 255 },
  lightBlue: { r: 15, g: 147, b: 255 },
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 },
  gray: { r: 180, g: 180, b: 180 },
};

type TSymbolVariation = 'hexagon' | 'clover' | 'diamond';
export const symbols: { [key in TSymbolVariation]: string } = {
  hexagon: '⬢',
  clover: '☘',
  diamond: '◆',
};

export function decorate(
  foreground?: IRGBColor,
  background?: IRGBColor,
  bold = false,
  underlined = false
): string {
  return (
    resetColor +
    (foreground
      ? `\x1b[38;2;${foreground.r};${foreground.g};${foreground.b}m`
      : resetForegroundColor) +
    (background
      ? `\x1b[48;2;${background.r};${background.g};${background.b}m`
      : resetBackgroundColor) +
    (bold ? `\x1b[1m` : '') +
    (underlined ? `	\x1b[4m` : '')
  );
}

export function say(...args: string[]): void {
  print(...args, '\n');
}
function print(...args: string[]): void {
  process.stdout.write([args, resetColor].flat().join(''));
}

function letterLoop(target: string, count: number): string {
  return [...new Array<void>(count)].map(() => target).join('');
}

export function filledBySpace(
  content: string[],
  letterMargin: number,
  lineMargin: number,
  decorator = ''
): string {
  const maxLength = content
    .map(v => renderLength(v))
    .reduce((a, b) => Math.max(a, b));
  const shareMargin = letterLoop(' ', letterMargin);
  const letterMargined = letterLoop(' ', maxLength + letterMargin * 2);
  const linesMargined = [...new Array<void>(lineMargin)].map(
    () => decorator + letterMargined + resetColor
  );
  return [
    linesMargined,
    content.map(v =>
      [
        decorator,
        shareMargin,
        v,
        letterLoop(' ', maxLength - renderLength(v)),
        shareMargin,
        resetColor,
      ].join('')
    ),
    linesMargined,
  ]
    .flat()
    .join('\n');
}

export function outlined(
  content: string[],
  letterMargin: number,
  lineMargin: number,
  decorator = ''
): string {
  const maxLength = content
    .map(v => renderLength(v))
    .reduce((a, b) => Math.max(a, b));
  const marginSpace = letterLoop(' ', letterMargin);
  const lineMargins = [...new Array<void>(lineMargin)].map(() => '');
  return [
    `╭` + letterLoop('─', maxLength + letterMargin * 2) + `╮`,
    [lineMargins, content, lineMargins]
      .flat()
      .map(v =>
        [
          '│',
          marginSpace,
          v,
          letterLoop(' ', maxLength - renderLength(v)),
          marginSpace,
          '│',
        ].join('')
      ),
    `╰` + letterLoop('─', maxLength + letterMargin * 2) + `╯`,
  ]
    .flat()
    .map(v => `${decorator}${v}${decorate()}`)
    .join('\n');
}

export async function input(
  content: string[],
  validator: (input: string) => Promise<boolean> = () => Promise.resolve(true)
) {
  const reader = createInterface({ input: process.stdin });
  print(...content);
  return new Promise<string>(resolve => {
    reader.on('line', line => {
      void (async () => {
        if (!(await validator(line))) {
          print(...content);
          return;
        }
        reader.close();
        resolve(line);
      })();
    });
  });
}
export async function confirmInput<UnionType extends string>(
  content: string[],
  selections: UnionType[],
  showSelections: boolean
): Promise<UnionType> {
  return <UnionType>(
    await input(
      [...content, showSelections ? ` (${selections.join('/')})` : '', ': '],
      v => {
        return Promise.resolve((<string[]>selections).includes(v));
      }
    )
  );
}
export async function confirmYesNo(content: string[]): Promise<boolean> {
  return (await confirmInput(content, ['y', 'n'], true)) === 'y';
}
