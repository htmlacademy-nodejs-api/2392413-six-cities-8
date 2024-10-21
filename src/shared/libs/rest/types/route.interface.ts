import { Middleware } from '#shared/libs/rest/middleware/middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { HttpMethod } from './http-method.enum.js';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
}
