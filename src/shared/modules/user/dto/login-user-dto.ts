import { Expose } from 'class-transformer';
import { CreateUserDto } from './create-user-dto.js';

export class LoginUserDto implements Omit<CreateUserDto, 'name' | 'isPro'> {
  @Expose()
  public email: string;

  @Expose()
  public password: string;
}
