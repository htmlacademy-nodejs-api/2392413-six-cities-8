import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { createErrorObject } from '../../../../../src/shared/helpers/common.js';
import { Logger } from '../../../../../src/shared/libs/logger/logger.interface.js';
import { HttpError } from '../../../../../src/shared/libs/rest/errors/http-error.js';
import { ApplicationError } from '../../../../../src/shared/libs/rest/types/application-error.enum.js';
import { Component } from '../../../../../src/shared/types/component.enum.js';
import { ExceptionFilter } from './exception-filter.interface.js';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(
      `[HttpErrorException]: ${req.path} # ${error.message}`,
      error
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
