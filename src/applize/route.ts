import { ApplizePage } from '..';

export type TApplizeRouter = ((url: string) => Promise<boolean>);

export class ApplizeRoute {
  routers: TApplizeRouter[] = [];
  returnCode = 200;

  constructor(public page: ApplizePage) {}

  route(router: TApplizeRouter) {
    this.routers.push(router);
    return this;
  }

  code(code: number) {
    this.returnCode = code;
    return this;
  }
}
