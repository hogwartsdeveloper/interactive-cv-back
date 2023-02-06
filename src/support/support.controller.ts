import { ISupportController } from "./support.controller.interface";
import { NextFunction, Request, Response } from "express";
import { BaseController } from "../comman/base.controller";
import { inject, injectable } from "inversify";
import { types } from "../types";
import { LoggerService } from "../logger/logger.service";

@injectable()
export class SupportController
  extends BaseController
  implements ISupportController
{
  constructor(@inject(types.Logger) private loggerService: LoggerService) {
    super(loggerService);
    this.bindRoutes([
      {
        path: "/pdf",
        method: "get",
        func: this.getPDF,
      },
    ]);
  }
  getPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
    return Promise.resolve(undefined);
  }
}
