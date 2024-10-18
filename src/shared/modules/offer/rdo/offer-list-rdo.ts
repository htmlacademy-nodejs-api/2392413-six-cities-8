import { City } from '#src/shared/types/city.type.js';
import { OfferType } from '#src/shared/types/offer-type.enum.js';
import { Expose } from 'class-transformer';
import { OfferRdo } from './offer-rdo.js';

type OfferIncludeType =
  | 'id'
  | 'title'
  | 'type'
  | 'price'
  | 'isFavorite'
  | 'isPremium'
  | 'city'
  | 'previewImage'
  | 'rating'
  | 'reviewsCount'
  | 'createdDate';
export class OfferListRdo implements Pick<OfferRdo, OfferIncludeType> {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public type: OfferType;

  @Expose()
  public price: number;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public rating: number;

  @Expose()
  public reviewsCount: number;

  @Expose()
  public createdDate: string;
}
