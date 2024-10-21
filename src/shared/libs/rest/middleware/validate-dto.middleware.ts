import { reduceValidationErrors } from '#shared/helpers/common.js';
import { ValidationError } from '#shared/libs/rest/errors/validation.error.js';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(
    { body, path }: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length) {
      throw new ValidationError(
        `Validation error: ${path}`,
        reduceValidationErrors(errors)
      );
    }

    next();
  }
}
