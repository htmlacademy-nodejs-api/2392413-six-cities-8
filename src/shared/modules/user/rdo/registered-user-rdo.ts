import { Expose } from 'class-transformer';
import { UserRdo } from './user-rdo.js';

export class RegisteredUserRdo extends UserRdo {
  @Expose()
  public id: string;
}
