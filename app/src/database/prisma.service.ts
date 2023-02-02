import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { types } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(types.Logger) private loggerService: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$disconnect();
			this.loggerService.log('[PrismaService] Success connect db');
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error('[PrismaService] Error connect db: ' + e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
