import { AVATAR_URL } from '../api';
import { UserType } from '../const';
import { OfferListRdo } from '../dto/offer/offer-list-rdo';
import { OfferRdo } from '../dto/offer/offer-rdo';
import { ReviewRdo } from '../dto/review/review-rdo';
import { UserRdo } from '../dto/user/user-rdo';
import { Comment, Offer, User } from '../types/types';

const adaptUserTypeToClient = (userType: boolean): UserType => {
  switch (userType) {
    case false:
      return UserType.Regular;
    case true:
      return UserType.Pro;
    default:
      return UserType.Regular;
  }
};

export const adaptLoginToClient = (user: UserRdo): User => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  type: adaptUserTypeToClient(user.isPro),
});

export const adaptUserToClient = (user: UserRdo): User => ({
  name: user.name,
  type: adaptUserTypeToClient(user.isPro),
  email: user.email,
  avatarUrl: `${AVATAR_URL}/${user.avatarUrl}`,
});

export const adaptOfferDetailToClient = (offer: OfferRdo): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  previewImage: offer.previewImage,
  bedrooms: offer.bedrooms,
  description: offer.description,
  goods: offer.goods,
  images: offer.images,
  maxAdults: offer.maxAdults,
  type: offer.type,
  location: offer.location,
  city: offer.city,
  host: adaptUserToClient(offer.user),
});

export const adaptOfferToClient = (offer: OfferListRdo): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  previewImage: offer.previewImage,
  type: offer.type,
  location: offer.city.location,
  city: offer.city,
  bedrooms: 0,
  description: '',
  goods: [],
  images: [],
  maxAdults: 0,
  host: {
    name: '',
    avatarUrl: '',
    type: UserType.Regular,
    email: '',
  },
});

export const adaptCommentToClient = (comment: ReviewRdo): Comment => ({
  id: comment.id,
  comment: comment.comment,
  date: comment.date,
  rating: comment.rating,
  user: adaptUserToClient(comment.user),
});

export const adaptOffersToClient = (offers: OfferListRdo[]): Offer[] =>
  offers.map((offer) => adaptOfferToClient(offer));

export const adaptCommentsToClient = (comments: ReviewRdo[]): Comment[] =>
  comments.map((comment) => adaptCommentToClient(comment));
