import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { BaseController } from '#src/shared/libs/rest/controller/base-controller.abstract.js';
import { HttpMethod } from '#src/shared/libs/rest/types/http-method.enum.js';
import { Component } from '#src/shared/types/component.enum.js';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger)
    protected readonly logger: Logger
  ) {
    super(logger);
    this.logger.info('Register routes for CategoryController...');

    this.addRoute({
      path: '/users/register',
      method: HttpMethod.Post,
      handler: this.register,
    });

    this.addRoute({
      path: '/users/login',
      method: HttpMethod.Post,
      handler: this.authorize,
    });

    this.addRoute({
      path: '/users/login',
      method: HttpMethod.Get,
      handler: this.getState,
    });

    this.addRoute({
      path: '/users/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
    });
  }

  public register(req: Request, res: Response): void {
    // Код обработчика
  }

  public authorize(req: Request, res: Response): void {
    // Код обработчика
  }

  public getState(req: Request, res: Response): void {
    // Код обработчика
  }

  public logout(req: Request, res: Response): void {
    // Код обработчика
  }
}
