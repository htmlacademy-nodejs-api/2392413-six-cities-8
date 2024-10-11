import { Logger } from '#libs/logger/logger.interface.js';
import { Component } from '#types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { OfferService } from '../offer/offer-service.interface.js';
import { CreateReviewDto } from './dto/create-review-dto.js';
import { ReviewEntity } from './review-entity.js';
import {
  ReviewEntityDocument,
  ReviewService,
} from './review-service.interface.js';

@injectable()
export class DefaultReviewService implements ReviewService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.ReviewModel)
    private readonly reviewModel: types.ModelType<ReviewEntity>,
    @inject(Component.OfferService)
    private readonly offerService: OfferService
  ) {}

  async calculateAverageRating(offerId: string): Promise<number> {
    const [review] = await this.reviewModel.aggregate<Record<string, number>>([
      { $match: { offerId: new mongoose.Types.ObjectId(offerId) } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);
    return +review.averageRating.toFixed(1);
  }

  async create(
    offerId: string,
    dto: CreateReviewDto
  ): Promise<ReviewEntityDocument> {
    const result = await this.reviewModel.create({ ...dto, offerId });
    const averageRating = await this.calculateAverageRating(offerId);

    this.offerService.updateRating(offerId, averageRating);
    this.logger.info('New review created');
    return result.populate('userId');
  }

  async findByOfferId(offerId: string): Promise<ReviewEntityDocument[] | null> {
    const result = await this.reviewModel
      .find({ offerId })
      .populate(['userId'])
      .exec();

    return result;
  }
}
