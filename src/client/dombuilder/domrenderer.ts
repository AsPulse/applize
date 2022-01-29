import { IApplizeDomBuilder } from '.';

export class DomRenderer implements IApplizeDomBuilder {
  constructor(public targetElement: HTMLElement) {}
}
