import { ILocalController } from './local.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../comman/base.controller';
import { inject, injectable } from 'inversify';
import { types } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class LocalController extends BaseController implements ILocalController {
	constructor(@inject(types.Logger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/',
				method: 'post',
				func: this.add,
			},
			{
				path: '/',
				method: 'get',
				func: this.get,
			},
		]);
	}
	add(req: Request, res: Response, next: NextFunction): void {
		console.log(req.body);
		this.ok(res, 'add');
	}

	get(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'get');
	}
}
