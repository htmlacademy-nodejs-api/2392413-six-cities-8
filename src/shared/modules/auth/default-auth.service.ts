import { LoginUserDto } from '#modules/user/dto/login-user-dto.js';
import { UserEntity } from '#modules/user/user-entity.js';
import { UserService } from '#modules/user/user-service.interface.js';
import { Config } from '#src/shared/libs/config/config.interface.js';
import { RestSchema } from '#src/shared/libs/config/rest-schema.js';
import { Logger } from '#src/shared/libs/logger/logger.interface.js';
import { Component } from '#src/shared/types/component.enum.js';
import { inject, injectable } from 'inversify';
import { SignJWT } from 'jose';
import * as crypto from 'node:crypto';
import { AuthService } from './auth-service.interface.js';
import { JWT_ALGORITHM, JWT_EXPIRED } from './auth.constant.js';
import { UserNotFoundException } from './errors/user-not-found.exception.js';
import { UserPasswordIncorrectException } from './errors/user-password-incorrect.exception.js';
import { TokenPayload } from './types/token-payload.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
