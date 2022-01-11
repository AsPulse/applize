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
