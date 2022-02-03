import { IDOMRenderer } from '../domBuilder';

export type router = (url: string) => void;
export type render = (adb: IDOMRenderer) => void;

declare const global: { fileName?: string };
declare const window: { __applize: { render: IDOMRenderer } };

export class ApplizePage {
  fileName: string | null = null;
  constructor(public router: router, public render: render) {
    const windowA = (() => {
      try {
        if (window !== undefined) return window;
      } catch {
        return undefined;
      }
      return undefined;
    })();
    const globalA = (() => {
      try {
        if (global !== undefined) return global;
      } catch {
        return undefined;
      }
      return undefined;
    })();
    if (globalA?.fileName) {
      this.fileName = globalA.fileName;
    }
    if (windowA) {
      render(windowA.__applize.render.clone());
    }
  }
}
