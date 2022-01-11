// value 0 ... 255
interface IRGBColor {
  r: number;
  g: number;
  b: number;
}

const resetColor = `\x1b[0m`;

type TColorVariation = 'green' | 'blue';
export const colors: { [key in TColorVariation]: IRGBColor } = {
  green: { r: 0, g: 217, b: 98 },
  blue: { r: 0, g: 119, b: 255 },
};
