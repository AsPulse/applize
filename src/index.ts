import { IApplizeDomBuilder } from './client/dombuilder';

export class Applize {
  addPage(page: (adb: IApplizeDomBuilder) => void) {
    console.log(page.toString());
  }
}
