import { Container } from 'inversify';
import 'reflect-metadata';
import { RestApplication } from './rest/rest-application.js';
import { createRestApplicationContainer } from './rest/rest-container.js';
import { createOfferContainer } from './shared/modules/offer/offer-container.js';
import { createUserContainer } from './shared/modules/user/user-container.js';
import { Component } from './shared/types/component.enum.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer()
  );

  const application = appContainer.get<RestApplication>(
    Component.RestApplication
  );
  await application.init();
}

bootstrap();
