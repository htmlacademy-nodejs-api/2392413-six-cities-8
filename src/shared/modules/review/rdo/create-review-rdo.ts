import { ReviewEntity } from '#modules/review/review-entity.js';
import { UserEntity } from '#modules/user/user-entity.js';
import { Ref } from '@typegoose/typegoose';

type reviewExcludeType = 'id' | '_id' | 'createdAt' | 'updatedAt';
export class ReviewRdo implements Omit<ReviewEntity, reviewExcludeType> {
  public date: Date;
  public userId: Ref<UserEntity>;
  public comment: string;
  public rating: number;
}
