import { PageRoute } from './route';
import http from 'http';
import { IEndPoint } from './url';
import { serve } from './server';
import { cwd } from 'process';
import type { JSONStyle, ServerAPISchema } from '../api/schema';

export interface IApplizeOptions {
  port: number;
  trailingSlash: 'RedirectWithSlash' | 'RedirectWithoutSlash' | 'NoChange';
  rootEndPoint: IEndPoint;
  distRoot: string;
}

export class Applize<APIType extends ServerAPISchema> {
  routes: PageRoute[] = [];
  apiImplementation: {
    name: string;
    executor: (input: JSONStyle) => Promise<JSONStyle>;
  }[] = [];

  addPageRoute(route: PageRoute | undefined) {
    if (!route) return;
    this.routes.push(route);
  }

  implementsAPI<ImplementingAPI extends keyof APIType>(
    name: ImplementingAPI,
    executor: (
      input: APIType[ImplementingAPI]['input']
    ) => Promise<APIType[ImplementingAPI]['output']>
  ) {
    this.apiImplementation.push({ name: name.toString(), executor });
  }

  run(options: Partial<IApplizeOptions>) {
    const server = http.createServer();
    const renderedOption: IApplizeOptions = {
      port: options.port ?? 8080,
      trailingSlash: options.trailingSlash ?? 'NoChange',
      rootEndPoint: options.rootEndPoint ?? { url: ['applize'] },
      distRoot: options.distRoot ?? cwd(),
    };

    server.on('request', (req, res) => {
      void (async () => {
        if (!req.url) return;
        await serve(
          req,
          res,
          renderedOption,
          this.routes,
          this.apiImplementation
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
