import { ServerAPIGeneralSchema } from '../api/schema';
import { ApplizeCSS } from '../style';

export type HTMLTags = keyof HTMLElementTagNameMap;

export type ElementGeneratorGeneric<K extends HTMLTags, U> = (
  tag: K
) => IApplizeDOM<HTMLElementTagNameMap[K], U>;

export type ElementGenerator = <NewK extends HTMLTags>(
  ...args: Parameters<ElementGeneratorGeneric<NewK, null>>
) => ReturnType<ElementGeneratorGeneric<NewK, null>>;

export interface IApplizeDOM<K extends HTMLElement, ExposeType> {
  element: K;
  expose: ExposeType;

  in<NewExpose>(
    inner: (elementGenerator: ElementGenerator) => NewExpose
  ): IApplizeDOM<K, NewExpose>;

  setExpose<NewExpose>(expose: NewExpose): IApplizeDOM<K, NewExpose>;

  text(text: string): IApplizeDOM<K, ExposeType>;

  on(
    event: keyof HTMLElementEventMap,
    func: () => unknown
  ): IApplizeDOM<K, ExposeType>;

  empty(): IApplizeDOM<K, ExposeType>;

  style(css: ApplizeCSS): IApplizeDOM<K, ExposeType>;
}

export interface IDomRenderFinished {
  title: string;
  onLeave: () => void;
}
export type IDOMRendererFinishedInput = Partial<
  Pick<IDomRenderFinished, 'onLeave'>
> &
  Omit<IDomRenderFinished, 'onLeave'>;

export interface IDOMRenderer<APISchema extends ServerAPIGeneralSchema> {
  targetElement: HTMLElement | DocumentFragment;
  applizeRoot: string;
  onFinish: (finished: IDomRenderFinished) => void;
  finish: (finished: IDOMRendererFinishedInput) => void;
  build<K extends HTMLTags, U>(
    ...args: Parameters<ElementGeneratorGeneric<K, U>>
  ): IApplizeDOM<HTMLElementTagNameMap[K], null>;
  clone<
    newAPISchema extends ServerAPIGeneralSchema
  >(): IDOMRenderer<newAPISchema>;

  api<CallingAPIName extends keyof APISchema>(
    name: CallingAPIName,
    input: APISchema[CallingAPIName]['input']
  ): Promise<APISchema[CallingAPIName]['output']>;

  pageMove(pathname: string, targetElement?: HTMLElement): void;
}
