import { Logger } from '#shared/libs/logger/logger.interface.js';
import { HttpError } from '#shared/libs/rest/errors/http-error.js';
import { ReviewEntity } from '#shared/modules/review/review-entity.js';
import { UserEntity } from '#shared/modules/user/user-entity.js';
import { UserEntityDocument } from '#shared/modules/user/user-service.interface.js';
import { CityName } from '#shared/types/city-name.enum.js';
import { Component } from '#shared/types/component.enum.js';
import { SortType } from '#shared/types/sort-type.enum.js';
import { types } from '@typegoose/typegoose';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
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
      { $match: { offerId: new mongoose.Types.ObjectId(offerId) } },
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
            id: { $toString: '$_id' },
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
        'city.name': cityName,
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

  private async postFavorite(
    user: UserEntityDocument,
    offerId: string
  ): Promise<void> {
    if (user.favoriteOffers.includes(offerId)) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with id "${user.id}" already has an offer with id "${offerId}" in favorites`,
        'DefaultOfferService'
      );
    }
    user.favoriteOffers.push(offerId);
  }

  private async deleteFavorite(
    user: UserEntityDocument,
    offerId: string
  ): Promise<void> {
    if (!user.favoriteOffers.includes(offerId)) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with id "${user.id}" has not an offer with id "${offerId}" in favorites`,
        'DefaultOfferService'
      );
    }

    user.favoriteOffers = user.favoriteOffers.filter((id) => id !== offerId);
  }

  async updateFavorite(
    userId: string,
    offerId: string,
    action: string
  ): Promise<OfferEntityDocument | null> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id "${userId}" not found`,
        'DefaultOfferService'
      );
    }
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id "${offerId}" not found`,
        'DefaultOfferService'
      );
    }

    if (action === 'POST') {
      await this.postFavorite(user, offerId);
      offer.isFavorite = true;
    } else if (action === 'DELETE') {
      await this.deleteFavorite(user, offerId);
      offer.isFavorite = false;
    } else {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'action must be POST or DELETE',
        'DefaultOfferService'
      );
    }

    await this.userModel
      .findByIdAndUpdate(userId, { favoriteOffers: user.favoriteOffers })
      .exec();

    return offer;
  }

  async updateRating(
    offerId: string,
    rating: number
  ): Promise<OfferEntityDocument | null> {
    return this.offerModel.findByIdAndUpdate(offerId, { rating }).exec();
  }
}
