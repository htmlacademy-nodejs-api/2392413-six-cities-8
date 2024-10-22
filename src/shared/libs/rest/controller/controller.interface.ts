import { Response, Router } from 'express';
import { Route } from '../../../../../src/shared/libs/rest/types/route.interface.js';

export interface Controller {
  readonly router: Router;
  addRoute(route: Route): void;
  send<T>(res: Response, statusCode: number, data: T): void;
  ok<T>(res: Response, data: T): void;
  created<T>(res: Response, data: T): void;
  noContent<T>(res: Response, data: T): void;
}
