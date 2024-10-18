import { City, Location, Type } from '../../types/types';
import { UserRdo } from '../user/user-rdo';

export class OfferRdo {
  public id!: string;
  public title!: string;
  public description!: string;
  public createdDate!: string;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: Type;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: string[];
  public user!: UserRdo;
  public location!: Location;
  public reviewsCount!: number;
}
