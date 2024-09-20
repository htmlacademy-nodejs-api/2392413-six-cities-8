import { City, GoodType, Location, OfferType, User } from './index.js';

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
