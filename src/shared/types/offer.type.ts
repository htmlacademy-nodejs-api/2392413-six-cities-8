import { City } from './city.type.js';
import { GoodType } from './good-type.type.js';
import { Location } from './location.type.js';
import { OfferType } from './offer-type.enum.js';
import { User } from './user.type.js';

export type Offer = {
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
  host: User;
  images: string[];
  previewImage: string;
  maxAdults: number;
  createdDate: Date;
};
