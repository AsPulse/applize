import { PageRoute } from './route';
import http from 'http';

interface IApplizeOptions {
  port: number;
  trailingSlash: 'RedirectWithSlash' | 'RedirectWithoutSlash' | 'NoChange';
}
const defaultOption: IApplizeOptions = {
  port: 8080,
  trailingSlash: 'NoChange',
} as const;
export class Applize {
  routes: PageRoute[] = [];
  addPageRoute(route: PageRoute) {
    this.routes.push(route);
  }

  run(options: Partial<IApplizeOptions>) {
    const server = http.createServer();

    server.on('request', (req, res) => {});

    server.listen(options.port);
  }
}
