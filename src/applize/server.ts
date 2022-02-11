import { readFile } from 'fs/promises';
import { IncomingMessage, ServerResponse } from 'http';
import { resolve } from 'path';
import { findRoute, IApplizeOptions } from '.';
import { JSONStyle } from '../api/schema';
import { PageRoute } from './route';
import { equalsEndPoint, getParams, urlParse } from './url';

export async function serve(
  req: IncomingMessage,
  res: ServerResponse,
  option: IApplizeOptions,
  routes: PageRoute[],
  apiImplementation: {
    name: string;
    executor: (input: JSONStyle) => Promise<JSONStyle>;
  }[]
) {
  const start = performance.now();
  await serveExecute(req, res, option, routes, apiImplementation);
  const finish = performance.now();
  console.log(`Served! ${finish - start}ms: ${req.url ?? ''}`);
}

export async function serveExecute(
  req: IncomingMessage,
  res: ServerResponse,
  option: IApplizeOptions,
  routes: PageRoute[],
  apiImplementation: {
    name: string;
    executor: (input: JSONStyle) => Promise<JSONStyle>;
  }[]
) {
  if (!req.url) return;
  const url = req.url;
  const ep = urlParse(url ?? '/');

  const processPost = new Promise(resolve => {
    if (req.method === 'POST') {
      let data = '';
      req
        .on('data', chunk => {
          data += chunk;
        })
        .on('end', () => {
          void (async () => {
            //TODO: type check need!
            const input = JSON.parse(data) as unknown;
            const api = getParams(url, ['api']).api;
            if (!api) resolve(true);
            const impl = apiImplementation.find(v => v.name === api);
            if (!impl) {
              res.writeHead(501, {
                'Content-Type': '	application/json',
              });
              res.end('{}');
              resolve(true);
              return;
            }
            res.writeHead(200, {
              'Content-Type': '	application/json',
            });
            res.end(JSON.stringify(await impl.executor(input as JSONStyle)));
            resolve(true);
            return;
          })();
        });
    } else {
      resolve(false);
    }
  });

  if (await processPost) {
    return;
  }

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
