import { types } from '@typegoose/typegoose';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Logger } from '../../../../src/shared/libs/logger/logger.interface.js';
import { HttpError } from '../../../../src/shared/libs/rest/errors/http-error.js';
import { Component } from '../../../../src/shared/types/component.enum.js';
import { CreateUserDto } from './dto/create-user-dto.js';
import { UpdateUserDto } from './dto/update-user-dto.js';
import { UserEntity } from './user-entity.js';
import { UserEntityDocument, UserService } from './user-service.interface.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async exists(documentId: string): Promise<boolean> {
    return (await this.userModel.exists({ _id: documentId })) !== null;
  }

  public async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<UserEntityDocument> {
    const existedUser = await this.findByEmail(dto.email);
    if (existedUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email "${dto.email}" already exists.`,
        'DefaultUserService'
      );
    }

    const user = new UserEntity({
      ...dto,
      avatarUrl: DEFAULT_AVATAR_FILE_NAME,
    });
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<UserEntityDocument | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<UserEntityDocument> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(
    userId: string,
    dto: UpdateUserDto
  ): Promise<UserEntityDocument | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
  }
}
