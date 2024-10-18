import { City, Location, Type } from '../../types/types';

export default class CreateOfferDto {
  public title!: string;
  public description!: string;
  public createdDate!: Date;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public rating!: number;
  public type!: Type;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: string[];
  public userId!: string;
  public location!: Location;
}
