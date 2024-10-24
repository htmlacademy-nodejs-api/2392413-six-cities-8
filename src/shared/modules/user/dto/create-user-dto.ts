import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';
import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from '../user.constant.js';
import { CreateUserMessages } from './create-user.messages.js';

export class CreateUserDto {
  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, {
    message: CreateUserMessages.name.lengthField,
  })
  public name: string;

  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: CreateUserMessages.password.lengthField,
  })
  public password: string;

  @IsBoolean({ message: CreateUserMessages.isPro.invalidFormat })
  public isPro: boolean;
}
