import { HTMLTags, IApplizeDOMBuilder, TBuilder } from '.';


export class DomRenderer implements IApplizeDOMBuilder {
  constructor(public targetElement: HTMLElement) {}
  build<T extends HTMLTags, U>(...args: TBuilder<T, U>) {
    const element = this.parse(...args);
    this.targetElement.appendChild(element.element);
    return element;
  }
  parse<T extends HTMLTags, U>(...args: TBuilder<T, U>){
    const element = document.createElement(args[0]);
    const last = args[1];
    const expose = last(<S extends HTMLTags, K>(...args: TBuilder<S, K>) => {
        const parsed = this.parse(...args);
        element.appendChild(parsed.element);
        return parsed;
    });
    return { element, expose }
  };
}
