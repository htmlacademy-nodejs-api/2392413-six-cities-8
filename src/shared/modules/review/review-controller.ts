import { OfferService } from '#modules/offer/offer-service.interface.js';
import { ParamOfferId } from '#modules/offer/types/param-offerId.type.js';
import { fillDTO } from '#src/shared/helpers/common.js';
import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { BaseController } from '#src/shared/libs/rest/controller/base-controller.abstract.js';
import { HttpMethod } from '#src/shared/libs/rest/types/http-method.enum.js';
import { RequestBody } from '#src/shared/libs/rest/types/request-body.type.js';
import { Component } from '#src/shared/types/component.enum.js';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CreateReviewDto } from './dto/create-review-dto.js';
import { ReviewRdo } from './rdo/create-review-rdo.js';
import { ReviewService } from './review-service.interface.js';

@injectable()
export class ReviewController extends BaseController {
  salt: string;
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.ReviewService)
    protected readonly reviewService: ReviewService,
    @inject(Component.OfferService)
    protected readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for ReviewController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getReviews,
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
    });
  }

  public async create(
    req: Request<ParamOfferId, RequestBody, CreateReviewDto>,
    res: Response
  ): Promise<void> {
    const { body } = req;
    const { params } = req;
    await this.offerService.checkOfferExists(params.offerId);
    const review = await this.reviewService.create(params.offerId, body);
    this.created(res, fillDTO(ReviewRdo, review));
  }

  public async getReviews(
    req: Request<ParamOfferId, unknown, CreateReviewDto>,
    res: Response
  ): Promise<void> {
    const { params } = req;
    await this.offerService.checkOfferExists(params.offerId);
    const review = await this.reviewService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(ReviewRdo, review));
  }
}
