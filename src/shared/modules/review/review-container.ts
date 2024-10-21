import { Controller } from '#shared/libs/rest/controller/controller.interface.js';
import { Component } from '#shared/types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { DefaultReviewService } from './default-review-service.js';
import { ReviewController } from './review-controller.js';
import { ReviewEntity, ReviewModel } from './review-entity.js';
import { ReviewService } from './review-service.interface.js';

export function createReviewContainer() {
  const reviewContainer = new Container();
  reviewContainer
    .bind<ReviewService>(Component.ReviewService)
    .to(DefaultReviewService)
    .inSingletonScope();
  reviewContainer
    .bind<types.ModelType<ReviewEntity>>(Component.ReviewModel)
    .toConstantValue(ReviewModel);
  reviewContainer
    .bind<Controller>(Component.ReviewController)
    .to(ReviewController)
    .inSingletonScope();

  return reviewContainer;
}
