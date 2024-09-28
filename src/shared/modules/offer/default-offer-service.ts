import { Logger } from '#libs/logger/logger.interface.js';
import { SortType } from '#src/shared/types/sort-type.enum.js';
import { Component } from '#types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CreateOfferDto } from './dto/create-offer-dto.js';
import { UpdateOfferDto } from './dto/update-offer-dto.js';
import { OfferEntity } from './offer-entity.js';
import {
  OfferEntityDocument,
  OfferService,
} from './offer-service.interface.js';

const DEFAULT_OFFERS_LIMIT = 60;
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

  async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<OfferEntityDocument | null> {
    const result = await this.offerModel.findByIdAndUpdate(offerId, dto, {
      new: true,
    });
    this.logger.info(`Offer updated: ${dto.title}`);

    return result;
  }

  async deleteById(offerId: string): Promise<OfferEntityDocument | null> {
    const result = await this.offerModel.findByIdAndDelete(offerId);
    if (result) {
      this.logger.info(`Offer deleted: ${result.title}`);
    }

    return result;
  }

  findById(offerId: string): Promise<OfferEntityDocument | null> {
    return this.offerModel.findById(offerId).populate(['userId']).exec();
  }

  find(
    recordCount: number = DEFAULT_OFFERS_LIMIT
  ): Promise<OfferEntityDocument[]> {
    return this.offerModel
      .find()
      .sort({ createdAt: SortType.Down })
      .limit(recordCount)
      .populate(['userId'])
      .exec();
  }
}
