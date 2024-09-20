import { Container } from 'inversify';
import { Config } from '../shared/libs/config/config.interface.js';
import { RestConfig } from '../shared/libs/config/rest-config.js';
import { RestSchema } from '../shared/libs/config/rest-schema.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo-database-client.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { PinoLogger } from '../shared/libs/logger/pino-logger.js';
import { Component } from '../shared/types/component.enum.js';
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

  return restApplicationContainer;
}
