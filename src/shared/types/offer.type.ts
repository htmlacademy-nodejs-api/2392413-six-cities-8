import { City, GoodType, Location, OfferType, UserInfo } from './index.js';

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
  previewImage: string;
  maxAdults: number;
  createdDate: Date;
};
