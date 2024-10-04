import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { BaseController } from '#src/shared/libs/rest/controller/base-controller.abstract.js';
import { Component } from '#src/shared/types/component.enum.js';
import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    protected readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');
  }
}
