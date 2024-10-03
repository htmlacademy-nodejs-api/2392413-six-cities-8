import { Config } from '#src/shared/libs/config/config.interface.js';
import { RestSchema } from '#src/shared/libs/config/rest-schema.js';
import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { BaseController } from '#src/shared/libs/rest/controller/base-controller.abstract.js';
import { HttpMethod } from '#src/shared/libs/rest/types/http-method.enum.js';
import { Component } from '#src/shared/types/component.enum.js';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CreateUserDto } from './dto/create-user-dto.js';
import { LoginUserDto } from './dto/login-user-dto.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) protected readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    super(logger);
    this.logger.info('Register routes for CategoryController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.register,
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.authorize,
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.getState,
    });

    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
    });
  }

  public register(req: Request, res: Response): void {
    const dto: CreateUserDto = req.body;
    const salt = this.config.get('SALT');
    const user = this.userService.create(dto, salt);
    this.created(res, user);
  }

  public authorize(req: Request, res: Response): void {
    const dto: LoginUserDto = req.body;
    const user = this.userService.login(dto, this.config.get('SALT'));
    this.ok(res, user);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getState(req: Request, res: Response): void {
    // Код обработчика
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public logout(req: Request, res: Response): void {
    // Код обработчика
  }
}
