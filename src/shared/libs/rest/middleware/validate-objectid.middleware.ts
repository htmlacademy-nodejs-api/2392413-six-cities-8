import { HttpError } from '#shared/libs/rest/errors/http-error.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { Middleware } from './middleware.interface.js';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private param: string) {}

  public execute(
    { params }: Request,
    _res: Response,
    next: NextFunction
  ): void {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
