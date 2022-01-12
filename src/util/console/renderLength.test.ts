import { renderLength } from './renderLength';

describe('renderLength', () => {
  it('normalLetter', () => {
    expect(renderLength('Hello')).toBe(5);
    expect(renderLength('Hello!')).toBe(6);
    expect(renderLength('Hello World')).toBe(11);
    expect(renderLength('⬢Hello')).toBe(6);
  });
  it('hiragana', () => {
    expect(renderLength('ああああ')).toBe(8);
    expect(renderLength('𠮷')).toBe(2);
  });
  it('katakana', () => {
    expect(renderLength('マイクテスト')).toBe(12);
    expect(renderLength('ゼンカクカタカナ')).toBe(16);
  });
  it('halfKatakana', () => {
    expect(renderLength('ﾏｲｸﾃｽﾄ')).toBe(6);
    expect(renderLength('ﾊﾝｶｸｶﾀｶﾅ')).toBe(8);
  });
  it('cross', () => {
    expect(renderLength('こんにちは世界！!, Yesｱｲｳｴｵ')).toBe(28);
  });
});
