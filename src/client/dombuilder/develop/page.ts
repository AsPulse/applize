import { IApplizeDomBuilder } from '..';
import { DomRenderer } from '../domrenderer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
((_adb: IApplizeDomBuilder) => {
  console.log('hello!');
})(new DomRenderer(document.body));
