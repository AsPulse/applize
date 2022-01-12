export function renderLength(content: string): number {
  return [...content].map(v => {
    if( v.match(/^[ｦ-ﾟ]*$/) ) return 1;
    // eslint-disable-next-line no-control-regex
    if( v.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ) return 2;
    return 1;
  }).reduce<number>((a, b) => a + b, 0);
}
