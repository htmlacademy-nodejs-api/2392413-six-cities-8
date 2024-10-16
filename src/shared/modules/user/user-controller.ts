import { AuthService } from '#modules/auth/auth-service.interface.js';
import { fillDTO } from '#src/shared/helpers/common.js';
import { Config } from '#src/shared/libs/config/config.interface.js';
import { RestSchema } from '#src/shared/libs/config/rest-schema.js';
import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { BaseController } from '#src/shared/libs/rest/controller/base-controller.abstract.js';
import { HttpError } from '#src/shared/libs/rest/errors/http-error.js';
import { PrivateRouteMiddleware } from '#src/shared/libs/rest/middleware/private-route.middleware.js';
import { UploadFileMiddleware } from '#src/shared/libs/rest/middleware/upload-file.middleware.js';
import { ValidateDtoMiddleware } from '#src/shared/libs/rest/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '#src/shared/libs/rest/middleware/validate-objectid.middleware.js';
import { HttpMethod } from '#src/shared/libs/rest/types/http-method.enum.js';
import { Component } from '#src/shared/types/component.enum.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { CreateUserRequest } from './create-user-request.type.js';
import { CreateUserDto } from './dto/create-user-dto.js';
import { LoginUserDto } from './dto/login-user-dto.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { LoggedUserRdo } from './rdo/logged-user-rdo.js';
import { UserRdo } from './rdo/user-rdo.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  salt: string;
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) protected readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {
    super(logger);
    this.salt = this.config.get('SALT');

    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ],
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ],
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.authorize,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.getAuthorizeState,
    });

    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware()],
    });
  }

  public async create(req: CreateUserRequest, res: Response): Promise<void> {
    const dto: CreateUserDto = req.body;
    const user = await this.userService.create(dto, this.salt);
    this.created(res, fillDTO(UserRdo, user));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path,
    });
  }

  public async authorize(req: Request, res: Response): Promise<void> {
    const { body }: LoginUserRequest = req;
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, user);
    this.ok(res, Object.assign(responseData, { token }));
  }

  public async getAuthorizeState(req: Request, res: Response): Promise<void> {
    const {
      tokenPayload: { email },
    } = req;
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const {
      tokenPayload: { email },
    } = req;
    await this.userService.findByEmail(email);
    this.noContent(res, {});
  }
}
