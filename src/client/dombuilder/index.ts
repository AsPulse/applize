export type HTMLTags = keyof HTMLElementTagNameMap;

export type ElementGenerator<K extends HTMLTags, U> = (
  tag: K
) => IApplizeDOM<HTMLElementTagNameMap[K], U>;

export type ElementGeneratorUnknown = <NewK extends HTMLTags>(
  ...args: Parameters<ElementGenerator<NewK, null>>
) => ReturnType<ElementGenerator<NewK, null>>;

export interface IApplizeDOM<K extends HTMLElement, ExposeType> {
  element: K;
  expose: ExposeType;

  in<NewExpose>(
    inner: (elementGenerator: ElementGeneratorUnknown) => NewExpose
  ): IApplizeDOM<K, NewExpose>;

  setExpose<NewExpose>(expose: NewExpose): IApplizeDOM<K, NewExpose>;

  text(text: string): IApplizeDOM<K, ExposeType>;

  on(
    event: keyof HTMLElementEventMap,
    func: () => unknown
  ): IApplizeDOM<K, ExposeType>;
}

export interface DOMRenderer {
  targetElement: HTMLElement;
  build<K extends HTMLTags, U>(
    ...args: Parameters<ElementGenerator<K, U>>
  ): IApplizeDOM<HTMLElementTagNameMap[K], null>;
}
