import { BaseController } from '../comman/base.controller';
import { IUserController } from './user.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { types } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(types.Logger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
			},
		]);
	}
	info(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'Info');
	}

	login(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'Login');
	}

	register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'Register');
	}
}
