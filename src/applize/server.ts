import type { IncomingMessage, ServerResponse } from 'http';
import { resolve } from 'path';
import type { Applize, IApplizeOptions } from '.';
import { findRoute } from '.';
import type { APITypesGeneral, JSONStyle } from '../api/schema';
import type { ICookie, ISetCookie } from './cookie';
import type { StaticFileManager } from './staticfile';
import { equalsEndPoint, getParams } from './url';
import { urlParse } from './urlParse';
import type * as T from 'io-ts';

export interface ILog {
  url: string;
  time: number;
  userAgent: string;
  remoteAddress: string | undefined;
  code: number;
}

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
  const serve = await serveExecute(req, res, option, instance);
  const finish = performance.now();
  option.logger({
    url: req.url ?? '',
    time: finish - start,
    userAgent: req.headers['user-agent'] ?? 'unknown',
    remoteAddress: (v => Array.isArray(v) ? v.join(', ') : v)(req.headers['x-forwarded-for']) ?? req.socket?.remoteAddress,
    code: serve.code
  });
}
function JSONParse<A, B, C>(
  data: string,
  type: T.Type<A, B, C>
): unknown | null {
  try {
    const object: unknown = JSON.parse(data);
    if (type.is(object)) {
      return object;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
export async function serveExecute<
  T extends APITypesGeneral,
  U extends Record<string, unknown>
>(
  req: IncomingMessage,
  res: ServerResponse,
  option: IApplizeOptions,
  instance: Applize<T, U>
): Promise<{
  code: number
}> {
  if (!req.url) throw 'Request didnt have url!';
  const url = req.url;
  const ep = urlParse(url ?? '/');

  const processPost = new Promise<{
    processed: true,
    code: number,
  } | {
    processed: false
  }>(resolve => {
    if (req.method === 'POST') {
      let data = '';
      req
        .on('data', chunk => {
          data += chunk;
        })
        .on('end', () => {
          void (async () => {
            const api = getParams(url, ['api']).api;
            if (!api) {
              res.writeHead(404, {
                'Content-Type': '	application/json',
              });
              res.end('404 Not Found');
              resolve({
                processed: true,
                code: 404,
              });
            }
            const impl = instance
              .privates()
              .apiImplementation.find(v => v.name === api);
            const type = Object.entries(instance.apiSchema).find(
              v => v[0] === api
            );
            if (!impl || !type) {
              res.writeHead(501, {
                'Content-Type': '	application/json',
              });
              res.end('{}');
              resolve({
                processed: true,
                code: 501,
              });
              return;
            }
            const input = JSONParse(data, type[1].input);
            if (input === null) {
              res.writeHead(400, {
                'Content-Type': '	application/json',
              });
              res.end();
              resolve({
                processed: true,
                code: 400,
              });
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
              cookie,
              req
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
            resolve({
              processed: true,
              code: 200
            });
            return;
          })();
        });
    } else {
      resolve({
        processed: false
      });
    }
  });

  const post = await processPost;
  if (post.processed) {
    return {
      code: post.code
    };
  }

  const staticRouteLookup = instance
    .privates()
    .staticRoutes.find(v => v.routers.find(v => v(ep)) !== undefined);
  if (staticRouteLookup !== undefined) {
    const code = await endWithStaticFile(
      resolve(__dirname, 'public', staticRouteLookup.filePath),
      staticRouteLookup.returnCode,
      staticRouteLookup.contentTypeValue,
      req,
      res,
      instance.privates().sfm
    );
    return { code };
  }

  if (equalsEndPoint(ep, { url: ['favicon.ico'] })) {
    res.writeHead(404);
    res.end();
    return { code: 404 };
  }

  if (equalsEndPoint(ep, option.rootEndPoint)) {
    if (getParams(url, ['entry']).entry) {
      const code = await endWithStaticFile(
        resolve(__dirname, 'entry', 'index.js'),
        200,
        'text/javascript',
        req,
        res,
        instance.privates().sfm
      );
      return { code };
    }
    const route = await findRoute(
      instance.privates().routes,
      instance.privates().routes[0],
      urlParse(getParams(url, ['page']).page ?? '')
    );

    const code = await endWithStaticFile(
      resolve(__dirname, 'pages', `${route.page.fileName}.js`),
      route.returnCode,
      'text/javascript',
      req,
      res,
      instance.privates().sfm
    );
    return { code };
  }

  const code = await endWithStaticFile(
    resolve(__dirname, 'entry', `index.html`),
    200,
    'text/html',
    req,
    res,
    instance.privates().sfm
  );
  return { code };
}

export async function endWithStaticFile(
  path: string,
  returnCode: number,
  contentType: string,
  req: IncomingMessage,
  res: ServerResponse,
  sfm: StaticFileManager
): Promise<number> {
  const etag = req.headers['if-none-match'];
  const acceptEncodingRaw = req.headers['accept-encoding'];
  const acceptEncoding =
    typeof acceptEncodingRaw === 'string'
      ? acceptEncodingRaw.split(',').map(v => v.trim())
      : [];
  const file = await sfm.readFile(path);
  const cached = etag === file.hash;
  const code = cached ? 304 : returnCode;
  if (cached) {
    res.writeHead(code, {
      'Content-Type': contentType,
      ETag: file.hash,
    });
    res.end();
    return code;
  } else {
    if (acceptEncoding.includes('br')) {
      res.writeHead(code, {
        'Content-Type': contentType,
        'Content-Encoding': 'br',
        ETag: file.hash,
      });
      res.end(file.data.brotli);
      return code;
    }
    if (acceptEncoding.includes('gzip')) {
      res.writeHead(code, {
        'Content-Type': contentType,
        'Content-Encoding': 'gzip',
        ETag: file.hash,
      });
      res.end(file.data.gzip);
      return code;
    }
    res.writeHead(code, {
      'Content-Type': contentType,
      ETag: file.hash,
    });
    res.end(file.data.original);
    return code;
  }
}
