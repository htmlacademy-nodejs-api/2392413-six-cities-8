import { HttpError } from '#src/shared/libs/rest/errors/http-error.js';

export class BaseUserException extends HttpError {
  constructor(httpStatusCode: number, message: string) {
    super(httpStatusCode, message);
  }
}
