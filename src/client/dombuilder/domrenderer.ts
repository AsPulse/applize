import { IApplizeDOMBuilder, TBuilder } from '.';


export class DomRenderer implements IApplizeDOMBuilder {
  constructor(public targetElement: HTMLElement) {}
  build<U>(...args: TBuilder<U>) {
    const element = this.parse(...args);
    this.targetElement.appendChild(element.element);
    return element;
  }
  parse<U>(...args: TBuilder<U>){
    const element = document.createElement(args[0]);
    const last = args[1];
    const expose = last(<K>(...args: TBuilder<K>) => {
        const parsed = this.parse(...args);
        element.appendChild(parsed.element);
        return parsed;
    });
    return { element, expose }
  };
}
