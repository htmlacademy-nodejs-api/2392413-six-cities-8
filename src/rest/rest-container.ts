import { Config } from '#libs/config/config.interface.js';
import { RestConfig } from '#libs/config/rest-config.js';
import { RestSchema } from '#libs/config/rest-schema.js';
import { DatabaseClient } from '#libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '#libs/database-client/mongo-database-client.js';
import { Logger } from '#libs/logger/logger.interface.js';
import { PinoLogger } from '#libs/logger/pino-logger.js';
import { AppExceptionFilter } from '#src/shared/libs/rest/exception-filter/app-exception-filter.js';
import { ExceptionFilter } from '#src/shared/libs/rest/exception-filter/exception-filter.interface.js';
import { HttpErrorExceptionFilter } from '#src/shared/libs/rest/exception-filter/http-error.exception-filter.js';
import { ValidationExceptionFilter } from '#src/shared/libs/rest/exception-filter/validation.exception-filter.js';
import { PathTransformer } from '#src/shared/libs/rest/transform/path-transformer.js';
import { Component } from '#types/component.enum.js';
import { Container } from 'inversify';
import { RestApplication } from './rest-application.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer
    .bind<RestApplication>(Component.RestApplication)
    .to(RestApplication)
    .inSingletonScope();
  restApplicationContainer
    .bind<Logger>(Component.Logger)
    .to(PinoLogger)
    .inSingletonScope();
  restApplicationContainer
    .bind<Config<RestSchema>>(Component.Config)
    .to(RestConfig)
    .inSingletonScope();
  restApplicationContainer
    .bind<DatabaseClient>(Component.DatabaseClient)
    .to(MongoDatabaseClient)
    .inSingletonScope();
  restApplicationContainer
    .bind<ExceptionFilter>(Component.ExceptionFilter)
    .to(AppExceptionFilter)
    .inSingletonScope();
  restApplicationContainer
    .bind<ExceptionFilter>(Component.HttpExceptionFilter)
    .to(HttpErrorExceptionFilter)
    .inSingletonScope();
  restApplicationContainer
    .bind<ExceptionFilter>(Component.ValidationExceptionFilter)
    .to(ValidationExceptionFilter)
    .inSingletonScope();
  restApplicationContainer
    .bind<PathTransformer>(Component.PathTransformer)
    .to(PathTransformer)
    .inSingletonScope();
  return restApplicationContainer;
}
