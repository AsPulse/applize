import { ApplizePage } from '..';
import { ApplizePageWithFile } from '../page';
import { IEndPoint } from './url';

export type TApplizeRouter = (url: IEndPoint) => Promise<boolean>;

export class PageRoute {
  routers: TApplizeRouter[] = [];
  returnCode = 200;

  private constructor(public page: ApplizePageWithFile) {}

  static fromPage(page: ApplizePage): PageRoute | undefined {
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
