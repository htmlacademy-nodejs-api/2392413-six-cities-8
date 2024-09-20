import { types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { CreateOfferDto } from './dto/create-offer-dto.js';
import { OfferEntity } from './offer-entity.js';
import {
  OfferEntityDocument,
  OfferService,
} from './offer-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  async create(dto: CreateOfferDto): Promise<OfferEntityDocument> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  findById(offerId: string): Promise<OfferEntityDocument | null> {
    return this.offerModel.findById(offerId).exec();
  }
}
