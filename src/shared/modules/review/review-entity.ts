import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { OfferEntity } from '../../../../src/shared/modules/offer/offer-entity.js';
import { UserEntity } from '../../../../src/shared/modules/user/user-entity.js';

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
  @prop({ required: true, ref: OfferEntity })
  public offerId: Ref<OfferEntity>;

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
