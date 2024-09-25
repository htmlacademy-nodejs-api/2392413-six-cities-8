import { UserEntity } from '#modules/user/user-entity.js';
import { City } from '#types/city.type.js';
import { GoodType } from '#types/good-type.type.js';
import { Location } from '#types/location.type.js';
import { OfferType } from '#types/offer-type.enum.js';
import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title: string;

  @prop({ trim: true, required: true })
  public description: string;

  @prop({ required: true })
  public createdDate: Date;

  @prop({ required: true })
  public city: City;

  @prop({ required: true })
  public previewImage: string;

  @prop({ required: true })
  public images: string[];

  @prop({ required: true })
  public isPremium: boolean;

  @prop({ required: true })
  public isFavorite: boolean;

  @prop({ required: true })
  public rating: number;

  @prop({ required: true, type: () => String, enum: OfferType })
  public type: OfferType;

  @prop({ required: true })
  public bedrooms: number;

  @prop({ required: true })
  public maxAdults: number;

  @prop({ required: true })
  public price: number;

  @prop({ required: true })
  public goods: GoodType[];

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;

  @prop({ required: true })
  public location: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
