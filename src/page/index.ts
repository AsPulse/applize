import { IDOMRenderer } from '../domBuilder';

export type router = (url: string) => void;
export type render = (adb: IDOMRenderer) => void;

declare const global: { fileName?: string };
declare const window: { __applize: { render: IDOMRenderer } };

export class ApplizePage {
  fileName: string | null = null;
  constructor(public router: router, public render: render) {
    const chkFromWeb = (() => {
      try {
        if (window !== undefined) return true;
      } catch {
        return false;
      }
      return false;
    })();
    if (global.fileName) {
      this.fileName = global.fileName;
    }
    if (chkFromWeb) {
      render(window.__applize.render.clone());
    }
  }
}
