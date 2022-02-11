import { ServerAPISchema } from '../api/schema';
import { ApplizePage } from '../page/index';
import { ApplizePageWithFile } from '../page/index';
import { IEndPoint } from './url';

export type TApplizeRouter = (url: IEndPoint) => Promise<boolean>;

export class PageRoute {
  routers: TApplizeRouter[] = [];
  returnCode = 200;

  private constructor(public page: ApplizePageWithFile) {}

  static fromPage<K extends ServerAPISchema>(
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

  code(code: number) {
    this.returnCode = code;
    return this;
  }
}
