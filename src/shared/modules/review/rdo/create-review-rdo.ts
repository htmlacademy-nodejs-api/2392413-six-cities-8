import { ReviewEntity } from '#modules/review/review-entity.js';
import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user-rdo.js';

type reviewExcludeType = 'id' | '_id' | 'userId' | 'createdAt' | 'updatedAt';
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
