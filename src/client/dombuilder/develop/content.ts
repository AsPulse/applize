import { DomRenderer } from '../domrenderer';

export const content = (adb: DomRenderer) => {
  adb.build('div').in(v => {
    v('p').text('Lorem ipsum dolor sit amet,');
    v('p').text('consectetur adipiscing elit,');
    v('p').text(
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    );
    v('div').in(v => {
      v('s').in(v => v('b').text('This is inner!'));
    });
  });
};
