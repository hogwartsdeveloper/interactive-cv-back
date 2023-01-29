import { ILocalController } from './local.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../comman/base.controller';
import { inject, injectable } from 'inversify';
import { types } from '../types';
import { ILogger } from '../logger/logger.interface';
import { ValidateMiddleware } from '../comman/validate.middleware';
import { LocalCreateDto } from './dto/local-create.dto';
import { AuthGuard } from '../comman/auth.guard';
import { ILocalService } from './service/local.service.interface';
import { HttpError } from '../error/http-error.class';

@injectable()
export class LocalController extends BaseController implements ILocalController {
	constructor(
		@inject(types.Logger) private loggerService: ILogger,
		@inject(types.LocalService) private localService: ILocalService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/',
				method: 'post',
				func: this.add,
				middlewares: [new ValidateMiddleware(LocalCreateDto), new AuthGuard()],
			},
			{
				path: '/',
				method: 'get',
				func: this.get,
			},
		]);
	}

	/**
	 * @swagger
	 * /local:
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
		next: NextFunction,
	): Promise<void> {
		const result = await this.localService.create(body);
		if (!result) {
			return next(new HttpError(422, 'Local exist'));
		}
		this.ok(res, { id: result.id, code: result.code, name: result?.name });
	}

	/**
	 * @swagger
	 * /local:
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
}
