import { IApplizeDOMBuilder } from './client/dombuilder';

export class Applize {
  addPage(page: (adb: IApplizeDOMBuilder) => void) {
    console.log(page.toString());
  }
}
