import { PageRoute } from './route';
import http from 'http';
import { IEndPoint } from './url';
import { serve } from './server';

export interface IApplizeOptions {
  port: number;
  trailingSlash: 'RedirectWithSlash' | 'RedirectWithoutSlash' | 'NoChange';
  rootEndPoint: IEndPoint;
}

export class Applize {
  routes: PageRoute[] = [];
  addPageRoute(route: PageRoute | undefined) {
    if (!route) return;
    this.routes.push(route);
  }

  run(options: Partial<IApplizeOptions>) {
    const server = http.createServer();
    const renderedOption: IApplizeOptions = {
      port: options.port ?? 8080,
      trailingSlash: options.trailingSlash ?? 'NoChange',
      rootEndPoint: options.rootEndPoint ?? { url: ['applize'] },
    };

    server.on('request', (req, res) => {
      void (async () => {
        if (!req.url) return;
        await serve(req.url, res, renderedOption, this.routes);
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
