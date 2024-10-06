import { fillDTO } from '#src/shared/helpers/common.js';
import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { BaseController } from '#src/shared/libs/rest/controller/base-controller.abstract.js';
import { HttpMethod } from '#src/shared/libs/rest/types/http-method.enum.js';
import { Component } from '#src/shared/types/component.enum.js';
import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { OfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer-rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    protected readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
    });
  }

  public async create(req: CreateOfferRequest, res: Response): Promise<void> {
    const { body } = req;
    const offer = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, offer));
  }
}
