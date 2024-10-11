import { Logger } from '#libs/logger/logger.interface.js';
import { ReviewEntity } from '#modules/review/review-entity.js';
import { CityName } from '#src/shared/types/city-name.enum.js';
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

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

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

  async findById(offerId: string): Promise<OfferEntityDocument | null> {
    const [reviews] = await this.reviewModel.aggregate([
      { $match: { offerId } },
      { $count: 'reviewsCount' },
    ]);

    const result = await this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();

    if (result) {
      Object.assign(result, { reviewsCount: reviews.reviewsCount });
    }

    return result;
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
      .aggregate([
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'offerId',
            as: 'reviewsCount',
          },
        },
        { $addFields: { reviewsCount: { $size: '$reviewsCount' } } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        { $unwind: '$userId' },
      ])
      .sort({ createdAt: SortType.Down })
      .limit(recordCount)
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
    return this.offerModel
      .findByIdAndUpdate(offerId, [{ isFavorite: status === 1 }], { new: true })
      .exec();
  }

  async updateRating(
    offerId: string,
    rating: number
  ): Promise<OfferEntityDocument | null> {
    return this.offerModel.findByIdAndUpdate(offerId, { rating }).exec();
  }
}
