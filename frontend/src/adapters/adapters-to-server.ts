import { UserType } from '../const';
import { OfferRdo } from '../dto/offer/offer-rdo';
import CreateUserDto from '../dto/user/create-user-dto';
import { UserRdo } from '../dto/user/user-rdo';
import { Offer, User, UserRegister } from '../types/types';

const adaptUserTypeToServer = (userType: UserType): boolean => {
  switch (userType) {
    case UserType.Regular:
      return false;
    case UserType.Pro:
      return true;
    default:
      return false;
  }
};

export const adaptSignupToServer = (user: UserRegister): CreateUserDto => ({
  name: user.name,
  isPro: adaptUserTypeToServer(user.type),
  email: user.email,
  password: user.password,
});

export const adaptUserToServer = (user: User): UserRdo => ({
  name: user.name,
  isPro: adaptUserTypeToServer(user.type),
  email: user.email,
  avatarUrl: user.avatarUrl,
});

export const adaptOfferDetailToServer = (offer: Offer): OfferRdo => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  previewImage: offer.previewImage,
  bedrooms: offer.bedrooms as number,
  description: offer.description as string,
  goods: offer.goods as string[],
  images: offer.images as string[],
  maxAdults: offer.maxAdults as number,
  type: offer.type,
  location: offer.location,
  city: offer.city,
  user: adaptUserToServer(offer.host as User),
  createdDate: '',
  reviewsCount: 0,
});
