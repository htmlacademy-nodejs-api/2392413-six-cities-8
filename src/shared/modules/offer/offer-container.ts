import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { DefaultOfferService } from './default-offer-service.js';
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

  return offerContainer;
}
