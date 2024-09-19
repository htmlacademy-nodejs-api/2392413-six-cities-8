import { DocumentType } from '@typegoose/typegoose';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UserEntity } from './user-entity.js';

export type UserEntityDocument = DocumentType<UserEntity>;

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<UserEntityDocument>;
  findByEmail(email: string): Promise<UserEntityDocument | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<UserEntityDocument>;
}
