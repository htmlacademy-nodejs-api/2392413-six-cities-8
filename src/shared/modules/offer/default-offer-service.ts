import { Logger } from '#libs/logger/logger.interface.js';
import { ReviewEntity } from '#modules/review/review-entity.js';
import { HttpError } from '#src/shared/libs/rest/errors/http-error.js';
import { CityName } from '#src/shared/types/city-name.enum.js';
import { SortType } from '#src/shared/types/sort-type.enum.js';
import { Component } from '#types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { CreateOfferDto } from './dto/create-offer-dto.js';
import { UpdateOfferDto } from './dto/update-offer-dto.js';
import { OfferEntity } from './offer-entity.js';
import {
  OfferEntityDocument,
  OfferService,
} from './offer-service.interface.js';

const DEFAULT_OFFERS_LIMIT = 60;
const PREMIUM_OFFERS_LIMIT = 3;
@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.ReviewModel)
    private readonly reviewModel: types.ModelType<ReviewEntity>
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
    await this.checkOfferExists(offerId);
    const result = await this.offerModel.findByIdAndUpdate(offerId, dto, {
      new: true,
    });
    this.logger.info(`Offer updated: ${dto.title}`);

    return result;
  }

  async deleteById(offerId: string): Promise<OfferEntityDocument | null> {
    await this.checkOfferExists(offerId);
    const result = await this.offerModel.findByIdAndDelete(offerId);
    if (result) {
      this.logger.info(`Offer deleted: ${result.title}`);
    }

    return result;
  }

  async findById(offerId: string): Promise<OfferEntityDocument | null> {
    await this.checkOfferExists(offerId);
    return await this.offerModel.findById(offerId).populate(['userId']).exec();
  }

  async findPremiumByCity(
    cityName: CityName
  ): Promise<OfferEntityDocument[] | null> {
    return this.offerModel
      .find({
        city: cityName,
        isPremium: true,
      })
      .sort({ createdAt: SortType.Down })
      .limit(PREMIUM_OFFERS_LIMIT)
      .populate(['userId'])
      .exec();
  }

  async find(
    recordCount: number = DEFAULT_OFFERS_LIMIT
  ): Promise<OfferEntityDocument[]> {
    return this.offerModel
      .find()
      .sort({ createdAt: SortType.Down })
      .limit(recordCount)
      .populate(['userId'])
      .exec();
  }

  async findFavorites(): Promise<OfferEntityDocument[]> {
    return this.offerModel
      .find([{ isFavorite: true }])
      .populate(['userId'])
      .exec();
  }

  async updateFavorite(
    offerId: string,
    status: number
  ): Promise<OfferEntityDocument | null> {
    await this.checkOfferExists(offerId);

    return this.offerModel
      .findByIdAndUpdate(offerId, [{ isFavorite: status === 1 }], { new: true })
      .exec();
  }

  async updateRating(offerId: string): Promise<OfferEntityDocument | null> {
    await this.checkOfferExists(offerId);
    ///// Очень сомневаюсь в правильности
    const [{ averageRating }] = await this.reviewModel.aggregate([
      { $match: { offerId } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    return this.offerModel
      .findByIdAndUpdate(offerId, [{ rating: averageRating }], { new: true })
      .populate(['userId'])
      .exec();
  }

  async checkOfferExists(offerId: string): Promise<void> {
    const isOfferExists = await this.offerModel.exists({ _id: offerId }).exec();

    if (!isOfferExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id "${offerId}" not found.`,
        'OfferService'
      );
    }
  }
}
