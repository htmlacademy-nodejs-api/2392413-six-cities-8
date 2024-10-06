import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../../user/user-entity.js';
import { ReviewEntity } from '../review-entity.js';

type reviewExcludeType = 'id' | '_id' | 'createdAt' | 'updatedAt';
export class ReviewRdo implements Omit<ReviewEntity, reviewExcludeType> {
  public date: Date;
  public userId: Ref<UserEntity>;
  public comment: string;
  public rating: number;
}
