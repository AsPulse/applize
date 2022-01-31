import { IApplizeDOMBuilder } from '..';

export const content = (adb: IApplizeDOMBuilder) => {
  const data = adb.build('div', (div) => {
    return {
      paragraph1: div('p'),
      paragraph2: div('p'),
      paragraph3: div('p'),
      inner: div('div', (inner) => {
        return { text: inner('s', (bold) => bold('b')) };
      }),
    };
  });
  data.expose.paragraph1.element.textContent = 'Lorem ipsum dolor sit amet,';
  data.expose.paragraph2.element.textContent = 'consectetur adipiscing elit,';
  data.expose.paragraph3.element.textContent =
    'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  data.expose.inner.expose.text.expose.element.textContent = 'This is inner!';
};
