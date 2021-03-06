import type { BetterObjectConstructor } from '../util/betterObjectConstructor';

declare const Object: BetterObjectConstructor;

export interface IEndPoint {
  url: string[];
}

export function equalsEndPoint(
  a: IEndPoint,
  b: IEndPoint,
  variable = false
): boolean {
  if (a.url.length !== b.url.length) return false;
  for (let i = 0; i < a.url.length; i++) {
    if (variable && b.url[i] !== '' && a.url[i].startsWith(':')) continue;
    if (a.url[i] !== b.url[i]) return false;
  }
  return true;
}

export function getParams<U extends string>(
  url: string,
  paramSchema: U[]
): { [P in U]: string | undefined } {
  const splitted = url.split('?');
  if (splitted.length < 2) {
    return Object.fromEntries(paramSchema.map(v => [v, undefined]));
  }
  const params = splitted[1].split('&').map(v => v.split('='));
  return Object.fromEntries(
    paramSchema.map<[U, string | undefined]>(v => [
      v,
      decodeGetParam(params.find(e => v === e[0])?.at(1)),
    ])
  );
}

function decodeGetParam(url: string | undefined): string | undefined {
  if (url === undefined) return undefined;
  return decodeURIComponent(url);
}
