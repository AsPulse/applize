import { DomRenderer } from '../domrenderer';
import { content } from './content';

const program = `document.addEventListener('DOMContentLoaded', () => {
  (${content.toString()})(new (${DomRenderer.toString()})(document.body));
})`;

eval(program);
console.log(program);
