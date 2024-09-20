import { CityName } from '../../../types/city-name.enum.js';
import { GoodType } from '../../../types/good-type.type.js';
import { Location } from '../../../types/location.type.js';
import { OfferType } from '../../../types/offer-type.enum.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public createdDate: Date;
  public city: CityName;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: OfferType;
  public bedrooms: number;
  public maxAdults: number;
  public price: number;
  public goods: GoodType[];
  public userId: string;
  public location: Location;
}
