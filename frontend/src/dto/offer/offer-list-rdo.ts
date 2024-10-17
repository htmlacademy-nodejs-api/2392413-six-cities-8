import { City, Type } from '../../types/types';
import { OfferRdo } from './offer-rdo';

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
  public id!: string;
  public title!: string;
  public type!: Type;
  public price!: number;
  public isFavorite!: boolean;
  public isPremium!: boolean;
  public city!: City;
  public previewImage!: string;
  public rating!: number;
  public reviewsCount!: number;
  public createdDate!: string;
}
