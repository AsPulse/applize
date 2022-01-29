import { IApplizeDomBuilder } from '..';
import { DomRenderer } from '../domrenderer';

((adb: IApplizeDomBuilder) => {
  console.log('hello!');
})(new DomRenderer(document.body));
