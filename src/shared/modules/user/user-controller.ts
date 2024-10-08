import { fillDTO } from '#src/shared/helpers/common.js';
import { Config } from '#src/shared/libs/config/config.interface.js';
import { RestSchema } from '#src/shared/libs/config/rest-schema.js';
import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { BaseController } from '#src/shared/libs/rest/controller/base-controller.abstract.js';
import { HttpError } from '#src/shared/libs/rest/errors/http-error.js';
import { HttpMethod } from '#src/shared/libs/rest/types/http-method.enum.js';
import { Component } from '#src/shared/types/component.enum.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { CreateUserRequest } from './create-user-request.type.js';
import { CreateUserDto } from './dto/create-user-dto.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { UserRdo } from './rdo/user-rdo.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  salt: string;
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) protected readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    super(logger);
    this.salt = this.config.get('SALT');

    this.logger.info('Register routes for UserController...');

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

  public async register(req: CreateUserRequest, res: Response): Promise<void> {
    const dto: CreateUserDto = req.body;
    const user = await this.userService.create(dto, this.salt);
    this.created(res, fillDTO(UserRdo, user));
  }

  public async authorize(req: Request, res: Response): Promise<void> {
    const { body }: LoginUserRequest = req;
    const existedUser = await this.userService.findByEmail(body.email);

    if (
      !existedUser ||
      (existedUser && !existedUser.isValidPassword(body.password, this.salt))
    ) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid username or password',
        'UserController'
      );
    }

    const user = await this.userService.login(body);
    this.ok(res, user);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getState(_req: Request, _res: Response): void {
    // Код обработчика
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public logout(_req: Request, _res: Response): void {
    // Код обработчика
  }
}
