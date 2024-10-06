import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { UserEntity } from '../user/user-entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ReviewEntity extends defaultClasses.Base {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
@modelOptions({
  schemaOptions: {
    collection: 'reviews',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ReviewEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public date: Date;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;

  @prop({ required: true })
  public comment: string;

  @prop({ required: true })
  public rating: number;
}

export const ReviewModel = getModelForClass(ReviewEntity);
