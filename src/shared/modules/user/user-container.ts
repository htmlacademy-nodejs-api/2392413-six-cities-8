import { Controller } from '#src/shared/libs/rest/controller/controller.interface.js';
import { Component } from '#types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { DefaultUserService } from './default-user-service.js';
import { UserController } from './user-controller.js';
import { UserEntity, UserModel } from './user-entity.js';
import { UserService } from './user-service.interface.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer
    .bind<UserService>(Component.UserService)
    .to(DefaultUserService)
    .inSingletonScope();
  userContainer
    .bind<types.ModelType<UserEntity>>(Component.UserModel)
    .toConstantValue(UserModel);
  userContainer
    .bind<Controller>(Component.UserController)
    .to(UserController)
    .inSingletonScope();

  return userContainer;
}
