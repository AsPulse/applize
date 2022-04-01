import type { PageRoute } from './route';
import http from 'http';
import type { IEndPoint } from './url';
import { serve } from './server';
import { cwd } from 'process';
import type { APITypesGeneral, JSONStyle } from '../api/schema';
import { StaticFileManager } from './staticfile';
import type { ICookie, ISetCookie } from './cookie';
import type * as T from 'io-ts';

export interface IApplizeOptions {
  port: number;
  trailingSlash: 'RedirectWithSlash' | 'RedirectWithoutSlash' | 'NoChange';
  rootEndPoint: IEndPoint;
  distRoot: string;
}

export class Applize<
  APITypes extends APITypesGeneral,
  PluginType extends Record<string, unknown> = Record<string, never>
> {
  constructor(public apiSchema: APITypes) {}
  private routes: PageRoute[] = [];
  private apiImplementation: {
    name: string;
    executor: (
      input: JSONStyle,
      plugin: <T extends keyof PluginType>(name: T) => Promise<PluginType[T]>,
      cookie: {
        (key: string): ICookie | null;
        (data: ISetCookie): void;
      }
    ) => Promise<JSONStyle>;
  }[] = [];
  private sfm = new StaticFileManager();

  //Plugins-----
  private plugins: Partial<{
    [P in keyof PluginType]: {
      promise: Promise<PluginType[P]>;
      resolver: (data: PluginType[P]) => void;
    };
  }> = {};
  pluginReady<T extends keyof PluginType>(
    name: T,
    func: () => Promise<PluginType[T]>
  ) {
    if (!(name in this.plugins)) {
      let resolver: (data: PluginType[T]) => void = () => undefined;
      const promise = new Promise<PluginType[T]>(
        resolve => (resolver = resolve)
      );
      this.plugins[name] = {
        promise,
        resolver,
      };
    }
    void (async () => {
      this.plugins[name]?.resolver(await func());
    })();
  }
  private plugin = <T extends keyof PluginType>(
    name: T
  ): Promise<PluginType[T]> => {
    const d = this.plugins[name];
    if (d !== undefined) {
      return d.promise;
    }
    let resolver: (data: PluginType[T]) => void = () => undefined;
    const promise = new Promise<PluginType[T]>(resolve => (resolver = resolve));
    this.plugins[name] = {
      promise,
      resolver,
    };
    return promise;
  };
  //Plugins-----
  privates() {
    return {
      apiImplementation: this.apiImplementation,
      routes: this.routes,
      sfm: this.sfm,
      plugin: this.plugin,
    };
  }

  addPageRoute(route: PageRoute | undefined) {
    if (!route) return;
    this.routes.push(route);
  }

  implementAPI<ImplementingAPI extends keyof APITypes>(
    name: ImplementingAPI,
    executor: (
      input: T.TypeOf<APITypes[ImplementingAPI]['input']>,
      plugin: <T extends keyof PluginType>(name: T) => Promise<PluginType[T]>,
      cookie: {
        (key: string): ICookie | null;
        (data: ISetCookie): void;
      }
    ) => Promise<T.TypeOf<APITypes[ImplementingAPI]['output']>>
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
        await serve(req, res, renderedOption, this);
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
