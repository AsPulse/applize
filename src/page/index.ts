import { IDOMRenderer } from '../domBuilder';

export type router = (url: string) => void;
export type render = (adb: IDOMRenderer) => void;

declare const global: { fileName?: string };

export class ApplizePage {
  fileName: string | null = null;
  constructor(public router: router, public render: render) {
    if ( global.fileName ) {
      this.fileName = global.fileName;
    }
  }
}
