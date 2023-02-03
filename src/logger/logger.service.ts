import { ILogger } from './logger.interface';
import { Logger } from 'tslog';
import { injectable } from 'inversify';

@injectable()
export class LoggerService implements ILogger {
	public logger: Logger;

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		});
	}

	error(...arg: unknown[]): void {
		this.logger.error(...arg);
	}

	log(...arg: unknown[]): void {
		this.logger.info(...arg);
	}

	warn(...arg: unknown[]): void {
		this.logger.warn(...arg);
	}
}
