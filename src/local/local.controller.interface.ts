import { NextFunction, Request, Response } from 'express';

export interface ILocalController {
	add: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	get: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
