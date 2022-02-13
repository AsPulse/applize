import {
  IApplizeDOM,
  HTMLTags,
  ElementGeneratorGeneric,
  ElementGenerator,
  IDOMRenderer,
  IDomRenderFinished,
} from '.';
import { ServerAPISchema } from '../api/schema';
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

  empty() {
    this.element.innerHTML = '';
    return this;
  }

  style(css: ApplizeCSS) {
    renderCSS(this.element, css);
    return this;
  }
}

declare const window: {
  __applize?: {
    render?: IDOMRenderer<Record<never, never>>;
    pageMove?: (pathname: string, targetElement?: HTMLElement) => void;
  };
};

export class DOMRendererClient<APISchema extends ServerAPISchema>
  implements IDOMRenderer<APISchema>
{
  constructor(
    public targetElement: HTMLElement | DocumentFragment,
    public applizeRoot: string,
    public finish: (finished: IDomRenderFinished) => void
  ) {}
  pageMove(pathname: string, targetElement?: HTMLElement): void {
    if (window.__applize?.pageMove) {
      window.__applize.pageMove(pathname, targetElement);
    }
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

  clone<newAPISchema extends ServerAPISchema>(): IDOMRenderer<newAPISchema> {
    return new DOMRendererClient<newAPISchema>(
      this.targetElement,
      this.applizeRoot,
      this.finish
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
