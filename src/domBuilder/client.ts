import {
  IApplizeDOM,
  HTMLTags,
  ElementGeneratorGeneric,
  ElementGenerator,
  IDOMRenderer,
} from '.';
import { ServerAPISchema } from '../api/schema';

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
}

export class DOMRendererClient<APISchema extends ServerAPISchema>
  implements IDOMRenderer<APISchema>
{
  constructor(public targetElement: HTMLElement, public applizeRoot: string) {}
  api<CallingAPIName extends keyof APISchema>(
    name: CallingAPIName,
    input: APISchema[CallingAPIName]['input']
  ): Promise<APISchema[CallingAPIName]['output']> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${this.applizeRoot}?api=${name.toString()}`);
      xhr.send(JSON.stringify(input));
      xhr.onload = () => {
        if( xhr.status == 200 || xhr.status == 304 ) {
          resolve(JSON.parse(xhr.responseText) as APISchema[CallingAPIName]['output']);
        } else {
          reject(xhr.status);
        }
      };
    });
  }

  clone<newAPISchema extends ServerAPISchema>(): IDOMRenderer<newAPISchema> {
    return new DOMRendererClient<newAPISchema>(this.targetElement, this.applizeRoot);
  }
  build<K extends HTMLTags, U>(
    ...args: Parameters<ElementGeneratorGeneric<K, U>>
  ) {
    const dom = IApplizeDOMClient.generate(...args);
    this.targetElement.appendChild(dom.element);
    return dom;
  }
}
