import { timeTest } from '../util/timeTest';
import { equalsEndPoint, getParams, urlParse } from './url';

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
    expect(equalsEndPoint(urlParse('/normal'), urlParse('/dashboard'))).toBe(
      false
    );
  });
});

describe('getParams', () => {
  it('single parameter', () => {
    expect(
      getParams('https://example.com/?src=https%3A%2F%2Faaa.com', ['src'])
    ).toStrictEqual({ src: 'https://aaa.com' });
  });
});

describe('urlParseTime', () => {
  expect(
    timeTest('urlParseTime', 500000, () => {
      urlParse('/article/some-test-article');
    })
  ).toBeLessThan(0.001);
});

describe('urlEqualsTime', () => {
  expect(
    timeTest('urlEqualsTime', 500000, () => {
      equalsEndPoint(
        { url: ['article', 'some-test-article'] },
        { url: ['article', 'different-test-article'] }
      );
    })
  ).toBeLessThan(0.0001);
});

describe('getParamsTime', () => {
  expect(
    timeTest('getParamsTime', 200000, () => {
      getParams('https://example.com/?src=https%3A%2F%2Faaa.com', ['src']);
    })
  ).toBeLessThan(0.01);
  expect(
    timeTest('getParamsURITime', 200000, () => {
      //expect(new URLSearchParams(new URL('https://example.com/?src=https%3A%2F%2Faaa.com').search).get('src')).toBe('https://aaa.com');
      new URLSearchParams(
        new URL('https://example.com/?src=https%3A%2F%2Faaa.com').search
      ).get('src');
    })
  ).toBeLessThan(0.1);
});
