import { urlParse } from './url';

describe('urlParser', () => {
  it('without-parameters', () => {
    expect(urlParse('/a')).toStrictEqual({ url: ['a'] });
    expect(urlParse('a')).toStrictEqual({ url: ['a'] });
    expect(urlParse('/a/')).toStrictEqual({ url: ['a'] });
    expect(urlParse('/a/b')).toStrictEqual({ url: ['a', 'b'] });
    expect(urlParse('a/b')).toStrictEqual({ url: ['a', 'b'] });
    expect(urlParse('a/b/')).toStrictEqual({ url: ['a', 'b'] });
  });
  it('with-parameters', () => {
    expect(urlParse('/a?params=aaa')).toStrictEqual({ url: ['a'] });
    expect(urlParse('a?params=aaa')).toStrictEqual({ url: ['a'] });
    expect(urlParse('/a/?params=aaa')).toStrictEqual({ url: ['a'] });
    expect(urlParse('/a/b?params=aaa')).toStrictEqual({ url: ['a', 'b'] });
    expect(urlParse('a/b?params=aaa')).toStrictEqual({ url: ['a', 'b'] });
    expect(urlParse('a/b/?params=aaa')).toStrictEqual({ url: ['a', 'b'] });
  });
});
