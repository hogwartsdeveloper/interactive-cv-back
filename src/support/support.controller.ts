import { ISupportController } from "./support.controller.interface";
import { NextFunction, Request, Response } from "express";
import { BaseController } from "../comman/base.controller";
import { inject, injectable } from "inversify";
import { types } from "../types";
import { LoggerService } from "../logger/logger.service";
import { SupportService } from "./service/support.service";
import { isURL } from "class-validator";
import { HttpError } from "../error/http-error.class";

@injectable()
export class SupportController
  extends BaseController
  implements ISupportController
{
  constructor(
    @inject(types.Logger) private loggerService: LoggerService,
    @inject(types.SupportService) private supportService: SupportService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: "/pdf",
        method: "get",
        func: this.getPDF,
      },
    ]);
  }
  async getPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
    const url = req.query.url as string;
    if (!url) {
      return next(new HttpError(404, "Url not found"));
    }
    if (!isURL(url)) {
      return next(new HttpError(404, "Url not specified"));
    }

    try {
      const pdf = await this.supportService.printPDF(url);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length,
      });
      this.ok(res, pdf);
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.error(e.message);
        return next(new HttpError(500, "Error print PDF"));
      }
    }
  }
}
