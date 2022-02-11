import type { ServerAPISchema } from '../api/schema';
import { IDOMRenderer } from '../domBuilder';

export type render<K extends ServerAPISchema> = (adb: IDOMRenderer<K>) => void;

declare const global: { fileName?: string };
declare const window: {
  __applize?: { render?: IDOMRenderer<Record<never, never>> };
};

export class ApplizePage<K extends ServerAPISchema> {
  fileName: string | null = null;
  constructor(public render: render<K>) {
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
