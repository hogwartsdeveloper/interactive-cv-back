import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { types } from './types';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(@inject(types.Logger) private loggerService: ILogger) {
		this.app = express();
		this.port = 8000;
	}

	public init(): void {
		this.server = this.app.listen(this.port, () =>
			this.loggerService.log('server started is port: ' + this.port),
		);
	}
}
