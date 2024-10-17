import { OfferService } from '#modules/offer/offer-service.interface.js';
import { ParamOfferId } from '#modules/offer/types/param-offerId.type.js';
import { fillDTO } from '#src/shared/helpers/common.js';
import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { BaseController } from '#src/shared/libs/rest/controller/base-controller.abstract.js';
import { DocumentExistsMiddleware } from '#src/shared/libs/rest/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '#src/shared/libs/rest/middleware/private-route.middleware.js';
import { ValidateDtoMiddleware } from '#src/shared/libs/rest/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '#src/shared/libs/rest/middleware/validate-objectid.middleware.js';
import { HttpMethod } from '#src/shared/libs/rest/types/http-method.enum.js';
import { RequestBody } from '#src/shared/libs/rest/types/request-body.type.js';
import { Component } from '#src/shared/types/component.enum.js';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CreateReviewDto } from './dto/create-review-dto.js';
import { ReviewRdo } from './rdo/review-rdo.js';
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
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getReviews,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
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
    const review = await this.reviewService.create(params.offerId, {
      ...body,
      userId: tokenPayload.id,
    });
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
