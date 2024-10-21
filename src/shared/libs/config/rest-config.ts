import { Config } from '#shared/libs/config/config.interface.js';
import { Logger } from '#shared/libs/logger/logger.interface.js';
import { Component } from '#shared/types/component.enum.js';
import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { configRestSchema, RestSchema } from './rest-schema.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error(
        'Can not read .env file. Perhaps the file does not exists.'
      );
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
