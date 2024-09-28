import { CityName } from '#src/shared/types/city-name.enum.js';
import { GoodType } from '#src/shared/types/good-type.type.js';
import { Location } from '#src/shared/types/location.type.js';
import { OfferType } from '#src/shared/types/offer-type.enum.js';
import { CreateOfferDto } from './create-offer-dto.js';

export class UpdateOfferDto implements Omit<CreateOfferDto, 'userId'> {
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
  public location: Location;
}
