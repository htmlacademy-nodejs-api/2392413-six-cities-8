import { LoginUserDto } from '../../../../src/shared/modules/user/dto/login-user-dto.js';
import { UserEntity } from '../../../../src/shared/modules/user/user-entity.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
}
