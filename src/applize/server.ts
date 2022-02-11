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
  await serveExecute(url, res, option, routes);
  const finish = performance.now();
  console.log(`Served! ${finish - start}ms: ${url}`);
}

export async function serveExecute(
  url: string,
  res: ServerResponse,
  option: IApplizeOptions,
  routes: PageRoute[]
) {
  const ep = urlParse(url ?? '/');

  if (equalsEndPoint(ep, { url: ['favicon.ico'] })) {
    res.end();
    return;
  }

  if (equalsEndPoint(ep, option.rootEndPoint)) {
    if (getParams(url, ['entry']).entry) {
      res.writeHead(200, {
        'Content-Type': 'text/javascript',
      });
      res.end(await readFile(resolve(__dirname, 'entry', 'index.js')));
      return;
    }
    const route = await findRoute(
      routes,
      routes[0],
      urlParse(getParams(url, ['page']).page ?? '')
    );
    res.writeHead(route.returnCode, {
      'Content-Type': 'text/javascript',
    });
    res.end(
      await readFile(resolve(__dirname, 'pages', `${route.page.fileName}.js`))
    );
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/html',
  });
  res.end(await readFile(resolve(__dirname, 'entry', `index.html`)));
  return;
}
