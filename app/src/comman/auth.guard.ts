import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../error/http-error.class';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.user) {
			return next(new HttpError(401, 'unauthorised'));
		} else {
			next();
		}
	}
}
