import { NextFunction, Request, Response } from "express";

export interface ISupportController {
  getPDF: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
