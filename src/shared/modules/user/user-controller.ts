import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import { Config } from '../../libs/config/config.interface.js';
import { RestSchema } from '../../libs/config/rest-schema.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { HttpError } from '../../libs/rest/errors/http-error.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';
import { UploadFileMiddleware } from '../../libs/rest/middleware/upload-file.middleware.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { Component } from '../../types/component.enum.js';
import { AuthService } from '../auth/auth-service.interface.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { CreateUserDto } from './dto/create-user-dto.js';
import { LoginUserDto } from './dto/login-user-dto.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { LoggedUserRdo } from './rdo/logged-user-rdo.js';
import { RegisteredUserRdo } from './rdo/registered-user-rdo.js';
import { UploadUserAvatarRdo } from './rdo/upload-user-avatar.rdo.js';
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
      path: '/users/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
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
    this.created(res, fillDTO(RegisteredUserRdo, user));
  }

  public async uploadAvatar({ params, file }: Request, res: Response) {
    const { userId } = params;
    const uploadFile = { avatarUrl: file?.filename };
    await this.userService.updateById(userId, uploadFile);
    this.created(
      res,
      fillDTO(UploadUserAvatarRdo, { filepath: uploadFile.avatarUrl })
    );
  }

  public async authorize(req: Request, res: Response): Promise<void> {
    const { body }: LoginUserRequest = req;
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, user);
    this.ok(res, Object.assign(responseData, { token }));
  }

  public async getAuthorizeState(req: Request, res: Response): Promise<void> {
    const { tokenPayload } = req;
    if (tokenPayload) {
      const foundedUser = await this.userService.findByEmail(
        tokenPayload.email
      );

      if (foundedUser) {
        this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
        return;
      }
    }

    throw new HttpError(
      StatusCodes.UNAUTHORIZED,
      'Unauthorized',
      'UserController'
    );
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const {
      tokenPayload: { email },
    } = req;
    await this.userService.findByEmail(email);
    this.noContent(res, {});
  }
}
