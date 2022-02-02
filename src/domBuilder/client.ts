import {
  IApplizeDOM,
  HTMLTags,
  ElementGenerator,
  ElementGeneratorUnknown,
  IDOMRenderer,
} from '.';

export class IApplizeDOMClient<K extends HTMLElement, ExposeType>
  implements IApplizeDOM<K, ExposeType>
{
  constructor(public element: K, public expose: ExposeType) {}

  static generate<K extends HTMLTags, U>(
    ...args: Parameters<ElementGenerator<K, U>>
  ) {
    return new IApplizeDOMClient(document.createElement(args[0]), null);
  }

  in<NewExpose>(
    inner: (elementGenerator: ElementGeneratorUnknown) => NewExpose
  ): IApplizeDOMClient<K, NewExpose> {
    return this.setExpose(
      inner((...args) => {
        const dom = IApplizeDOMClient.generate(...args);
        this.element.appendChild(dom.element);
        return dom;
      })
    );
  }

  setExpose<NewExpose>(expose: NewExpose) {
    return new IApplizeDOMClient<K, NewExpose>(this.element, expose);
  }

  //------- Property Editor

  text(text: string) {
    this.element.textContent = text;
    return this;
  }

  on(event: keyof HTMLElementEventMap, func: () => unknown) {
    this.element.addEventListener(event, func);
    return this;
  }
}

export class DOMRendererClient implements IDOMRenderer {
  constructor(public targetElement: HTMLElement) {}
  clone(): IDOMRenderer {
    return new DOMRendererClient(this.targetElement);
  }
  build<K extends HTMLTags, U>(...args: Parameters<ElementGenerator<K, U>>) {
    const dom = IApplizeDOMClient.generate(...args);
    this.targetElement.appendChild(dom.element);
    return dom;
  }
}
