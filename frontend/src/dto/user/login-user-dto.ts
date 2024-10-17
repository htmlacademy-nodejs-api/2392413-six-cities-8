import CreateUserDto from './create-user-dto';

export default class LoginUserDto
  implements Omit<CreateUserDto, 'name' | 'isPro'>
{
  public email!: string;
  public password!: string;
}
