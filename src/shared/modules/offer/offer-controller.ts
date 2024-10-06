import { fillDTO } from '#src/shared/helpers/common.js';
import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { BaseController } from '#src/shared/libs/rest/controller/base-controller.abstract.js';
import { HttpMethod } from '#src/shared/libs/rest/types/http-method.enum.js';
import { CityName } from '#src/shared/types/city-name.enum.js';
import { Component } from '#src/shared/types/component.enum.js';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer-rdo.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { ParamCityName } from './types/param-cityname.type.js';
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
      method: HttpMethod.Post,
      handler: this.create,
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getOffers,
    });

    this.addRoute({
      path: '/{offerId}',
      method: HttpMethod.Put,
      handler: this.update,
    });

    this.addRoute({
      path: '/{offerId}',
      method: HttpMethod.Delete,
      handler: this.update,
    });

    this.addRoute({
      path: '/{offerId}',
      method: HttpMethod.Get,
      handler: this.getOfferDetail,
    });

    this.addRoute({
      path: '/premium/{cityName}',
      method: HttpMethod.Get,
      handler: this.getPremiumByCity,
    });
  }

  public async create(req: CreateOfferRequest, res: Response): Promise<void> {
    const { body } = req;
    const offer = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async getOffers(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, offers);
  }

  public async update(req: UpdateOfferRequest, res: Response): Promise<void> {
    const { params, body } = req;
    const offer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferRdo, offer));
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
    this.ok(res, offers);
  }
}
