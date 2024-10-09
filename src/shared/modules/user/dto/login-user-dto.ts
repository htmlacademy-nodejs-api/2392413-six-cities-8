import { Exclude, Expose } from 'class-transformer';
import { CreateUserDto } from './create-user-dto.js';

export class LoginUserDto implements CreateUserDto {
  @Exclude()
  public name: string;

  @Expose()
  public email: string;

  @Exclude()
  public avatarUrl: string;

  @Expose()
  public password: string;

  @Exclude()
  public isPro: boolean;
}
