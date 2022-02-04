import { PageRoute } from './route';
import http from 'http';
import { urlParse } from './url';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

interface IApplizeOptions {
  port: number;
  trailingSlash: 'RedirectWithSlash' | 'RedirectWithoutSlash' | 'NoChange';
}

export class Applize {
  routes: PageRoute[] = [];
  addPageRoute(route: PageRoute | undefined) {
    if(!route) return;
    this.routes.push(route);
  }

  run(options: Partial<IApplizeOptions>) {
    const server = http.createServer();

    const renderedOption: IApplizeOptions = {
      port: options.port ?? 8080,
      trailingSlash: options.trailingSlash ?? 'NoChange',
    };

    server.on('request', (req, res) => {
      void (async () => {
        const ep = urlParse(req.url ?? '/');
        const route = this.routes.find(v => v.routers.some(v => v(ep))) ?? this.routes[0];
        res.writeHead(route.returnCode, {'Content-Type': 'application/javascript'});
        res.end(await readFile(resolve('pages', route.page.fileName)));
      })();
    });

    server.listen(renderedOption.port);
  }
}
