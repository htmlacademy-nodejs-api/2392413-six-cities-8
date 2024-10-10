import { fillDTO } from '#src/shared/helpers/common.js';
import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { BaseController } from '#src/shared/libs/rest/controller/base-controller.abstract.js';
import { DocumentExistsMiddleware } from '#src/shared/libs/rest/middleware/document-exists.middleware.js';
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
import { OfferRdo } from './rdo/offer-rdo.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { ParamCityName } from './types/param-cityname.type.js';
import { ParamUpdateFavorite } from './types/param-update-favorite.type.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    protected readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getOffers,
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
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
      path: '/favorite',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffers,
    });

    this.addRoute({
      path: '/favorite/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.updateFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async create(req: CreateOfferRequest, res: Response): Promise<void> {
    const { body } = req;
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async getOffers(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, fillDTO(OfferRdo, offers));
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
    this.ok(res, fillDTO(OfferRdo, offer));
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

  public async getFavoriteOffers(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorites();
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async updateFavorite(
    req: Request<ParamUpdateFavorite>,
    res: Response
  ): Promise<void> {
    const { offerId, status } = req.params;
    const offers = await this.offerService.updateFavorite(offerId, +status);
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
