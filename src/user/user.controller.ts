import { BaseController } from '../comman/base.controller';
import { IUserController } from './user.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { types } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUserService } from './service/user.service.interface';
import { HttpError } from '../error/http-error.class';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(types.Logger) private loggerService: ILogger,
		@inject(types.UserService) private userService: IUserService,
	) {
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

	async register({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.create(body);
		if (!result) {
			return next(new HttpError(422, 'User exist'));
		}

		this.ok(res, { email: result.email, id: result.id });
	}
}
