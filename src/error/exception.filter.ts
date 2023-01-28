import { IExceptionFilter } from './exception.filter.interface';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { types } from '../types';
import { ILogger } from '../logger/logger.interface';
import { HttpError } from './http-error.class';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(types.Logger) private loggerService: ILogger) {}
	catch(err: HttpError | Error, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.loggerService.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.loggerService.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
