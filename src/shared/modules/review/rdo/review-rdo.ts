import { ReviewEntity } from '#modules/review/review-entity.js';
import { UserRdo } from '#modules/user/rdo/user-rdo.js';
import { Expose, Type } from 'class-transformer';

type reviewExcludeType = '_id' | 'offerId' | 'userId' | 'updatedAt';

export class ReviewRdo implements Omit<ReviewEntity, reviewExcludeType> {
  @Expose()
  public id: string;

  @Expose({ name: 'createdAt' })
  public date: string;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose()
  public comment: string;

  @Expose()
  public rating: number;
}
