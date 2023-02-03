import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const authHeader = req.headers.authorization;
		if (authHeader) {
			verify(authHeader.split(' ')[1], this.secret, (err, payload: any) => {
				if (err) {
					next();
				} else if (payload) {
					req.user = payload.email as string;
					req.role = payload.role as string;
					next();
				}
			});
		} else {
			next();
		}
	}
}
