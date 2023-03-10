import { ILocalController } from "./local.controller.interface";
import { NextFunction, Request, Response } from "express";
import { BaseController } from "../comman/base.controller";
import { inject, injectable } from "inversify";
import { types } from "../types";
import { ILogger } from "../logger/logger.interface";
import { ValidateMiddleware } from "../comman/validate.middleware";
import { LocalCreateDto } from "./dto/local-create.dto";
import { AuthGuard } from "../comman/auth.guard";
import { ILocalService } from "./service/local.service.interface";
import { HttpError } from "../error/http-error.class";
import { RoleGuard } from "../comman/role.guard";
import { LocalUpdateDto } from "./dto/local-update.dto";
import { Lang } from "./model/local.model";

@injectable()
export class LocalController
  extends BaseController
  implements ILocalController
{
  constructor(
    @inject(types.Logger) private loggerService: ILogger,
    @inject(types.LocalService) private localService: ILocalService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: "/",
        method: "post",
        func: this.add,
        middlewares: [
          new ValidateMiddleware(LocalCreateDto),
          new AuthGuard(),
          new RoleGuard(),
        ],
      },
      {
        path: "/",
        method: "get",
        func: this.get,
      },
      {
        path: "/:lang",
        method: "get",
        func: this.getLang,
      },
      {
        path: "/",
        method: "delete",
        func: this.remove,
        middlewares: [new AuthGuard(), new RoleGuard()],
      },
      {
        path: "/",
        method: "patch",
        func: this.update,
        middlewares: [
          new ValidateMiddleware(LocalUpdateDto),
          new AuthGuard(),
          new RoleGuard(),
        ],
      },
    ]);
  }

  /**
   * @swagger
   * /api/local:
   *   post:
   *     description: Add local
   *     tags: [Local]
   *     produces:
   *       - application/json
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                code:
   *                  type: string
   *                  description: The local code.
   *                name:
   *                  type: object
   *                  properties:
   *                    en:
   *                      type: string
   *                    kz:
   *                      type: string
   *                    ru:
   *                      type: string
   *     responses:
   *       200:
   *         description: registration
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  id:
   *                    type: integer
   *                    description: The local id
   *                  code:
   *                    type: string
   *                    description: The local code
   *                  name:
   *                    type: object
   *                    properties:
   *                      id:
   *                        type: integer
   *                      en:
   *                        type: string
   *                      kz:
   *                        type: string
   *                      ru:
   *                        type: string
   *                      localId:
   *                        type: integer
   *     security:
   *       - bearerAuth: []
   */
  async add(
    { body }: Request<{}, {}, LocalCreateDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.localService.create(body);
    if (!result) {
      return next(new HttpError(422, "Local exist"));
    }
    this.ok(res, { id: result.id, code: result.code, name: result?.name });
  }

  /**
   * @swagger
   * /api/local:
   *   get:
   *     description: Get all local
   *     tags: [Local]
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: info
   *         content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  type: object
   *                  properties:
   *                    id:
   *                      type: integer
   *                      description: The local id
   *                    code:
   *                      type: string
   *                      description: The local code
   *                    name:
   *                      type: object
   *                      properties:
   *                        id:
   *                          type: integer
   *                        en:
   *                          type: string
   *                        kz:
   *                          type: string
   *                        ru:
   *                          type: string
   *                        localId:
   *                          type: integer
   */
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    const result = await this.localService.getAll();
    this.ok(res, { result });
  }

  /**
   * @swagger
   * /api/local/{lang}:
   *   get:
   *     description: get local
   *     tags: [Local]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: lang
   *         description: Local lang
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: get local lang
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  code:
   *                    type: string
   *                    description: The local code
   *                  lang:
   *                    type: string
   *                    description: The local lang value
   */
  async getLang(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const lang = req.params?.lang;
    if (lang !== "en" && lang !== "kz" && lang !== "ru") {
      return next(new HttpError(404, "Lang not found"));
    }
    const result = await this.localService.get(lang as Lang);
    this.ok(res, result);
  }

  /**
   * @swagger
   * /api/local:
   *   delete:
   *     description: delete local
   *     tags: [Local]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Local id
   *         in: query
   *         required: true
   *         type: number
   *     responses:
   *       200:
   *         description: registration
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  id:
   *                    type: integer
   *                    description: The local id
   *                  code:
   *                    type: string
   *                    description: The local code
   *                  name:
   *                    type: object
   *                    properties:
   *                      id:
   *                        type: integer
   *                      en:
   *                        type: string
   *                      kz:
   *                        type: string
   *                      ru:
   *                        type: string
   *                      localId:
   *                        type: integer
   *     security:
   *       - bearerAuth: []
   */
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    const localId = req.query?.id;
    if (!localId) {
      return next(new HttpError(404, "id parameter not found"));
    }
    try {
      const result = await this.localService.remove(+localId);
      this.ok(res, { id: result?.id, code: result?.code, name: result?.name });
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.error(e.message);
        return next(new HttpError(500, "Error delete"));
      }
    }
  }

  /**
   * @swagger
   * /api/local:
   *   patch:
   *     description: Update local
   *     tags: [Local]
   *     produces:
   *       - application/json
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                id:
   *                  type: number
   *                  description: The local id
   *                code:
   *                  type: string
   *                  description: The local code.
   *                name:
   *                  type: object
   *                  properties:
   *                    en:
   *                      type: string
   *                    kz:
   *                      type: string
   *                    ru:
   *                      type: string
   *     responses:
   *       200:
   *         description: registration
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  id:
   *                    type: integer
   *                    description: The local id
   *                  code:
   *                    type: string
   *                    description: The local code
   *                  name:
   *                    type: object
   *                    properties:
   *                      id:
   *                        type: integer
   *                      en:
   *                        type: string
   *                      kz:
   *                        type: string
   *                      ru:
   *                        type: string
   *                      localId:
   *                        type: integer
   *     security:
   *       - bearerAuth: []
   */
  async update(
    { body }: Request<{}, {}, LocalUpdateDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.localService.update(body);
    if (!result) {
      return next(new HttpError(404, "Local update error"));
    }
    this.ok(res, { id: result.id, code: result.code, name: result?.name });
  }
}
