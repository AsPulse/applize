import {
  IApplizeDOM,
  HTMLTags,
  ElementGeneratorGeneric,
  ElementGenerator,
  IDOMRenderer,
  IDomRenderFinished,
  IDOMRendererFinishedInput,
} from '.';
import { ServerAPIGeneralSchema } from '../api/schema';
import { ApplizeCSS } from '../style';
import { renderCSS } from '../style/render';

export class IApplizeDOMClient<K extends HTMLElement, ExposeType>
  implements IApplizeDOM<K, ExposeType>
{
  constructor(public element: K, public expose: ExposeType) {}

  static generate<K extends HTMLTags, U>(
    ...args: Parameters<ElementGeneratorGeneric<K, U>>
  ) {
    return new IApplizeDOMClient(document.createElement(args[0]), null);
  }

  in<NewExpose>(
    inner: (elementGenerator: ElementGenerator) => NewExpose
  ): IApplizeDOMClient<K, NewExpose> {
    return this.setExpose(
      inner((...args) => {
        const dom = IApplizeDOMClient.generate(...args);
        this.element.appendChild(dom.element);
        return dom;
      })
    );
  }

  private setExpose<NewExpose>(expose: NewExpose) {
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

  empty() {
    this.element.innerHTML = '';
    return this;
  }

  style(css: ApplizeCSS) {
    renderCSS(this.element, css);
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

export class DOMRendererClient<APISchema extends ServerAPIGeneralSchema>
  implements IDOMRenderer<APISchema>
{
  styleElement: HTMLStyleElement | null;
  constructor(
    public targetElement: HTMLElement | DocumentFragment,
    private applizeRoot: string,
    private pageUnique: string,
    private onFinish: (finished: IDomRenderFinished) => void
  ) {
    this.styleElement = null;
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
  style(selector: string, ...style: string[]) {
    if (this.styleElement === null) {
      this.styleElement = document.createElement('style');
      document.head.appendChild(this.styleElement);
    }
    this.styleElement.sheet?.insertRule(
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
    const dom = IApplizeDOMClient.generate(...args);
    this.targetElement.appendChild(dom.element);
    return dom;
  }
}
