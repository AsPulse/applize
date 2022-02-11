import type { IAPISchema } from '../api/schema';
import { IDOMRenderer } from '../domBuilder';

export type render = (adb: IDOMRenderer<[]>) => void;

declare const global: { fileName?: string };
declare const window: { __applize?: { render?: IDOMRenderer<[]> } };

export class ApplizePage<K extends IAPISchema[]> {
  fileName: string | null = null;
  constructor(public render: render) {
    const windowA = typeof window === 'object' ? window : undefined;
    const globalA = typeof global === 'object' ? global : undefined;
    if (globalA?.fileName) {
      this.fileName = globalA.fileName;
    }
    if (windowA?.__applize?.render) {
      render(windowA.__applize.render.clone<K>());
    }
  }
}

export class ApplizePageWithFile {
  constructor(public fileName: string) {}
}
