import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../error/http-error.class';

export class RoleGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.role || req.role !== 'ADMIN') {
			return next(new HttpError(403, 'not enough rights'));
		} else {
			next();
		}
	}
}
