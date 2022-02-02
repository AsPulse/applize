export type HTMLTags = keyof HTMLElementTagNameMap;

export type ElementGenerator<K extends HTMLTags, U> = (
  tag: K
) => IApplizeDOM<HTMLElementTagNameMap[K], U>;

export type ElementGeneratorUnknown = <NewK extends HTMLTags>(
  ...args: Parameters<ElementGenerator<NewK, null>>
) => ReturnType<ElementGenerator<NewK, null>>;

export class IApplizeDOM<K extends HTMLElement, ExposeType> {
  constructor(public element: K, public expose: ExposeType) {}

  static generate<K extends HTMLTags, U>(
    ...args: Parameters<ElementGenerator<K, U>>
  ) {
    return new IApplizeDOM(document.createElement(args[0]), null);
  }

  in<NewExpose>(
    inner: (elementGenerator: ElementGeneratorUnknown) => NewExpose
  ): IApplizeDOM<K, NewExpose> {
    return this.setExpose(
      inner((...args) => {
        const dom = IApplizeDOM.generate(...args);
        this.element.appendChild(dom.element);
        return dom;
      })
    );
  }

  setExpose<NewExpose>(expose: NewExpose) {
    return new IApplizeDOM<K, NewExpose>(this.element, expose);
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

export class DomRenderer {
  constructor(public targetElement: HTMLElement) {}
  build<K extends HTMLTags, U>(...args: Parameters<ElementGenerator<K, U>>) {
    const dom = IApplizeDOM.generate(...args);
    this.targetElement.appendChild(dom.element);
    return dom;
  }
}
