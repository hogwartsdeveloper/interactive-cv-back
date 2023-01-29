import { BaseController } from '../comman/base.controller';
import { IUserController } from './user.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { types } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUserService } from './service/user.service.interface';
import { HttpError } from '../error/http-error.class';
import { ValidateMiddleware } from '../comman/validate.middleware';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../comman/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(types.Logger) private loggerService: ILogger,
		@inject(types.UserService) private userService: IUserService,
		@inject(types.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	/**
	 * @swagger
	 * /user/info:
	 *   get:
	 *     description: User info
	 *     tags: [User]
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: info
	 *         content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  id:
	 *                    type: integer
	 *                    description: The user id
	 *                  email:
	 *                    type: string
	 *                    description: The user email.
	 *     security:
	 *       - bearerAuth: []
	 */
	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userData = await this.userService.getInfo(user as string);
		this.ok(res, { id: userData?.id, email: userData?.email });
	}

	/**
	 * @swagger
	 * /user/login:
	 *    post:
	 *      description: Login to the application
	 *      tags: [User]
	 *      produces:
	 *       - application/json
	 *      requestBody:
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                email:
	 *                  type: string
	 *                  description: The user email
	 *                password:
	 *                  type: string
	 *                  description: The user password
	 *      responses:
	 *        200:
	 *          description: JWT
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  jwt:
	 *                    type: string
	 *                    description: The jsonwebtoken
	 */
	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validate(body);
		if (!result) {
			return next(new HttpError(401, 'User does not exist'));
		}
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));

		this.ok(res, { jwt });
	}

	/**
	 * @swagger
	 * /user/register:
	 *   post:
	 *     description: Registration to the application
	 *     tags: [User]
	 *     produces:
	 *       - application/json
	 *     requestBody:
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                email:
	 *                  type: string
	 *                  description: The user email.
	 *                name:
	 *                  type: string
	 *                  description: The user name.
	 *                password:
	 *                  type: string
	 *                  description: The user password.
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
	 *                    description: The user id
	 *                  email:
	 *                    type: string
	 *                    description: The user email
	 */
	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.create(body);
		if (!result) {
			return next(new HttpError(422, 'User exist'));
		}

		this.ok(res, { email: result.email, id: result.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((res, rej) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err) {
						rej(err);
					}
					res(token as string);
				},
			);
		});
	}
}
