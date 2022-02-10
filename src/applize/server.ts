import { readFile } from 'fs/promises';
import { ServerResponse } from 'http';
import { resolve } from 'path';
import { findRoute, IApplizeOptions } from '.';
import { PageRoute } from './route';
import { equalsEndPoint, getParams, urlParse } from './url';

export async function serve(
  url: string,
  res: ServerResponse,
  option: IApplizeOptions,
  routes: PageRoute[]
) {
  const start = performance.now();
  const ep = urlParse(url ?? '/');

  if (equalsEndPoint(ep, { url: ['favicon.ico'] })) {
    res.end();
  }

  if (equalsEndPoint(ep, option.rootEndPoint)) {
    const route = await findRoute(
      routes,
      routes[0],
      urlParse(getParams(url, ['page']).page ?? '')
    );
    res.writeHead(route.returnCode, {
      'Content-Type': 'application/javascript',
    });
    res.end(
      await readFile(resolve(__dirname, 'pages', `${route.page.fileName}.js`))
    );
  }

  const finish = performance.now();

  console.log(`Served! ${finish - start}ms: ${url}`);
}
