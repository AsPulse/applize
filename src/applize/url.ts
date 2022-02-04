interface IEndPoint {
  url: string[];
}

export function urlParse(url: string): IEndPoint {
  const cutParam = url.includes('?') ? url.substring(0, url.indexOf('?')) : url;
  const cutStart = cutParam.startsWith('/') ? cutParam.slice(1) : cutParam;
  const cutEnd = cutStart.endsWith('/') ? cutStart.slice(0,-1) : cutStart;
  return { url: cutEnd.split('/') }
}

export function equalsEndPoint(a: IEndPoint, b: IEndPoint): boolean {
  if ( a.url.length !== b.url.length ) return false;
  for ( let i = 0; i < a.url.length; i++ ) {
    if ( a.url[i] !== b.url[i] ) return false;
  }
  return true;
}
