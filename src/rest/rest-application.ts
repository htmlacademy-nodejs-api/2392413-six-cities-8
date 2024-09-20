import { Config } from '#libs/config/config.interface.js';
import { RestSchema } from '#libs/config/rest-schema.js';
import { DatabaseClient } from '#libs/database-client/database-client.interface.js';
import { Logger } from '#libs/logger/logger.interface.js';
import { getMongoURI } from '#src/shared/helpers/database.js';
import { Component } from '#types/component.enum.js';
import { inject, injectable } from 'inversify';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient
  ) {}

  private async initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this.initDb();
    this.logger.info('Init database completed');
  }
}
