import { ApplizeCSS } from '.';
import { BetterObjectConstructor } from '../util/betterObjectConstructor';

declare const Object: BetterObjectConstructor;

export function renderCSS(element: HTMLElement, style: ApplizeCSS) {
  Object.entries(style).forEach(([key, value]) => {
    element.style[key] = value;
  });
}
