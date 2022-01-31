import { DomRenderer } from '../domrenderer';

export const content = (adb: DomRenderer) => {
  const data = adb.build('div').in((v) => {
    return {
      paragraph1: v('p'),
      paragraph2: v('p'),
      paragraph3: v('p'),
      inner: v('div').in((v) => {
        return { text: v('s').in((v) => v('b')) };
      }),
    };
  });
  data.expose.paragraph1.element.textContent = 'Lorem ipsum dolor sit amet,';
  data.expose.paragraph2.element.textContent = 'consectetur adipiscing elit,';
  data.expose.paragraph3.element.textContent =
    'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  data.expose.inner.expose.text.expose.element.textContent = 'This is inner!';
};
