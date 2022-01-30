import {
  HTMLTags,
  IApplizeDOM,
  IApplizeDOMBuilder,
  TBuilder,
  TNoExpose,
} from '.';

export class DomRenderer implements IApplizeDOMBuilder {
  constructor(public targetElement: HTMLElement) {}
  build<T extends HTMLTags, U>(...args: TBuilder<T, U>) {
    const element = this.parse(...args);
    this.targetElement.appendChild(element.element);
    return element;
  }
  parse<T extends HTMLTags, U = TNoExpose>(
    ...args: TBuilder<T, U>
  ): IApplizeDOM<HTMLElementTagNameMap[T], U> {
    const element = document.createElement(args[0]);
    const last = args[1];
    if (last !== undefined) {
      const expose = last(<S extends HTMLTags, K>(...args: TBuilder<S, K>) => {
        const parsed = this.parse(...args);
        element.appendChild(parsed.element);
        return parsed;
      });
      return { element, expose };
    } else {
      return { element, expose: last as unknown as U };
    }
  }
}
