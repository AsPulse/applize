// value 0 ... 255
interface IRGBColor {
  r: number;
  g: number;
  b: number;
}

const resetColor = `\x1b[0m`;
const resetForegroundColor = `\x1b[39m`;
const resetBackgroundColor = `\x1b[49m`;

type TColorVariation = 'pink' | 'green' | 'blue' | 'white' | 'black';
export const colors: { [key in TColorVariation]: IRGBColor } = {
  pink: { r: 255, g: 50, b: 125 },
  green: { r: 0, g: 217, b: 98 },
  blue: { r: 0, g: 119, b: 255 },
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 },
};

type TSymbolVariation = 'hexagon' | 'clover' | 'diamond';
export const symbols: { [key in TSymbolVariation]: string } = {
  hexagon: '⬢',
  clover: '☘',
  diamond: '◆'
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

export function print(...args: string[]): void {
  console.log([args, resetColor].flat().join(''));
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
    .map((v) => v.length)
    .reduce((a, b) => Math.max(a, b));
  const shareMargin = letterLoop(' ', letterMargin);
  const letterMargined = letterLoop(' ', maxLength + letterMargin * 2);
  const linesMargined = [...new Array<void>(lineMargin)].map(
    () => decorator + letterMargined + resetColor
  );
  return [
    linesMargined,
    content.map((v) =>
      [
        decorator,
        shareMargin,
        v,
        letterLoop(' ', maxLength - v.length),
        shareMargin,
        resetColor,
      ].join('')
    ),
    linesMargined,
  ]
    .flat()
    .join('\n');
}
