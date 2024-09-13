import { City } from './city.type.js';
import { GoodType } from './good-type.type.js';
import { Location } from './location.type.js';
import { OfferType } from './offer-type.enum.js';
import { UserInfo } from './user-info.type.js';

export type Offer = {
  id: string;
  title: string;
  type: OfferType;
  price: number;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  description: string;
  bedrooms: number;
  goods: GoodType[];
  host: UserInfo;
  images: string[];
  maxAdults: number;
  publicationDate: Date;
};
