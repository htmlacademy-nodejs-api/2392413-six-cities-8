import { ReviewEntity } from '#modules/review/review-entity.js';
import { UserRdo } from '#modules/user/rdo/user-rdo.js';
import { Expose, Type } from 'class-transformer';

type reviewExcludeType =
  | 'id'
  | '_id'
  | 'offerId'
  | 'userId'
  | 'createdAt'
  | 'updatedAt';
export class ReviewRdo implements Omit<ReviewEntity, reviewExcludeType> {
  @Expose()
  public date: Date;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose()
  public comment: string;

  @Expose()
  public rating: number;
}
