import { IncomingMessage, ServerResponse } from 'http';
import { resolve } from 'path';
import { Applize, findRoute, IApplizeOptions } from '.';
import { APITypesGeneral, JSONStyle } from '../api/schema';
import { ICookie, ISetCookie } from './cookie';
import { StaticFileManager } from './staticfile';
import { equalsEndPoint, getParams } from './url';
import { urlParse } from './urlParse';

export async function serve<
  T extends APITypesGeneral,
  U extends Record<string, unknown>
>(
  req: IncomingMessage,
  res: ServerResponse,
  option: IApplizeOptions,
  instance: Applize<T, U>
) {
  const start = performance.now();
  await serveExecute(req, res, option, instance);
  const finish = performance.now();
  console.log(`Served! ${finish - start}ms: ${req.url ?? ''}`);
}

export async function serveExecute<
  T extends APITypesGeneral,
  U extends Record<string, unknown>
>(
  req: IncomingMessage,
  res: ServerResponse,
  option: IApplizeOptions,
  instance: Applize<T, U>
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
            const impl = instance
              .privates()
              .apiImplementation.find(v => v.name === api);
            if (!impl) {
              res.writeHead(501, {
                'Content-Type': '	application/json',
              });
              res.end('{}');
              resolve(true);
              return;
            }

            const setCookie: ISetCookie[] = [];
            let parsedCookie: ICookie[] | null = null;
            function cookie(key: string): ICookie | null;
            function cookie(data: ISetCookie): void;
            function cookie(
              data: string | ISetCookie
            ): (ICookie | null) | void {
              if (typeof data === 'string') {
                if (parsedCookie === null) {
                  parsedCookie = (req.headers.cookie?.split('; ') ?? [])
                    .map(v => v.split('='))
                    .map(v => ({
                      key: v[0],
                      value: v[1],
                    }));
                }
                return parsedCookie.find(v => v.key === data) ?? null;
              } else {
                setCookie.push(data);
                return;
              }
            }
            const apiResult = await impl.executor(
              input as JSONStyle,
              instance.privates().plugin,
              cookie
            );
            res.writeHead(200, [
              ['Content-Type', '	application/json'],
              ...setCookie.map(v => [
                'Set-Cookie',
                [
                  `${v.key}=${v.value}`,
                  ...(v.maxAge ? [`Max-Age=${v.maxAge}`] : []),
                  `SameSite=${v.sameSite}`,
                  ...(v.domain ? [`Domain=${v.domain}`] : []),
                  ...(v.path ? [`Path=${v.path}`] : []),
                  ...(v.httpOnly ? [`HttpOnly`] : []),
                  ...(v.secure ? [`Secure`] : []),
                ].join('; '),
              ]),
            ]);
            res.end(JSON.stringify(apiResult));
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
        instance.privates().sfm
      );
      return;
    }
    const route = await findRoute(
      instance.privates().routes,
      instance.privates().routes[0],
      urlParse(getParams(url, ['page']).page ?? '')
    );

    await endWithStaticFile(
      resolve(__dirname, 'pages', `${route.page.fileName}.js`),
      route.returnCode,
      'text/javascript',
      req,
      res,
      instance.privates().sfm
    );
    return;
  }

  await endWithStaticFile(
    resolve(__dirname, 'entry', `index.html`),
    200,
    'text/html',
    req,
    res,
    instance.privates().sfm
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
