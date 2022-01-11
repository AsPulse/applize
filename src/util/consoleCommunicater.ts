// value 0 ... 255
interface IRGBColor {
  r: number;
  g: number;
  b: number;
}

const resetColor = `\x1b[0m`;
const resetForegroundColor = `\x1b[39m`;
const resetBackgroundColor = `\x1b[49m`;

type TColorVariation = 'pink' | 'green' | 'blue';
export const colors: { [key in TColorVariation]: IRGBColor } = {
  pink: { r: 255, g: 0, b: 96 },
  green: { r: 0, g: 217, b: 98 },
  blue: { r: 0, g: 119, b: 255 },
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
