import { getMongoURI } from '#helpers/database.js';
import { Config } from '#libs/config/config.interface.js';
import { RestSchema } from '#libs/config/rest-schema.js';
import { DatabaseClient } from '#libs/database-client/database-client.interface.js';
import { Logger } from '#libs/logger/logger.interface.js';
import { Controller } from '#src/shared/libs/rest/controller/controller.interface.js';
import { ExceptionFilter } from '#src/shared/libs/rest/exception-filter/exception-filter.interface.js';
import { Component } from '#types/component.enum.js';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class RestApplication {
  private readonly server: Express;
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Component.UserController)
    private readonly userController: Controller,
    @inject(Component.OfferController)
    private readonly offerController: Controller,
    @inject(Component.ReviewController)
    private readonly reviewController: Controller,
    @inject(Component.ExceptionFilter)
    private readonly appExceptionFilter: ExceptionFilter
  ) {
    this.server = express();
  }

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

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initMiddleware() {
    this.server.use(express.json());
  }

  private async _initControllers() {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/reviews', this.reviewController.router);
  }

  private async _initExceptionFilter() {
    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter)
    );
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this.initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init app-level middleware');
    await this._initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers');
    await this._initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filter');
    await this._initExceptionFilter();
    this.logger.info('Exception filter initialization completed');

    this.logger.info('Try to init server...');
    await this._initServer();
    this.logger.info(
      `🚀 Server started on http://localhost:${this.config.get('PORT')}`
    );
  }
}
