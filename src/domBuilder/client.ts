import {
  IApplizeDOM,
  HTMLTags,
  ElementGeneratorGeneric,
  ElementGenerator,
  IDOMRenderer,
  IDomRenderFinished,
  IDOMRendererFinishedInput,
  ElementGeneratorRoot,
} from '.';
import { ServerAPIGeneralSchema } from '../api/schema';

export class IApplizeDOMClient<K extends HTMLElement, ExposeType>
  implements IApplizeDOM<K, ExposeType>
{
  constructor(
    public element: K,
    public expose: ExposeType,
    public root: ElementGeneratorRoot
  ) {}

  static generate<K extends HTMLTags, U>(
    root: ElementGeneratorRoot,
    ...args: Parameters<ElementGeneratorGeneric<K, U>>
  ) {
    return new IApplizeDOMClient(document.createElement(args[0]), null, root);
  }

  in<NewExpose>(
    inner: (elementGenerator: ElementGenerator) => NewExpose
  ): IApplizeDOMClient<K, NewExpose> {
    return this.setExpose(
      inner((...args) => {
        const dom = IApplizeDOMClient.generate(this.root, ...args);
        this.element.appendChild(dom.element);
        return dom;
      })
    );
  }

  private setExpose<NewExpose>(expose: NewExpose) {
    return new IApplizeDOMClient<K, NewExpose>(this.element, expose, this.root);
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

  empty() {
    this.element.innerHTML = '';
    return this;
  }

  classAdd(...name: string[]) {
    this.element.classList.add(...name);
    return this;
  }

  classRemove(...name: string[]) {
    this.element.classList.remove(...name);
    return this;
  }
}

declare const window: {
  __applize?: {
    render?: IDOMRenderer<Record<never, never>>;
    pageMove?: (pathname: string, targetElement?: HTMLElement) => void;
  };
};


interface IComponentStyle {
  unique: string;
  style: (selector: string) => string;
}

export class DOMRendererClient<APISchema extends ServerAPIGeneralSchema>
  implements IDOMRenderer<APISchema>
{
  styleElement: HTMLStyleElement | null;
  styleUnique: number;
  styleComponenets: IComponentStyle[];
  constructor(
    public targetElement: HTMLElement | DocumentFragment,
    private applizeRoot: string,
    private pageUnique: string,
    private onFinish: (finished: IDomRenderFinished) => void
  ) {
    this.styleElement = null;
    this.styleUnique = -1;
    this.styleComponenets = [];
  }
  finish(finished: IDOMRendererFinishedInput) {
    this.onFinish({
      ...finished,
      onLeave: () => {
        if (finished.onLeave) finished.onLeave();
        if (this.styleElement) this.styleElement.remove();
      },
    });
  }
  pageMove(pathname: string, targetElement?: HTMLElement): void {
    if (window.__applize?.pageMove) {
      window.__applize.pageMove(pathname, targetElement);
    }
  }
  private appendStyle(data: string) {
    if (this.styleElement === null) {
      this.styleElement = document.createElement('style');
      document.head.appendChild(this.styleElement);
    }
    this.styleElement.sheet?.insertRule(
      data
    );
  }
  style(selector: string, ...style: string[]) {
    this.appendStyle(
      `.style-page-${this.pageUnique} ${selector}{${style.join(';')}}`
    );
  }
  api<CallingAPIName extends keyof APISchema>(
    name: CallingAPIName,
    input: APISchema[CallingAPIName]['input']
  ): Promise<APISchema[CallingAPIName]['output']> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${this.applizeRoot}?api=${name.toString()}`);
      xhr.send(JSON.stringify(input));
      xhr.onload = () => {
        if (xhr.status == 200 || xhr.status == 304) {
          resolve(
            JSON.parse(xhr.responseText) as APISchema[CallingAPIName]['output']
          );
        } else {
          reject(xhr.status);
        }
      };
    });
  }

  clone<
    newAPISchema extends ServerAPIGeneralSchema
  >(): IDOMRenderer<newAPISchema> {
    return new DOMRendererClient<newAPISchema>(
      this.targetElement,
      this.applizeRoot,
      this.pageUnique,
      this.onFinish
    );
  }
  build<K extends HTMLTags, U>(
    ...args: Parameters<ElementGeneratorGeneric<K, U>>
  ) {
    const dom = IApplizeDOMClient.generate(
      {
        styleDefine: (v: { [key: string]: string[] }) => {
          const style = (unique: string) =>
            Object.entries(v).map(([key, value]) =>
              `${key.replace(/&/g, unique)}{${value.join(';')}}`
            ).join('');
          const component = this.styleComponenets.find(v => v.style('&') === style('&'));
          if ( component ) {
            return component.unique;
          } else {
            const unique = `component-${++this.styleUnique}`;
            this.styleComponenets.push({
              unique,
              style
            });
            this.appendStyle(style(`.style-page-${this.pageUnique} ${unique}`))
            return unique;
          }
        },
      },
      ...args
    );
    this.targetElement.appendChild(dom.element);
    return dom;
  }
}
