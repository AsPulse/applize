import { colors, decorate, symbols } from './consoleCommunicater';
import { renderLength } from './renderLength';

describe('renderLength', () => {
  it('normalLetter', () => {
    expect(renderLength('Hello')).toBe(5);
    expect(renderLength('Hello!')).toBe(6);
    expect(renderLength('Hello World!')).toBe(12);
    expect(renderLength('⬢Hello')).toBe(6);
  });
  it('symbol', () => {
    expect(renderLength('!')).toBe(1);
    expect(renderLength('！')).toBe(2);
    expect(renderLength('⬢')).toBe(1);
  });
  it('hiragana', () => {
    expect(renderLength('ああああ')).toBe(8);
    expect(renderLength('ああああ！')).toBe(10);
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
  it('controlletter', () => {
    expect(renderLength(decorate(colors.white, colors.pink, true))).toBe(0);
    expect(
      renderLength(decorate(colors.white, colors.pink, true) + 'あいうAbc')
    ).toBe(9);
  });
  it('cross', () => {
    expect(renderLength('こんにちは世界！!, Yesｱｲｳｴｵ')).toBe(27);
    expect(renderLength(decorate(colors.pink, undefined, true) + symbols.hexagon + ' ApplizeBuilder' + decorate())).toBe(16);
  });
});
