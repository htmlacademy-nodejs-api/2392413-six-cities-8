import { createErrorObject } from '#shared/helpers/common.js';
import { Logger } from '#shared/libs/logger/logger.interface.js';
import { ValidationError } from '#shared/libs/rest/errors/validation.error.js';
import { ApplicationError } from '#shared/libs/rest/types/application-error.enum.js';
import { Component } from '#shared/types/component.enum.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException]: ${error.message}`, error);
    error.details.forEach((errorField) =>
      this.logger.warn(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createErrorObject(
          ApplicationError.ValidationError,
          error.message,
          error.details
        )
      );
  }
}
