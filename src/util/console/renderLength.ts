/* eslint-disable no-control-regex */
export function renderLength(content: string): number {
  return [...content.replace(/\x1b\[(.*)m/g, '')]
    .map((v) => {
      if (v.match(/^[ｦ-ﾟ]*$/)) return 1;
      if (v.match(/^[\u2700-\u2bff]+$/u)) return 1;
      if (v.match(/^[\ufe00-\uffff]+$/u)) return 2;
      if (v.match(/^[\u2e00-\u9fff]+$/u)) return 2;
      if (v.match(/^[\u{20000}-\u{2ff00}]+$/u)) return 2;
      return 1;
    })
    .reduce<number>((a, b) => a + b, 0);
}
