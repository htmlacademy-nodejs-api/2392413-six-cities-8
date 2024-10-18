import { Logger } from '#libs/logger/logger.interface.js';
import { ReviewEntity } from '#modules/review/review-entity.js';
import { UserEntity } from '#modules/user/user-entity.js';
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
    private readonly reviewModel: types.ModelType<ReviewEntity>,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
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

    this.logger.info(`Offer updated: ${offerId}`);

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

    if (result !== null) {
      result.reviewsCount = +reviews?.reviewsCount;
    }

    return result;
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
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        {
          $addFields: {
            reviewsCount: { $size: '$reviewsCount' },
            isFavorite: false,
            id: '$_id',
          },
        },
        { $unwind: '$userId' },
      ])
      .sort({ createdAt: SortType.Down })
      .limit(recordCount)
      .exec();
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

  async findFavorites(favoritesId: string[]): Promise<OfferEntityDocument[]> {
    if (!favoritesId.length) {
      return [];
    }
    const offers = await this.offerModel
      .find({ _id: { $in: favoritesId } })
      .populate(['userId'])
      .exec();

    offers.map((offer) => {
      offer.isFavorite = true;
    });

    return offers;
  }

  async updateFavorite(
    userId: string,
    offerId: string,
    status: number
  ): Promise<OfferEntityDocument | null> {
    const user = await this.userModel.findById(userId);
    if (user) {
      if (status === 1) {
        if (user.favoriteOffers.includes(offerId)) {
          throw new HttpError(
            StatusCodes.CONFLICT,
            `User with id "${userId}" already has an offer with id "${offerId}" in favorites`,
            'DefaultOfferService'
          );
        }
        user.favoriteOffers.push(offerId);
      } else if (status === 0) {
        if (!user.favoriteOffers.includes(offerId)) {
          throw new HttpError(
            StatusCodes.CONFLICT,
            `User with id "${userId}" has not an offer with id "${offerId}" in favorites`,
            'DefaultOfferService'
          );
        }

        user.favoriteOffers = user.favoriteOffers.filter(
          (id) => id !== offerId
        );
      } else {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          'Status must be 1 or 0',
          'DefaultOfferService'
        );
      }

      await this.userModel
        .findByIdAndUpdate(userId, { favoriteOffers: user.favoriteOffers })
        .exec();
    }

    return await this.findById(offerId);
  }

  async updateRating(
    offerId: string,
    rating: number
  ): Promise<OfferEntityDocument | null> {
    return this.offerModel.findByIdAndUpdate(offerId, { rating }).exec();
  }
}
