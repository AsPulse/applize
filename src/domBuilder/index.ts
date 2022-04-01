import type { APITypesGeneral } from '../api/schema';
import type * as T from 'io-ts';

export type HTMLTags = keyof HTMLElementTagNameMap;

export type ElementGeneratorGeneric<K extends HTMLTags, U> = (
  tag: K
) => IApplizeDOM<HTMLElementTagNameMap[K], U>;

export type ElementGenerator = {
  <NewK extends HTMLTags>(
    ...args: Parameters<ElementGeneratorGeneric<NewK, null>>
  ): ReturnType<ElementGeneratorGeneric<NewK, null>>;
  (): ElementGeneratorRoot;
};

export interface IApplizeDOM<K extends HTMLElement, ExposeType> {
  element: K;
  expose: ExposeType;
  root: ElementGeneratorRoot;

  in<NewExpose>(
    inner: (elementGenerator: ElementGenerator) => NewExpose
  ): IApplizeDOM<K, NewExpose>;

  text(text: string): IApplizeDOM<K, ExposeType>;

  on(
    event: keyof HTMLElementEventMap,
    func: () => unknown
  ): IApplizeDOM<K, ExposeType>;

  empty(): IApplizeDOM<K, ExposeType>;

  classAdd(...name: string[]): IApplizeDOM<K, ExposeType>;

  classRemove(...name: string[]): IApplizeDOM<K, ExposeType>;
}

export interface IDomRenderFinished {
  title: string;
  onLeave: () => void;
}
export type IDOMRendererFinishedInput = Partial<
  Pick<IDomRenderFinished, 'onLeave'>
> &
  Omit<IDomRenderFinished, 'onLeave'>;

export interface IDOMRenderer<APISchema extends APITypesGeneral> {
  targetElement: HTMLElement | DocumentFragment;
  finish: (finished: IDOMRendererFinishedInput) => void;
  build<K extends HTMLTags, U>(
    ...args: Parameters<ElementGeneratorGeneric<K, U>>
  ): IApplizeDOM<HTMLElementTagNameMap[K], null>;
  clone<newAPISchema extends APITypesGeneral>(): IDOMRenderer<newAPISchema>;

  url(): string[];

  api<CallingAPIName extends keyof APISchema>(
    name: CallingAPIName,
    input: T.TypeOf<APISchema[CallingAPIName]['input']>
  ): Promise<T.TypeOf<APISchema[CallingAPIName]['output']>>;
  style(selector: string, ...style: string[]): void;
  pageMove(pathname: string, targetElement?: HTMLElement): void;
}

export interface ElementGeneratorRoot {
  styleDefine: (style: { [key: string]: string[] }) => string;
}
