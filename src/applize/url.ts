interface IEndPoint {
  url: string[];
}

export function urlParse(url: string): IEndPoint {
  const cutParam = url.includes('?') ? url.substring(0, url.indexOf('?')) : url;
  const cutStart = cutParam.startsWith('/') ? cutParam.slice(1) : cutParam;
  const cutEnd = cutStart.endsWith('/') ? cutStart.slice(0,-1) : cutStart;
  return { url: cutEnd.split('/') }
}
