export type TBuilderArgs<T> = [T];
export type HTMLTags = keyof HTMLElementTagNameMap;
export type TBuilder<T extends HTMLTags, U> =
  | [
      ...TBuilderArgs<T>,
      (
        builder: <S extends HTMLTags, K>(
          ...args: TBuilder<S, K>
        ) => IApplizeDOM<HTMLElementTagNameMap[S], K>
      ) => U
    ]
  | TBuilderArgs<T>;

export type TNoExpose = undefined;
export interface IApplizeDOM<K extends HTMLElement, U> {
  element: K;
  expose: U;
}

export interface IApplizeDOMBuilder {
  targetElement: HTMLElement;
  build<T extends HTMLTags, U = TNoExpose>(
    ...args: TBuilder<T, U>
  ): IApplizeDOM<HTMLElementTagNameMap[T], U>;
  parse<T extends HTMLTags, U = TNoExpose>(
    ...args: TBuilder<T, U>
  ): IApplizeDOM<HTMLElementTagNameMap[T], U>;
}
