import { City } from '#src/shared/types/city.type.js';
import { GoodType } from '#src/shared/types/good-type.type.js';
import { Location } from '#src/shared/types/location.type.js';
import { OfferType } from '#src/shared/types/offer-type.enum.js';
import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user-rdo.js';
import { OfferEntity } from '../offer-entity.js';

type offerExcludeType = '_id' | 'userId' | 'createdAt' | 'updatedAt';
export class OfferRdo implements Omit<OfferEntity, offerExcludeType> {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public createdDate: Date;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: OfferType;

  @Expose()
  public bedrooms: number;

  @Expose()
  public maxAdults: number;

  @Expose()
  public price: number;

  @Expose()
  public goods: GoodType[];

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose()
  public location: Location;
}
