import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { injectable } from 'inversify';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor() {
		this.app = express();
		this.port = 8000;
	}

	public init(): void {
		this.server = this.app.listen(this.port, () => console.log('start server'));
	}
}
