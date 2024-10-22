import { DocumentType } from '@typegoose/typegoose';
import { DocumentExists } from '../../../../src/shared/types/document-exists.interface.js';
import { CreateUserDto } from './dto/create-user-dto.js';
import { UpdateUserDto } from './dto/update-user-dto.js';
import { UserEntity } from './user-entity.js';

export type UserEntityDocument = DocumentType<UserEntity>;

export interface UserService extends DocumentExists {
  create(dto: CreateUserDto, salt: string): Promise<UserEntityDocument>;
  findByEmail(email: string): Promise<UserEntityDocument | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<UserEntityDocument>;
  updateById(
    userId: string,
    dto: UpdateUserDto
  ): Promise<UserEntityDocument | null>;
}
