import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { types } from './types';
import { UserController } from './user/user.controller';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(types.Logger) private loggerService: ILogger,
		@inject(types.UserController) private userController: UserController,
	) {
		this.app = express();
		this.port = 8000;
	}

	private useRoutes(): void {
		this.app.use('/user', this.userController.router);
	}

	public init(): void {
		this.useRoutes();
		this.server = this.app.listen(this.port, () =>
			this.loggerService.log('server started is port: ' + this.port),
		);
	}
}
