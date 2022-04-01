import type { APITypesGeneral } from '../api/schema';
import type { ApplizePage } from '../page/index';
import { ApplizePageWithFile } from '../page/index';
import type { IEndPoint } from './url';
import { equalsEndPoint } from './url';
import { urlParse } from './urlParse';

export type TApplizeRouter = (url: IEndPoint) => Promise<boolean>;

export class PageRoute {
  routers: TApplizeRouter[] = [];
  returnCode = 200;

  private constructor(public page: ApplizePageWithFile) {}

  static fromPage<K extends APITypesGeneral>(
    page: ApplizePage<K>
  ): PageRoute | undefined {
    if (!page.fileName) {
      //TODO: warning about no filename
      return undefined;
    }
    return new PageRoute(new ApplizePageWithFile(page.fileName));
  }

  route(router: TApplizeRouter) {
    this.routers.push(router);
    return this;
  }

  urlRoute(url: string) {
    return this.route(v => Promise.resolve(equalsEndPoint(urlParse(url), v)));
  }

  variableUrlRoute(url: string) {
    return this.route(v =>
      Promise.resolve(equalsEndPoint(urlParse(url), v, true))
    );
  }

  code(code: number) {
    this.returnCode = code;
    return this;
  }
}
