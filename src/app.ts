import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { ILogger } from './logger/logger.interface';
import { types } from './types';
import { UserController } from './user/user.controller';
import { json } from 'body-parser';
import { ExceptionFilter } from './error/exception.filter';
import { AuthMiddleware } from './comman/auth.middleware';
import { ConfigService } from './config/config.service';
import { options } from '../swagger.config';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(types.Logger) private loggerService: ILogger,
		@inject(types.UserController) private userController: UserController,
		@inject(types.ExceptionFilter) private exceptionFilter: ExceptionFilter,
		@inject(types.ConfigService) private configService: ConfigService,
	) {
		this.app = express();
		this.port = 8000;
	}

	private useRoutes(): void {
		this.app.use('/user', this.userController.router);
	}

	private useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	private useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	private async useSwagger(): Promise<void> {
		const swaggerSpec = await swaggerJSDoc(options);
		this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	}

	public async init(): Promise<void> {
		await this.useSwagger();
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilter();
		this.server = this.app.listen(this.port, () =>
			this.loggerService.log('server started is port: ' + this.port),
		);
	}
}
