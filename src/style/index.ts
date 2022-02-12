export type CSSAbsoluteUnits = 'cm' | 'mm' | 'Q' | 'in' | 'pc' | 'pt' | 'px';
export type CSSRelativeUnits = 'em' | 'ex' | 'ch' | 'rem' | 'lh' | 'vw' | 'vh' | 'vmin' | 'vmax';

export class Color {
  constructor(public r: number, public g: number, public b: number, public a: number){}
  static fromHex(string: `#${string}`) {
    return new Color(parseInt(string[1] + string[2], 16), parseInt(string[3] + string[4], 16), parseInt(string[5] + string[6], 16), 255)
  }
  static fromRGB(r: number, g: number, b: number) {
    return new Color(r, g, b, 255);
  }
  static fromRGBA(r: number, g: number, b: number, a: number) {
    return new Color(r, g, b, a);
  }
  alpha(alpha: number): Color {
    return new Color(this.r, this.g, this.b, alpha);
  }
  toRGB(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}

export type Length = `${number}${CSSAbsoluteUnits | CSSRelativeUnits | '%'}`
export type ratio = number | `${number}%`

export class Cardinal<T> {
  constructor(public top: T | undefined, public bottom: T | undefined, public left: T | undefined, public right: T | undefined){}
  static fromAll<K>(value: K | undefined) {
    return new Cardinal<K>(value, value, value, value);
  }
  static fromVH<K>(UpAndDown: K | undefined, LeftAndRight: K | undefined) {
    return new Cardinal<K>(UpAndDown, UpAndDown, LeftAndRight, LeftAndRight);
  }
}


