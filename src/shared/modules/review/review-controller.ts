import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { RequestBody } from '../../libs/rest/types/request-body.type.js';
import { Component } from '../../types/component.enum.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { ParamOfferId } from '../offer/types/param-offerId.type.js';
import { CreateReviewDto } from './dto/create-review-dto.js';
import { ReviewRdo } from './rdo/review-rdo.js';
import { ReviewService } from './review-service.interface.js';

@injectable()
export class ReviewController extends BaseController {
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
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getReviews,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateReviewDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async create(
    req: Request<ParamOfferId, RequestBody, CreateReviewDto>,
    res: Response
  ): Promise<void> {
    const { body, tokenPayload } = req;
    const { params } = req;
    const data = {
      ...body,
      userId: tokenPayload.id,
      offerId: params.offerId,
    };

    const review = await this.reviewService.create(data);
    this.created(res, fillDTO(ReviewRdo, review));
  }

  public async getReviews(
    req: Request<ParamOfferId, unknown, CreateReviewDto>,
    res: Response
  ): Promise<void> {
    const { params } = req;
    const review = await this.reviewService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(ReviewRdo, review));
  }
}
