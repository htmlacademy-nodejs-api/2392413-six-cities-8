import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Controller } from '../../../../src/shared/libs/rest/controller/controller.interface.js';
import { Component } from '../../../../src/shared/types/component.enum.js';
import { DefaultOfferService } from './default-offer-service.js';
import { OfferController } from './offer-controller.js';
import { OfferEntity, OfferModel } from './offer-entity.js';
import { OfferService } from './offer-service.interface.js';

export function createOfferContainer() {
  const offerContainer = new Container();
  offerContainer
    .bind<OfferService>(Component.OfferService)
    .to(DefaultOfferService)
    .inSingletonScope();
  offerContainer
    .bind<types.ModelType<OfferEntity>>(Component.OfferModel)
    .toConstantValue(OfferModel);
  offerContainer
    .bind<Controller>(Component.OfferController)
    .to(OfferController)
    .inSingletonScope();

  return offerContainer;
}
