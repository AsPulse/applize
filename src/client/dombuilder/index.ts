export type TBuilderArgs = [string]
export type TBuilder<U> =
    [...TBuilderArgs, ((builder: <K>(...args: TBuilder<K>) => IApplizeDOM<K>) => U)];


export type TNoExpose = null;
export interface IApplizeDOM<U> {
  element: HTMLElement,
  expose: U
}

export interface IApplizeDOMBuilder {
  targetElement: HTMLElement;
  build<U>(...args: TBuilder<U>): IApplizeDOM<U>;
  parse<U>(...args: TBuilder<U>): IApplizeDOM<U>;
}

