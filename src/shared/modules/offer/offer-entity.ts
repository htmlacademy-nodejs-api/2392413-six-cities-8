import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import { UserEntity } from '../../../../src/shared/modules/user/user-entity.js';
import { City } from '../../../../src/shared/types/city.type.js';
import { GoodType } from '../../../../src/shared/types/good-type.type.js';
import { Location } from '../../../../src/shared/types/location.type.js';
import { OfferType } from '../../../../src/shared/types/offer-type.enum.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
  options: { allowMixed: Severity.ALLOW },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true })
  public title: string;

  @prop({ trim: true })
  public description: string;

  @prop()
  public createdDate: Date;

  @prop()
  public city: City;

  @prop()
  public previewImage: string;

  @prop()
  public images: string[];

  @prop()
  public isPremium: boolean;

  public isFavorite: boolean;

  @prop()
  public rating: number;

  @prop({ type: () => String, enum: OfferType })
  public type: OfferType;

  @prop()
  public bedrooms: number;

  @prop()
  public maxAdults: number;

  @prop()
  public price: number;

  @prop()
  public goods: GoodType[];

  @prop({ ref: UserEntity })
  public userId: Ref<UserEntity>;

  @prop()
  public location: Location;

  public reviewsCount: number;
}

export const OfferModel = getModelForClass(OfferEntity);
