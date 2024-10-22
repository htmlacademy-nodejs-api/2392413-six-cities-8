import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Logger } from '../../../../src/shared/libs/logger/logger.interface.js';
import { ExceptionFilter } from '../../../../src/shared/libs/rest/exception-filter/exception-filter.interface.js';
import { Component } from '../../../../src/shared/types/component.enum.js';
import { BaseUserException } from './errors/base-user.exception.js';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res.status(error.httpStatusCode).json({
      type: 'AUTHORIZATION',
      error: error.message,
    });
  }
}
