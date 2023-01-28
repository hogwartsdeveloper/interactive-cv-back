import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface';

export type ExpressReturnType = Response<any, Record<string, any>>;

type routerMethodType = 'get' | 'post' | 'delete' | 'patch' | 'put';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, routerMethodType>;
	middlewares?: IMiddleware[];
}
