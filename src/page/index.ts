import { IDOMRenderer } from '../domBuilder';

export type router = (url: string) => void;
export type render = (adb: IDOMRenderer) => void;

declare const global: { fileName?: string };
declare const window: { __applize?: { render?: IDOMRenderer } };

export class ApplizePage {
  fileName: string | null = null;
  constructor(public router: router, public render: render) {
    const windowA = typeof window === 'object' ? window : undefined;
    const globalA = typeof global === 'object' ? global : undefined;
    if (globalA?.fileName) {
      this.fileName = globalA.fileName;
    }
    if (windowA?.__applize?.render) {
      render(windowA.__applize.render.clone());
    }
  }
}
