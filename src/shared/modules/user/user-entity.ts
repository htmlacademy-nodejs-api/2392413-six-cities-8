import { defaultClasses, getModelForClass, prop } from '@typegoose/typegoose';
import { User } from '../../types/index.js';

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 15;

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 12;

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    required: true,
    minlength: MIN_NAME_LENGTH,
    maxlength: MAX_NAME_LENGTH,
  })
  public name: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: false })
  public avatarUrl: string;

  @prop({
    required: true,
    minlength: MIN_PASSWORD_LENGTH,
    maxlength: MAX_PASSWORD_LENGTH,
  })
  public password: string;

  @prop({ required: true })
  public isPro: boolean;
}

export const UserModel = getModelForClass(UserEntity);
