import { equalsEndPoint, urlParse } from './url';

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

describe('equalsEndPoint', () => {
  it('true', () => {
    expect(equalsEndPoint(urlParse('/a'), urlParse('a'))).toBe(true);
    expect(equalsEndPoint(urlParse('a'), urlParse('a'))).toBe(true);
    expect(equalsEndPoint(urlParse('/a/'), urlParse('a/'))).toBe(true);
    expect(equalsEndPoint(urlParse('/a/'), urlParse('/a/'))).toBe(true);
    expect(equalsEndPoint(urlParse('/a/b'), urlParse('a/b'))).toBe(true);
    expect(equalsEndPoint(urlParse('/a/b'), urlParse('a/b/'))).toBe(true);
    expect(
      equalsEndPoint(urlParse('/a/b?params=none&some=equal'), urlParse('a/b/'))
    ).toBe(true);
  });
  it('false', () => {
    expect(equalsEndPoint(urlParse('/a'), urlParse('b'))).toBe(false);
    expect(equalsEndPoint(urlParse('/a'), urlParse('a/b'))).toBe(false);
    expect(equalsEndPoint(urlParse('a'), urlParse('/b'))).toBe(false);
    expect(equalsEndPoint(urlParse('/normal'), urlParse('/dashboard'))).toBe(false);
  });
});
