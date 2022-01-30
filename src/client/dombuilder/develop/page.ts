import { IApplizeDOMBuilder } from '..';
import { DomRenderer } from '../domrenderer';


document.addEventListener('DOMContentLoaded', () => {
  ((adb: IApplizeDOMBuilder) => {
      const data = adb.build('div', div => {
        return {
          paragraph1: div('p', () => ({})),
          paragraph2: div('p', () => ({})),
          paragraph3: div('p', () => ({})),
        };
      });
      data.expose.paragraph1.element.textContent = 'Lorem ipsum dolor sit amet,';
      data.expose.paragraph2.element.textContent = 'consectetur adipiscing elit,';
      data.expose.paragraph3.element.textContent = 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  })(new DomRenderer(document.body));
});
