import { ReviewService } from '#modules/review/review-service.interface.js';
import { UserService } from '#modules/user/user-service.interface.js';
import { fillDTO } from '#src/shared/helpers/common.js';
import { Config } from '#src/shared/libs/config/config.interface.js';
import { RestSchema } from '#src/shared/libs/config/rest-schema.js';
import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { BaseController } from '#src/shared/libs/rest/controller/base-controller.abstract.js';
import { DocumentExistsMiddleware } from '#src/shared/libs/rest/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '#src/shared/libs/rest/middleware/private-route.middleware.js';
import { UploadFileMiddleware } from '#src/shared/libs/rest/middleware/upload-file.middleware.js';
import { ValidateDtoMiddleware } from '#src/shared/libs/rest/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '#src/shared/libs/rest/middleware/validate-objectid.middleware.js';
import { HttpMethod } from '#src/shared/libs/rest/types/http-method.enum.js';
import { CityName } from '#src/shared/types/city-name.enum.js';
import { Component } from '#src/shared/types/component.enum.js';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CreateOfferDto } from './dto/create-offer-dto.js';
import { UpdateOfferDto } from './dto/update-offer-dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferListRdo } from './rdo/offer-list-rdo.js';
import { OfferRdo } from './rdo/offer-rdo.js';
import { UploadImageRdo } from './rdo/upload-image.rdo.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { ParamCityName } from './types/param-cityname.type.js';
import { ParamOfferId } from './types/param-offerId.type.js';
import { ParamUpdateFavorite } from './types/param-update-favorite.type.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    protected readonly offerService: OfferService,
    @inject(Component.UserService)
    protected readonly userService: UserService,
    @inject(Component.Config)
    private readonly configService: Config<RestSchema>,
    @inject(Component.ReviewService)
    protected readonly reviewService: ReviewService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/offers',
      method: HttpMethod.Get,
      handler: this.getOffers,
    });

    this.addRoute({
      path: '/offers',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Get,
      handler: this.getOfferDetail,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/premium/:cityName',
      method: HttpMethod.Get,
      handler: this.getPremiumByCity,
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffers,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.updateFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.updateFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/offers/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'image'
        ),
      ],
    });
  }

  public async create(req: CreateOfferRequest, res: Response): Promise<void> {
    const { body, tokenPayload } = req;
    const result = await this.offerService.create({
      ...body,
      userId: tokenPayload.id,
    });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async update(req: UpdateOfferRequest, res: Response): Promise<void> {
    const { params, body } = req;
    const result = await this.offerService.updateById(params.offerId, body);
    if (result) {
      const offer = await this.offerService.findById(params.offerId);
      this.ok(res, fillDTO(OfferRdo, offer));
    }
  }

  public async delete(req: UpdateOfferRequest, res: Response) {
    const { params } = req;
    const offer = await this.offerService.deleteById(params.offerId);
    await this.reviewService.deleteByOfferId(params.offerId);
    this.noContent(res, fillDTO(OfferRdo, offer));
  }

  public async getOffers(req: Request, res: Response): Promise<void> {
    const { tokenPayload } = req;
    const offers = await this.offerService.find();

    if (tokenPayload) {
      const user = await this.userService.findByEmail(tokenPayload.email);
      if (user) {
        offers.map((offer) => {
          offer.isFavorite = user.favoriteOffers.includes(offer.id);
        });
      }
    }

    this.ok(res, fillDTO(OfferListRdo, offers));
  }

  public async getOfferDetail(
    req: UpdateOfferRequest,
    res: Response
  ): Promise<void> {
    const { params } = req;
    const offer = await this.offerService.findById(params.offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async getPremiumByCity(
    req: Request<ParamCityName>,
    res: Response
  ): Promise<void> {
    const { params } = req;
    const cityName = params.cityName as CityName;
    const offer = await this.offerService.findPremiumByCity(cityName);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async getFavoriteOffers(req: Request, res: Response): Promise<void> {
    const {
      tokenPayload: { email },
    } = req;
    const user = (await this.userService.findByEmail(email)) || {
      favoriteOffers: [],
    };
    const offers = await this.offerService.findFavorites(user.favoriteOffers);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async updateFavorite(
    req: Request<ParamUpdateFavorite>,
    res: Response
  ): Promise<void> {
    const { tokenPayload, method } = req;
    const { offerId } = req.params;
    const offers = await this.offerService.updateFavorite(
      tokenPayload.id,
      offerId,
      method
    );
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async uploadImage(
    { params, file }: Request<ParamOfferId>,
    res: Response
  ) {
    const { offerId } = params;
    const updateDto = { previewImage: file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageRdo, updateDto));
  }
}
