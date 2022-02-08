import { PageRoute } from './route';
import http from 'http';
import { IEndPoint, urlParse } from './url';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

interface IApplizeOptions {
  port: number;
  trailingSlash: 'RedirectWithSlash' | 'RedirectWithoutSlash' | 'NoChange';
}

export class Applize {
  routes: PageRoute[] = [];
  addPageRoute(route: PageRoute | undefined) {
    if (!route) return;
    this.routes.push(route);
  }

  run(options: Partial<IApplizeOptions>) {
    const server = http.createServer();
    console.log(this.routes);
    const renderedOption: IApplizeOptions = {
      port: options.port ?? 8080,
      trailingSlash: options.trailingSlash ?? 'NoChange',
    };

    server.on('request', (req, res) => {
      void (async () => {
        const ep = urlParse(req.url ?? '/');
        const route = await findRoute(this.routes, this.routes[0], ep);
        res.writeHead(route.returnCode, {
          'Content-Type': 'application/javascript',
        });
        res.end(
          await readFile(
            resolve(__dirname, 'pages', `${route.page.fileName}.js`)
          )
        );
      })();
    });

    server.listen(renderedOption.port);
  }
}

export async function findRoute(
  routes: PageRoute[],
  defaultValue: PageRoute,
  ep: IEndPoint
): Promise<PageRoute> {
  const routeDetectors = routes.map(async v => ({
    pageRoute: v,
    isExpected: await Promise.any(
      v.routers.map(async e =>
        (await e(ep)) ? Promise.resolve(true) : Promise.reject(false)
      )
    ).catch(() => false),
  }));
  try {
    return await Promise.any(
      routeDetectors.map(async v_1 =>
        (
          await v_1
        ).isExpected
          ? Promise.resolve((await v_1).pageRoute)
          : Promise.reject()
      )
    );
  } catch {
    return defaultValue;
  }
}
