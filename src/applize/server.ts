import { IncomingMessage, ServerResponse } from 'http';
import { resolve } from 'path';
import { findRoute, IApplizeOptions } from '.';
import { JSONStyle } from '../api/schema';
import { PageRoute } from './route';
import { StaticFileManager } from './staticfile';
import { equalsEndPoint, getParams, urlParse } from './url';

export async function serve(
  req: IncomingMessage,
  res: ServerResponse,
  option: IApplizeOptions,
  routes: PageRoute[],
  apiImplementation: {
    name: string;
    executor: (input: JSONStyle) => Promise<JSONStyle>;
  }[],
  sfm: StaticFileManager
) {
  const start = performance.now();
  await serveExecute(req, res, option, routes, apiImplementation, sfm);
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
  }[],
  sfm: StaticFileManager
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
      await endWithStaticFile(
        resolve(__dirname, 'entry', 'index.js'),
        200,
        'text/javascript',
        req,
        res,
        sfm
      );
      return;
    }
    const route = await findRoute(
      routes,
      routes[0],
      urlParse(getParams(url, ['page']).page ?? '')
    );

    await endWithStaticFile(
      resolve(__dirname, 'pages', `${route.page.fileName}.js`),
      route.returnCode,
      'text/javascript',
      req,
      res,
      sfm
    );
    return;
  }

  await endWithStaticFile(
    resolve(__dirname, 'entry', `index.html`),
    200,
    'text/html',
    req,
    res,
    sfm
  );
  return;
}

export async function endWithStaticFile(
  path: string,
  returnCode: number,
  contentType: string,
  req: IncomingMessage,
  res: ServerResponse,
  sfm: StaticFileManager
): Promise<void> {
  const etag = req.headers['if-none-match'];
  const acceptEncodingRaw = req.headers['accept-encoding'];
  const acceptEncoding =
    typeof acceptEncodingRaw === 'string'
      ? acceptEncodingRaw.split(',').map(v => v.trim())
      : [];
  const file = await sfm.readFile(path);
  const cached = etag === file.hash;
  if (cached) {
    res.writeHead(cached ? 304 : returnCode, {
      'Content-Type': contentType,
      ETag: file.hash,
    });
    res.end();
  } else {
    if (acceptEncoding.includes('br')) {
      res.writeHead(cached ? 304 : returnCode, {
        'Content-Type': contentType,
        'Content-Encoding': 'br',
        ETag: file.hash,
      });
      res.end(file.data.brotli);
      return;
    }
    if (acceptEncoding.includes('gzip')) {
      res.writeHead(cached ? 304 : returnCode, {
        'Content-Type': contentType,
        'Content-Encoding': 'gzip',
        ETag: file.hash,
      });
      res.end(file.data.gzip);
      return;
    }
    res.writeHead(cached ? 304 : returnCode, {
      'Content-Type': contentType,
      ETag: file.hash,
    });
    res.end(file.data.original);
  }
}
